const puppeteer = require('puppeteer');

async function testMobileHeaderFix() {
  console.log('🔍 Testing mobile header duplication fix and Google button alignment...');
  
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 1000,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Test mobile viewport
    await page.setViewport({ width: 375, height: 667 });
    
    // Test auth page
    console.log('🌐 Loading auth page on mobile...');
    await page.goto('https://reviewsandmarketing.com/auth', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check mobile header elements
    const mobileHeaderInfo = await page.evaluate(() => {
      // Check for "Back to Home" link visibility
      const backToHomeLink = document.querySelector('a[href="/"]');
      const backToHomeVisible = backToHomeLink && !backToHomeLink.classList.contains('hidden');
      
      // Check for mobile back button
      const mobileBackButton = document.querySelector('a.md\\:hidden');
      const mobileBackButtonVisible = !!mobileBackButton;
      
      // Check main auth card header
      const mainHeader = document.querySelector('h1');
      const mainHeaderText = mainHeader ? mainHeader.textContent : '';
      
      // Check Google button alignment - look for button with "Continue with Google" text
      const allButtons = Array.from(document.querySelectorAll('button'));
      const googleButton = allButtons.find(button => 
        button.textContent.includes('Continue with Google')
      );
      
      const googleButtonClasses = googleButton ? googleButton.className : '';
      const hasGoogleButtonFlexbox = googleButtonClasses.includes('inline-flex') || googleButtonClasses.includes('flex');
      const hasGoogleButtonItemsCenter = googleButtonClasses.includes('items-center');
      const hasGoogleButtonJustifyCenter = googleButtonClasses.includes('justify-center');
      
      return {
        backToHomeVisible,
        mobileBackButtonVisible,
        mainHeaderText,
        googleButtonClasses,
        hasGoogleButtonFlexbox,
        hasGoogleButtonItemsCenter,
        hasGoogleButtonJustifyCenter,
        googleButtonText: googleButton ? googleButton.textContent.trim() : 'Not found'
      };
    });
    
    console.log('Mobile header info:', mobileHeaderInfo);
    
    // Check results
    if (!mobileHeaderInfo.backToHomeVisible) {
      console.log('✅ "Back to Home" link properly hidden on mobile');
    } else {
      console.log('❌ "Back to Home" link still visible on mobile');
    }
    
    if (mobileHeaderInfo.mobileBackButtonVisible) {
      console.log('✅ Mobile back button is present');
    } else {
      console.log('❌ Mobile back button missing');
    }
    
    if (mobileHeaderInfo.hasGoogleButtonFlexbox && mobileHeaderInfo.hasGoogleButtonItemsCenter && mobileHeaderInfo.hasGoogleButtonJustifyCenter) {
      console.log('✅ Google button has proper flexbox alignment classes');
    } else {
      console.log('❌ Google button missing proper flexbox alignment classes');
      console.log('   Google button classes:', mobileHeaderInfo.googleButtonClasses);
    }
    
    // Take screenshot
    await page.screenshot({ path: 'mobile-header-fix-test.png' });
    console.log('📸 Screenshot saved');
    
    // Test desktop viewport
    console.log('🖥️ Testing desktop viewport...');
    await page.setViewport({ width: 1200, height: 800 });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const desktopHeaderInfo = await page.evaluate(() => {
      // Look for the desktop back link specifically
      const allLinks = Array.from(document.querySelectorAll('a[href="/"]'));
      const desktopBackLink = allLinks.find(link => 
        link.classList.contains('hidden') && link.classList.contains('md:inline-flex')
      );
      
      const backToHomeVisible = !!desktopBackLink;
      
      return {
        backToHomeVisible,
        totalLinks: allLinks.length,
        linkClasses: allLinks.map(link => link.className)
      };
    });
    
    console.log('Desktop header info:', desktopHeaderInfo);
    
    if (desktopHeaderInfo.backToHomeVisible) {
      console.log('✅ "Back to Home" link properly visible on desktop');
    } else {
      console.log('❌ "Back to Home" link missing on desktop');
      console.log('   Total links found:', desktopHeaderInfo.totalLinks);
      console.log('   Link classes:', desktopHeaderInfo.linkClasses);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testMobileHeaderFix().catch(console.error);
