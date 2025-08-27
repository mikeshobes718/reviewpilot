import { NextRequest, NextResponse } from 'next/server';
import { config } from '../../../lib/config';

export async function POST(request: NextRequest) {
  try {
    const { email, verificationLink, userName } = await request.json();

    if (!email || !verificationLink) {
      return NextResponse.json(
        { error: 'Email and verification link are required.' },
        { status: 400 }
      );
    }

    const response = await fetch('https://api.postmarkapp.com/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Postmark-Server-Token': config.postmark.apiKey,
      },
      body: JSON.stringify({
        From: config.postmark.fromEmail,
        To: email,
        Subject: 'Verify your email address - Reviews & Marketing',
        TextBody: `
Hi ${userName || 'there'},

Please verify your email address by clicking the link below:

${verificationLink}

If you didn't create an account with Reviews & Marketing, you can safely ignore this email.

Best regards,
The Reviews & Marketing Team
        `,
        HtmlBody: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">🔐 Verify Your Email</h1>
    <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Complete your account setup</p>
  </div>
  
  <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
    <h2 style="color: #1f2937; margin-top: 0;">Hi ${userName || 'there'},</h2>
    
    <p>Please verify your email address to complete your account setup with <strong>Reviews & Marketing</strong>.</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${verificationLink}" style="background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">Verify Email Address</a>
    </div>
    
    <p>If the button above doesn't work, you can copy and paste this link into your browser:</p>
    <p style="word-break: break-all; color: #6b7280; font-size: 14px;">${verificationLink}</p>
    
    <p>If you didn't create an account with Reviews & Marketing, you can safely ignore this email.</p>
    
    <p>Best regards,<br>The Reviews & Marketing Team</p>
  </div>
  
  <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px;">
    <p>© 2025 Reviews & Marketing. All rights reserved.</p>
    <p><a href="https://reviewsandmarketing.com/privacy" style="color: #3b82f6;">Privacy Policy</a> | <a href="https://reviewsandmarketing.com/contact" style="color: #3b82f6;">Contact Us</a></p>
  </div>
</body>
</html>
        `,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to send verification email: ${response.status}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Verification email error:', error);
    return NextResponse.json(
      { error: 'Failed to send verification email. Please try again later.' },
      { status: 500 }
    );
  }
}
