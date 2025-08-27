import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('🧪 Testing internet connectivity from AWS instance...');
    
    // Test 1: Basic fetch to a public API
    console.log('Testing fetch to httpbin.org...');
    const response = await fetch('https://httpbin.org/get', {
      method: 'GET',
      headers: {
        'User-Agent': 'Reviews-Marketing-App/1.0'
      }
    });
    
    if (response.ok) {
      console.log('✅ SUCCESS: Can reach httpbin.org');
      const data = await response.json();
      
      // Test 2: Try to reach Postmark API (without sending email)
      console.log('Testing Postmark API connectivity...');
      try {
        const postmarkTest = await fetch('https://api.postmarkapp.com/email', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-Postmark-Server-Token': 'test-token',
          },
          body: JSON.stringify({
            From: 'test@example.com',
            To: 'test@example.com',
            Subject: 'Test',
            TextBody: 'Test'
          }),
        });
        
        if (postmarkTest.status === 401) {
          console.log('✅ SUCCESS: Can reach Postmark API (got 401 as expected for invalid token)');
        } else {
          console.log(`⚠️  Postmark API response: ${postmarkTest.status}`);
        }
      } catch (postmarkError) {
        console.log('❌ FAILED: Cannot reach Postmark API:', postmarkError instanceof Error ? postmarkError.message : 'Unknown error');
      }
      
      return NextResponse.json({
        success: true,
        message: 'Internet connectivity test successful',
        httpbin: {
          status: response.status,
          headers: Object.fromEntries(response.headers.entries()),
          data: data
        },
        timestamp: new Date().toISOString()
      });
      
    } else {
      console.log(`❌ FAILED: httpbin.org returned ${response.status}`);
      return NextResponse.json({
        success: false,
        message: `Cannot reach httpbin.org: ${response.status}`,
        status: response.status
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('❌ Connectivity test failed:', error);
    return NextResponse.json({
      success: false,
      message: 'Connectivity test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
