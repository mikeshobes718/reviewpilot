import { NextRequest, NextResponse } from 'next/server';
import { EmailService } from '../../../lib/email-service';
import { config } from '../../../lib/config';

export async function POST(request: NextRequest) {
  try {
    // Debug environment variables
    console.log('Environment variables check:');
    console.log('POSTMARK_API_KEY exists:', !!process.env.POSTMARK_API_KEY);
    console.log('POSTMARK_FROM_EMAIL exists:', !!process.env.POSTMARK_FROM_EMAIL);
    console.log('POSTMARK_API_KEY length:', process.env.POSTMARK_API_KEY?.length || 0);
    
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
        'X-Postmark-Server-Token': config.postmark.apiKey,
      },
      body: JSON.stringify({
        From: config.postmark.fromEmail,
        To: config.company.supportEmail,
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

    // Send confirmation email to user using beautiful template
    await EmailService.sendContactConfirmation(email, name);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
}
