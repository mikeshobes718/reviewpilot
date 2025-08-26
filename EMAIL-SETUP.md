# 📧 Email Verification Setup Guide

## Overview
Your Reviews & Marketing application now includes a complete email verification and authentication flow with:
- ✅ Email verification on signup
- ✅ Welcome emails for new users
- ✅ Password reset emails
- ✅ Login notification emails
- ✅ Professional branded email templates

## 🔑 Required Setup

### 1. Postmark API Key
You need to configure your Postmark API key for the email service to work:

```bash
# Add this to your environment variables
NEXT_PUBLIC_POSTMARK_API_KEY=your_postmark_api_key_here
# OR
POSTMARK_API_KEY=your_postmark_api_key_here
```

**Get your Postmark API key:**
1. Sign up at [postmarkapp.com](https://postmarkapp.com)
2. Create a new Server
3. Get your Server API Token
4. Add it to your environment configuration

### 2. Domain Verification
For production emails, verify your domain in Postmark:
- Add DNS records as instructed by Postmark
- This ensures emails come from `noreply@reviewsandmarketing.com`

## 📧 Email Flow

### Signup Process
1. User creates account
2. **Welcome email** sent immediately
3. **Verification email** sent via Firebase
4. User must verify email before accessing dashboard
5. "Resend Verification" button available if needed

### Password Reset
1. User requests password reset
2. **Password reset email** sent with custom link
3. Link expires in 1 hour for security
4. Professional branded email template

### Login Notifications
1. **Login notification emails** sent for new device logins
2. Includes device info and login time
3. Security alerts for suspicious activity

## 🎨 Email Templates

All emails include:
- Professional branding with your logo/colors
- Mobile-responsive design
- Clear call-to-action buttons
- Security information and expiration notices
- Links to your privacy policy and contact page

## 🚀 Deployment

The email system is now deployed and ready. Once you add your Postmark API key, users will receive:

- **Welcome emails** when they sign up
- **Verification emails** to confirm their account
- **Password reset emails** when requested
- **Login notifications** for security

## 🔧 Customization

Email templates can be customized in `src/lib/emailService.ts`:
- Colors and branding
- Email content and messaging
- Button styles and links
- Expiration times and security notices

## 📱 Testing

Test the email system by:
1. Creating a new account
2. Requesting password reset
3. Checking email delivery and formatting
4. Verifying all links work correctly

## 🆘 Support

If emails aren't working:
1. Check your Postmark API key is correct
2. Verify domain DNS settings in Postmark
3. Check browser console for errors
4. Ensure environment variables are loaded

---

**Your authentication system is now enterprise-ready with professional email flows! 🎉**
