const puppeteer = require('puppeteer');

async function testMobileOnly() {
  console.log('📱 Testing mobile menu button specifically...');
  
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 1000,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    await page.goto('https://reviewsandmarketing.com', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // First check desktop view
    console.log('\n🖥️ Desktop view:');
    const desktopButtons = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.map((btn, index) => ({
        index,
        text: btn.textContent.trim(),
        className: btn.className,
        visible: btn.offsetParent !== null
      }));
    });
    
    console.log('Desktop buttons:', desktopButtons);
    
    // Switch to mobile viewport
    console.log('\n📱 Mobile view:');
    await page.setViewport({ width: 375, height: 667 });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check mobile buttons
    const mobileButtons = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.map((btn, index) => ({
        index,
        text: btn.textContent.trim(),
        className: btn.className,
        visible: btn.offsetParent !== null,
        rect: btn.getBoundingClientRect()
      }));
    });
    
    console.log('Mobile buttons:', mobileButtons);
    
    // Look specifically for mobile menu button
    const mobileMenuButton = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find(btn => 
        btn.className.includes('md:hidden') || 
        btn.innerHTML.includes('M4 6h16M4 12h16M4 18h16')
      );
    });
    
    if (mobileMenuButton) {
      console.log('✅ Mobile menu button found!');
      console.log('   Class:', mobileMenuButton.className);
      console.log('   Visible:', mobileMenuButton.offsetParent !== null);
      
      // Try to click it
      try {
        await page.evaluate(btn => btn.click(), mobileMenuButton);
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const mobileMenu = await page.$('[class*="menu"], [class*="nav"], [class*="dropdown"]');
        if (mobileMenu) {
          console.log('✅ Mobile menu opened successfully!');
        } else {
          console.log('❌ Mobile menu did not open');
        }
      } catch (error) {
        console.log('❌ Mobile menu click failed:', error.message);
      }
    } else {
      console.log('❌ Mobile menu button not found');
    }
    
    // Take screenshot
    await page.screenshot({ path: 'mobile-test-final.png' });
    console.log('📸 Screenshot saved');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testMobileOnly().catch(console.error);
