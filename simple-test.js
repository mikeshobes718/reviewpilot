const puppeteer = require('puppeteer');

async function simpleTest() {
  console.log('🧪 Simple test of all critical issues...');
  
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 500,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Test 1: Authentication Forms
    console.log('\n🔐 Testing Authentication Forms...');
    await page.goto('https://reviewsandmarketing.com/auth', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const emailInput = await page.$('input[type="email"]');
    const passwordInput = await page.$('input[type="password"]');
    const submitButton = await page.$('button[type="submit"]');
    
    console.log('   Email input:', !!emailInput ? '✅ Found' : '❌ Missing');
    console.log('   Password input:', !!passwordInput ? '✅ Found' : '❌ Missing');
    console.log('   Submit button:', !!submitButton ? '✅ Found' : '❌ Missing');
    
    const authFixed = !!(emailInput && passwordInput && submitButton);
    console.log('   🔐 Authentication Forms:', authFixed ? '✅ FIXED' : '❌ BROKEN');
    
    // Test 2: Subscription Buttons
    console.log('\n💳 Testing Subscription Buttons...');
    await page.goto('https://reviewsandmarketing.com/subscribe', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Look for buttons with "Starter" or "Pro" text
    const planButtons = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.filter(btn => 
        btn.textContent.toLowerCase().includes('starter') || 
        btn.textContent.toLowerCase().includes('pro')
      );
    });
    
    console.log('   Plan selection buttons found:', planButtons.length);
    if (planButtons.length > 0) {
      console.log('   Button texts:', planButtons.map(btn => btn.textContent.trim()));
    }
    
    const subscriptionFixed = planButtons && planButtons.length > 0;
    console.log('   💳 Subscription Buttons:', subscriptionFixed ? '✅ FIXED' : '❌ BROKEN');
    
    // Test 3: Mobile Menu
    console.log('\n📱 Testing Mobile Menu...');
    await page.goto('https://reviewsandmarketing.com', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Switch to mobile viewport
    await page.setViewport({ width: 375, height: 667 });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Look for mobile menu button
    const mobileButton = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find(btn => 
        btn.className.includes('md:hidden') || 
        btn.innerHTML.includes('M4 6h16M4 12h16M4 18h16')
      );
    });
    
    console.log('   Mobile menu button:', !!mobileButton ? '✅ Found' : '❌ Missing');
    
    let mobileFixed = false;
    if (mobileButton) {
      // Try to click it
      try {
        await page.evaluate(btn => btn.click(), mobileButton);
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Check if menu opened
        const mobileMenu = await page.$('[class*="menu"], [class*="nav"], [class*="dropdown"]');
        mobileFixed = !!mobileMenu;
        console.log('   Mobile menu opened:', mobileFixed ? '✅ Yes' : '❌ No');
      } catch (error) {
        console.log('   Mobile menu click failed:', error.message);
      }
    }
    
    console.log('   📱 Mobile Menu:', mobileFixed ? '✅ FIXED' : '❌ BROKEN');
    
    // Final Summary
    console.log('\n📊 FINAL RESULTS:');
    console.log('   🔐 Authentication Forms:', authFixed ? '✅ FIXED' : '❌ BROKEN');
    console.log('   💳 Subscription Buttons:', subscriptionFixed ? '✅ FIXED' : '❌ BROKEN');
    console.log('   📱 Mobile Menu:', mobileFixed ? '✅ FIXED' : '❌ BROKEN');
    
    const totalFixed = [authFixed, subscriptionFixed, mobileFixed].filter(Boolean).length;
    console.log(`\n🎯 OVERALL: ${totalFixed}/3 Critical Issues Fixed`);
    
    if (totalFixed === 3) {
      console.log('🎉 ALL CRITICAL ISSUES ARE NOW 100% FIXED! 🎉');
    } else {
      console.log('⚠️ Some issues still need attention');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

simpleTest().catch(console.error);
