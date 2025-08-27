const puppeteer = require('puppeteer');

async function testMobileMenuImprovements() {
  console.log('🧪 Testing mobile menu improvements...');
  
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 1000,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Test mobile viewport
    await page.setViewport({ width: 375, height: 667 });
    
    console.log('🏠 Loading homepage on mobile...');
    await page.goto('https://reviewsandmarketing.com', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check if mobile menu button is visible
    const mobileMenuButton = await page.evaluate(() => {
      const button = document.querySelector('button.md\\:hidden');
      return !!button;
    });
    
    if (mobileMenuButton) {
      console.log('✅ Mobile menu button is visible');
    } else {
      console.log('❌ Mobile menu button not found');
      return;
    }
    
    // Click mobile menu button
    console.log('📱 Opening mobile menu...');
    await page.click('button.md\\:hidden');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check mobile menu content
    const mobileMenuInfo = await page.evaluate(() => {
      const menu = document.querySelector('.fixed.inset-y-0.right-0');
      if (!menu) return 'Menu not found';
      
      const menuTitle = menu.querySelector('h3');
      const menuItems = Array.from(menu.querySelectorAll('nav a, nav button'));
      const closeButton = menu.querySelector('button[aria-label="Close mobile menu"]');
      
      return {
        hasMenu: !!menu,
        title: menuTitle ? menuTitle.textContent : '',
        menuItems: menuItems.map(item => item.textContent.trim()),
        hasCloseButton: !!closeButton,
        menuWidth: menu.style.width || 'default'
      };
    });
    
    console.log('Mobile menu info:', mobileMenuInfo);
    
    if (mobileMenuInfo.hasMenu) {
      console.log('✅ Mobile menu is open and visible');
    } else {
      console.log('❌ Mobile menu not found');
    }
    
    if (mobileMenuInfo.title === 'Menu') {
      console.log('✅ Menu title is correct');
    } else {
      console.log(`❌ Menu title is incorrect: "${mobileMenuInfo.title}"`);
    }
    
    if (mobileMenuInfo.menuItems.length > 0) {
      console.log('✅ Menu items are present:', mobileMenuInfo.menuItems);
    } else {
      console.log('❌ No menu items found');
    }
    
    if (mobileMenuInfo.hasCloseButton) {
      console.log('✅ Close button is present');
    } else {
      console.log('❌ Close button missing');
    }
    
    // Test menu item functionality
    console.log('🔗 Testing menu item functionality...');
    
    // Try to click on a menu item
    try {
      await page.click('nav a[href="#features"]');
      console.log('✅ Features link is clickable');
    } catch (error) {
      console.log('⚠️ Features link not clickable:', error.message);
    }
    
    // Close the menu
    console.log('❌ Closing mobile menu...');
    await page.click('button[aria-label="Close mobile menu"]');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if menu is closed
    const menuClosed = await page.evaluate(() => {
      const menu = document.querySelector('.fixed.inset-y-0.right-0');
      return !menu || menu.style.display === 'none';
    });
    
    if (menuClosed) {
      console.log('✅ Mobile menu closed successfully');
    } else {
      console.log('❌ Mobile menu did not close');
    }
    
    // Take screenshot
    await page.screenshot({ path: 'mobile-menu-improvements-test.png' });
    console.log('📸 Screenshot saved');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testMobileMenuImprovements().catch(console.error);
