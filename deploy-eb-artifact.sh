#!/bin/bash

echo "🚀 Deploying to Elastic Beanstalk using Artifact Mode (EB CLI method)"

# Set variables
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
ZIP_FILE="build/app-$TIMESTAMP.zip"

echo "📦 Building application locally..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"

echo "📦 Creating deployment bundle..."
mkdir -p build

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

echo "🔧 Configuring EB CLI to use artifact..."
# Create or update .elasticbeanstalk/config.yml
mkdir -p .elasticbeanstalk
cat > .elasticbeanstalk/config.yml << EOF
branch-defaults:
  main:
    environment: reviews-marketing-with-profile
    group_suffix: null

deploy:
  artifact: $ZIP_FILE

global:
  application_name: reviews-marketing-fresh
  branch: null
  default_ec2_keyname: null
  default_platform: Node.js 22 running on 64bit Amazon Linux 2023
  default_region: us-east-1
  include_git_submodules: true
  instance_profile: null
  platform_name: null
  platform_version: null
  profile: null
  repository: null
  sc: null
  workspace_type: Application
EOF

echo "✅ EB CLI configured to use artifact: $ZIP_FILE"

echo "🚀 Deploying with EB CLI..."
eb deploy

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "🌐 Your app should be available shortly"
    echo "📊 Check status with: eb status"
    echo "📋 View logs with: eb logs"
else
    echo "❌ Deployment failed!"
    echo "💡 Try using the AWS CLI method instead: ./deploy-eb-golden.sh"
    exit 1
fi

echo "🎉 Deployment process completed!"
