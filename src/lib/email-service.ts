import { emailTemplates, EmailTemplateData } from './email-templates';

export interface SendEmailOptions {
  to: string;
  template: 'verifyEmail' | 'resetPassword' | 'welcomeEmail' | 'contactConfirmation';
  data: EmailTemplateData;
}

export class EmailService {
  private static async sendEmail(to: string, subject: string, textBody: string, htmlBody: string) {
    // Use hardcoded values as fallback if environment variables aren't loaded
    const apiKey = process.env.POSTMARK_API_KEY || '50e2ca3f-c387-4cd0-84a9-ff7fb7928d55';
    const fromEmail = process.env.POSTMARK_FROM_EMAIL || 'hello@reviewsandmarketing.com';
    
    console.log('EmailService - Sending email with:', { apiKey: apiKey ? 'EXISTS' : 'MISSING', fromEmail });
    
    const response = await fetch('https://api.postmarkapp.com/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Postmark-Server-Token': apiKey,
      },
      body: JSON.stringify({
        From: fromEmail,
        To: to,
        Subject: subject,
        TextBody: textBody,
        HtmlBody: htmlBody,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Postmark API error:', errorData);
      throw new Error(`Failed to send email via Postmark: ${response.status}`);
    }

    return response.json();
  }

  static async sendVerificationEmail(to: string, verificationLink: string, userName?: string) {
    const emailData = emailTemplates.verifyEmail({
      userEmail: to,
      verificationLink,
      userName,
      supportEmail: 'hello@reviewsandmarketing.com',
      companyAddress: 'Riverfront Center, 221 River St 9th floor, Hoboken, NJ 07030'
    });

    return this.sendEmail(to, emailData.subject, emailData.textBody, emailData.htmlBody);
  }

  static async sendPasswordResetEmail(to: string, resetLink: string, userName?: string) {
    const emailData = emailTemplates.resetPassword({
      userEmail: to,
      resetLink,
      userName,
      supportEmail: 'hello@reviewsandmarketing.com',
      companyAddress: 'Riverfront Center, 221 River St 9th floor, Hoboken, NJ 07030'
    });

    return this.sendEmail(to, emailData.subject, emailData.textBody, emailData.htmlBody);
  }

  static async sendWelcomeEmail(to: string, userName?: string) {
    const emailData = emailTemplates.welcomeEmail({
      userEmail: to,
      userName,
      supportEmail: 'hello@reviewsandmarketing.com',
      companyAddress: 'Riverfront Center, 221 River St 9th floor, Hoboken, NJ 07030'
    });

    return this.sendEmail(to, emailData.subject, emailData.textBody, emailData.htmlBody);
  }

  static async sendContactConfirmation(to: string, userName: string) {
    const emailData = emailTemplates.contactConfirmation({
      userEmail: to,
      userName,
      supportEmail: 'hello@reviewsandmarketing.com',
      companyAddress: 'Riverfront Center, 221 River St 9th floor, Hoboken, NJ 07030'
    });

    return this.sendEmail(to, emailData.subject, emailData.textBody, emailData.htmlBody);
  }

  static async sendCustomEmail(to: string, subject: string, textBody: string, htmlBody: string) {
    return this.sendEmail(to, subject, textBody, htmlBody);
  }
}
