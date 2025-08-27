const puppeteer = require('puppeteer');

async function testErrorHandling() {
  console.log('🧪 Testing improved error handling for existing users...');
  
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
    
    // Fill out form with existing email
    console.log('📝 Filling form with existing email...');
    await page.type('input[type="email"]', 'mikeshobes718@gmail.com');
    await page.type('input[type="password"]', 'TestPassword123!');
    
    // Submit form
    console.log('🚀 Submitting form...');
    await page.click('button[type="submit"]');
    
    // Wait for error
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Check error message and action buttons
    const errorInfo = await page.evaluate(() => {
      const errorMessage = document.querySelector('.text-red-700');
      const allButtons = Array.from(document.querySelectorAll('button'));
      const clearFormButton = allButtons.find(button => button.textContent.includes('Clear Form'));
      const switchToSignInButton = allButtons.find(button => button.textContent.includes('Switch to Sign In'));
      
      return {
        hasError: !!errorMessage,
        errorText: errorMessage ? errorMessage.textContent : '',
        hasClearFormButton: !!clearFormButton,
        hasSwitchToSignInButton: !!switchToSignInButton,
        clearFormText: clearFormButton ? clearFormButton.textContent : '',
        switchToSignInText: switchToSignInButton ? switchToSignInButton.textContent : ''
      };
    });
    
    console.log('Error handling info:', errorInfo);
    
    if (errorInfo.hasError) {
      console.log('✅ Error message is displayed');
      console.log('Error text:', errorInfo.errorText);
    } else {
      console.log('❌ No error message found');
    }
    
    if (errorInfo.hasClearFormButton) {
      console.log('✅ Clear Form button is present');
    } else {
      console.log('❌ Clear Form button missing');
    }
    
    if (errorInfo.hasSwitchToSignInButton) {
      console.log('✅ Switch to Sign In button is present');
    } else {
      console.log('❌ Switch to Sign In button missing');
    }
    
    // Test Clear Form functionality
    if (errorInfo.hasClearFormButton) {
      console.log('🧹 Testing Clear Form functionality...');
      await page.evaluate(() => {
        const allButtons = Array.from(document.querySelectorAll('button'));
        const clearFormButton = allButtons.find(button => button.textContent.includes('Clear Form'));
        if (clearFormButton) clearFormButton.click();
      });
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const formCleared = await page.evaluate(() => {
        const emailInput = document.querySelector('input[type="email"]');
        const passwordInput = document.querySelector('input[type="password"]');
        const errorMessage = document.querySelector('.text-red-700');
        
        return {
          emailEmpty: emailInput ? emailInput.value === '' : false,
          passwordEmpty: passwordInput ? passwordInput.value === '' : false,
          errorCleared: !errorMessage
        };
      });
      
      console.log('Form cleared status:', formCleared);
      
      if (formCleared.emailEmpty && formCleared.passwordEmpty && formCleared.errorCleared) {
        console.log('✅ Clear Form functionality works correctly');
      } else {
        console.log('❌ Clear Form functionality has issues');
      }
    }
    
    // Test Switch to Sign In functionality
    if (errorInfo.hasSwitchToSignInButton) {
      console.log('🔄 Testing Switch to Sign In functionality...');
      await page.evaluate(() => {
        const allButtons = Array.from(document.querySelectorAll('button'));
        const switchToSignInButton = allButtons.find(button => button.textContent.includes('Switch to Sign In'));
        if (switchToSignInButton) switchToSignInButton.click();
      });
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const switchedToSignIn = await page.evaluate(() => {
        const title = document.querySelector('h1');
        const submitButton = document.querySelector('button[type="submit"]');
        
        return {
          title: title ? title.textContent : '',
          submitButtonText: submitButton ? submitButton.textContent : '',
          isSignInMode: title && title.textContent.includes('Welcome Back')
        };
      });
      
      console.log('Switch to Sign In status:', switchedToSignIn);
      
      if (switchedToSignIn.isSignInMode) {
        console.log('✅ Successfully switched to Sign In mode');
      } else {
        console.log('❌ Failed to switch to Sign In mode');
      }
    }
    
    // Take screenshot
    await page.screenshot({ path: 'error-handling-test.png' });
    console.log('📸 Screenshot saved');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testErrorHandling().catch(console.error);
