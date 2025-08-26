#!/bin/bash

echo "🚀 Starting AWS Elastic Beanstalk Deployment..."

# Check if AWS CLI is configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS CLI not configured. Please run 'aws configure' first."
    exit 1
fi

# Build the application
echo "📦 Building Next.js application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Exiting."
    exit 1
fi

echo "✅ Build successful!"

# Initialize Elastic Beanstalk application
echo "🔧 Initializing Elastic Beanstalk application..."
eb init reviews-marketing-app \
    --platform node.js \
    --region us-east-1

# Create environment if it doesn't exist
echo "🌍 Creating Elastic Beanstalk environment..."
eb create reviews-marketing-prod \
    --instance-type t3.small \
    --single-instance \
    --envvars $(cat env.production | grep -v '^#' | tr '\n' ',' | sed 's/,$//')

# Deploy the application
echo "🚀 Deploying to Elastic Beanstalk..."
eb deploy

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "🌐 Your application is now live!"
    
    # Get the application URL
    APP_URL=$(eb status | grep CNAME | awk '{print $2}')
    echo "🔗 Application URL: http://$APP_URL"
    
    # Open the application
    echo "🌐 Opening application in browser..."
    open "http://$APP_URL"
else
    echo "❌ Deployment failed. Check the logs with 'eb logs'"
    exit 1
fi
