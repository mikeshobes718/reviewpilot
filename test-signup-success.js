const puppeteer = require('puppeteer');

async function testSignupSuccess() {
  console.log('🧪 Testing signup success with detailed logging...');
  
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 2000,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Test on desktop viewport
    await page.setViewport({ width: 1200, height: 800 });
    
    console.log('🔐 Loading auth page...');
    await page.goto('https://reviewsandmarketing.com/auth', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check current page state
    const pageState = await page.evaluate(() => {
      const title = document.querySelector('h1');
      const form = document.querySelector('form');
      const buttons = Array.from(document.querySelectorAll('button'));
      const inputs = Array.from(document.querySelectorAll('input'));
      
      return {
        title: title ? title.textContent : '',
        hasForm: !!form,
        buttonTexts: buttons.map(b => b.textContent.trim()),
        inputTypes: inputs.map(i => i.type),
        inputValues: inputs.map(i => i.value)
      };
    });
    
    console.log('Current page state:', pageState);
    
    // Switch to signup mode
    console.log('🔄 Switching to signup mode...');
    await page.evaluate(() => {
      const signUpButton = Array.from(document.querySelectorAll('button')).find(button => 
        button.textContent.includes('Sign Up')
      );
      if (signUpButton) {
        signUpButton.click();
        console.log('Clicked Sign Up button');
      } else {
        console.log('Sign Up button not found');
      }
    });
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check if we're now in signup mode
    const signupState = await page.evaluate(() => {
      const title = document.querySelector('h1');
      const form = document.querySelector('form');
      const emailInput = document.querySelector('input[type="email"]');
      const passwordInput = document.querySelector('input[type="password"]');
      const submitButton = document.querySelector('button[type="submit"]');
      
      return {
        title: title ? title.textContent : '',
        hasForm: !!form,
        hasEmailInput: !!emailInput,
        hasPasswordInput: !!passwordInput,
        hasSubmitButton: !!submitButton,
        submitButtonText: submitButton ? submitButton.textContent.trim() : ''
      };
    });
    
    console.log('Signup mode state:', signupState);
    
    if (!signupState.hasEmailInput || !signupState.hasPasswordInput) {
      console.log('❌ Signup form not properly loaded');
      return;
    }
    
    // Fill out the form
    console.log('📝 Filling out signup form...');
    
    // Generate unique email
    const timestamp = Date.now();
    const testEmail = `test${timestamp}@example.com`;
    const testPassword = 'TestPassword123!';
    
    console.log(`Using email: ${testEmail}`);
    console.log(`Using password: ${testPassword}`);
    
    // Clear and fill email
    await page.evaluate(() => {
      const emailInput = document.querySelector('input[type="email"]');
      if (emailInput) {
        emailInput.value = '';
        emailInput.focus();
      }
    });
    await page.type('input[type="email"]', testEmail);
    
    // Clear and fill password
    await page.evaluate(() => {
      const passwordInput = document.querySelector('input[type="password"]');
      if (passwordInput) {
        passwordInput.value = '';
        passwordInput.focus();
      }
    });
    await page.type('input[type="password"]', testPassword);
    
    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check form values
    const formValues = await page.evaluate(() => {
      const emailInput = document.querySelector('input[type="email"]');
      const passwordInput = document.querySelector('input[type="password"]');
      
      return {
        emailValue: emailInput ? emailInput.value : '',
        passwordValue: passwordInput ? passwordInput.value : ''
      };
    });
    
    console.log('Form values after filling:', formValues);
    
    // Submit the form
    console.log('🚀 Submitting signup form...');
    await page.click('button[type="submit"]');
    
    // Wait for form submission and response
    console.log('⏳ Waiting for form submission...');
    await new Promise(resolve => setTimeout(resolve, 8000));
    
    // Check for results
    const result = await page.evaluate(() => {
      const errorMessage = document.querySelector('.text-red-600, .bg-red-50, [class*="error"]');
      const successMessage = document.querySelector('.text-success-700, .bg-success-50, [class*="success"]');
      const loadingState = document.querySelector('.animate-spin');
      const pageContent = document.body.textContent;
      
      return {
        hasError: !!errorMessage,
        hasSuccess: !!successMessage,
        isLoading: !!loadingState,
        errorText: errorMessage ? errorMessage.textContent : '',
        successText: successMessage ? successMessage.textContent : '',
        pageContent: pageContent.substring(0, 500) // First 500 chars
      };
    });
    
    console.log('Signup result:', result);
    
    if (result.hasError) {
      console.log('❌ Signup failed with error:', result.errorText);
    } else if (result.hasSuccess) {
      console.log('✅ Signup successful:', result.successText);
    } else if (result.isLoading) {
      console.log('⏳ Signup is still processing...');
    } else {
      console.log('⚠️ Signup result unclear');
      console.log('Page content preview:', result.pageContent);
    }
    
    // Take screenshot for debugging
    await page.screenshot({ path: 'signup-test-result.png' });
    console.log('📸 Screenshot saved as signup-test-result.png');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testSignupSuccess().catch(console.error);
