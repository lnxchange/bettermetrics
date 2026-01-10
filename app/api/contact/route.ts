import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import nodemailer from 'nodemailer'

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
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.SUPABASE_SERVICE_ROLE_KEY
        )

        const { error: dbError } = await supabase
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

        if (dbError) {
          console.error('Database save error:', dbError)
        } else {
          savedToDatabase = true
          console.log('Contact message saved to database')
        }
      } catch (dbErr) {
        console.error('Database connection error:', dbErr)
      }
    }

    // Try to send email (optional - will succeed silently if SMTP not configured)
    let emailSent = false
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || 'smtp.gmail.com',
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: false,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        })

        // Build email subject based on interest type and user's subject
        const interestMap: { [key: string]: string } = {
          'research-paper': 'Research Paper Request',
          'research': 'Research Collaboration',
          'testing': 'Testing & Validation',
          'consulting': 'Organizational Consulting',
          'speaking': 'Speaking Engagement',
          'media': 'Media Inquiry',
          'general': 'General Inquiry'
        }
        const emailSubject = subject 
          ? `AIM Framework: ${subject}`
          : `AIM Framework: ${interestMap[interest] || 'Contact Form'}`

        // Build email content based on whether it's a research paper request
        const htmlContent = interest === 'research-paper' ? `
          <h2>Research Paper Request</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${affiliation ? `<p><strong>Affiliation:</strong> ${affiliation}</p>` : ''}
          
          <h3>Research Paper Scope</h3>
          <p>${paperScope.replace(/\n/g, '<br>')}</p>
          
          <h3>Specific Questions to Address</h3>
          <p>${paperQuestions.replace(/\n/g, '<br>')}</p>
          
          <hr>
          <p><em>This is a research paper request. Papers will include limited references but sufficient information for further investigation and critique.</em></p>
          <p><em>This message was sent from the AIM Framework contact form.</em></p>
        ` : `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${affiliation ? `<p><strong>Affiliation:</strong> ${affiliation}</p>` : ''}
          ${interest ? `<p><strong>Interest:</strong> ${interest}</p>` : ''}
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
          
          <hr>
          <p><em>This message was sent from the AIM Framework contact form.</em></p>
        `

        const textContent = interest === 'research-paper' ? `
          Research Paper Request
          
          Name: ${name}
          Email: ${email}
          ${affiliation ? `Affiliation: ${affiliation}` : ''}
          
          Research Paper Scope:
          ${paperScope}
          
          Specific Questions to Address:
          ${paperQuestions}
          
          ---
          This is a research paper request. Papers will include limited references but sufficient information for further investigation and critique.
          This message was sent from the AIM Framework contact form.
        ` : `
          New Contact Form Submission
          
          Name: ${name}
          Email: ${email}
          ${affiliation ? `Affiliation: ${affiliation}` : ''}
          ${interest ? `Interest: ${interest}` : ''}
          
          Message:
          ${message}
          
          ---
          This message was sent from the AIM Framework contact form.
        `

        const mailOptions = {
          from: process.env.SMTP_FROM || process.env.SMTP_USER,
          to: 'yule@attune.legal',
          subject: emailSubject,
          html: htmlContent,
          text: textContent,
        }

        await transporter.sendMail(mailOptions)
        emailSent = true
        console.log('Email notification sent')
      } catch (emailErr) {
        console.error('Email send error:', emailErr)
        // Don't fail the request if email fails - we have the database record
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
