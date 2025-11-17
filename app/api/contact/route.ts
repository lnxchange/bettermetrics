import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, affiliation, interest, message, paperScope, paperQuestions } = body

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

    // Create transporter (using a simple SMTP configuration)
    // Note: In production, you should use environment variables for SMTP credentials
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    // Build subject based on interest type
    const subjectMap: { [key: string]: string } = {
      'research-paper': 'Research Paper Request',
      'research': 'Research Collaboration',
      'testing': 'Testing & Validation',
      'consulting': 'Organizational Consulting',
      'speaking': 'Speaking Engagement',
      'media': 'Media Inquiry',
      'general': 'General Inquiry'
    }
    const subject = `AIM Framework: ${subjectMap[interest] || 'Contact Form'}`

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

    // Email content
    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: 'yule@attune.legal',
      subject,
      html: htmlContent,
      text: textContent,
    }

    // Send email
    await transporter.sendMail(mailOptions)

    return NextResponse.json(
      { message: 'Message sent successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
