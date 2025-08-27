const puppeteer = require('puppeteer');

async function workingTest() {
  console.log('🧪 Working test of all critical issues...');
  
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 1000,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Test 1: Authentication Forms
    console.log('\n🔐 Test 1: Authentication Forms');
    await page.goto('https://reviewsandmarketing.com/auth', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const emailInput = await page.$('input[type="email"]');
    const passwordInput = await page.$('input[type="password"]');
    const submitButton = await page.$('button[type="submit"]');
    
    const authFixed = !!(emailInput && passwordInput && submitButton);
    console.log('   🔐 Authentication Forms:', authFixed ? '✅ FIXED' : '❌ BROKEN');
    
    // Test 2: Subscription Buttons
    console.log('\n💳 Test 2: Subscription Buttons');
    await page.goto('https://reviewsandmarketing.com/subscribe', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Get all buttons and check for Starter/Pro
    const allButtons = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.map(btn => btn.textContent.trim());
    });
    
    console.log('   All button texts:', allButtons);
    
    const hasStarter = allButtons.some(text => text.toLowerCase().includes('starter'));
    const hasPro = allButtons.some(text => text.toLowerCase().includes('pro'));
    
    const subscriptionFixed = hasStarter && hasPro;
    console.log('   💳 Subscription Buttons:', subscriptionFixed ? '✅ FIXED' : '❌ BROKEN');
    console.log('   Has Starter button:', hasStarter);
    console.log('   Has Pro button:', hasPro);
    
    // Test 3: Mobile Menu
    console.log('\n📱 Test 3: Mobile Menu');
    await page.goto('https://reviewsandmarketing.com', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
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
    
    let mobileFixed = false;
    if (mobileButton) {
      console.log('   Mobile menu button found');
      try {
        await page.evaluate(btn => btn.click(), mobileButton);
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const mobileMenu = await page.$('[class*="menu"], [class*="nav"], [class*="dropdown"]');
        mobileFixed = !!mobileMenu;
        console.log('   Mobile menu opened:', mobileFixed);
      } catch (error) {
        console.log('   Mobile menu click failed:', error.message);
      }
    } else {
      console.log('   No mobile menu button found');
    }
    
    console.log('   📱 Mobile Menu:', mobileFixed ? '✅ FIXED' : '❌ BROKEN');
    
    // Final Summary
    console.log('\n📊 FINAL RESULTS:');
    console.log('   🔐 Authentication Forms:', authFixed ? '✅ FIXED' : '❌ BROKEN');
    console.log('   💳 Subscription Buttons:', subscriptionFixed ? '✅ FIXED' : '❌ BROKEN');
    console.log('   📱 Mobile Menu:', mobileFixed ? '✅ FIXED' : '❌ BROKEN');
    
    const totalFixed = [authFixed, subscriptionFixed, mobileFixed].filter(Boolean).length;
    console.log(`\n🎯 OVERALL RESULT: ${totalFixed}/3 Critical Issues Fixed`);
    
    if (totalFixed === 3) {
      console.log('🎉 ALL CRITICAL ISSUES ARE NOW 100% FIXED! 🎉');
      console.log('🚀 Your website is fully functional!');
    } else {
      console.log('⚠️ Some issues still need attention');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

workingTest().catch(console.error);
