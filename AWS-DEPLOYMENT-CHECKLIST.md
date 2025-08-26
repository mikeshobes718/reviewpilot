# 🚀 AWS Deployment Checklist for reviewsandmarketing.com

## ✅ Pre-Deployment Checklist

- [ ] **AWS Account Setup**
  - [ ] AWS account created and verified
  - [ ] IAM user with appropriate permissions created
  - [ ] Access keys generated for the IAM user

- [ ] **Domain Control**
  - [ ] Domain `reviewsandmarketing.com` is under your control
  - [ ] Access to domain registrar/DNS management
  - [ ] Domain is not currently pointing to another service

- [ ] **Local Environment**
  - [ ] Node.js 18+ installed
  - [ ] AWS CLI installed
  - [ ] All dependencies installed (`npm install`)

## 🔑 Step 1: AWS Credentials Configuration

```bash
# Configure AWS CLI
aws configure

# Enter your credentials:
# AWS Access Key ID: [your_access_key]
# AWS Secret Access Key: [your_secret_key]
# Default region name: us-east-1
# Default output format: json

# Verify configuration
aws sts get-caller-identity
```

## 🚀 Step 2: Deploy to AWS

```bash
# Make scripts executable
chmod +x aws-deploy.sh
chmod +x setup-aws.sh

# Run deployment
./aws-deploy.sh
```

## 🌐 Step 3: Domain Configuration

### 3.1 DNS Settings
After successful deployment, update your domain's DNS:

**For Elastic Beanstalk:**
- Create an **A record** pointing to your EB environment IP
- Or create a **CNAME record** pointing to your EB environment URL

**For AWS Amplify:**
- Create a **CNAME record** pointing to your Amplify domain

### 3.2 SSL Certificate
1. Go to **AWS Certificate Manager** in `us-east-1` region
2. **Request a certificate** for `reviewsandmarketing.com`
3. **Validate the certificate** (DNS validation recommended)
4. **Attach the certificate** to your hosting service

## 🧪 Step 4: Testing

### 4.1 Test AWS Deployment
```bash
# Test the live AWS deployment
node test-aws-production.js
```

### 4.2 Manual Testing Checklist
- [ ] **Homepage** loads correctly
- [ ] **Logo** links back to homepage
- [ ] **Navigation** works on desktop and mobile
- [ ] **Pricing** link works and shows correct prices
- [ ] **Watch Demo** button opens YouTube video
- [ ] **Authentication** system works (sign up, sign in, password reset)
- [ ] **Dashboard** access requires authentication
- [ ] **Contact page** shows correct Hoboken address
- [ ] **Privacy policy** shows August 26, 2025 date
- [ ] **Year 2025** appears throughout the site
- [ ] **Mobile responsiveness** works on all screen sizes

## 🔍 Step 5: Monitoring & Verification

### 5.1 AWS Console Checks
- [ ] **Elastic Beanstalk** environment is healthy
- [ ] **CloudWatch** logs show no errors
- [ ] **S3 bucket** is accessible
- [ ] **SSL certificate** is valid and attached

### 5.2 Performance Checks
- [ ] **Page load time** under 5 seconds
- [ ] **Mobile performance** is acceptable
- [ ] **All images** load correctly
- [ ] **No console errors** in browser

## 🚨 Troubleshooting

### Common Issues & Solutions

1. **Build Failures**
   ```bash
   # Check Node.js version
   node --version  # Should be 18+
   
   # Clean and rebuild
   rm -rf .next node_modules
   npm install
   npm run build
   ```

2. **Deployment Failures**
   ```bash
   # Check AWS credentials
   aws sts get-caller-identity
   
   # Check Elastic Beanstalk status
   eb status
   
   # View logs
   eb logs
   ```

3. **Domain Issues**
   ```bash
   # Check DNS propagation
   dig reviewsandmarketing.com
   nslookup reviewsandmarketing.com
   
   # Check SSL certificate
   openssl s_client -connect reviewsandmarketing.com:443 -servername reviewsandmarketing.com
   ```

4. **Performance Issues**
   ```bash
   # Check application logs
   eb ssh
   tail -f /var/log/nodejs/nodejs.log
   
   # Monitor CloudWatch metrics
   # Check CPU, memory, and error rates
   ```

## 📊 Success Criteria

Your deployment is successful when:

- [ ] **Domain accessible**: `https://reviewsandmarketing.com` loads
- [ ] **SSL working**: HTTPS with valid certificate
- [ ] **All tests pass**: `node test-aws-production.js` shows 100% success
- [ ] **Performance acceptable**: Page load under 5 seconds
- [ ] **Mobile responsive**: Works on all device sizes
- [ ] **All features functional**: Authentication, dashboard, forms, etc.

## 🔄 Post-Deployment

### 6.1 Set Up Monitoring
- [ ] **CloudWatch alarms** for CPU, memory, error rates
- [ ] **Application performance monitoring**
- [ ] **Uptime monitoring** for the domain

### 6.2 Backup & Recovery
- [ ] **Database backups** configured
- [ ] **Application backups** scheduled
- [ ] **Disaster recovery plan** documented

### 6.3 CI/CD Pipeline
- [ ] **GitHub Actions** or **AWS CodePipeline** configured
- [ ] **Automatic deployments** on code changes
- [ ] **Testing pipeline** integrated

## 📞 Support Resources

- **AWS Documentation**: https://docs.aws.amazon.com/
- **Elastic Beanstalk**: https://docs.aws.amazon.com/elasticbeanstalk/
- **AWS Amplify**: https://docs.aws.amazon.com/amplify/
- **CloudWatch**: https://docs.aws.amazon.com/cloudwatch/

## 🎯 Final Verification

Before considering deployment complete:

1. **Run comprehensive tests**: `node test-aws-production.js`
2. **Verify all functionality** manually
3. **Check performance** on multiple devices
4. **Confirm SSL certificate** is working
5. **Test authentication flows** end-to-end
6. **Verify mobile experience** is optimal

---

## 🚀 **Ready to Deploy!**

Your application is configured and ready for AWS deployment to `https://reviewsandmarketing.com`.

**Next step**: Run `./aws-deploy.sh` after configuring your AWS credentials!

---

**Need help?** Check the detailed guide in `AWS-DEPLOYMENT-GUIDE.md`
