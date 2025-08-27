const puppeteer = require('puppeteer');

async function testMobileMenuFinal() {
  console.log('📱 Final mobile menu test...');
  
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 1000,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Go to homepage
    console.log('🌐 Loading homepage...');
    await page.goto('https://reviewsandmarketing.com', { waitUntil: 'networkidle0' });
    
    // Wait for page to be fully loaded
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Check desktop view first
    console.log('\n🖥️ Desktop view check:');
    const desktopButtons = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.map((btn, index) => ({
        index,
        text: btn.textContent.trim(),
        className: btn.className,
        visible: btn.offsetParent !== null,
        hasMdHidden: btn.className.includes('md:hidden')
      }));
    });
    
    console.log('Desktop buttons found:', desktopButtons.length);
    desktopButtons.forEach((btn, i) => {
      if (btn.hasMdHidden) {
        console.log(`   ${i}: Mobile menu button - ${btn.className} | Visible: ${btn.visible}`);
      }
    });
    
    // Switch to mobile viewport
    console.log('\n📱 Switching to mobile viewport...');
    await page.setViewport({ width: 375, height: 667 });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check mobile view
    console.log('\n📱 Mobile view check:');
    const mobileButtons = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.map((btn, index) => ({
        index,
        text: btn.textContent.trim(),
        className: btn.className,
        visible: btn.offsetParent !== null,
        hasMdHidden: btn.className.includes('md:hidden')
      }));
    });
    
    console.log('Mobile buttons found:', mobileButtons.length);
    mobileButtons.forEach((btn, i) => {
      if (btn.hasMdHidden) {
        console.log(`   ${i}: Mobile menu button - ${btn.className} | Visible: ${btn.visible}`);
      }
    });
    
    // Find mobile menu button
    const mobileMenuButton = mobileButtons.find(btn => btn.hasMdHidden);
    
    if (mobileMenuButton && mobileMenuButton.visible) {
      console.log('\n✅ Mobile menu button found and visible!');
      
      // Try to click it
      try {
        console.log('🖱️ Clicking mobile menu button...');
        await page.click('button.md\\:hidden');
        await new Promise(resolve => setTimeout(resolve), 3000);
        
        // Check if menu opened
        const mobileMenu = await page.$('[class*="fixed inset-0"]');
        if (mobileMenu) {
          console.log('✅ Mobile menu opened successfully!');
          
          // Check menu content
          const menuItems = await page.evaluate(() => {
            const menu = document.querySelector('[class*="fixed inset-0"]');
            if (!menu) return [];
            
            const links = menu.querySelectorAll('a');
            return Array.from(links).map(link => link.textContent.trim());
          });
          
          console.log('📋 Menu items found:', menuItems);
          
        } else {
          console.log('❌ Mobile menu did not open');
        }
      } catch (error) {
        console.log('❌ Mobile menu click failed:', error.message);
      }
    } else {
      console.log('❌ Mobile menu button not found or not visible');
      console.log('Available buttons:');
      mobileButtons.forEach((btn, i) => {
        console.log(`   ${i}: ${btn.text} | ${btn.className} | Visible: ${btn.visible}`);
      });
    }
    
    // Take screenshot
    await page.screenshot({ path: 'mobile-menu-final-test.png' });
    console.log('📸 Screenshot saved');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testMobileMenuFinal().catch(console.error);
