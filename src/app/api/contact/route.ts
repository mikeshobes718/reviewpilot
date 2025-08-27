import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { name, email, company, message, inquiryType } = await request.json();

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Send email via Postmark
    const postmarkResponse = await fetch('https://api.postmarkapp.com/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Postmark-Server-Token': process.env.POSTMARK_API_KEY || '',
      },
      body: JSON.stringify({
        From: process.env.POSTMARK_FROM_EMAIL || 'hello@reviewsandmarketing.com',
        To: 'hello@reviewsandmarketing.com',
        Subject: `New Contact Form Submission: ${inquiryType}`,
        TextBody: `
New contact form submission:

Name: ${name}
Email: ${email}
Company: ${company || 'Not specified'}
Inquiry Type: ${inquiryType}
Message: ${message}

Submitted at: ${new Date().toISOString()}
        `,
        HtmlBody: `
<h2>New Contact Form Submission</h2>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Company:</strong> ${company || 'Not specified'}</p>
<p><strong>Inquiry Type:</strong> ${inquiryType}</p>
<p><strong>Message:</strong></p>
<p>${message.replace(/\n/g, '<br>')}</p>
<hr>
<p><em>Submitted at: ${new Date().toLocaleString()}</em></p>
        `,
      }),
    });

    if (!postmarkResponse.ok) {
      const errorData = await postmarkResponse.json();
      console.error('Postmark API error:', errorData);
      throw new Error('Failed to send email via Postmark');
    }

    // Send confirmation email to user
    await fetch('https://api.postmarkapp.com/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Postmark-Server-Token': process.env.POSTMARK_API_KEY || '',
      },
      body: JSON.stringify({
        From: process.env.POSTMARK_FROM_EMAIL || 'hello@reviewsandmarketing.com',
        To: email,
        Subject: 'Thank you for contacting Reviews & Marketing',
        TextBody: `
Dear ${name},

Thank you for reaching out to Reviews & Marketing. We have received your message and will get back to you within 24 hours.

Your message:
${message}

If you have any urgent questions, please don't hesitate to call us directly.

Best regards,
The Reviews & Marketing Team
        `,
        HtmlBody: `
<h2>Thank you for contacting us!</h2>
<p>Dear ${name},</p>
<p>Thank you for reaching out to <strong>Reviews & Marketing</strong>. We have received your message and will get back to you within 24 hours.</p>
<hr>
<p><strong>Your message:</strong></p>
<p>${message.replace(/\n/g, '<br>')}</p>
<hr>
<p>If you have any urgent questions, please don't hesitate to call us directly.</p>
<p>Best regards,<br>The Reviews & Marketing Team</p>
        `,
      }),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
}
