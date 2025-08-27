const puppeteer = require('puppeteer');

async function testValidationDebug() {
  console.log('🔍 Debugging Form Validation Issue...');
  
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
    
    // Fill out form with test data
    console.log('📝 Filling form...');
    const testEmail = `debug${Date.now()}@example.com`;
    const testPassword = 'StrongPass123!';
    
    await page.type('input[type="email"]', testEmail);
    await page.type('input[type="password"]', testPassword);
    
    // Check if terms checkbox is present and unchecked
    const checkboxState = await page.evaluate(() => {
      const checkbox = document.querySelector('input[type="checkbox"]');
      return {
        exists: !!checkbox,
        checked: checkbox ? checkbox.checked : false,
        required: checkbox ? checkbox.required : false
      };
    });
    
    console.log('Checkbox state:', checkboxState);
    
    if (!checkboxState.exists) {
      console.log('❌ Terms checkbox not found');
      return;
    }
    
    if (checkboxState.checked) {
      console.log('❌ Terms checkbox is already checked - unchecking it');
      await page.evaluate(() => {
        const checkbox = document.querySelector('input[type="checkbox"]');
        if (checkbox) checkbox.checked = false;
      });
    }
    
    // Now try to submit without checking terms
    console.log('🚀 Attempting to submit without checking terms...');
    await page.click('button[type="submit"]');
    
    // Wait for response
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Check for validation error
    const validationResult = await page.evaluate(() => {
      const errorMessage = document.querySelector('.text-red-700');
      const successMessage = document.querySelector('.text-success-700');
      
      return {
        hasError: !!errorMessage,
        errorText: errorMessage ? errorMessage.textContent : '',
        hasSuccess: !!successMessage,
        successText: successMessage ? successMessage.textContent : ''
      };
    });
    
    console.log('Validation result:', validationResult);
    
    if (validationResult.hasError && validationResult.errorText.includes('agree to the Terms')) {
      console.log('✅ Terms validation is working!');
    } else if (validationResult.hasSuccess) {
      console.log('❌ Form submitted successfully despite no terms agreement');
    } else if (validationResult.hasError) {
      console.log('❌ Different error occurred:', validationResult.errorText);
    } else {
      console.log('❌ No clear result from form submission');
    }
    
    // Take screenshot
    await page.screenshot({ path: 'validation-debug-test.png' });
    console.log('📸 Screenshot saved');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testValidationDebug().catch(console.error);
