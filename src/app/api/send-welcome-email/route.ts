import { NextRequest, NextResponse } from 'next/server';
import { config } from '../../../lib/config';

export async function POST(request: NextRequest) {
  try {
    const { email, userName } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required.' },
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
        Subject: 'Welcome to Reviews & Marketing! 🎉',
        TextBody: `
Welcome to Reviews & Marketing! 🎉

Hi ${userName || 'there'},

Welcome to Reviews & Marketing! We're excited to have you on board.

What you can do now:
- Verify your email address to unlock full access
- Set up your first review campaign
- Connect your business accounts
- Start collecting 5-star reviews

Get Started: https://reviewsandmarketing.com/dashboard

If you have any questions, our support team is here to help!

Best regards,
The Reviews & Marketing Team

© 2025 Reviews & Marketing. All rights reserved.
        `,
        HtmlBody: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Reviews & Marketing</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">🌟 Welcome to Reviews & Marketing!</h1>
    <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Your journey to better reviews starts now</p>
  </div>
  
  <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
    <h2 style="color: #1f2937; margin-top: 0;">Hi ${userName || 'there'},</h2>
    
    <p>Welcome to <strong>Reviews & Marketing</strong>! We're excited to have you on board.</p>
    
    <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #374151;">🚀 What you can do now:</h3>
      <ul style="margin: 10px 0; padding-left: 20px;">
        <li>Verify your email address to unlock full access</li>
        <li>Set up your first review campaign</li>
        <li>Connect your business accounts</li>
        <li>Start collecting 5-star reviews</li>
      </ul>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://reviewsandmarketing.com/dashboard" style="background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">Get Started</a>
    </div>
    
    <p>If you have any questions, our support team is here to help!</p>
    
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
      throw new Error(`Failed to send welcome email: ${response.status}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Welcome email error:', error);
    return NextResponse.json(
      { error: 'Failed to send welcome email. Please try again later.' },
      { status: 500 }
    );
  }
}
