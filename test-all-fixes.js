const puppeteer = require('puppeteer');

async function testAllFixes() {
  console.log('🧪 Testing all critical fixes on live site...');
  console.log('🌐 Testing on: https://reviewsandmarketing.com');
  
  const browser = await puppeteer.launch({
    headless: false, // Set to false to see what's happening
    slowMo: 1000,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    
    // Test 1: Authentication Forms
    console.log('\n🔐 Test 1: Authentication Forms (CRITICAL ISSUE #1)');
    await page.goto('https://reviewsandmarketing.com/auth', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for Firebase to initialize
    
    // Check if forms are visible
    const emailInput = await page.$('input[type="email"]');
    const passwordInput = await page.$('input[type="password"]');
    const submitButton = await page.$('button[type="submit"]');
    
    console.log('   Email input found:', !!emailInput);
    console.log('   Password input found:', !!passwordInput);
    console.log('   Submit button found:', !!submitButton);
    
    if (emailInput && passwordInput && submitButton) {
      console.log('   ✅ AUTHENTICATION FORMS FIXED! All form elements found!');
      
      // Test form interaction
      await emailInput.type('test@example.com');
      await passwordInput.type('password123');
      console.log('   ✅ Form fields can be filled');
      
      // Check if submit button is enabled
      const isDisabled = await page.evaluate(btn => btn.disabled, submitButton);
      console.log('   Submit button disabled:', isDisabled);
      
      // Test password reset
      const forgotPasswordLink = await page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll('button, a'));
        return elements.find(el => el.textContent.toLowerCase().includes('forgot'));
      });
      
      if (forgotPasswordLink) {
        console.log('   ✅ Forgot password link found');
      } else {
        console.log('   ❌ Forgot password link still missing');
      }
      
      // Test Google sign-in button
      const googleButton = await page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll('button, a'));
        return elements.find(el => el.textContent.toLowerCase().includes('google'));
      });
      
      if (googleButton) {
        console.log('   ✅ Google sign-in button found');
      } else {
        console.log('   ❌ Google sign-in button still missing');
      }
      
    } else {
      console.log('   ❌ AUTHENTICATION FORMS STILL BROKEN!');
      await page.screenshot({ path: 'auth-still-broken.png' });
      console.log('   📸 Screenshot saved as auth-still-broken.png');
    }
    
    // Test 2: Subscription Forms
    console.log('\n💳 Test 2: Subscription Forms (CRITICAL ISSUE #2)');
    await page.goto('https://reviewsandmarketing.com/subscribe', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check pricing cards
    const pricingCards = await page.$$('.card, [class*="card"], [class*="pricing"]');
    console.log('   Pricing cards found:', pricingCards.length);
    
    // Check plan selection buttons
    const planButtons = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.filter(btn => 
        btn.textContent.toLowerCase().includes('starter') || 
        btn.textContent.toLowerCase().includes('pro')
      );
    });
    console.log('   Plan selection buttons found:', planButtons.length);
    
    if (planButtons && planButtons.length > 0) {
      console.log('   ✅ SUBSCRIPTION BUTTONS FIXED! Plan selection buttons found');
      
      // Test clicking the first plan button
      try {
        await page.evaluate((btn, index) => {
          if (buttons[index]) buttons[index].click();
        }, planButtons, 0);
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('   ✅ Plan selection button clickable');
      } catch (error) {
        console.log('   ❌ Plan selection button click failed:', error.message);
      }
    } else {
      console.log('   ❌ SUBSCRIPTION BUTTONS STILL BROKEN!');
    }
    
    // Check for subscription buttons
    const subscribeButtons = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button, a'));
      return buttons.filter(btn => 
        btn.textContent.toLowerCase().includes('subscribe') || 
        btn.textContent.toLowerCase().includes('get started')
      );
    });
    console.log('   Subscription buttons found:', subscribeButtons ? subscribeButtons.length : 0);
    
    // Test 3: Mobile Menu
    console.log('\n📱 Test 3: Mobile Menu (CRITICAL ISSUE #3)');
    await page.goto('https://reviewsandmarketing.com', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Switch to mobile viewport
    await page.setViewport({ width: 375, height: 667 });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Look for mobile menu button
    const mobileMenuButton = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('button, a'));
      return elements.find(el => 
        el.textContent.toLowerCase().includes('menu') || 
        el.textContent.toLowerCase().includes('hamburger') ||
        el.getAttribute('aria-label')?.toLowerCase().includes('menu') ||
        el.innerHTML.includes('M4 6h16M4 12h16M4 18h16') // SVG hamburger icon
      );
    });
    
    if (mobileMenuButton) {
      console.log('   ✅ MOBILE MENU BUTTON FOUND!');
      
      // Try to click it
      try {
        await page.evaluate(btn => btn.click(), mobileMenuButton);
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Check if menu opened
        const mobileMenu = await page.$('[class*="menu"], [class*="nav"], [class*="dropdown"]');
        if (mobileMenu) {
          console.log('   ✅ MOBILE MENU FIXED! Menu opened successfully');
        } else {
          console.log('   ❌ Mobile menu button clicked but menu did not open');
        }
      } catch (error) {
        console.log('   ❌ Mobile menu button click failed:', error.message);
      }
    } else {
      console.log('   ❌ MOBILE MENU STILL BROKEN! Button not found');
      
      // Take screenshot to see mobile layout
      await page.screenshot({ path: 'mobile-menu-still-broken.png' });
      console.log('   📸 Mobile screenshot saved as mobile-menu-still-broken.png');
    }
    
    // Take final screenshot
    await page.screenshot({ path: 'final-test-results.png' });
    console.log('   📸 Final test screenshot saved');
    
    // Summary
    console.log('\n📊 TEST SUMMARY:');
    console.log('   🔐 Authentication Forms:', emailInput && passwordInput && submitButton ? '✅ FIXED' : '❌ STILL BROKEN');
    console.log('   💳 Subscription Buttons:', planButtons && planButtons.length > 0 ? '✅ FIXED' : '❌ STILL BROKEN');
    console.log('   📱 Mobile Menu:', mobileMenuButton ? '✅ FIXED' : '❌ STILL BROKEN');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testAllFixes().catch(console.error);
