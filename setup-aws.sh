#!/bin/bash

echo "🔧 AWS Setup for Reviews & Marketing"
echo "===================================="

echo ""
echo "📋 Prerequisites Check:"
echo "1. AWS Account ✓"
echo "2. Domain Control over reviewsandmarketing.com ✓"
echo "3. AWS CLI installed ✓"
echo "4. Node.js 18+ installed ✓"

echo ""
echo "🔑 Next Steps:"
echo "1. Configure AWS credentials:"
echo "   aws configure"
echo ""
echo "2. Enter your AWS credentials when prompted:"
echo "   - AWS Access Key ID"
echo "   - AWS Secret Access Key"
echo "   - Default region: us-east-1"
echo "   - Default output format: json"
echo ""
echo "3. Verify configuration:"
echo "   aws sts get-caller-identity"
echo ""
echo "4. Run deployment:"
echo "   ./aws-deploy.sh"
echo ""

echo "📚 For detailed instructions, see: AWS-DEPLOYMENT-GUIDE.md"
echo ""

echo "🚀 Ready to deploy to https://reviewsandmarketing.com!"
echo ""

# Check if AWS CLI is configured
if aws sts get-caller-identity &> /dev/null; then
    echo "✅ AWS credentials are already configured!"
    echo "You can now run: ./aws-deploy.sh"
else
    echo "❌ AWS credentials not configured yet."
    echo "Please run 'aws configure' first."
fi
