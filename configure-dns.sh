#!/bin/bash

echo "🌐 CONFIGURING DNS FOR CUSTOM DOMAIN"
echo "This will point reviewsandmarketing.com to your Elastic Beanstalk environment"
echo ""

# Set variables
DOMAIN="reviewsandmarketing.com"
HOSTED_ZONE_ID="Z0782815WSXGEC0O2E7Q"
EB_ENVIRONMENT="reviews-marketing-fresh-ULTIMATE.eba-bpj772a5.us-east-1.elasticbeanstalk.com"
REGION="us-east-1"

echo "📋 Current Configuration:"
echo "  Domain: $DOMAIN"
echo "  Hosted Zone ID: $HOSTED_ZONE_ID"
echo "  Elastic Beanstalk: $EB_ENVIRONMENT"
echo ""

# Get the IP address of the EB environment
echo "🔍 Getting Elastic Beanstalk IP address..."
EB_IP=$(dig +short $EB_ENVIRONMENT | head -1)

if [ -z "$EB_IP" ]; then
    echo "❌ Could not resolve EB environment IP address"
    exit 1
fi

echo "✅ EB Environment IP: $EB_IP"
echo ""

# Create the change batch file - using A records for both to avoid conflicts
echo "📝 Creating DNS change batch..."
cat > dns-changes.json << EOF
{
    "Changes": [
        {
            "Action": "UPSERT",
            "ResourceRecordSet": {
                "Name": "$DOMAIN",
                "Type": "A",
                "TTL": 300,
                "ResourceRecords": [
                    {
                        "Value": "$EB_IP"
                    }
                ]
            }
        },
        {
            "Action": "UPSERT",
            "ResourceRecordSet": {
                "Name": "www.$DOMAIN",
                "Type": "A",
                "TTL": 300,
                "ResourceRecords": [
                    {
                        "Value": "$EB_IP"
                    }
                ]
            }
        }
    ]
}
EOF

echo "📋 DNS Changes to be applied:"
cat dns-changes.json
echo ""

read -p "Do you want to apply these DNS changes? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ DNS configuration cancelled."
    rm -f dns-changes.json
    exit 1
fi

echo ""
echo "🚀 Applying DNS changes..."
aws route53 change-resource-record-sets \
    --hosted-zone-id $HOSTED_ZONE_ID \
    --change-batch file://dns-changes.json \
    --region $REGION

if [ $? -eq 0 ]; then
    echo "✅ DNS changes applied successfully!"
    echo ""
    echo "🌐 Your domain should now be accessible at:"
    echo "   http://$DOMAIN"
    echo "   http://www.$DOMAIN"
    echo ""
    echo "⏳ DNS propagation may take 5-15 minutes."
    echo "📱 Test from different networks to verify access."
else
    echo "❌ Failed to apply DNS changes!"
    exit 1
fi

# Clean up
rm -f dns-changes.json

echo ""
echo "🎉 DNS configuration complete!"
echo "💡 The tester should now be able to access: https://$DOMAIN"
