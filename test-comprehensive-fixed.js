const puppeteer = require('puppeteer');

async function testComprehensive() {
  console.log('🚀 Starting comprehensive test on live production site...');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Test 1: Homepage and Mobile Menu
    console.log('\n📱 Testing Homepage and Mobile Menu...');
    await page.goto('https://reviewsandmarketing.com', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // First check desktop view
    const desktopMobileButton = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find(btn => btn.className.includes('md:hidden'));
    });
    
    if (desktopMobileButton) {
      console.log('✅ Mobile menu button found in desktop view (hidden as expected)');
      
      // Switch to mobile viewport
      await page.setViewport({ width: 375, height: 667 });
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Now check if button is visible in mobile view
      const mobileViewButton = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const mobileBtn = buttons.find(btn => btn.className.includes('md:hidden'));
        return mobileBtn ? {
          visible: mobileBtn.offsetParent !== null,
          className: mobileBtn.className,
          text: mobileBtn.textContent.trim()
        } : null;
      });
      
      if (mobileViewButton && mobileViewButton.visible) {
        console.log('✅ Mobile menu button is visible in mobile view');
        
        // Click mobile menu button
        try {
          await page.click('button.md\\:hidden');
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Check if mobile menu opened
          const mobileMenu = await page.$('[class*="fixed inset-0"]');
          if (mobileMenu) {
            console.log('✅ Mobile menu opened successfully');
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
    
    // Final mobile menu status
    const mobileMenuWorking = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const mobileBtn = buttons.find(btn => btn.className.includes('md:hidden'));
      return mobileBtn && mobileBtn.offsetParent !== null;
    });
    
    console.log('\n🎯 Test Summary:');
    console.log('📱 Mobile Menu:', mobileMenuWorking ? '✅ WORKING' : '❌ BROKEN');
    console.log('🔐 Authentication Forms:', authContent.forms > 0 ? '✅ WORKING' : '❌ BROKEN');
    console.log('💳 Subscription Buttons:', subscriptionButtons.starterButton && subscriptionButtons.proButton ? '✅ WORKING' : '❌ BROKEN');
    
    // Take final screenshot
    await page.screenshot({ path: 'comprehensive-test-final.png' });
    console.log('📸 Final screenshot saved');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testComprehensive().catch(console.error);
