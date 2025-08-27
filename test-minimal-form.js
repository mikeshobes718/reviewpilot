const puppeteer = require('puppeteer');

async function testMinimalForm() {
  console.log('🔍 Testing Minimal Form Submission...');
  
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 1000,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Enable console logging
    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
    page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
    
    // Test on desktop viewport
    await page.setViewport({ width: 1200, height: 800 });
    
    console.log('🔐 Loading auth page...');
    await page.goto('https://reviewsandmarketing.com/auth', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check if page loaded
    const pageTitle = await page.title();
    console.log('Page title:', pageTitle);
    
    // Check if component rendered
    const componentCheck = await page.evaluate(() => {
      const starIcon = document.querySelector('.w-16.h-16.bg-gradient-to-br');
      const form = document.querySelector('form');
      const submitButton = document.querySelector('button[type="submit"]');
      
      return {
        hasStarIcon: !!starIcon,
        hasForm: !!form,
        hasSubmitButton: !!submitButton,
        formAction: form ? form.action : 'none',
        formMethod: form ? form.method : 'none'
      };
    });
    
    console.log('Component check:', componentCheck);
    
    if (!componentCheck.hasForm) {
      console.log('❌ Form not found');
      return;
    }
    
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
    
    // Fill out form with test data
    console.log('📝 Filling form...');
    const testEmail = `minimal${Date.now()}@example.com`;
    const testPassword = 'StrongPass123!';
    
    await page.type('input[type="email"]', testEmail);
    await page.type('input[type="password"]', testPassword);
    
    // Check form state before submission
    const formState = await page.evaluate(() => {
      const emailInput = document.querySelector('input[type="email"]');
      const passwordInput = document.querySelector('input[type="password"]');
      const submitButton = document.querySelector('button[type="submit"]');
      
      return {
        emailValue: emailInput ? emailInput.value : 'none',
        passwordValue: passwordInput ? passwordInput.value : 'none',
        submitButtonText: submitButton ? submitButton.textContent : 'none',
        submitButtonDisabled: submitButton ? submitButton.disabled : true
      };
    });
    
    console.log('Form state before submission:', formState);
    
    // Try to submit form
    console.log('🚀 Attempting form submission...');
    
    // Try clicking the submit button
    await page.click('button[type="submit"]');
    
    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check if anything happened
    const afterSubmission = await page.evaluate(() => {
      const errorMessage = document.querySelector('.text-red-700');
      const successMessage = document.querySelector('.text-success-700');
      const loadingState = document.querySelector('.animate-spin');
      
      return {
        hasError: !!errorMessage,
        errorText: errorMessage ? errorMessage.textContent : '',
        hasSuccess: !!successMessage,
        successText: successMessage ? successMessage.textContent : '',
        hasLoading: !!loadingState
      };
    });
    
    console.log('After submission state:', afterSubmission);
    
    // Take screenshot
    await page.screenshot({ path: 'minimal-form-test.png' });
    console.log('📸 Screenshot saved');
    
    // Summary
    console.log('\n🎯 MINIMAL FORM TEST RESULTS:');
    console.log('1. Page loaded:', !!pageTitle);
    console.log('2. Component rendered:', componentCheck.hasStarIcon);
    console.log('3. Form present:', componentCheck.hasForm);
    console.log('4. Submit button present:', componentCheck.hasSubmitButton);
    console.log('5. Form submission attempted:', true);
    console.log('6. Any response received:', afterSubmission.hasError || afterSubmission.hasSuccess || afterSubmission.hasLoading);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testMinimalForm().catch(console.error);
