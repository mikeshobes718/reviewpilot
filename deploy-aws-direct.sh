#!/bin/bash

echo "🚀 Deploying to AWS Elastic Beanstalk via AWS CLI..."

# Set variables
APP_NAME="reviews-marketing-fresh"
ENV_NAME="reviews-marketing-prod"
REGION="us-east-1"
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
VERSION_LABEL="v-$TIMESTAMP"
ZIP_FILE="build/app.zip"

# Check if artifact exists
if [ ! -f "$ZIP_FILE" ]; then
    echo "❌ Deployment artifact not found. Run ./build-artifact.sh first!"
    exit 1
fi

echo "📦 Using artifact: $ZIP_FILE"
echo "🏷️  Version label: $VERSION_LABEL"

# Get the S3 bucket for Elastic Beanstalk
echo "🔍 Finding Elastic Beanstalk S3 bucket..."
S3_BUCKET=$(aws elasticbeanstalk create-storage-location --region $REGION --query 'S3Bucket' --output text)

if [ $? -ne 0 ]; then
    echo "❌ Failed to get S3 bucket!"
    exit 1
fi

echo "📦 Using S3 bucket: $S3_BUCKET"

# Upload the bundle to S3
echo "📤 Uploading to S3..."
S3_KEY="$APP_NAME/$VERSION_LABEL.zip"
aws s3 cp $ZIP_FILE s3://$S3_BUCKET/$S3_KEY --region $REGION

if [ $? -ne 0 ]; then
    echo "❌ Failed to upload to S3!"
    exit 1
fi

echo "✅ Upload successful!"

# Create the new application version
echo "🏷️  Creating application version..."
aws elasticbeanstalk create-application-version \
    --application-name $APP_NAME \
    --version-label $VERSION_LABEL \
    --description "Deployment with platform hooks - $TIMESTAMP" \
    --source-bundle S3Bucket=$S3_BUCKET,S3Key=$S3_KEY \
    --region $REGION

if [ $? -ne 0 ]; then
    echo "❌ Failed to create application version!"
    exit 1
fi

echo "✅ Application version created!"

# Deploy the version to the environment
echo "🚀 Deploying to environment..."
aws elasticbeanstalk update-environment \
    --environment-name $ENV_NAME \
    --version-label $VERSION_LABEL \
    --region $REGION

if [ $? -eq 0 ]; then
    echo "✅ Deployment started successfully!"
    echo "🌐 Environment: $ENV_NAME"
    echo "📊 Check status with: aws elasticbeanstalk describe-environments --environment-names $ENV_NAME --region $REGION"
    echo "📝 View logs with: aws elasticbeanstalk retrieve-environment-info --environment-name $ENV_NAME --info-type tail --region $REGION"
else
    echo "❌ Failed to start deployment!"
    exit 1
fi
