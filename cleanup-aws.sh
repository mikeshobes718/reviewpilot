#!/bin/bash

echo "🧹 AWS CLEANUP - Removing old, failed Elastic Beanstalk environments and applications"
echo "This will help keep your AWS account clean and reduce costs."
echo ""

# Set region
REGION="us-east-1"

echo "📋 Current Elastic Beanstalk environments:"
aws elasticbeanstalk describe-environments --region $REGION --query 'Environments[*].{Name:EnvironmentName,Status:Status,Health:Health,App:ApplicationName}' --output table

echo ""
echo "📋 Current Elastic Beanstalk applications:"
aws elasticbeanstalk describe-applications --region $REGION --query 'Applications[*].{Name:ApplicationName,DateCreated:DateCreated,Description:Description}' --output table

echo ""
echo "🚨 ENVIRONMENTS TO TERMINATE (Red/Unhealthy):"
echo "  - reviews-marketing-fresh-new (Red)"
echo "  - reviews-marketing-with-profile (Red)"
echo "  - reviews-marketing-prod (Red)"
echo "  - reviewpilot-prod (Red)"
echo ""

echo "🗑️  APPLICATIONS TO DELETE (Old/Unused):"
echo "  - my-app (old EB CLI init)"
echo "  - reviews-marketing-app (old deployment)"
echo "  - reviewpilot (old deployment)"
echo ""

echo "✅ KEEPING (Working):"
echo "  - reviews-marketing-fresh (with reviews-marketing-fresh-ULTIMATE environment)"
echo ""

read -p "Do you want to proceed with cleanup? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Cleanup cancelled."
    exit 1
fi

echo ""
echo "🧹 Starting cleanup process..."

# Terminate failed environments
echo "🗑️  Terminating failed environments..."

ENVIRONMENTS_TO_TERMINATE=(
    "reviews-marketing-fresh-new"
    "reviews-marketing-with-profile"
    "reviews-marketing-prod"
    "reviewpilot-prod"
)

for env in "${ENVIRONMENTS_TO_TERMINATE[@]}"; do
    echo "  Terminating environment: $env"
    aws elasticbeanstalk terminate-environment --environment-name "$env" --region $REGION --output text
    if [ $? -eq 0 ]; then
        echo "    ✅ $env termination initiated"
    else
        echo "    ❌ Failed to terminate $env"
    fi
done

echo ""
echo "⏳ Waiting for environments to terminate..."
sleep 30

# Delete old applications (only after environments are terminated)
echo "🗑️  Deleting old applications..."

APPLICATIONS_TO_DELETE=(
    "my-app"
    "reviews-marketing-app"
    "reviewpilot"
)

for app in "${APPLICATIONS_TO_DELETE[@]}"; do
    echo "  Deleting application: $app"
    
    # Check if app has any environments
    ENV_COUNT=$(aws elasticbeanstalk describe-environments --application-name "$app" --region $REGION --query 'Environments | length(@)' --output text)
    
    if [ "$ENV_COUNT" -eq 0 ]; then
        aws elasticbeanstalk delete-application --application-name "$app" --region $REGION --output text
        if [ $? -eq 0 ]; then
            echo "    ✅ $app deleted successfully"
        else
            echo "    ❌ Failed to delete $app"
        fi
    else
        echo "    ⚠️  Skipping $app - still has $ENV_COUNT environment(s)"
    fi
done

echo ""
echo "🧹 Cleanup completed!"
echo ""
echo "📋 Remaining environments:"
aws elasticbeanstalk describe-environments --region $REGION --query 'Environments[*].{Name:EnvironmentName,Status:Status,Health:Health,App:ApplicationName}' --output table

echo ""
echo "📋 Remaining applications:"
aws elasticbeanstalk describe-applications --region $REGION --query 'Applications[*].{Name:ApplicationName,DateCreated:DateCreated,Description:Description}' --output table

echo ""
echo "🎉 Cleanup complete! Your AWS account is now cleaner and more cost-effective."
echo "✅ Only the working 'reviews-marketing-fresh' application remains."
