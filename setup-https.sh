#!/bin/bash

echo "🔒 SETTING UP HTTPS FOR reviewsandmarketing.com"
echo "This will add the required DNS validation records for your SSL certificate"
echo ""

# Set variables
DOMAIN="reviewsandmarketing.com"
HOSTED_ZONE_ID="Z0782815WSXGEC0O2E7Q"
REGION="us-east-1"

# SSL Certificate validation records
CERT_ARN="arn:aws:acm:us-east-1:519848832340:certificate/9aee7c51-ae8d-48df-9c8b-801dee8ebd80"

echo "📋 SSL Certificate Details:"
echo "  Certificate ARN: $CERT_ARN"
echo "  Domain: $DOMAIN"
echo "  Hosted Zone ID: $HOSTED_ZONE_ID"
echo ""

# Get the current validation records
echo "🔍 Getting certificate validation records..."
VALIDATION_RECORDS=$(aws acm describe-certificate --certificate-arn $CERT_ARN --region $REGION --query 'Certificate.DomainValidationOptions[].ResourceRecord' --output json)

if [ $? -ne 0 ]; then
    echo "❌ Failed to get validation records"
    exit 1
fi

echo "✅ Validation records retrieved successfully"
echo ""

# Create the DNS change batch file
echo "📝 Creating DNS validation records..."
cat > ssl-validation-records.json << EOF
{
    "Changes": [
        {
            "Action": "UPSERT",
            "ResourceRecordSet": {
                "Name": "_37c174756c1eb11a7225b8659dc2d242.reviewsandmarketing.com.",
                "Type": "CNAME",
                "TTL": 300,
                "ResourceRecords": [
                    {
                        "Value": "_6125ac5a541e5a526f55093f61818acb.xlfgrmvvlj.acm-validations.aws."
                    }
                ]
            }
        },
        {
            "Action": "UPSERT",
            "ResourceRecordSet": {
                "Name": "_def2c3e2be45778810b98e5e48089465.www.reviewsandmarketing.com.",
                "Type": "CNAME",
                "TTL": 300,
                "ResourceRecords": [
                    {
                        "Value": "_398a6f489464741758c9ca960956aa50.xlfgrmvvlj.acm-validations.aws."
                    }
                ]
            }
        }
    ]
}
EOF

echo "📋 DNS Validation Records to be added:"
cat ssl-validation-records.json
echo ""

read -p "Do you want to add these validation records to your DNS? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ SSL setup cancelled."
    rm -f ssl-validation-records.json
    exit 1
fi

echo ""
echo "🚀 Adding DNS validation records..."
aws route53 change-resource-record-sets \
    --hosted-zone-id $HOSTED_ZONE_ID \
    --change-batch file://ssl-validation-records.json \
    --region $REGION

if [ $? -eq 0 ]; then
    echo "✅ DNS validation records added successfully!"
    echo ""
    echo "⏳ SSL Certificate validation is now in progress..."
    echo "   This typically takes 5-30 minutes to complete."
    echo ""
    echo "📊 Check certificate status with:"
    echo "   aws acm describe-certificate --certificate-arn $CERT_ARN --region $REGION"
    echo ""
    echo "🌐 Once validated, your site will be accessible at:"
    echo "   https://reviewsandmarketing.com"
    echo "   https://www.reviewsandmarketing.com"
else
    echo "❌ Failed to add DNS validation records!"
    exit 1
fi

# Clean up
rm -f ssl-validation-records.json

echo ""
echo "🎉 SSL setup process initiated!"
echo "💡 The certificate will be automatically validated once DNS propagates."
