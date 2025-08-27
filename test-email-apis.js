const fetch = require('node-fetch');

async function testEmailAPIs() {
  console.log('🧪 Testing Email API Endpoints...');
  
  const baseUrl = 'https://reviewsandmarketing.com';
  
  try {
    // Test 1: Verification Email API
    console.log('\n📧 Testing Verification Email API...');
    try {
      const response = await fetch(`${baseUrl}/api/send-verification-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          verificationLink: 'https://reviewsandmarketing.com/auth?mode=verifyEmail&email=test@example.com',
          userName: 'TestUser'
        }),
      });
      
      if (response.ok) {
        console.log('✅ Verification Email API: SUCCESS');
      } else {
        const error = await response.text();
        console.log('❌ Verification Email API: FAILED');
        console.log('   Status:', response.status);
        console.log('   Error:', error);
      }
    } catch (error) {
      console.log('❌ Verification Email API: ERROR');
      console.log('   Error:', error.message);
    }
    
    // Test 2: Password Reset Email API
    console.log('\n🔑 Testing Password Reset Email API...');
    try {
      const response = await fetch(`${baseUrl}/api/send-password-reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          resetLink: 'https://reviewsandmarketing.com/auth?mode=resetPassword&email=test@example.com',
          userName: 'TestUser'
        }),
      });
      
      if (response.ok) {
        console.log('✅ Password Reset Email API: SUCCESS');
      } else {
        const error = await response.text();
        console.log('❌ Password Reset Email API: FAILED');
        console.log('   Status:', response.status);
        console.log('   Error:', error);
      }
    } catch (error) {
      console.log('❌ Password Reset Email API: ERROR');
      console.log('   Error:', error.message);
    }
    
    // Test 3: Welcome Email API
    console.log('\n🎉 Testing Welcome Email API...');
    try {
      const response = await fetch(`${baseUrl}/api/send-welcome-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          userName: 'TestUser'
        }),
      });
      
      if (response.ok) {
        console.log('✅ Welcome Email API: SUCCESS');
      } else {
        const error = await response.text();
        console.log('❌ Welcome Email API: FAILED');
        console.log('   Status:', response.status);
        console.log('   Error:', error);
      }
    } catch (error) {
      console.log('❌ Welcome Email API: ERROR');
      console.log('   Error:', error.message);
    }
    
    // Test 4: Contact Confirmation Email API
    console.log('\n📞 Testing Contact Confirmation Email API...');
    try {
      const response = await fetch(`${baseUrl}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@example.com',
          company: 'Test Company',
          message: 'This is a test message to verify beautiful email templates.',
          inquiryType: 'General Inquiry'
        }),
      });
      
      if (response.ok) {
        console.log('✅ Contact Confirmation Email API: SUCCESS');
      } else {
        const error = await response.text();
        console.log('❌ Contact Confirmation Email API: FAILED');
        console.log('   Status:', response.status);
        console.log('   Error:', error);
      }
    } catch (error) {
      console.log('❌ Contact Confirmation Email API: ERROR');
      console.log('   Error:', error.message);
    }
    
    console.log('\n🎉 Email API Testing Complete!');
    console.log('📧 If all APIs returned SUCCESS, your beautiful email templates are working!');
    console.log('📧 Check your Postmark dashboard to see the actual emails sent.');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testEmailAPIs().catch(console.error);
