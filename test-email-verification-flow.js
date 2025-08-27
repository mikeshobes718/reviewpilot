const puppeteer = require('puppeteer');

async function testEmailVerificationFlow() {
  console.log('🧪 Testing email verification flow...');
  
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
    
    // Switch to signup mode
    console.log('🔄 Switching to signup mode...');
    await page.evaluate(() => {
      const signUpButton = Array.from(document.querySelectorAll('button')).find(button => 
        button.textContent.includes('Sign Up')
      );
      if (signUpButton) {
        signUpButton.click();
      }
    });
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Fill out form with new email
    console.log('📝 Filling form with new email...');
    const timestamp = Date.now();
    const testEmail = `test${timestamp}@example.com`;
    const testPassword = 'TestPassword123!';
    
    console.log(`Using email: ${testEmail}`);
    
    await page.type('input[type="email"]', testEmail);
    await page.type('input[type="password"]', testPassword);
    
    // Submit form
    console.log('🚀 Submitting signup form...');
    await page.click('button[type="submit"]');
    
    // Wait for response
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Check for verification message
    const verificationInfo = await page.evaluate(() => {
      const successMessage = document.querySelector('.text-success-700');
      const verificationBox = document.querySelector('.bg-blue-50');
      const allButtons = Array.from(document.querySelectorAll('button'));
      const resendButton = allButtons.find(button => button.textContent.includes('Resend verification email'));
      
      return {
        hasSuccess: !!successMessage,
        successText: successMessage ? successMessage.textContent : '',
        hasVerificationBox: !!verificationBox,
        hasResendButton: !!resendButton,
        verificationBoxText: verificationBox ? verificationBox.textContent : ''
      };
    });
    
    console.log('Verification info:', verificationInfo);
    
    if (verificationInfo.hasSuccess) {
      console.log('✅ Success message displayed');
      console.log('Success text:', verificationInfo.successText);
    } else {
      console.log('❌ No success message found');
    }
    
    if (verificationInfo.hasVerificationBox) {
      console.log('✅ Verification instructions box displayed');
      console.log('Verification text:', verificationInfo.verificationBoxText);
    } else {
      console.log('❌ Verification instructions box missing');
    }
    
    if (verificationInfo.hasResendButton) {
      console.log('✅ Resend verification email button present');
    } else {
      console.log('❌ Resend verification email button missing');
    }
    
    // Test resend functionality
    if (verificationInfo.hasResendButton) {
      console.log('📧 Testing resend verification email...');
      await page.evaluate(() => {
        const allButtons = Array.from(document.querySelectorAll('button'));
        const resendButton = allButtons.find(button => button.textContent.includes('Resend verification email'));
        if (resendButton) resendButton.click();
      });
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Check if resend was successful
      const resendResult = await page.evaluate(() => {
        const successMessage = document.querySelector('.text-success-700');
        return {
          hasSuccess: !!successMessage,
          successText: successMessage ? successMessage.textContent : ''
        };
      });
      
      if (resendResult.hasSuccess) {
        console.log('✅ Resend verification email successful');
        console.log('Resend message:', resendResult.successText);
      } else {
        console.log('❌ Resend verification email failed');
      }
    }
    
    // Now test sign-in with unverified account
    console.log('🔐 Testing sign-in with unverified account...');
    
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
    
    // Try to sign in with the unverified account
    await page.evaluate(() => {
      const emailInput = document.querySelector('input[type="email"]');
      const passwordInput = document.querySelector('input[type="password"]');
      if (emailInput) emailInput.value = '';
      if (passwordInput) passwordInput.value = '';
    });
    
    await page.type('input[type="email"]', testEmail);
    await page.type('input[type="password"]', testPassword);
    
    // Submit sign-in form
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
      console.log('✅ Proper verification required error displayed');
    } else {
      console.log('❌ Verification required error not properly displayed');
    }
    
    // Take screenshot
    await page.screenshot({ path: 'email-verification-test.png' });
    console.log('📸 Screenshot saved');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testEmailVerificationFlow().catch(console.error);
