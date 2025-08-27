import { NextRequest, NextResponse } from 'next/server';
import { EmailService } from '../../../lib/email-service';

export async function POST(request: NextRequest) {
  try {
    const { email, userName } = await request.json();

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Send welcome email using our beautiful template
    await EmailService.sendWelcomeEmail(email, userName);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Welcome email API error:', error);
    return NextResponse.json(
      { error: 'Failed to send welcome email. Please try again later.' },
      { status: 500 }
    );
  }
}
