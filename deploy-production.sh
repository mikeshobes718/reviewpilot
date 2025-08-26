#!/bin/bash

echo "🚀 Reviews & Marketing - Production Deployment Script"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    # Check AWS CLI
    if ! command -v aws &> /dev/null; then
        print_warning "AWS CLI is not installed. Installing now..."
        if [[ "$OSTYPE" == "darwin"* ]]; then
            brew install awscli
        else
            print_error "Please install AWS CLI manually: https://aws.amazon.com/cli/"
            exit 1
        fi
    fi
    
    print_success "All dependencies are available!"
}

# Build the application
build_app() {
    print_status "Building Next.js application..."
    
    # Clean previous build
    if [ -d ".next" ]; then
        rm -rf .next
    fi
    
    # Install dependencies
    npm install
    
    # Build the app
    if npm run build; then
        print_success "Application built successfully!"
    else
        print_error "Build failed! Please check the errors above."
        exit 1
    fi
}

# Check AWS credentials
check_aws_credentials() {
    print_status "Checking AWS credentials..."
    
    if aws sts get-caller-identity &> /dev/null; then
        print_success "AWS credentials are configured!"
        return 0
    else
        print_warning "AWS credentials are not configured or invalid."
        print_status "You have several deployment options:"
        echo ""
        echo "1. Configure AWS credentials:"
        echo "   aws configure"
        echo ""
        echo "2. Use AWS Amplify (recommended for Next.js):"
        echo "   amplify init"
        echo ""
        echo "3. Deploy to Vercel (alternative):"
        echo "   npm install -g vercel && vercel --prod"
        echo ""
        return 1
    fi
}

# Deploy to AWS Elastic Beanstalk
deploy_elastic_beanstalk() {
    print_status "Deploying to AWS Elastic Beanstalk..."
    
    # Check if EB CLI is installed
    if ! command -v eb &> /dev/null; then
        print_warning "Elastic Beanstalk CLI not found. Installing..."
        pip3 install awsebcli
    fi
    
    # Initialize EB application
    if [ ! -f ".elasticbeanstalk/config.yml" ]; then
        print_status "Initializing Elastic Beanstalk application..."
        eb init reviews-marketing-app \
            --platform node.js \
            --region us-east-1 \
            --source codecommit/reviews-marketing-app
    fi
    
    # Create environment if it doesn't exist
    print_status "Creating/updating Elastic Beanstalk environment..."
    eb create reviews-marketing-prod \
        --instance-type t3.small \
        --single-instance \
        --envvars $(cat env.production | grep -v '^#' | tr '\n' ',' | sed 's/,$//')
    
    # Deploy
    print_status "Deploying application..."
    if eb deploy; then
        print_success "Deployment successful!"
        
        # Get the application URL
        APP_URL=$(eb status | grep CNAME | awk '{print $2}')
        if [ ! -z "$APP_URL" ]; then
            print_success "Your application is live at: http://$APP_URL"
            echo "http://$APP_URL" > .deployment-url
        fi
    else
        print_error "Deployment failed! Check the logs with 'eb logs'"
        exit 1
    fi
}

# Deploy to AWS Amplify
deploy_amplify() {
    print_status "Deploying to AWS Amplify..."
    
    # Check if Amplify CLI is installed
    if ! command -v amplify &> /dev/null; then
        print_warning "Amplify CLI not found. Installing..."
        npm install -g @aws-amplify/cli
    fi
    
    # Initialize Amplify if not already done
    if [ ! -f "amplify/team-provider-info.json" ]; then
        print_status "Initializing Amplify project..."
        amplify init \
            --app reviews-marketing-app \
            --envName prod \
            --defaultEditor code \
            --framework nextjs \
            --yes
    fi
    
    # Add hosting
    print_status "Adding hosting to Amplify..."
    amplify add hosting \
        --envName prod \
        --appId reviews-marketing-app \
        --yes
    
    # Publish
    print_status "Publishing to Amplify..."
    if amplify publish --envName prod; then
        print_success "Amplify deployment successful!"
        
        # Get the URL from amplify status
        AMPLIFY_URL=$(amplify status | grep "Hosting endpoint" | awk '{print $3}')
        if [ ! -z "$AMPLIFY_URL" ]; then
            print_success "Your application is live at: $AMPLIFY_URL"
            echo "$AMPLIFY_URL" > .deployment-url
        fi
    else
        print_error "Amplify deployment failed!"
        exit 1
    fi
}

# Deploy to Vercel (fallback)
deploy_vercel() {
    print_status "Deploying to Vercel (fallback option)..."
    
    # Check if Vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        print_status "Installing Vercel CLI..."
        npm install -g vercel
    fi
    
    # Deploy to Vercel
    print_status "Deploying to Vercel..."
    if vercel --prod --yes; then
        print_success "Vercel deployment successful!"
        
        # Get the URL from vercel output
        VERCEL_URL=$(vercel ls | grep "reviews-marketing" | awk '{print $2}')
        if [ ! -z "$VERCEL_URL" ]; then
            print_success "Your application is live at: $VERCEL_URL"
            echo "$VERCEL_URL" > .deployment-url
        fi
    else
        print_error "Vercel deployment failed!"
        exit 1
    fi
}

# Main deployment function
main_deployment() {
    print_status "Starting production deployment..."
    
    # Check dependencies
    check_dependencies
    
    # Build the application
    build_app
    
    # Check AWS credentials
    if check_aws_credentials; then
        # Try Elastic Beanstalk first
        if deploy_elastic_beanstalk; then
            return 0
        fi
        
        # Fallback to Amplify
        if deploy_amplify; then
            return 0
        fi
    fi
    
    # If AWS deployment fails, try Vercel
    print_warning "AWS deployment failed. Trying Vercel as fallback..."
    if deploy_vercel; then
        return 0
    fi
    
    print_error "All deployment methods failed!"
    exit 1
}

# Run deployment
main_deployment

# Final status
if [ -f ".deployment-url" ]; then
    DEPLOYMENT_URL=$(cat .deployment-url)
    echo ""
    echo "🎉 DEPLOYMENT COMPLETE! 🎉"
    echo "=========================="
    echo "Your application is live at: $DEPLOYMENT_URL"
    echo ""
    echo "Next steps:"
    echo "1. Test all functionality on the live site"
    echo "2. Configure your custom domain if needed"
    echo "3. Set up monitoring and alerts"
    echo ""
    echo "Happy testing! 🚀"
else
    print_error "Deployment failed! Please check the errors above."
    exit 1
fi
