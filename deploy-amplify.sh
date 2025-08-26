#!/bin/bash

echo "🚀 Deploying to AWS Amplify..."

# Set variables
APP_ID="d213nrmvvrm0e8"
BRANCH_NAME="main"
REGION="us-east-1"

echo "📦 Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"

echo "📤 Creating deployment..."
DEPLOYMENT_ID=$(aws amplify create-deployment \
    --app-id $APP_ID \
    --branch-name $BRANCH_NAME \
    --region $REGION \
    --query 'jobSummary.jobId' \
    --output text)

if [ $? -eq 0 ] && [ "$DEPLOYMENT_ID" != "None" ]; then
    echo "✅ Deployment created with ID: $DEPLOYMENT_ID"
    
    echo "🚀 Starting deployment..."
    aws amplify start-deployment \
        --app-id $APP_ID \
        --branch-name $BRANCH_NAME \
        --job-id $DEPLOYMENT_ID \
        --region $REGION
    
    if [ $? -eq 0 ]; then
        echo "✅ Deployment started successfully!"
        echo "🌐 Your app will be available at: https://d213nrmvvrm0e8.amplifyapp.com"
        echo "📊 Check deployment status with: aws amplify get-job --app-id $APP_ID --branch-name $BRANCH_NAME --job-id $DEPLOYMENT_ID"
    else
        echo "❌ Failed to start deployment!"
        exit 1
    fi
else
    echo "❌ Failed to create deployment!"
    exit 1
fi
