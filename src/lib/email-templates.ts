export interface EmailTemplateData {
  userName?: string;
  userEmail?: string;
  verificationLink?: string;
  resetLink?: string;
  businessName?: string;
  supportEmail?: string;
  companyAddress?: string;
}

export const emailTemplates = {
  // Email verification template
  verifyEmail: (data: EmailTemplateData) => ({
    subject: 'Verify your email address - Reviews & Marketing',
    htmlBody: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
    <style>
        body { 
            margin: 0; 
            padding: 0; 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #f8fafc;
            color: #1f2937;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            padding: 40px 30px;
            text-align: center;
        }
        .logo {
            width: 60px;
            height: 60px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 16px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
        }
        .logo svg {
            width: 32px;
            height: 32px;
            fill: white;
        }
        .header h1 {
            color: white;
            margin: 0;
            font-size: 28px;
            font-weight: 700;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 18px;
            margin-bottom: 24px;
            color: #374151;
        }
        .message {
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 32px;
            color: #4b5563;
        }
        .button-container {
            text-align: center;
            margin: 32px 0;
        }
        .verify-button {
            display: inline-block;
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            color: white;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 12px;
            font-weight: 600;
            font-size: 16px;
            box-shadow: 0 4px 14px 0 rgba(59, 130, 246, 0.4);
            transition: all 0.3s ease;
        }
        .verify-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px 0 rgba(59, 130, 246, 0.5);
        }
        .fallback-link {
            margin-top: 16px;
            font-size: 14px;
            color: #6b7280;
        }
        .fallback-link a {
            color: #3b82f6;
            text-decoration: none;
        }
        .footer {
            background-color: #f9fafb;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }
        .footer p {
            margin: 8px 0;
            font-size: 14px;
            color: #6b7280;
        }
        .company-info {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
        }
        .support-link {
            color: #3b82f6;
            text-decoration: none;
            font-weight: 500;
        }
        @media (max-width: 600px) {
            .container { margin: 20px; border-radius: 12px; }
            .header { padding: 30px 20px; }
            .content { padding: 30px 20px; }
            .footer { padding: 20px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">
                <svg viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
            </div>
            <h1>Verify Your Email</h1>
        </div>
        
        <div class="content">
            <div class="greeting">Hello${data.userName ? `, ${data.userName}` : ''}!</div>
            
            <div class="message">
                Welcome to <strong>Reviews & Marketing</strong>! To complete your account setup and start building your business reputation, please verify your email address.
            </div>
            
            <div class="button-container">
                <a href="${data.verificationLink}" class="verify-button">
                    Verify Email Address
                </a>
                
                <div class="fallback-link">
                    If the button doesn't work, copy and paste this link into your browser:<br>
                    <a href="${data.verificationLink}">${data.verificationLink}</a>
                </div>
            </div>
            
            <div class="message">
                This verification link will expire in 24 hours. If you didn't create an account with us, you can safely ignore this email.
            </div>
        </div>
        
        <div class="footer">
            <p><strong>Reviews & Marketing</strong></p>
            <p>Turn every satisfied customer into a 5-star advocate</p>
            
            <div class="company-info">
                <p>Need help? <a href="mailto:${data.supportEmail || 'hello@reviewsandmarketing.com'}" class="support-link">Contact Support</a></p>
                <p>${data.companyAddress || 'Riverfront Center, 221 River St 9th floor, Hoboken, NJ 07030'}</p>
            </div>
        </div>
    </div>
</body>
</html>
    `,
    textBody: `
Hello${data.userName ? `, ${data.userName}` : ''}!

Welcome to Reviews & Marketing! To complete your account setup and start building your business reputation, please verify your email address.

Click this link to verify your email: ${data.verificationLink}

This verification link will expire in 24 hours. If you didn't create an account with us, you can safely ignore this email.

Thanks,
The Reviews & Marketing Team

Need help? Contact us at ${data.supportEmail || 'hello@reviewsandmarketing.com'}
    `
  }),

  // Password reset template
  resetPassword: (data: EmailTemplateData) => ({
    subject: 'Reset your password - Reviews & Marketing',
    htmlBody: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <style>
        body { 
            margin: 0; 
            padding: 0; 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #f8fafc;
            color: #1f2937;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            padding: 40px 30px;
            text-align: center;
        }
        .logo {
            width: 60px;
            height: 60px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 16px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
        }
        .logo svg {
            width: 32px;
            height: 32px;
            fill: white;
        }
        .header h1 {
            color: white;
            margin: 0;
            font-size: 28px;
            font-weight: 700;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 18px;
            margin-bottom: 24px;
            color: #374151;
        }
        .message {
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 32px;
            color: #4b5563;
        }
        .button-container {
            text-align: center;
            margin: 32px 0;
        }
        .reset-button {
            display: inline-block;
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            color: white;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 12px;
            font-weight: 600;
            font-size: 16px;
            box-shadow: 0 4px 14px 0 rgba(239, 68, 68, 0.4);
            transition: all 0.3s ease;
        }
        .reset-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px 0 rgba(239, 68, 68, 0.5);
        }
        .fallback-link {
            margin-top: 16px;
            font-size: 14px;
            color: #6b7280;
        }
        .fallback-link a {
            color: #ef4444;
            text-decoration: none;
        }
        .security-note {
            background-color: #fef2f2;
            border: 1px solid #fecaca;
            border-radius: 8px;
            padding: 16px;
            margin: 24px 0;
        }
        .security-note h3 {
            margin: 0 0 8px 0;
            color: #dc2626;
            font-size: 16px;
        }
        .security-note p {
            margin: 0;
            color: #7f1d1d;
            font-size: 14px;
        }
        .footer {
            background-color: #f9fafb;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }
        .footer p {
            margin: 8px 0;
            font-size: 14px;
            color: #6b7280;
        }
        .company-info {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
        }
        .support-link {
            color: #ef4444;
            text-decoration: none;
            font-weight: 500;
        }
        @media (max-width: 600px) {
            .container { margin: 20px; border-radius: 12px; }
            .header { padding: 30px 20px; }
            .content { padding: 30px 20px; }
            .footer { padding: 20px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">
                <svg viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
            </div>
            <h1>Reset Your Password</h1>
        </div>
        
        <div class="content">
            <div class="greeting">Hello${data.userName ? `, ${data.userName}` : ''}!</div>
            
            <div class="message">
                We received a request to reset your password for your <strong>Reviews & Marketing</strong> account. Click the button below to create a new password.
            </div>
            
            <div class="button-container">
                <a href="${data.resetLink}" class="reset-button">
                    Reset Password
                </a>
                
                <div class="fallback-link">
                    If the button doesn't work, copy and paste this link into your browser:<br>
                    <a href="${data.resetLink}">${data.resetLink}</a>
                </div>
            </div>
            
            <div class="security-note">
                <h3>🔒 Security Notice</h3>
                <p>This password reset link will expire in 1 hour. If you didn't request a password reset, please ignore this email and your password will remain unchanged.</p>
            </div>
            
            <div class="message">
                For security reasons, we recommend using a strong, unique password that you don't use elsewhere.
            </div>
        </div>
        
        <div class="footer">
            <p><strong>Reviews & Marketing</strong></p>
            <p>Turn every satisfied customer into a 5-star advocate</p>
            
            <div class="company-info">
                <p>Need help? <a href="mailto:${data.supportEmail || 'hello@reviewsandmarketing.com'}" class="support-link">Contact Support</a></p>
                <p>${data.companyAddress || 'Riverfront Center, 221 River St 9th floor, Hoboken, NJ 07030'}</p>
            </div>
        </div>
    </div>
</body>
</html>
    `,
    textBody: `
Hello${data.userName ? `, ${data.userName}` : ''}!

We received a request to reset your password for your Reviews & Marketing account. Click the link below to create a new password:

${data.resetLink}

This password reset link will expire in 1 hour. If you didn't request a password reset, please ignore this email and your password will remain unchanged.

For security reasons, we recommend using a strong, unique password that you don't use elsewhere.

Thanks,
The Reviews & Marketing Team

Need help? Contact us at ${data.supportEmail || 'hello@reviewsandmarketing.com'}
    `
  }),

  // Welcome email template
  welcomeEmail: (data: EmailTemplateData) => ({
    subject: 'Welcome to Reviews & Marketing! 🎉',
    htmlBody: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Reviews & Marketing</title>
    <style>
        body { 
            margin: 0; 
            padding: 0; 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #f8fafc;
            color: #1f2937;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            padding: 40px 30px;
            text-align: center;
        }
        .logo {
            width: 60px;
            height: 60px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 16px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
        }
        .logo svg {
            width: 32px;
            height: 32px;
            fill: white;
        }
        .header h1 {
            color: white;
            margin: 0;
            font-size: 28px;
            font-weight: 700;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 18px;
            margin-bottom: 24px;
            color: #374151;
        }
        .message {
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 32px;
            color: #4b5563;
        }
        .button-container {
            text-align: center;
            margin: 32px 0;
        }
        .dashboard-button {
            display: inline-block;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 12px;
            font-weight: 600;
            font-size: 16px;
            box-shadow: 0 4px 14px 0 rgba(16, 185, 129, 0.4);
            transition: all 0.3s ease;
        }
        .dashboard-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px 0 rgba(16, 185, 129, 0.5);
        }
        .features {
            background-color: #f0fdf4;
            border: 1px solid #bbf7d0;
            border-radius: 8px;
            padding: 24px;
            margin: 24px 0;
        }
        .features h3 {
            margin: 0 0 16px 0;
            color: #059669;
            font-size: 18px;
        }
        .feature-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .feature-list li {
            padding: 8px 0;
            color: #065f46;
            font-size: 14px;
        }
        .feature-list li:before {
            content: "✓ ";
            color: #10b981;
            font-weight: bold;
        }
        .footer {
            background-color: #f9fafb;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }
        .footer p {
            margin: 8px 0;
            font-size: 14px;
            color: #6b7280;
        }
        .company-info {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
        }
        .support-link {
            color: #10b981;
            text-decoration: none;
            font-weight: 500;
        }
        @media (max-width: 600px) {
            .container { margin: 20px; border-radius: 12px; }
            .header { padding: 30px 20px; }
            .content { padding: 30px 20px; }
            .footer { padding: 20px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">
                <svg viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
            </div>
            <h1>Welcome! 🎉</h1>
        </div>
        
        <div class="content">
            <div class="greeting">Hello${data.userName ? `, ${data.userName}` : ''}!</div>
            
            <div class="message">
                Welcome to <strong>Reviews & Marketing</strong>! We're excited to have you on board. Your account has been successfully created and verified.
            </div>
            
            <div class="button-container">
                <a href="https://reviewsandmarketing.com/dashboard" class="dashboard-button">
                    Go to Dashboard
                </a>
            </div>
            
            <div class="features">
                <h3>🚀 What you can do now:</h3>
                <ul class="feature-list">
                    <li>Create your first review request</li>
                    <li>Set up your business profile</li>
                    <li>Connect your review platforms</li>
                    <li>Start collecting customer reviews</li>
                    <li>Track your reputation growth</li>
                </ul>
            </div>
            
            <div class="message">
                We're here to help you turn every satisfied customer into a 5-star advocate. If you have any questions or need assistance getting started, don't hesitate to reach out to our support team.
            </div>
        </div>
        
        <div class="footer">
            <p><strong>Reviews & Marketing</strong></p>
            <p>Turn every satisfied customer into a 5-star advocate</p>
            
            <div class="company-info">
                <p>Need help? <a href="mailto:${data.supportEmail || 'hello@reviewsandmarketing.com'}" class="support-link">Contact Support</a></p>
                <p>${data.companyAddress || 'Riverfront Center, 221 River St 9th floor, Hoboken, NJ 07030'}</p>
            </div>
        </div>
    </div>
</body>
</html>
    `,
    textBody: `
Hello${data.userName ? `, ${data.userName}` : ''}!

Welcome to Reviews & Marketing! We're excited to have you on board. Your account has been successfully created and verified.

What you can do now:
✓ Create your first review request
✓ Set up your business profile
✓ Connect your review platforms
✓ Start collecting customer reviews
✓ Track your reputation growth

Go to your dashboard: https://reviewsandmarketing.com/dashboard

We're here to help you turn every satisfied customer into a 5-star advocate. If you have any questions or need assistance getting started, don't hesitate to reach out to our support team.

Thanks,
The Reviews & Marketing Team

Need help? Contact us at ${data.supportEmail || 'hello@reviewsandmarketing.com'}
    `
  }),

  // Contact form confirmation template
  contactConfirmation: (data: EmailTemplateData) => ({
    subject: 'Thank you for contacting Reviews & Marketing',
    htmlBody: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank You - Reviews & Marketing</title>
    <style>
        body { 
            margin: 0; 
            padding: 0; 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #f8fafc;
            color: #1f2937;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
            padding: 40px 30px;
            text-align: center;
        }
        .logo {
            width: 60px;
            height: 60px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 16px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
        }
        .logo svg {
            width: 32px;
            height: 32px;
            fill: white;
        }
        .header h1 {
            color: white;
            margin: 0;
            font-size: 28px;
            font-weight: 700;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 18px;
            margin-bottom: 24px;
            color: #374151;
        }
        .message {
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 32px;
            color: #4b5563;
        }
        .button-container {
            text-align: center;
            margin: 32px 0;
        }
        .website-button {
            display: inline-block;
            background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
            color: white;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 12px;
            font-weight: 600;
            font-size: 16px;
            box-shadow: 0 4px 14px 0 rgba(139, 92, 246, 0.4);
            transition: all 0.3s ease;
        }
        .website-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px 0 rgba(139, 92, 246, 0.5);
        }
        .response-time {
            background-color: #f3f4f6;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            padding: 20px;
            margin: 24px 0;
            text-align: center;
        }
        .response-time h3 {
            margin: 0 0 8px 0;
            color: #374151;
            font-size: 16px;
        }
        .response-time p {
            margin: 0;
            color: #6b7280;
            font-size: 14px;
        }
        .footer {
            background-color: #f9fafb;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }
        .footer p {
            margin: 8px 0;
            font-size: 14px;
            color: #6b7280;
        }
        .company-info {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
        }
        .support-link {
            color: #8b5cf6;
            text-decoration: none;
            font-weight: 500;
        }
        @media (max-width: 600px) {
            .container { margin: 20px; border-radius: 12px; }
            .header { padding: 30px 20px; }
            .content { padding: 30px 20px; }
            .footer { padding: 20px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">
                <svg viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
            </div>
            <h1>Thank You! 🙏</h1>
        </div>
        
        <div class="content">
            <div class="greeting">Hello${data.userName ? `, ${data.userName}` : ''}!</div>
            
            <div class="message">
                Thank you for reaching out to <strong>Reviews & Marketing</strong>. We have received your message and our team is excited to help you with your inquiry.
            </div>
            
            <div class="response-time">
                <h3>⏰ Response Time</h3>
                <p>We typically respond within 2-4 hours during business hours (Monday-Friday, 9 AM - 6 PM EST)</p>
            </div>
            
            <div class="button-container">
                <a href="https://reviewsandmarketing.com" class="website-button">
                    Visit Our Website
                </a>
            </div>
            
            <div class="message">
                While you wait, feel free to explore our website to learn more about how we can help you build your business reputation and collect more customer reviews.
            </div>
        </div>
        
        <div class="footer">
            <p><strong>Reviews & Marketing</strong></p>
            <p>Turn every satisfied customer into a 5-star advocate</p>
            
            <div class="company-info">
                <p>Need immediate assistance? <a href="mailto:${data.supportEmail || 'hello@reviewsandmarketing.com'}" class="support-link">Contact Support</a></p>
                <p>${data.companyAddress || 'Riverfront Center, 221 River St 9th floor, Hoboken, NJ 07030'}</p>
            </div>
        </div>
    </div>
</body>
</html>
    `,
    textBody: `
Hello${data.userName ? `, ${data.userName}` : ''}!

Thank you for reaching out to Reviews & Marketing. We have received your message and our team is excited to help you with your inquiry.

Response Time: We typically respond within 2-4 hours during business hours (Monday-Friday, 9 AM - 6 PM EST)

While you wait, feel free to explore our website to learn more about how we can help you build your business reputation and collect more customer reviews.

Visit our website: https://reviewsandmarketing.com

Thanks,
The Reviews & Marketing Team

Need immediate assistance? Contact us at ${data.supportEmail || 'hello@reviewsandmarketing.com'}
    `
  })
};
