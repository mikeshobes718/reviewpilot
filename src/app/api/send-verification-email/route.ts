import { NextRequest, NextResponse } from 'next/server';
import { EmailService } from '../../../lib/email-service';

export async function POST(request: NextRequest) {
  try {
    const { email, verificationLink, userName } = await request.json();

    // Validate required fields
    if (!email || !verificationLink) {
      return NextResponse.json(
        { error: 'Email and verification link are required' },
        { status: 400 }
      );
    }

    // Send verification email using our beautiful template
    await EmailService.sendVerificationEmail(email, verificationLink, userName);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Verification email API error:', error);
    return NextResponse.json(
      { error: 'Failed to send verification email. Please try again later.' },
      { status: 500 }
    );
  }
}
