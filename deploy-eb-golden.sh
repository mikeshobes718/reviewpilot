#!/bin/bash

echo "🚀 Deploying to Elastic Beanstalk using Golden Setup (AWS CLI method)"

# Set variables
APP_NAME="reviews-marketing-fresh"
ENV_NAME="reviews-marketing-fresh-new"
REGION="us-east-1"
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
VERSION_LABEL="v-$TIMESTAMP"
ZIP_FILE="deployment-$TIMESTAMP.zip"

echo "📦 Building application locally..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"

echo "📦 Creating deployment bundle..."
# Use git archive if available, otherwise use zip
if command -v git &> /dev/null && git rev-parse --git-dir > /dev/null 2>&1; then
    echo "Using git archive for clean packaging..."
    git archive --format=zip --output="$ZIP_FILE" HEAD
else
    echo "Using zip for packaging..."
    zip -r "$ZIP_FILE" . -x "node_modules/*" ".next/cache/*" ".next/types/*" ".git/*" ".env*" "__tests__/*" "coverage/*" "*.log" ".DS_Store"
fi

if [ $? -ne 0 ]; then
    echo "❌ Failed to create deployment bundle!"
    exit 1
fi

echo "✅ Deployment bundle created: $ZIP_FILE"

echo "🔍 Finding Elastic Beanstalk S3 bucket..."
S3_BUCKET=$(aws elasticbeanstalk create-storage-location --region $REGION --query 'S3Bucket' --output text)

if [ $? -ne 0 ]; then
    echo "❌ Failed to get S3 bucket!"
    exit 1
fi

echo "📤 Uploading to S3 bucket: $S3_BUCKET"
S3_KEY="$APP_NAME/$ZIP_FILE"

aws s3 cp "$ZIP_FILE" "s3://$S3_BUCKET/$S3_KEY" --region $REGION

if [ $? -ne 0 ]; then
    echo "❌ Failed to upload to S3!"
    exit 1
fi

echo "✅ Upload successful!"

echo "📋 Creating application version..."
aws elasticbeanstalk create-application-version \
    --application-name "$APP_NAME" \
    --version-label "$VERSION_LABEL" \
    --description "Golden setup deployment with platform hooks - $TIMESTAMP" \
    --source-bundle S3Bucket="$S3_BUCKET",S3Key="$S3_KEY" \
    --region $REGION

if [ $? -ne 0 ]; then
    echo "❌ Failed to create application version!"
    exit 1
fi

echo "✅ Application version created: $VERSION_LABEL"

echo "🚀 Deploying to environment..."
aws elasticbeanstalk update-environment \
    --environment-name "$ENV_NAME" \
    --version-label "$VERSION_LABEL" \
    --region $REGION

if [ $? -eq 0 ]; then
    echo "✅ Deployment initiated successfully!"
    echo "🌐 Environment: $ENV_NAME"
    echo "📦 Version: $VERSION_LABEL"
    echo "🌐 Your app will be available at: http://reviews-marketing-fresh-new.eba-bpj772a5.us-east-1.elasticbeanstalk.com"
    echo "📊 Check status with: aws elasticbeanstalk describe-environments --environment-names $ENV_NAME --region $REGION"
    echo "📋 View logs with: aws elasticbeanstalk retrieve-environment-info --environment-name $ENV_NAME --info-type tail --region $REGION"
else
    echo "❌ Failed to deploy!"
    exit 1
fi

echo "🧹 Cleaning up local files..."
rm -f "$ZIP_FILE"

echo "🎉 Deployment process completed!"
