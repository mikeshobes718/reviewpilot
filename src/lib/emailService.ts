// src/lib/emailService.ts

import { Resend } from 'resend';

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

export class EmailService {
  // Welcome email for new users
  static async sendWelcomeEmail(email: string, name: string) {
    try {
      await resend.emails.send({
        from: 'Reviews & Marketing <noreply@reviewsandmarketing.com>',
        to: email,
        subject: 'Welcome to Reviews & Marketing! 🎉',
        html: `
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
              <h2 style="color: #1f2937; margin-top: 0;">Hi ${name},</h2>
              
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
        text: `
          Welcome to Reviews & Marketing! 🎉
          
          Hi ${name},
          
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
        `
      });
      
      return { success: true };
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      return { success: false, error };
    }
  }

  // Email verification email
  static async sendVerificationEmail(email: string, verificationLink: string, name: string) {
    try {
      await resend.emails.send({
        from: 'Reviews & Marketing <noreply@reviewsandmarketing.com>',
        to: email,
        subject: 'Verify Your Email - Reviews & Marketing',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verify Your Email</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">✅ Verify Your Email</h1>
              <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">One click to unlock your account</p>
            </div>
            
            <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
              <h2 style="color: #1f2937; margin-top: 0;">Hi ${name},</h2>
              
              <p>Thanks for signing up for <strong>Reviews & Marketing</strong>! To complete your registration, please verify your email address.</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationLink}" style="background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px;">Verify Email Address</a>
              </div>
              
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #6b7280; font-size: 14px;">${verificationLink}</p>
              
              <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
                <p style="margin: 0; color: #92400e;"><strong>Important:</strong> This verification link will expire in 24 hours. If you don't verify your email within this time, you'll need to request a new verification email.</p>
              </div>
              
              <p>If you didn't create an account with Reviews & Marketing, you can safely ignore this email.</p>
              
              <p>Best regards,<br>The Reviews & Marketing Team</p>
            </div>
            
            <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px;">
              <p>© 2025 Reviews & Marketing. All rights reserved.</p>
              <p><a href="https://reviewsandmarketing.com/privacy" style="color: #10b981;">Privacy Policy</a> | <a href="https://reviewsandmarketing.com/contact" style="color: #10b981;">Contact Us</a></p>
            </div>
          </body>
          </html>
        `,
        text: `
          Verify Your Email - Reviews & Marketing
          
          Hi ${name},
          
          Thanks for signing up for Reviews & Marketing! To complete your registration, please verify your email address.
          
          Verify Email Address: ${verificationLink}
          
          Important: This verification link will expire in 24 hours. If you don't verify your email within this time, you'll need to request a new verification email.
          
          If you didn't create an account with Reviews & Marketing, you can safely ignore this email.
          
          Best regards,
          The Reviews & Marketing Team
          
          © 2025 Reviews & Marketing. All rights reserved.
        `
      });
      
      return { success: true };
    } catch (error) {
      console.error('Failed to send verification email:', error);
      return { success: false, error };
    }
  }

  // Password reset email
  static async sendPasswordResetEmail(email: string, resetLink: string, name: string) {
    try {
      await resend.emails.send({
        from: 'Reviews & Marketing <noreply@reviewsandmarketing.com>',
        to: email,
        subject: 'Reset Your Password - Reviews & Marketing',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset Your Password</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">🔐 Reset Your Password</h1>
              <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Secure access to your account</p>
            </div>
            
            <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
              <h2 style="color: #1f2937; margin-top: 0;">Hi ${name},</h2>
              
              <p>We received a request to reset your password for your <strong>Reviews & Marketing</strong> account.</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetLink}" style="background: #ef4444; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px;">Reset Password</a>
              </div>
              
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #6b7280; font-size: 14px;">${resetLink}</p>
              
              <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
                <p style="margin: 0; color: #991b1b;"><strong>Security Notice:</strong> This password reset link will expire in 1 hour. If you didn't request a password reset, please ignore this email and your password will remain unchanged.</p>
              </div>
              
              <p>If you have any questions or need assistance, please contact our support team.</p>
              
              <p>Best regards,<br>The Reviews & Marketing Team</p>
            </div>
            
            <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px;">
              <p>© 2025 Reviews & Marketing. All rights reserved.</p>
              <p><a href="https://reviewsandmarketing.com/privacy" style="color: #ef4444;">Privacy Policy</a> | <a href="https://reviewsandmarketing.com/contact" style="color: #ef4444;">Contact Us</a></p>
            </div>
          </body>
          </html>
        `,
        text: `
          Reset Your Password - Reviews & Marketing
          
          Hi ${name},
          
          We received a request to reset your password for your Reviews & Marketing account.
          
          Reset Password: ${resetLink}
          
          Security Notice: This password reset link will expire in 1 hour. If you didn't request a password reset, please ignore this email and your password will remain unchanged.
          
          If you have any questions or need assistance, please contact our support team.
          
          Best regards,
          The Reviews & Marketing Team
          
          © 2025 Reviews & Marketing. All rights reserved.
        `
      });
      
      return { success: true };
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      return { success: false, error };
    }
  }

  // Login notification email
  static async sendLoginNotification(email: string, name: string, loginTime: string, deviceInfo: string) {
    try {
      await resend.emails.send({
        from: 'Reviews & Marketing <noreply@reviewsandmarketing.com>',
        to: email,
        subject: 'New Login to Your Account - Reviews & Marketing',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Login Notification</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">🔒 New Login Detected</h1>
              <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Account security notification</p>
            </div>
            
            <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
              <h2 style="color: #1f2937; margin-top: 0;">Hi ${name},</h2>
              
              <p>We detected a new login to your <strong>Reviews & Marketing</strong> account.</p>
              
              <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #374151;">📱 Login Details:</h3>
                <p><strong>Time:</strong> ${loginTime}</p>
                <p><strong>Device:</strong> ${deviceInfo}</p>
                <p><strong>Location:</strong> Based on IP address</p>
              </div>
              
              <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
                <p style="margin: 0; color: #92400e;"><strong>If this was you:</strong> You can safely ignore this email.</p>
                <p style="margin: 0; color: #92400e;"><strong>If this wasn't you:</strong> Please change your password immediately and contact our support team.</p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://reviewsandmarketing.com/dashboard" style="background: #8b5cf6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">View Account</a>
              </div>
              
              <p>Best regards,<br>The Reviews & Marketing Team</p>
            </div>
            
            <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px;">
              <p>© 2025 Reviews & Marketing. All rights reserved.</p>
              <p><a href="https://reviewsandmarketing.com/privacy" style="color: #8b5cf6;">Privacy Policy</a> | <a href="https://reviewsandmarketing.com/contact" style="color: #8b5cf6;">Contact Us</a></p>
            </div>
          </body>
          </html>
        `,
        text: `
          New Login to Your Account - Reviews & Marketing
          
          Hi ${name},
          
          We detected a new login to your Reviews & Marketing account.
          
          Login Details:
          Time: ${loginTime}
          Device: ${deviceInfo}
          Location: Based on IP address
          
          If this was you: You can safely ignore this email.
          If this wasn't you: Please change your password immediately and contact our support team.
          
          View Account: https://reviewsandmarketing.com/dashboard
          
          Best regards,
          The Reviews & Marketing Team
          
          © 2025 Reviews & Marketing. All rights reserved.
        `
      });
      
      return { success: true };
    } catch (error) {
      console.error('Failed to send login notification:', error);
      return { success: false, error };
    }
  }
}
