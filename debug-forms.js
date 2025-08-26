const puppeteer = require('puppeteer');

async function debugForms() {
  console.log('🔍 Debugging forms and mobile menu on live site...');
  
  const browser = await puppeteer.launch({
    headless: false, // Set to false to see what's happening
    slowMo: 1000,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    
    // Test 1: Authentication Page
    console.log('\n🔐 Testing Authentication Page...');
    await page.goto('https://reviewsandmarketing.com/auth', { waitUntil: 'networkidle0' });
    
    // Wait for page to load
    await page.waitForTimeout(3000);
    
    // Check if forms are visible
    const emailInput = await page.$('input[type="email"]');
    const passwordInput = await page.$('input[type="password"]');
    const submitButton = await page.$('button[type="submit"]');
    
    console.log('   Email input found:', !!emailInput);
    console.log('   Password input found:', !!passwordInput);
    console.log('   Submit button found:', !!submitButton);
    
    if (emailInput && passwordInput && submitButton) {
      console.log('   ✅ All form elements found!');
      
      // Test form interaction
      await emailInput.type('test@example.com');
      await passwordInput.type('password123');
      console.log('   ✅ Form fields can be filled');
      
      // Check if submit button is enabled
      const isDisabled = await page.evaluate(btn => btn.disabled, submitButton);
      console.log('   Submit button disabled:', isDisabled);
    } else {
      console.log('   ❌ Form elements missing!');
      
      // Take screenshot to see what's visible
      await page.screenshot({ path: 'auth-page-debug.png' });
      console.log('   📸 Screenshot saved as auth-page-debug.png');
    }
    
    // Test 2: Subscription Page
    console.log('\n💳 Testing Subscription Page...');
    await page.goto('https://reviewsandmarketing.com/subscribe', { waitUntil: 'networkidle0' });
    await page.waitForTimeout(3000);
    
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
    
    // Check subscription buttons
    const subscribeButtons = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button, a'));
      return buttons.filter(btn => 
        btn.textContent.toLowerCase().includes('subscribe') || 
        btn.textContent.toLowerCase().includes('get started')
      );
    });
    console.log('   Subscription buttons found:', subscribeButtons.length);
    
    // Test 3: Mobile Menu
    console.log('\n📱 Testing Mobile Menu...');
    await page.goto('https://reviewsandmarketing.com', { waitUntil: 'networkidle0' });
    await page.waitForTimeout(3000);
    
    // Switch to mobile viewport
    await page.setViewport({ width: 375, height: 667 });
    await page.waitForTimeout(2000);
    
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
      console.log('   ✅ Mobile menu button found');
      
      // Try to click it
      await page.evaluate(btn => btn.click(), mobileMenuButton);
      await page.waitForTimeout(2000);
      
      // Check if menu opened
      const mobileMenu = await page.$('[class*="menu"], [class*="nav"], [class*="dropdown"]');
      if (mobileMenu) {
        console.log('   ✅ Mobile menu opened successfully');
      } else {
        console.log('   ❌ Mobile menu did not open');
      }
    } else {
      console.log('   ❌ Mobile menu button not found');
      
      // Take screenshot to see mobile layout
      await page.screenshot({ path: 'mobile-layout-debug.png' });
      console.log('   📸 Mobile screenshot saved as mobile-layout-debug.png');
    }
    
    // Take final screenshot
    await page.screenshot({ path: 'final-debug.png' });
    console.log('   📸 Final debug screenshot saved');
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  } finally {
    await browser.close();
  }
}

debugForms().catch(console.error);
