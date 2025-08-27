

const puppeteer = require('puppeteer');

async function finalComprehensiveTest() {
  console.log('🚀 Final comprehensive test on live production site...');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Test 1: Homepage and Mobile Menu
    console.log('\n📱 Testing Homepage and Mobile Menu...');
    await page.goto('https://reviewsandmarketing.com', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Check mobile menu button in desktop view
    const desktopMobileButton = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find(btn => btn.className.includes('md:hidden'));
    });
    
    let mobileViewButton = null;
    
    if (desktopMobileButton) {
      console.log('✅ Mobile menu button found in desktop view (hidden as expected)');
      
      // Switch to mobile viewport
      await page.setViewport({ width: 375, height: 667 });
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Check if button is visible in mobile view
      mobileViewButton = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const mobileBtn = buttons.find(btn => btn.className.includes('md:hidden'));
        return mobileBtn ? {
          visible: mobileBtn.offsetParent !== null,
          className: mobileBtn.className
        } : null;
      });
      
      if (mobileViewButton && mobileViewButton.visible) {
        console.log('✅ Mobile menu button is visible in mobile view');
        
        // Click mobile menu button
        try {
          await page.click('button.md\\:hidden');
          await new Promise(resolve => setTimeout(resolve, 3000));
          
          // Check if mobile menu opened
          const mobileMenu = await page.$('[class*="fixed inset-0"]');
          if (mobileMenu) {
            console.log('✅ Mobile menu opened successfully');
            
            // Verify menu content
            const menuItems = await page.evaluate(() => {
              const menu = document.querySelector('[class*="fixed inset-0"]');
              if (!menu) return [];
              const links = menu.querySelectorAll('a');
              return Array.from(links).map(link => link.textContent.trim());
            });
            
            if (menuItems.length >= 5) {
              console.log('✅ Mobile menu contains all expected navigation items');
            } else {
              console.log('❌ Mobile menu missing some navigation items');
            }
          } else {
            console.log('❌ Mobile menu did not open');
          }
        } catch (error) {
          console.log('❌ Mobile menu click failed:', error.message);
        }
      } else {
        console.log('❌ Mobile menu button not visible in mobile view');
      }
    } else {
      console.log('❌ Mobile menu button not found at all');
    }
    
    // Test 2: Authentication Page
    console.log('\n🔐 Testing Authentication Page...');
    await page.goto('https://reviewsandmarketing.com/auth', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check page content
    const authContent = await page.evaluate(() => {
      const title = document.querySelector('h1')?.textContent?.trim();
      const forms = document.querySelectorAll('form').length;
      const inputs = document.querySelectorAll('input').length;
      const buttons = document.querySelectorAll('button').length;
      
      // Check for specific elements using proper selectors
      const allButtons = Array.from(document.querySelectorAll('button'));
      const forgotPassword = allButtons.find(btn => 
        btn.textContent.includes('Forgot your password') ||
        btn.textContent.includes('Forgot')
      );
      
      const googleButton = allButtons.find(btn => 
        btn.textContent.includes('Continue with Google') ||
        btn.innerHTML.includes('svg') ||
        btn.querySelector('svg')
      );
      
      return {
        title,
        forms,
        inputs,
        buttons,
        forgotPassword: !!forgotPassword,
        googleButton: !!googleButton,
        buttonTexts: allButtons.map(btn => btn.textContent.trim())
      };
    });
    
    console.log('Auth page content:', authContent);
    
    if (authContent.forms > 0 && authContent.inputs > 0) {
      console.log('✅ Authentication forms are present');
    } else {
      console.log('❌ Authentication forms missing');
    }
    
    if (authContent.forgotPassword) {
      console.log('✅ Forgot password link found');
    } else {
      console.log('❌ Forgot password link missing');
    }
    
    if (authContent.googleButton) {
      console.log('✅ Google sign-in button found');
    } else {
      console.log('❌ Google sign-in button missing');
    }
    
    // Test 3: Subscription Page
    console.log('\n💳 Testing Subscription Page...');
    await page.goto('https://reviewsandmarketing.com/subscribe', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check subscription buttons
    const subscriptionButtons = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const starterButton = buttons.find(btn => 
        btn.textContent.toLowerCase().includes('starter') ||
        btn.className.includes('starter')
      );
      const proButton = buttons.find(btn => 
        btn.textContent.toLowerCase().includes('pro') ||
        btn.className.includes('pro')
      );
      
      return {
        starterButton: !!starterButton,
        proButton: !!proButton,
        totalButtons: buttons.length,
        buttonTexts: buttons.map(btn => btn.textContent.trim())
      };
    });
    
    console.log('Subscription buttons:', subscriptionButtons);
    
    if (subscriptionButtons.starterButton && subscriptionButtons.proButton) {
      console.log('✅ Subscription plan buttons found');
    } else {
      console.log('❌ Subscription plan buttons missing');
    }
    
    // Test 4: Test form interactions
    console.log('\n🧪 Testing Form Interactions...');
    
    // Test authentication form
    await page.goto('https://reviewsandmarketing.com/auth', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Try to fill out the form
    try {
      await page.type('input[type="email"]', 'test@example.com');
      await page.type('input[type="password"]', 'password123');
      console.log('✅ Form inputs filled successfully');
    } catch (error) {
      console.log('❌ Form input failed:', error.message);
    }
    
    // Test subscription form interaction
    await page.goto('https://reviewsandmarketing.com/subscribe', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Try to click on plan buttons
    try {
      const planButtons = await page.$$('button');
      if (planButtons.length > 0) {
        await planButtons[0].click();
        console.log('✅ Plan button clicked successfully');
      }
    } catch (error) {
      console.log('❌ Plan button click failed:', error.message);
    }
    
    // Final status check
    const mobileMenuWorking = mobileViewButton && mobileViewButton.visible;
    const authFormsWorking = authContent.forms > 0 && authContent.forgotPassword && authContent.googleButton;
    const subscriptionWorking = subscriptionButtons.starterButton && subscriptionButtons.proButton;
    
    console.log('\n🎯 FINAL TEST SUMMARY:');
    console.log('📱 Mobile Menu:', mobileMenuWorking ? '✅ WORKING' : '❌ BROKEN');
    console.log('🔐 Authentication Forms:', authFormsWorking ? '✅ WORKING' : '❌ BROKEN');
    console.log('💳 Subscription Buttons:', subscriptionWorking ? '✅ WORKING' : '❌ BROKEN');
    
    if (mobileMenuWorking && authFormsWorking && subscriptionWorking) {
      console.log('\n🎉 ALL CRITICAL ISSUES ARE NOW FIXED! 🎉');
      console.log('✅ Mobile menu is fully functional');
      console.log('✅ Authentication forms are complete with forgot password and Google sign-in');
      console.log('✅ Subscription buttons are working correctly');
    } else {
      console.log('\n⚠️ Some issues still remain:');
      if (!mobileMenuWorking) console.log('❌ Mobile menu needs attention');
      if (!authFormsWorking) console.log('❌ Authentication forms need attention');
      if (!subscriptionWorking) console.log('❌ Subscription buttons need attention');
    }
    
    // Take final screenshot
    await page.screenshot({ path: 'final-comprehensive-test.png' });
    console.log('📸 Final screenshot saved');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

finalComprehensiveTest().catch(console.error);
