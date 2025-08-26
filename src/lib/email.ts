import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export class EmailService {
  // Welcome email for new signups
  static async sendWelcomeEmail(email: string, name?: string) {
    const template = this.getWelcomeEmailTemplate(name);
    
    try {
      await resend.emails.send({
        from: 'Reviews & Marketing <noreply@reviewsandmarketing.com>',
        to: [email],
        subject: template.subject,
        html: template.html,
        text: template.text,
      });
      
      console.log(`✅ Welcome email sent to ${email}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to send welcome email to ${email}:`, error);
      return false;
    }
  }

  // Password reset email
  static async sendPasswordResetEmail(email: string, resetLink: string) {
    const template = this.getPasswordResetTemplate(resetLink);
    
    try {
      await resend.emails.send({
        from: 'Reviews & Marketing <noreply@reviewsandmarketing.com>',
        to: [email],
        subject: template.subject,
        html: template.html,
        text: template.text,
      });
      
      console.log(`✅ Password reset email sent to ${email}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to send password reset email to ${email}:`, error);
      return false;
    }
  }

  // Account verification email
  static async sendVerificationEmail(email: string, verificationLink: string) {
    const template = this.getVerificationTemplate(verificationLink);
    
    try {
      await resend.emails.send({
        from: 'Reviews & Marketing <noreply@reviewsandmarketing.com>',
        to: [email],
        subject: template.subject,
        html: template.html,
        text: template.text,
      });
      
      console.log(`✅ Verification email sent to ${email}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to send verification email to ${email}:`, error);
      return false;
    }
  }

  // Login notification email
  static async sendLoginNotification(email: string, loginTime: Date, deviceInfo?: string) {
    const template = this.getLoginNotificationTemplate(loginTime, deviceInfo);
    
    try {
      await resend.emails.send({
        from: 'Reviews & Marketing <noreply@reviewsandmarketing.com>',
        to: [email],
        subject: template.subject,
        html: template.html,
        text: template.text,
      });
      
      console.log(`✅ Login notification sent to ${email}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to send login notification to ${email}:`, error);
      return false;
    }
  }

  // Private template methods
  private static getWelcomeEmailTemplate(name?: string): EmailTemplate {
    const displayName = name || 'there';
    
    return {
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
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); width: 80px; height: 80px; border-radius: 20px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
              <span style="color: white; font-size: 40px;">⭐</span>
            </div>
            <h1 style="color: #2d3748; margin: 0;">Welcome to Reviews & Marketing!</h1>
            <p style="color: #718096; margin: 10px 0 0 0;">Hi ${displayName}, we're excited to have you on board!</p>
          </div>
          
          <div style="background: #f7fafc; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
            <h2 style="color: #2d3748; margin-top: 0;">What's Next?</h2>
            <ol style="text-align: left; padding-left: 20px;">
              <li style="margin-bottom: 15px;"><strong>Complete Your Profile:</strong> Add your business details and connect your review platforms</li>
              <li style="margin-bottom: 15px;"><strong>Set Up Automation:</strong> Configure your review request workflow</li>
              <li style="margin-bottom: 15px;"><strong>Start Collecting Reviews:</strong> Begin building your online reputation</li>
            </ol>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://reviewsandmarketing.com/dashboard" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Get Started Now</a>
          </div>
          
          <div style="background: #edf2f7; border-radius: 8px; padding: 20px; margin-top: 30px;">
            <h3 style="color: #2d3748; margin-top: 0;">Need Help?</h3>
            <p style="margin-bottom: 15px;">Our support team is here to help you succeed:</p>
            <ul style="text-align: left; padding-left: 20px; margin: 0;">
              <li>📧 Email: support@reviewsandmarketing.com</li>
              <li>📱 Phone: +1 (555) 123-4567</li>
              <li>💬 Live Chat: Available on our website</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="color: #718096; font-size: 14px; margin: 0;">
              © 2025 Reviews & Marketing. All rights reserved.<br>
              <a href="https://reviewsandmarketing.com/privacy" style="color: #667eea;">Privacy Policy</a> | 
              <a href="https://reviewsandmarketing.com/terms" style="color: #667eea;">Terms of Service</a>
            </p>
          </div>
        </body>
        </html>
      `,
      text: `
Welcome to Reviews & Marketing! 🎉

Hi ${displayName}, we're excited to have you on board!

What's Next?
1. Complete Your Profile: Add your business details and connect your review platforms
2. Set Up Automation: Configure your review request workflow  
3. Start Collecting Reviews: Begin building your online reputation

Get Started Now: https://reviewsandmarketing.com/dashboard

Need Help?
- Email: support@reviewsandmarketing.com
- Phone: +1 (555) 123-4567
- Live Chat: Available on our website

© 2025 Reviews & Marketing. All rights reserved.
Privacy Policy: https://reviewsandmarketing.com/privacy
Terms of Service: https://reviewsandmarketing.com/terms
      `
    };
  }

  private static getPasswordResetTemplate(resetLink: string): EmailTemplate {
    return {
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
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="background: linear-gradient(135deg, #f56565 0%, #ed8936 100%); width: 80px; height: 80px; border-radius: 20px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
              <span style="color: white; font-size: 40px;">🔐</span>
            </div>
            <h1 style="color: #2d3748; margin: 0;">Reset Your Password</h1>
            <p style="color: #718096; margin: 10px 0 0 0;">We received a request to reset your password</p>
          </div>
          
          <div style="background: #f7fafc; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
            <p style="margin-bottom: 20px;">Click the button below to create a new password. This link will expire in 1 hour for security reasons.</p>
            
            <div style="text-align: center;">
              <a href="${resetLink}" style="background: linear-gradient(135deg, #f56565 0%, #ed8936 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Reset Password</a>
            </div>
            
            <p style="margin-top: 20px; font-size: 14px; color: #718096;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${resetLink}" style="color: #667eea; word-break: break-all;">${resetLink}</a>
            </p>
          </div>
          
          <div style="background: #fed7d7; border: 1px solid #feb2b2; border-radius: 8px; padding: 20px; margin-top: 30px;">
            <h3 style="color: #c53030; margin-top: 0;">⚠️ Security Notice</h3>
            <ul style="text-align: left; padding-left: 20px; margin: 0; color: #c53030;">
              <li>If you didn't request this password reset, please ignore this email</li>
              <li>Your password will remain unchanged until you click the link above</li>
              <li>This link expires in 1 hour for your security</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="color: #718096; font-size: 14px; margin: 0;">
              © 2025 Reviews & Marketing. All rights reserved.<br>
              <a href="https://reviewsandmarketing.com/privacy" style="color: #667eea;">Privacy Policy</a> | 
              <a href="https://reviewsandmarketing.com/terms" style="color: #667eea;">Terms of Service</a>
            </p>
          </div>
        </body>
        </html>
      `,
      text: `
Reset Your Password - Reviews & Marketing

We received a request to reset your password

Click the link below to create a new password. This link will expire in 1 hour for security reasons.

Reset Password: ${resetLink}

If the link doesn't work, copy and paste it into your browser.

⚠️ Security Notice
- If you didn't request this password reset, please ignore this email
- Your password will remain unchanged until you click the link above  
- This link expires in 1 hour for your security

© 2025 Reviews & Marketing. All rights reserved.
Privacy Policy: https://reviewsandmarketing.com/privacy
Terms of Service: https://reviewsandmarketing.com/terms
      `
    };
  }

  private static getVerificationTemplate(verificationLink: string): EmailTemplate {
    return {
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
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); width: 80px; height: 80px; border-radius: 20px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
              <span style="color: white; font-size: 40px;">✓</span>
            </div>
            <h1 style="color: #2d3748; margin: 0;">Verify Your Email</h1>
            <p style="color: #718096; margin: 10px 0 0 0;">One more step to complete your account setup</p>
          </div>
          
          <div style="background: #f7fafc; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
            <p style="margin-bottom: 20px;">Please verify your email address to activate your account and start using Reviews & Marketing.</p>
            
            <div style="text-align: center;">
              <a href="${verificationLink}" style="background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Verify Email</a>
            </div>
            
            <p style="margin-top: 20px; font-size: 14px; color: #718096;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${verificationLink}" style="color: #667eea; word-break: break-all;">${verificationLink}</a>
            </p>
          </div>
          
          <div style="background: #c6f6d5; border: 1px solid #9ae6b4; border-radius: 8px; padding: 20px; margin-top: 30px;">
            <h3 style="color: #22543d; margin-top: 0;">🎯 What Happens Next?</h3>
            <ul style="text-align: left; padding-left: 20px; margin: 0; color: #22543d;">
              <li>Click the verification link above</li>
              <li>Your account will be activated immediately</li>
              <li>You'll be redirected to your dashboard</li>
              <li>Start building your business reputation!</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="color: #718096; font-size: 14px; margin: 0;">
              © 2025 Reviews & Marketing. All rights reserved.<br>
              <a href="https://reviewsandmarketing.com/privacy" style="color: #667eea;">Privacy Policy</a> | 
              <a href="https://reviewsandmarketing.com/terms" style="color: #667eea;">Terms of Service</a>
            </p>
          </div>
        </body>
        </html>
      `,
      text: `
Verify Your Email - Reviews & Marketing

One more step to complete your account setup

Please verify your email address to activate your account and start using Reviews & Marketing.

Verify Email: ${verificationLink}

If the link doesn't work, copy and paste it into your browser.

🎯 What Happens Next?
- Click the verification link above
- Your account will be activated immediately
- You'll be redirected to your dashboard
- Start building your business reputation!

© 2025 Reviews & Marketing. All rights reserved.
Privacy Policy: https://reviewsandmarketing.com/privacy
Terms of Service: https://reviewsandmarketing.com/terms
      `
    };
  }

  private static getLoginNotificationTemplate(loginTime: Date, deviceInfo?: string): EmailTemplate {
    const formattedTime = loginTime.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });

    return {
      subject: 'New Login Detected - Reviews & Marketing',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Login Detected</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%); width: 80px; height: 80px; border-radius: 20px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
              <span style="color: white; font-size: 40px;">🔔</span>
            </div>
            <h1 style="color: #2d3748; margin: 0;">New Login Detected</h1>
            <p style="color: #718096; margin: 10px 0 0 0;">We detected a new login to your account</p>
          </div>
          
          <div style="background: #f7fafc; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
            <h2 style="color: #2d3748; margin-top: 0;">Login Details</h2>
            <div style="background: white; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
              <p style="margin: 10px 0;"><strong>Time:</strong> ${formattedTime}</p>
              ${deviceInfo ? `<p style="margin: 10px 0;"><strong>Device:</strong> ${deviceInfo}</p>` : ''}
              <p style="margin: 10px 0;"><strong>Location:</strong> Based on IP address</p>
            </div>
            
            <p style="margin-bottom: 20px;">If this was you, no action is needed. If you don't recognize this login, please secure your account immediately.</p>
          </div>
          
          <div style="background: #bee3f8; border: 1px solid #90cdf4; border-radius: 8px; padding: 20px; margin-top: 30px;">
            <h3 style="color: #2c5282; margin-top: 0;">🔒 Security Tips</h3>
            <ul style="text-align: left; padding-left: 20px; margin: 0; color: #2c5282;">
              <li>Use a strong, unique password</li>
              <li>Enable two-factor authentication if available</li>
              <li>Never share your login credentials</li>
              <li>Log out from shared devices</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="https://reviewsandmarketing.com/dashboard" style="background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">View Account Activity</a>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="color: #718096; font-size: 14px; margin: 0;">
              © 2025 Reviews & Marketing. All rights reserved.<br>
              <a href="https://reviewsandmarketing.com/privacy" style="color: #667eea;">Privacy Policy</a> | 
              <a href="https://reviewsandmarketing.com/terms" style="color: #667eea;">Terms of Service</a>
            </p>
          </div>
        </body>
        </html>
      `,
      text: `
New Login Detected - Reviews & Marketing

We detected a new login to your account

Login Details:
- Time: ${formattedTime}
${deviceInfo ? `- Device: ${deviceInfo}` : ''}
- Location: Based on IP address

If this was you, no action is needed. If you don't recognize this login, please secure your account immediately.

🔒 Security Tips
- Use a strong, unique password
- Enable two-factor authentication if available
- Never share your login credentials
- Log out from shared devices

View Account Activity: https://reviewsandmarketing.com/dashboard

© 2025 Reviews & Marketing. All rights reserved.
Privacy Policy: https://reviewsandmarketing.com/privacy
Terms of Service: https://reviewsandmarketing.com/terms
      `
    };
  }
}
