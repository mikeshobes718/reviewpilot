const puppeteer = require('puppeteer');

async function testLegalAndUXImprovements() {
  console.log('🧪 Testing Legal Terms & UX Improvements...');
  
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 1000,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Test on desktop viewport
    await page.setViewport({ width: 1200, height: 800 });
    
    console.log('\n🔐 TEST 1: Terms of Service Page...');
    await page.goto('https://reviewsandmarketing.com/terms', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check if terms page loads properly
    const termsContent = await page.evaluate(() => {
      const title = document.querySelector('h1');
      const sections = document.querySelectorAll('section');
      const termsLinks = document.querySelectorAll('a[href="/terms"]');
      
      return {
        hasTitle: !!title,
        titleText: title ? title.textContent : '',
        sectionsCount: sections.length,
        termsLinksCount: termsLinks.length
      };
    });
    
    console.log('Terms page content:', termsContent);
    
    if (termsContent.hasTitle && termsContent.titleText.includes('Terms of Service')) {
      console.log('✅ Terms of Service page is working');
    } else {
      console.log('❌ Terms of Service page not working properly');
    }
    
    console.log('\n🔐 TEST 2: Sign-up Form with Terms Agreement...');
    await page.goto('https://reviewsandmarketing.com/auth', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Switch to signup mode
    await page.evaluate(() => {
      const signUpButton = Array.from(document.querySelectorAll('button')).find(button => 
        button.textContent.includes('Sign Up')
      );
      if (signUpButton) {
        signUpButton.click();
      }
    });
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check for terms checkbox
    const termsCheckbox = await page.evaluate(() => {
      const checkbox = document.querySelector('input[type="checkbox"]');
      const termsLabel = document.querySelector('label[for="terms"]');
      const termsLinks = document.querySelectorAll('a[href="/terms"]');
      const privacyLinks = document.querySelectorAll('a[href="/privacy"]');
      
      return {
        hasCheckbox: !!checkbox,
        hasLabel: !!termsLabel,
        labelText: termsLabel ? termsLabel.textContent : '',
        termsLinksCount: termsLinks.length,
        privacyLinksCount: privacyLinks.length
      };
    });
    
    console.log('Terms agreement elements:', termsCheckbox);
    
    if (termsCheckbox.hasCheckbox && termsCheckbox.hasLabel) {
      console.log('✅ Terms agreement checkbox is present');
    } else {
      console.log('❌ Terms agreement checkbox missing');
    }
    
    // Test password strength indicator
    console.log('\n🔐 TEST 3: Password Strength Indicator...');
    
    const testEmail = `test${Date.now()}@example.com`;
    const weakPassword = 'weak';
    const strongPassword = 'StrongPass123!';
    
    await page.type('input[type="email"]', testEmail);
    await page.type('input[type="password"]', weakPassword);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check for password strength indicator
    const weakPasswordStrength = await page.evaluate(() => {
      const strengthText = document.querySelector('.text-xs.font-medium');
      const strengthBar = document.querySelector('.bg-gray-200.rounded-full');
      
      return {
        hasStrengthText: !!strengthText,
        strengthText: strengthText ? strengthText.textContent : '',
        hasStrengthBar: !!strengthBar
      };
    });
    
    console.log('Weak password strength indicator:', weakPasswordStrength);
    
    // Now test with strong password
    await page.evaluate(() => {
      const passwordInput = document.querySelector('input[type="password"]');
      if (passwordInput) passwordInput.value = '';
    });
    
    await page.type('input[type="password"]', strongPassword);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const strongPasswordStrength = await page.evaluate(() => {
      const strengthText = document.querySelector('.text-xs.font-medium');
      const strengthBar = document.querySelector('.bg-gray-200.rounded-full');
      
      return {
        hasStrengthText: !!strengthText,
        strengthText: strengthText ? strengthText.textContent : '',
        hasStrengthBar: !!strengthBar
      };
    });
    
    console.log('Strong password strength indicator:', strongPasswordStrength);
    
    if (weakPasswordStrength.hasStrengthText && strongPasswordStrength.hasStrengthText) {
      console.log('✅ Password strength indicator is working');
    } else {
      console.log('❌ Password strength indicator not working');
    }
    
    // Test form validation
    console.log('\n🔐 TEST 4: Form Validation...');
    
    // Try to submit without checking terms
    await page.click('button[type="submit"]');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const validationError = await page.evaluate(() => {
      const errorMessage = document.querySelector('.text-red-700');
      return {
        hasError: !!errorMessage,
        errorText: errorMessage ? errorMessage.textContent : ''
      };
    });
    
    console.log('Validation error (no terms):', validationError);
    
    if (validationError.hasError && validationError.errorText.includes('agree to the Terms')) {
      console.log('✅ Terms agreement validation is working');
    } else {
      console.log('❌ Terms agreement validation not working');
    }
    
    // Test subscription page improvements
    console.log('\n🔐 TEST 5: Subscription Page Improvements...');
    await page.goto('https://reviewsandmarketing.com/subscribe', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check for terms links in footer
    const subscriptionTerms = await page.evaluate(() => {
      const termsLinks = document.querySelectorAll('a[href="/terms"]');
      const privacyLinks = document.querySelectorAll('a[href="/privacy"]');
      const mostPopularLabel = document.querySelector('[aria-label*="Most Popular"]');
      
      return {
        termsLinksCount: termsLinks.length,
        privacyLinksCount: privacyLinks.length,
        hasMostPopularLabel: !!mostPopularLabel
      };
    });
    
    console.log('Subscription page terms:', subscriptionTerms);
    
    if (subscriptionTerms.termsLinksCount > 0 && subscriptionTerms.hasMostPopularLabel) {
      console.log('✅ Subscription page has proper terms and accessibility');
    } else {
      console.log('❌ Subscription page missing terms or accessibility');
    }
    
    // Test contact form improvements
    console.log('\n🔐 TEST 6: Contact Form Improvements...');
    await page.goto('https://reviewsandmarketing.com/contact', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check for terms links in contact form
    const contactFormTerms = await page.evaluate(() => {
      const termsLinks = document.querySelectorAll('a[href="/terms"]');
      const privacyLinks = document.querySelectorAll('a[href="/privacy"]');
      const footerTerms = document.querySelectorAll('footer a[href="/terms"]');
      
      return {
        formTermsLinksCount: termsLinks.length,
        formPrivacyLinksCount: privacyLinks.length,
        footerTermsLinksCount: footerTerms.length
      };
    });
    
    console.log('Contact form terms:', contactFormTerms);
    
    if (contactFormTerms.formTermsLinksCount > 0 && contactFormTerms.footerTermsLinksCount > 0) {
      console.log('✅ Contact form has proper terms links');
    } else {
      console.log('❌ Contact form missing terms links');
    }
    
    // Take final screenshot
    await page.screenshot({ path: 'legal-ux-improvements-test.png' });
    console.log('📸 Final screenshot saved');
    
    // Final summary
    console.log('\n🎯 IMPROVEMENTS TEST RESULTS:');
    console.log('1. Terms of Service page: ' + (termsContent.hasTitle ? '✅ Working' : '❌ Broken'));
    console.log('2. Terms agreement checkbox: ' + (termsCheckbox.hasCheckbox ? '✅ Present' : '❌ Missing'));
    console.log('3. Password strength indicator: ' + (weakPasswordStrength.hasStrengthText ? '✅ Working' : '❌ Broken'));
    console.log('4. Form validation: ' + (validationError.hasError && validationError.errorText.includes('agree to the Terms') ? '✅ Working' : '❌ Broken'));
    console.log('5. Subscription page terms: ' + (subscriptionTerms.termsLinksCount > 0 ? '✅ Present' : '❌ Missing'));
    console.log('6. Contact form terms: ' + (contactFormTerms.formTermsLinksCount > 0 ? '✅ Present' : '❌ Missing'));
    
    const allWorking = termsContent.hasTitle && 
                      termsCheckbox.hasCheckbox && 
                      weakPasswordStrength.hasStrengthText && 
                      (validationError.hasError && validationError.errorText.includes('agree to the Terms')) &&
                      subscriptionTerms.termsLinksCount > 0 &&
                      contactFormTerms.formTermsLinksCount > 0;
    
    if (allWorking) {
      console.log('\n🎉 SUCCESS: All legal and UX improvements are working!');
      console.log('✅ Terms of Service page is accessible');
      console.log('✅ Sign-up requires terms agreement');
      console.log('✅ Password strength indicator works');
      console.log('✅ Form validation is proper');
      console.log('✅ Subscription page has legal terms');
      console.log('✅ Contact form has legal terms');
    } else {
      console.log('\n❌ ISSUES REMAIN: Some improvements still need fixing');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testLegalAndUXImprovements().catch(console.error);
