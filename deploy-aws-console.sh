#!/bin/bash

echo "🚀 AWS Console Deployment for Reviews & Marketing"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Configuration
DOMAIN_NAME="reviewsandmarketing.com"
APP_NAME="reviews-marketing-app"

print_status "Building application for AWS deployment..."

# Clean and build
if [ -d ".next" ]; then
    rm -rf .next
fi

npm install
npm run build

if [ $? -eq 0 ]; then
    print_success "Application built successfully!"
else
    print_error "Build failed!"
    exit 1
fi

print_status "Creating deployment package..."

# Create deployment directory
mkdir -p aws-deployment
cp -r .next aws-deployment/
cp -r public aws-deployment/
cp -r src aws-deployment/
cp package*.json aws-deployment/
cp next.config.js aws-deployment/
cp .ebextensions aws-deployment/ -r
cp Procfile aws-deployment/ 2>/dev/null || echo "web: npm start" > aws-deployment/Procfile

# Create deployment instructions
cat > aws-deployment/DEPLOYMENT-INSTRUCTIONS.md << 'EOF'
# 🚀 AWS Deployment Instructions

## Option 1: AWS Amplify (Recommended)

### Step 1: Go to AWS Amplify Console
1. Open AWS Console
2. Navigate to AWS Amplify
3. Click "New App" → "Host web app"

### Step 2: Connect Repository
1. Choose "GitHub" or "Bitbucket"
2. Connect your repository
3. Select the branch to deploy

### Step 3: Configure Build Settings
Use these build settings:
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm install
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

### Step 4: Deploy
1. Click "Save and deploy"
2. Wait for build to complete
3. Your app will be live at the provided URL

### Step 5: Custom Domain
1. Go to "Domain Management"
2. Add your domain: reviewsandmarketing.com
3. Follow DNS verification steps
4. Request SSL certificate

## Option 2: Elastic Beanstalk

### Step 1: Create Application
1. Go to Elastic Beanstalk Console
2. Click "Create Application"
3. Name: reviews-marketing-app
4. Platform: Node.js

### Step 2: Upload Code
1. Upload the aws-deployment.zip file
2. Configure environment variables from env.production
3. Deploy

### Step 3: Configure Domain
1. Update DNS to point to EB environment
2. Request SSL certificate in Certificate Manager

## Option 3: S3 + CloudFront

### Step 1: Create S3 Bucket
1. Create bucket: reviews-marketing-static
2. Enable static website hosting
3. Upload built files

### Step 2: Create CloudFront Distribution
1. Create distribution pointing to S3
2. Configure custom domain
3. Request SSL certificate

## Environment Variables
Copy these to your AWS environment:
EOF

# Add environment variables to instructions
cat env.production >> aws-deployment/DEPLOYMENT-INSTRUCTIONS.md

# Create zip file
cd aws-deployment
zip -r ../aws-deployment.zip .
cd ..

print_success "Deployment package created: aws-deployment.zip"
print_success "Deployment instructions created: aws-deployment/DEPLOYMENT-INSTRUCTIONS.md"

echo ""
echo "🎯 NEXT STEPS:"
echo "1. Open AWS Console: https://console.aws.amazon.com/"
echo "2. Go to AWS Amplify (recommended) or Elastic Beanstalk"
echo "3. Follow the instructions in DEPLOYMENT-INSTRUCTIONS.md"
echo "4. Your app will be live at: https://${DOMAIN_NAME}"
echo ""
echo "📁 Files created:"
echo "   • aws-deployment.zip (deployment package)"
echo "   • aws-deployment/ (deployment directory)"
echo "   • DEPLOYMENT-INSTRUCTIONS.md (step-by-step guide)"
echo ""
echo "🚀 Ready to deploy to AWS!"
