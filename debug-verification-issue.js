const puppeteer = require('puppeteer');

async function debugVerificationIssue() {
  console.log('🔍 Debugging Email Verification Issue...');
  
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 1000,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Test on desktop viewport
    await page.setViewport({ width: 1200, height: 800 });
    
    console.log('🔐 Loading auth page...');
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
    const testEmail = `debug${timestamp}@example.com`;
    const testPassword = 'TestPassword123!';
    
    console.log(`Using email: ${testEmail}`);
    console.log(`Using password: ${testPassword}`);
    
    await page.type('input[type="email"]', testEmail);
    await page.type('input[type="password"]', testPassword);
    
    // Submit form
    console.log('🚀 Submitting signup form...');
    await page.click('button[type="submit"]');
    
    // Wait for response
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Check signup result
    const signupResult = await page.evaluate(() => {
      const successMessage = document.querySelector('.text-success-700');
      const errorMessage = document.querySelector('.text-red-700');
      
      return {
        hasSuccess: !!successMessage,
        successText: successMessage ? successMessage.textContent : '',
        hasError: !!errorMessage,
        errorText: errorMessage ? errorMessage.textContent : ''
      };
    });
    
    console.log('Signup result:', signupResult);
    
    if (!signupResult.hasSuccess) {
      console.log('❌ Signup failed - cannot proceed with verification test');
      return;
    }
    
    // Now immediately try to sign in with the same credentials
    console.log('\n🔐 Immediately trying to sign in...');
    
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
    console.log('🚀 Submitting sign-in form...');
    await page.click('button[type="submit"]');
    
    // Wait for response
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Check sign-in result
    const signInResult = await page.evaluate(() => {
      const successMessage = document.querySelector('.text-success-700');
      const errorMessage = document.querySelector('.text-red-700');
      
      return {
        hasSuccess: !!successMessage,
        successText: successMessage ? successMessage.textContent : '',
        hasError: !!errorMessage,
        errorText: errorMessage ? errorMessage.textContent : ''
      };
    });
    
    console.log('Sign-in result:', signInResult);
    
    // Take screenshot
    await page.screenshot({ path: 'debug-verification-issue.png' });
    console.log('📸 Screenshot saved');
    
    // Analysis
    console.log('\n🔍 ANALYSIS:');
    if (signInResult.hasError && signInResult.errorText.includes('verify your email')) {
      console.log('✅ VERIFICATION CHECK IS WORKING!');
      console.log('The system correctly detected unverified email');
    } else if (signInResult.hasError && signInResult.errorText.includes('Invalid email or password')) {
      console.log('❌ ISSUE IDENTIFIED: Firebase auth failing before verification check');
      console.log('This suggests the account creation or password validation has an issue');
    } else if (signInResult.hasSuccess) {
      console.log('❌ ISSUE IDENTIFIED: Sign-in succeeded without verification');
      console.log('This means the verification check is not working');
    } else {
      console.log('❌ UNEXPECTED RESULT: Need further investigation');
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  } finally {
    await browser.close();
  }
}

debugVerificationIssue().catch(console.error);
