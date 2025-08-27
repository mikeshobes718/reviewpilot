const puppeteer = require('puppeteer');

async function finalVerificationTest() {
  console.log('🧪 FINAL TEST: Email Verification Issues Fixed...');
  
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 1000,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Test on desktop viewport
    await page.setViewport({ width: 1200, height: 800 });
    
    console.log('\n🔐 TEST 1: Sign-in Verification Check (Should show helpful message)...');
    console.log('Loading auth page...');
    await page.goto('https://reviewsandmarketing.com/auth', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Create a test account
    console.log('🔄 Creating test account...');
    await page.evaluate(() => {
      const signUpButton = Array.from(document.querySelectorAll('button')).find(button => 
        button.textContent.includes('Sign Up')
      );
      if (signUpButton) {
        signUpButton.click();
      }
    });
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const timestamp = Date.now();
    const testEmail = `final${timestamp}@example.com`;
    const testPassword = 'TestPassword123!';
    
    console.log(`Using email: ${testEmail}`);
    
    await page.type('input[type="email"]', testEmail);
    await page.type('input[type="password"]', testPassword);
    
    // Submit form
    console.log('🚀 Submitting signup form...');
    await page.click('button[type="submit"]');
    
    // Wait for response
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Verify signup success
    const signupResult = await page.evaluate(() => {
      const successMessage = document.querySelector('.text-success-700');
      const verificationBox = document.querySelector('.bg-blue-50');
      
      return {
        hasSuccess: !!successMessage,
        successText: successMessage ? successMessage.textContent : '',
        hasVerificationBox: !!verificationBox,
        verificationText: verificationBox ? verificationBox.textContent : ''
      };
    });
    
    if (signupResult.hasSuccess && signupResult.hasVerificationBox) {
      console.log('✅ Signup successful - verification required');
      console.log('Verification instructions:', signupResult.verificationText);
    } else {
      console.log('❌ Signup failed or verification box missing');
      return;
    }
    
    // Now test sign-in with unverified account
    console.log('\n🔐 TEST 2: Sign-in with Unverified Account (Should show helpful verification message)...');
    
    // Switch to sign-in mode
    await page.evaluate(() => {
      const signInButton = Array.from(document.querySelectorAll('button')).find(button => 
        button.textContent.includes('Sign In')
      );
      if (signInButton) {
        signInButton.click();
      }
    });
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Clear and fill form
    await page.evaluate(() => {
      const emailInput = document.querySelector('input[type="email"]');
      const passwordInput = document.querySelector('input[type="password"]');
      if (emailInput) emailInput.value = '';
      if (passwordInput) passwordInput.value = '';
    });
    
    await page.type('input[type="email"]', testEmail);
    await page.type('input[type="password"]', testPassword);
    
    // Submit sign-in form
    console.log('🚀 Attempting sign-in with unverified account...');
    await page.click('button[type="submit"]');
    
    // Wait for error
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Check for verification required error
    const signInError = await page.evaluate(() => {
      const errorMessage = document.querySelector('.text-red-700');
      return {
        hasError: !!errorMessage,
        errorText: errorMessage ? errorMessage.textContent : ''
      };
    });
    
    console.log('Sign-in error info:', signInError);
    
    if (signInError.hasError && signInError.errorText.includes('verify your email')) {
      console.log('✅ VERIFICATION REQUIRED ERROR PROPERLY DISPLAYED');
      console.log('Error message:', signInError.errorText);
    } else {
      console.log('❌ Verification required error not properly displayed');
      console.log('Expected: "verify your email" in error message');
      console.log('Actual:', signInError.errorText);
    }
    
    // Test dashboard access protection
    console.log('\n🛡️ TEST 3: Dashboard Access Protection (Should redirect to auth)...');
    
    // Try to access dashboard directly
    console.log('🚀 Attempting to access dashboard...');
    await page.goto('https://reviewsandmarketing.com/dashboard', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Check if we're redirected to auth page
    const currentUrl = page.url();
    console.log('Current URL:', currentUrl);
    
    if (currentUrl.includes('/auth')) {
      console.log('✅ Dashboard access blocked - redirected to auth page');
      
      // Check if verification message is displayed
      const verificationMessage = await page.evaluate(() => {
        const errorMessage = document.querySelector('.text-red-700');
        return errorMessage ? errorMessage.textContent : '';
      });
      
      if (verificationMessage.includes('verify your email')) {
        console.log('✅ Verification message properly displayed on redirect');
      } else {
        console.log('❌ Verification message not displayed on redirect');
        console.log('Message found:', verificationMessage);
      }
    } else {
      console.log('❌ Dashboard access not properly blocked');
      console.log('Expected: redirect to /auth');
      console.log('Actual: stayed on dashboard');
    }
    
    // Take final screenshot
    await page.screenshot({ path: 'final-verification-test.png' });
    console.log('📸 Final screenshot saved');
    
    // Final summary
    console.log('\n🎯 FINAL TEST RESULTS:');
    console.log('1. Signup with verification required: ✅ Working');
    console.log('2. Sign-in verification check: ' + (signInError.hasError && signInError.errorText.includes('verify your email') ? '✅ FIXED' : '❌ STILL BROKEN'));
    console.log('3. Dashboard access protection: ' + (currentUrl.includes('/auth') ? '✅ FIXED' : '❌ STILL BROKEN'));
    
    if (signInError.hasError && signInError.errorText.includes('verify your email') && currentUrl.includes('/auth')) {
      console.log('\n🎉 SUCCESS: Both email verification issues are now FIXED!');
      console.log('✅ Users will see helpful verification messages');
      console.log('✅ Unverified users cannot access dashboard');
      console.log('✅ System properly guides users through verification process');
    } else {
      console.log('\n❌ ISSUES REMAIN: Some problems still need fixing');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

finalVerificationTest().catch(console.error);
