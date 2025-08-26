#!/bin/bash

echo "🚀 Building deployment artifact for Elastic Beanstalk..."

# Create build directory
mkdir -p build

# Build the Next.js app locally
echo "📦 Building Next.js application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"

# Create the deployment ZIP
echo "📦 Creating deployment artifact..."
cd build
zip -r app.zip .. -x "node_modules/*" ".next/*" ".git/*" ".env*" "__tests__/*" "coverage/*" "tests/*" "tests-examples/*" "*.zip" "aws-deployment/*" "aws-deployment.zip" ".DS_Store" "npm-debug.log*"

if [ $? -eq 0 ]; then
    echo "✅ Deployment artifact created: build/app.zip"
    echo "📊 Artifact size: $(du -h app.zip | cut -f1)"
    echo "🚀 Ready to deploy with: eb deploy"
else
    echo "❌ Failed to create deployment artifact!"
    exit 1
fi
