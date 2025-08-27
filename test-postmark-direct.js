const fetch = require('node-fetch');

async function testPostmarkDirect() {
  console.log('🧪 Testing Postmark API Directly...');
  
  const apiKey = '50e2ca3f-c387-4cd0-84a9-ff7fb7928d55';
  const fromEmail = 'hello@reviewsandmarketing.com';
  
  console.log('Using API Key:', apiKey ? 'EXISTS' : 'MISSING');
  console.log('From Email:', fromEmail);
  
  try {
    const response = await fetch('https://api.postmarkapp.com/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Postmark-Server-Token': apiKey,
      },
      body: JSON.stringify({
        From: fromEmail,
        To: 'mikeshobes718@gmail.com',
        Subject: 'Test Email from Reviews & Marketing',
        TextBody: 'This is a test email to verify Postmark is working.',
        HtmlBody: '<h1>Test Email</h1><p>This is a test email to verify Postmark is working.</p>',
      }),
    });
    
    console.log('Response Status:', response.status);
    console.log('Response OK:', response.ok);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ SUCCESS! Email sent:', result);
    } else {
      const error = await response.text();
      console.log('❌ FAILED! Error:', error);
    }
    
  } catch (error) {
    console.error('❌ EXCEPTION:', error.message);
  }
}

testPostmarkDirect().catch(console.error);
