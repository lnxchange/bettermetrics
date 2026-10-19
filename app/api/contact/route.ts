import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const NOTIFY_TO = 'yule@attune.legal'
const NOTIFY_FROM = 'Use Better Metrics <notifications@lexnova.com.au>'

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, affiliation, interest, subject, message, paperScope, paperQuestions } = body

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }

    // Validate research paper specific fields
    if (interest === 'research-paper' && (!paperScope || !paperQuestions)) {
      return NextResponse.json(
        { error: 'Research paper scope and questions are required' },
        { status: 400 }
      )
    }

    // Validate general message for non-research-paper requests
    if (interest !== 'research-paper' && !message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Save to database (always do this first - this is the primary storage)
    let savedToDatabase = false
    let messageId: string | undefined
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.SUPABASE_SERVICE_ROLE_KEY
        )

        const { data: saved, error: dbError } = await supabase
          .from('contact_messages')
          .insert({
            name,
            email,
            affiliation: affiliation || null,
            interest,
            subject: subject || null,
            message: message || null,
            paper_scope: paperScope || null,
            paper_questions: paperQuestions || null,
            is_read: false
          })
          .select('id')
          .single()

        if (dbError) {
          console.error('Database save error:', dbError)
        } else {
          savedToDatabase = true
          messageId = saved?.id
          console.log('Contact message saved to database')
        }
      } catch (dbErr) {
        console.error('Database connection error:', dbErr)
      }
    }

    // Notify by email. The sending domain is Lex Nova; the subject and body
    // name usebettermetrics.com so the message is identifiable.
    let emailSent = false
    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY)
        const interestMap: { [key: string]: string } = {
          'research-paper': 'Research Paper Request',
          'research': 'Research Collaboration',
          'testing': 'Testing & Validation',
          'consulting': 'Organizational Consulting',
          'speaking': 'Speaking Engagement',
          'media': 'Media Inquiry',
          'general': 'General Inquiry'
        }
        const topic = subject || interestMap[interest] || 'Contact Form'
        const emailSubject = `usebettermetrics.com: ${topic}`
        const safe = (value?: string) => escapeHtml(value || '')
        const htmlContent = interest === 'research-paper' ? `
          <p><strong>From the contact form on usebettermetrics.com</strong></p>
          <h2>Research Paper Request</h2>
          <p><strong>Name:</strong> ${safe(name)}</p>
          <p><strong>Email:</strong> ${safe(email)}</p>
          ${affiliation ? `<p><strong>Affiliation:</strong> ${safe(affiliation)}</p>` : ''}
          <h3>Research Paper Scope</h3>
          <p>${safe(paperScope).replace(/\n/g, '<br>')}</p>
          <h3>Specific Questions to Address</h3>
          <p>${safe(paperQuestions).replace(/\n/g, '<br>')}</p>
        ` : `
          <p><strong>From the contact form on usebettermetrics.com</strong></p>
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${safe(name)}</p>
          <p><strong>Email:</strong> ${safe(email)}</p>
          ${affiliation ? `<p><strong>Affiliation:</strong> ${safe(affiliation)}</p>` : ''}
          ${interest ? `<p><strong>Interest:</strong> ${safe(interestMap[interest] || interest)}</p>` : ''}
          <p><strong>Message:</strong></p>
          <p>${safe(message).replace(/\n/g, '<br>')}</p>
        `
        const textContent = interest === 'research-paper'
          ? [
              'From the contact form on usebettermetrics.com',
              '',
              'Research Paper Request',
              `Name: ${name}`,
              `Email: ${email}`,
              affiliation ? `Affiliation: ${affiliation}` : '',
              '',
              'Research Paper Scope:',
              paperScope,
              '',
              'Specific Questions to Address:',
              paperQuestions
            ].filter(line => line !== '').join('\n')
          : [
              'From the contact form on usebettermetrics.com',
              '',
              'New Contact Form Submission',
              `Name: ${name}`,
              `Email: ${email}`,
              affiliation ? `Affiliation: ${affiliation}` : '',
              interest ? `Interest: ${interestMap[interest] || interest}` : '',
              '',
              'Message:',
              message
            ].filter(line => line !== '').join('\n')

        const { error: sendError } = await resend.emails.send(
          {
            from: NOTIFY_FROM,
            to: [NOTIFY_TO],
            replyTo: email,
            subject: emailSubject,
            html: htmlContent,
            text: textContent,
            tags: [{ name: 'site', value: 'usebettermetrics' }]
          },
          messageId ? { idempotencyKey: `contact-notification/${messageId}` } : undefined
        )

        if (sendError) {
          console.error('Email send error:', sendError)
        } else {
          emailSent = true
          console.log('Email notification sent')
        }
      } catch (emailErr) {
        console.error('Email send error:', emailErr)
      }
    }

    // Success if either database save or email worked
    if (savedToDatabase || emailSent) {
      return NextResponse.json(
        { 
          message: 'Message received successfully',
          savedToDatabase,
          emailSent
        },
        { status: 200 }
      )
    }

    // If neither worked, return error
    console.error('Contact form: Neither database save nor email worked')
    return NextResponse.json(
      { error: 'Failed to process message. Please try again or email directly.' },
      { status: 500 }
    )
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
