#!/bin/bash

echo "🚀 PRE-BUILT DEPLOYMENT - Ready to run immediately!"

# Set variables
APP_NAME="reviews-marketing-fresh"
ENV_NAME="reviews-marketing-with-profile"
REGION="us-east-1"
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
VERSION_LABEL="PREBUILT-$TIMESTAMP"
ZIP_FILE="PREBUILT-deployment-$TIMESTAMP.zip"

echo "📦 Building application locally..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"

echo "📦 Creating PRE-BUILT deployment bundle..."
# Include everything needed to run immediately
zip -r "$ZIP_FILE" . -x "*.git*" "*.env*" "coverage/*" "review-saas/*" "rm-fresh/*" "tests/*" "tests-examples/*" "*.log" ".DS_Store" "deploy-*.sh" "aws-*.sh" "aws-deployment/*" "build/*" "*.zip" "node_modules/.cache/*" ".next/cache/*" ".next/types/*"

if [ $? -ne 0 ]; then
    echo "❌ Failed to create deployment bundle!"
    exit 1
fi

echo "✅ PRE-BUILT deployment bundle created: $ZIP_FILE"
echo "📊 Bundle size: $(du -h $ZIP_FILE | cut -f1)"

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
    --description "PRE-BUILT DEPLOYMENT - Ready to run - $TIMESTAMP" \
    --source-bundle S3Bucket="$S3_BUCKET",S3Key="$S3_KEY" \
    --region $REGION

if [ $? -ne 0 ]; then
    echo "❌ Failed to create application version!"
    exit 1
fi

echo "✅ Application version created: $VERSION_LABEL"

echo "🚀 Deploying pre-built version to environment..."
aws elasticbeanstalk update-environment \
    --environment-name "$ENV_NAME" \
    --version-label "$VERSION_LABEL" \
    --region $REGION

if [ $? -eq 0 ]; then
    echo "✅ PRE-BUILT deployment initiated successfully!"
    echo "🌐 Environment: $ENV_NAME"
    echo "📦 Version: $VERSION_LABEL"
    echo "🔴 This deployment is ready to run immediately!"
    echo "📊 Check status with: aws elasticbeanstalk describe-environments --environment-names $ENV_NAME --region $REGION"
else
    echo "❌ Failed to deploy!"
    exit 1
fi

echo "🧹 Cleaning up local files..."
rm -f "$ZIP_FILE"

echo "🎉 PRE-BUILT deployment process completed!"
echo "💪 Your app will start immediately without any build steps!"
