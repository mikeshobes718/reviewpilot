#!/bin/bash

echo "🚀 AWS S3 + CloudFront Deployment for reviewsandmarketing.com"
echo "=============================================================="

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
BUCKET_NAME="reviews-marketing-static-$(date +%s)"
REGION="us-east-1"

print_status "Building application..."

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

print_status "Creating S3 bucket: ${BUCKET_NAME}"

# Create S3 bucket
aws s3 mb "s3://${BUCKET_NAME}" --region ${REGION}

if [ $? -eq 0 ]; then
    print_success "S3 bucket created successfully!"
else
    print_error "Failed to create S3 bucket!"
    exit 1
fi

print_status "Configuring S3 bucket for static website hosting..."

# Configure bucket for static website hosting
aws s3 website "s3://${BUCKET_NAME}" \
    --index-document index.html \
    --error-document error.html

print_status "Uploading application files to S3..."

# Upload built files
aws s3 sync .next/static "s3://${BUCKET_NAME}/_next/static" --delete
aws s3 sync .next/server "s3://${BUCKET_NAME}/_next/server" --delete
aws s3 cp .next/server/app/index.html "s3://${BUCKET_NAME}/index.html"
aws s3 cp .next/server/app/about.html "s3://${BUCKET_NAME}/about.html"
aws s3 cp .next/server/app/contact.html "s3://${BUCKET_NAME}/contact.html"
aws s3 cp .next/server/app/privacy.html "s3://${BUCKET_NAME}/privacy.html"
aws s3 cp .next/server/app/subscribe.html "s3://${BUCKET_NAME}/subscribe.html"
aws s3 cp .next/server/app/auth.html "s3://${BUCKET_NAME}/auth.html"
aws s3 cp .next/server/app/dashboard.html "s3://${BUCKET_NAME}/dashboard.html"
aws s3 cp .next/server/app/admin.html "s3://${BUCKET_NAME}/admin.html"

print_success "Files uploaded to S3!"

print_status "Creating CloudFront distribution..."

# Create CloudFront distribution
DISTRIBUTION_CONFIG=$(cat <<EOF
{
  "CallerReference": "$(date +%s)",
  "Comment": "Reviews & Marketing App",
  "DefaultRootObject": "index.html",
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "S3-${BUCKET_NAME}",
        "DomainName": "${BUCKET_NAME}.s3-website-${REGION}.amazonaws.com",
        "CustomOriginConfig": {
          "HTTPPort": 80,
          "HTTPSPort": 443,
          "OriginProtocolPolicy": "http-only"
        }
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-${BUCKET_NAME}",
    "ViewerProtocolPolicy": "redirect-to-https",
    "AllowedMethods": {
      "Quantity": 7,
      "Items": ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"],
      "CachedMethods": {
        "Quantity": 2,
        "Items": ["GET", "HEAD"]
      }
    },
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": {
        "Forward": "none"
      }
    },
    "MinTTL": 0,
    "DefaultTTL": 86400,
    "MaxTTL": 31536000
  },
  "Enabled": true,
  "PriceClass": "PriceClass_100"
}
EOF
)

# Create the distribution
DISTRIBUTION_ID=$(aws cloudfront create-distribution --distribution-config "$DISTRIBUTION_CONFIG" --query 'Distribution.Id' --output text)

if [ $? -eq 0 ]; then
    print_success "CloudFront distribution created: ${DISTRIBUTION_ID}"
else
    print_error "Failed to create CloudFront distribution!"
    exit 1
fi

print_status "Waiting for CloudFront distribution to deploy..."

# Wait for deployment
aws cloudfront wait distribution-deployed --id ${DISTRIBUTION_ID}

print_success "CloudFront distribution deployed!"

# Get the CloudFront domain
CLOUDFRONT_DOMAIN=$(aws cloudfront get-distribution --id ${DISTRIBUTION_ID} --query 'Distribution.DomainName' --output text)

print_success "Your application is now live at: https://${CLOUDFRONT_DOMAIN}"

print_status "Next steps to configure your custom domain:"

echo ""
echo "🎯 DEPLOYMENT COMPLETE! 🎯"
echo "=========================="
echo "S3 Bucket: ${BUCKET_NAME}"
echo "CloudFront Distribution: ${DISTRIBUTION_ID}"
echo "CloudFront URL: https://${CLOUDFRONT_DOMAIN}"
echo ""
echo "🌐 To use your custom domain (${DOMAIN_NAME}):"
echo "1. Go to AWS Certificate Manager in ${REGION}"
echo "2. Request a certificate for ${DOMAIN_NAME}"
echo "3. Validate the certificate (DNS validation recommended)"
echo "4. Update your CloudFront distribution to use the certificate"
echo "5. Update your DNS to point to the CloudFront distribution"
echo ""
echo "📱 Your app is now live and accessible!"
echo "🔗 Test URL: https://${CLOUDFRONT_DOMAIN}"
echo ""
echo "🚀 Happy testing!"
