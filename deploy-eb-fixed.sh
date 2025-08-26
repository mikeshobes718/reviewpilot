#!/bin/bash

echo "🚀 Fixed Elastic Beanstalk Deployment for Reviews & Marketing"
echo "=============================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_status "Building application locally..."

# Clean and build
if [ -d ".next" ]; then
    rm -rf .next
fi

npm install
npm run build

if [ $? -eq 0 ]; then
    print_success "Application built successfully!"
else
    print_error "Build failed!"
    exit 1
fi

print_status "Verifying .next directory exists..."
if [ -d ".next" ]; then
    print_success ".next directory found with $(find .next -type f | wc -l) files"
else
    print_error ".next directory not found after build!"
    exit 1
fi

print_status "Deploying to Elastic Beanstalk..."

# Deploy using EB CLI
eb deploy

if [ $? -eq 0 ]; then
    print_success "Deployment successful!"
    
    # Get the application URL
    APP_URL=$(eb status | grep CNAME | awk '{print $2}')
    if [ ! -z "$APP_URL" ]; then
        print_success "Your application is live at: http://${APP_URL}"
        
        print_status "Testing application..."
        sleep 10  # Wait for deployment to settle
        
        # Test the application
        HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://${APP_URL}")
        if [ "$HTTP_STATUS" = "200" ]; then
            print_success "Application is responding correctly (HTTP 200)!"
        else
            print_warning "Application returned HTTP ${HTTP_STATUS}. Checking logs..."
            eb logs --all
        fi
    fi
else
    print_error "Deployment failed! Check the logs with 'eb logs'"
    exit 1
fi

echo ""
echo "🎯 DEPLOYMENT COMPLETE! 🎯"
echo "=========================="
echo "Your application should now be working at:"
echo "http://${APP_URL:-'reviews-marketing-prod.eba-apum6r2g.us-east-1.elasticbeanstalk.com'}"
echo ""
echo "If you still see 502 errors, check the logs with:"
echo "eb logs --all"
echo ""
echo "🚀 Happy testing!"
