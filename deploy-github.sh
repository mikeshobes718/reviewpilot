#!/bin/bash

echo "🚀 GITHUB DEPLOYMENT - Deploying from GitHub to Elastic Beanstalk!"

# Set variables
APP_NAME="reviews-marketing-fresh"
ENV_NAME="reviews-marketing-fresh-ULTIMATE"
REGION="us-east-1"
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
VERSION_LABEL="GITHUB-$TIMESTAMP"

echo "📦 Building application locally..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"

echo "📤 Pushing latest changes to GitHub..."
git add .
git commit -m "Deploy version $VERSION_LABEL - $TIMESTAMP"
git push origin main

if [ $? -ne 0 ]; then
    echo "❌ Failed to push to GitHub!"
    exit 1
fi

echo "✅ Pushed to GitHub successfully!"

echo "🚀 Deploying from GitHub to Elastic Beanstalk..."
# Deploy directly from GitHub using eb deploy
eb deploy --environment $ENV_NAME --region $REGION --version $VERSION_LABEL

if [ $? -eq 0 ]; then
    echo "✅ GITHUB deployment initiated successfully!"
    echo "🌐 Environment: $ENV_NAME"
    echo "📦 Version: $VERSION_LABEL"
    echo "🔗 GitHub: https://github.com/mikeshobes718/reviewpilot"
    echo "📊 Check status with: eb status --environment $ENV_NAME"
else
    echo "❌ Failed to deploy!"
    exit 1
fi

echo "🎉 GITHUB deployment process completed!"
echo "💪 Your app is now deployed from GitHub!"
