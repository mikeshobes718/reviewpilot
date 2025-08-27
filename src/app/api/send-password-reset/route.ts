import { NextRequest, NextResponse } from 'next/server';
import { EmailService } from '../../../lib/email-service';

export async function POST(request: NextRequest) {
  try {
    const { email, resetLink, userName } = await request.json();

    // Validate required fields
    if (!email || !resetLink) {
      return NextResponse.json(
        { error: 'Email and reset link are required' },
        { status: 400 }
      );
    }

    // Send password reset email using our beautiful template
    await EmailService.sendPasswordResetEmail(email, resetLink, userName);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Password reset email API error:', error);
    return NextResponse.json(
      { error: 'Failed to send password reset email. Please try again later.' },
      { status: 500 }
      );
  }
}
