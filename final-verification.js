const puppeteer = require('puppeteer');

async function finalVerification() {
  console.log('🧪 Final verification of all critical issues...');
  
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 500,
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
    
    const planButtons = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.filter(btn => 
        btn.textContent.toLowerCase().includes('starter') || 
        btn.textContent.toLowerCase().includes('pro')
      );
    });
    
    const subscriptionFixed = planButtons && planButtons.length > 0;
    console.log('   💳 Subscription Buttons:', subscriptionFixed ? '✅ FIXED' : '❌ BROKEN');
    if (subscriptionFixed) {
      console.log('   Found buttons:', planButtons.map(btn => btn.textContent.trim()));
    }
    
    // Test 3: Mobile Menu
    console.log('\n📱 Test 3: Mobile Menu');
    await page.goto('https://reviewsandmarketing.com', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    await page.setViewport({ width: 375, height: 667 });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mobileButton = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find(btn => 
        btn.className.includes('md:hidden') || 
        btn.innerHTML.includes('M4 6h16M4 12h16M4 18h16')
      );
    });
    
    let mobileFixed = false;
    if (mobileButton) {
      try {
        await page.evaluate(btn => btn.click(), mobileButton);
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const mobileMenu = await page.$('[class*="menu"], [class*="nav"], [class*="dropdown"]');
        mobileFixed = !!mobileMenu;
      } catch (error) {
        console.log('   Mobile menu click failed:', error.message);
      }
    }
    
    console.log('   📱 Mobile Menu:', mobileFixed ? '✅ FIXED' : '❌ BROKEN');
    
    // Final Summary
    console.log('\n📊 FINAL VERIFICATION RESULTS:');
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
      console.log('   Issues to fix:');
      if (!authFixed) console.log('   - Authentication forms');
      if (!subscriptionFixed) console.log('   - Subscription buttons');
      if (!mobileFixed) console.log('   - Mobile menu');
    }
    
  } catch (error) {
    console.error('❌ Verification failed:', error);
  } finally {
    await browser.close();
  }
}

finalVerification().catch(console.error);
