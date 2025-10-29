import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userEmail } = body

    // Validate required fields
    if (!userEmail) {
      return NextResponse.json(
        { error: 'User email is required' },
        { status: 400 }
      )
    }

    // Create transporter using the same SMTP configuration as contact form
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    // Email content
    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: 'yule@attune.legal',
      subject: 'New User Account Created - AIM Framework',
      html: `
        <h2>New User Account Created</h2>
        <p>A new user has signed up for the AIM Framework platform.</p>
        <p><strong>User Email:</strong> ${userEmail}</p>
        <p><strong>Timestamp:</strong> ${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })} PST</p>

        <hr>
        <p><em>This is an automated notification from the AIM Framework platform.</em></p>
      `,
      text: `
        New User Account Created

        A new user has signed up for the AIM Framework platform.

        User Email: ${userEmail}
        Timestamp: ${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })} PST

        ---
        This is an automated notification from the AIM Framework platform.
      `,
    }

    // Send email
    await transporter.sendMail(mailOptions)

    return NextResponse.json(
      { message: 'Notification sent successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('New user notification error:', error)
    // Return success even if email fails - don't block signup
    return NextResponse.json(
      { message: 'Notification processing completed' },
      { status: 200 }
    )
  }
}
