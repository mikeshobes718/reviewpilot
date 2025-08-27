import { emailTemplates, EmailTemplateData } from './email-templates';
import { config } from './config';

export interface SendEmailOptions {
  to: string;
  template: 'verifyEmail' | 'resetPassword' | 'welcomeEmail' | 'contactConfirmation';
  data: EmailTemplateData;
}

export class EmailService {
  private static async sendEmail(to: string, subject: string, textBody: string, htmlBody: string) {
    console.log('EmailService - Sending email with config:', { 
      apiKey: config.postmark.apiKey ? 'EXISTS' : 'MISSING', 
      fromEmail: config.postmark.fromEmail 
    });
    
    const response = await fetch('https://api.postmarkapp.com/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Postmark-Server-Token': config.postmark.apiKey,
      },
      body: JSON.stringify({
        From: config.postmark.fromEmail,
        To: to,
        Subject: subject,
        TextBody: textBody,
        HtmlBody: htmlBody,
      }),
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;
      try {
        const errorData = await response.json();
        console.error('Postmark API error:', errorData);
        errorMessage = errorData.Message || errorData.error || errorMessage;
      } catch (parseError) {
        console.error('Failed to parse error response:', parseError);
      }
      throw new Error(`Failed to send email via Postmark: ${errorMessage}`);
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
