#!/bin/bash

echo "🚀 Reviews & Marketing - AWS Deployment to reviewsandmarketing.com"
echo "================================================================"

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

# Configuration
DOMAIN_NAME="reviewsandmarketing.com"
APP_NAME="reviews-marketing-app"
ENVIRONMENT_NAME="reviews-marketing-prod"
REGION="us-east-1"

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

# Check AWS credentials
check_aws_credentials() {
    print_status "Checking AWS credentials..."
    
    if aws sts get-caller-identity &> /dev/null; then
        print_success "AWS credentials are configured!"
        return 0
    else
        print_error "AWS credentials are not configured or invalid."
        print_status "Please run the following commands to configure AWS:"
        echo ""
        echo "1. aws configure"
        echo "   - Enter your AWS Access Key ID"
        echo "   - Enter your AWS Secret Access Key"
        echo "   - Enter region: us-east-1"
        echo "   - Enter output format: json"
        echo ""
        echo "2. Or set environment variables:"
        echo "   export AWS_ACCESS_KEY_ID=your_access_key"
        echo "   export AWS_SECRET_ACCESS_KEY=your_secret_key"
        echo "   export AWS_DEFAULT_REGION=us-east-1"
        echo ""
        return 1
    fi
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

# Create S3 bucket for static assets
create_s3_bucket() {
    print_status "Creating S3 bucket for static assets..."
    
    BUCKET_NAME="${APP_NAME}-static-assets-$(date +%s)"
    
    if aws s3 mb "s3://${BUCKET_NAME}" --region ${REGION}; then
        print_success "S3 bucket created: ${BUCKET_NAME}"
        echo "${BUCKET_NAME}" > .s3-bucket-name
        
        # Configure bucket for static website hosting
        aws s3 website "s3://${BUCKET_NAME}" \
            --index-document index.html \
            --error-document error.html
        
        # Set bucket policy for public read access
        aws s3api put-bucket-policy --bucket "${BUCKET_NAME}" --policy '{
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Sid": "PublicReadGetObject",
                    "Effect": "Allow",
                    "Principal": "*",
                    "Action": "s3:GetObject",
                    "Resource": "arn:aws:s3:::'${BUCKET_NAME}'/*"
                }
            ]
        }'
        
        print_success "S3 bucket configured for static website hosting"
    else
        print_error "Failed to create S3 bucket"
        exit 1
    fi
}

# Deploy to Elastic Beanstalk
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
        eb init ${APP_NAME} \
            --platform node.js \
            --region ${REGION} \
            --source codecommit/${APP_NAME}
    fi
    
    # Create environment if it doesn't exist
    print_status "Creating/updating Elastic Beanstalk environment..."
    
    # Convert environment variables to proper format
    ENV_VARS=""
    while IFS= read -r line; do
        if [[ $line =~ ^[A-Za-z_][A-Za-z0-9_]*= ]]; then
            if [ -z "$ENV_VARS" ]; then
                ENV_VARS="$line"
            else
                ENV_VARS="$ENV_VARS,$line"
            fi
        fi
    done < env.production
    
    eb create ${ENVIRONMENT_NAME} \
        --instance-type t3.small \
        --envvars "$ENV_VARS"
    
    # Deploy
    print_status "Deploying application..."
    if eb deploy; then
        print_success "Deployment successful!"
        
        # Get the application URL
        APP_URL=$(eb status | grep CNAME | awk '{print $2}')
        if [ ! -z "$APP_URL" ]; then
            print_success "Your application is live at: http://${APP_URL}"
            echo "http://${APP_URL}" > .eb-url
        fi
    else
        print_error "Deployment failed! Check the logs with 'eb logs'"
        exit 1
    fi
}

# Deploy to AWS Amplify (alternative)
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
            --app ${APP_NAME} \
            --envName prod \
            --defaultEditor code \
            --framework nextjs \
            --yes
    fi
    
    # Add hosting
    print_status "Adding hosting to Amplify..."
    amplify add hosting \
        --envName prod \
        --appId ${APP_NAME} \
        --yes
    
    # Publish
    print_status "Publishing to Amplify..."
    if amplify publish --envName prod; then
        print_success "Amplify deployment successful!"
        
        # Get the URL from amplify status
        AMPLIFY_URL=$(amplify status | grep "Hosting endpoint" | awk '{print $3}')
        if [ ! -z "$AMPLIFY_URL" ]; then
            print_success "Your application is live at: ${AMPLIFY_URL}"
            echo "${AMPLIFY_URL}" > .amplify-url
        fi
    else
        print_error "Amplify deployment failed!"
        exit 1
    fi
}

# Configure custom domain
configure_custom_domain() {
    print_status "Configuring custom domain: ${DOMAIN_NAME}"
    
    # Check if domain is accessible
    if curl -s "https://${DOMAIN_NAME}" > /dev/null; then
        print_warning "Domain ${DOMAIN_NAME} is already accessible. Please ensure you have control over it."
    fi
    
    print_status "To complete domain configuration, you'll need to:"
    echo ""
    echo "1. Update your domain's DNS settings to point to AWS:"
    echo "   - Create an A record pointing to your Elastic Beanstalk environment"
    echo "   - Or create a CNAME record pointing to your Amplify domain"
    echo ""
    echo "2. Request SSL certificate in AWS Certificate Manager:"
    echo "   - Go to AWS Certificate Manager in ${REGION}"
    echo "   - Request a certificate for ${DOMAIN_NAME}"
    echo "   - Validate the certificate"
    echo ""
    echo "3. Configure the certificate with your hosting service"
    echo ""
}

# Main deployment function
main_deployment() {
    print_status "Starting AWS deployment to ${DOMAIN_NAME}..."
    
    # Check dependencies
    check_dependencies
    
    # Check AWS credentials
    if ! check_aws_credentials; then
        print_error "Please configure AWS credentials first, then run this script again."
        exit 1
    fi
    
    # Build the application
    build_app
    
    # Create S3 bucket
    create_s3_bucket
    
    # Try Elastic Beanstalk first
    if deploy_elastic_beanstalk; then
        DEPLOYMENT_TYPE="Elastic Beanstalk"
        DEPLOYMENT_URL=$(cat .eb-url)
    else
        # Fallback to Amplify
        if deploy_amplify; then
            DEPLOYMENT_TYPE="AWS Amplify"
            DEPLOYMENT_URL=$(cat .amplify-url)
        else
            print_error "All AWS deployment methods failed!"
            exit 1
        fi
    fi
    
    # Configure custom domain
    configure_custom_domain
    
    # Final status
    print_success "AWS deployment completed successfully!"
    echo ""
    echo "🎉 DEPLOYMENT COMPLETE! 🎉"
    echo "=========================="
    echo "Deployment Type: ${DEPLOYMENT_TYPE}"
    echo "AWS URL: ${DEPLOYMENT_URL}"
    echo "Custom Domain: ${DOMAIN_NAME}"
    echo ""
    echo "Next steps:"
    echo "1. Configure DNS settings for ${DOMAIN_NAME}"
    echo "2. Request SSL certificate in AWS Certificate Manager"
    echo "3. Test all functionality on the live site"
    echo "4. Set up monitoring and alerts"
    echo ""
    echo "Happy testing! 🚀"
}

# Run deployment
main_deployment
