const puppeteer = require('puppeteer');

async function testDashboardHeaderMenu() {
  console.log('🧪 Testing Dashboard Header Menu...');
  
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 1000,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Test on desktop viewport
    await page.setViewport({ width: 1200, height: 800 });
    
    console.log('🔐 Loading dashboard...');
    await page.goto('https://reviewsandmarketing.com/dashboard', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check if we're redirected to auth (expected for unauthenticated users)
    const currentUrl = page.url();
    if (currentUrl.includes('/auth')) {
      console.log('✅ Redirected to auth page (expected for unauthenticated users)');
      console.log('📝 To test the dashboard header menu, you need to sign in first');
      console.log('🔗 Please sign in manually and then navigate to /dashboard');
      return;
    }
    
    // If we're on the dashboard, test the header menu
    if (currentUrl.includes('/dashboard')) {
      console.log('✅ Dashboard loaded successfully');
      
      // Check for header menu elements
      const headerMenu = await page.evaluate(() => {
        const logo = document.querySelector('.w-8.h-8.bg-gradient-to-br');
        const navMenu = document.querySelector('.hidden.lg\\:flex.items-center.space-x-8');
        const mobileMenuButton = document.querySelector('button[class*="lg:hidden"]');
        
        return {
          hasLogo: !!logo,
          hasDesktopMenu: !!navMenu,
          hasMobileMenuButton: !!mobileMenuButton,
          menuItems: Array.from(document.querySelectorAll('.hidden.lg\\:flex a, .hidden.lg\\:flex button')).map(item => ({
            text: item.textContent?.trim(),
            type: item.tagName.toLowerCase(),
            href: item.href || null
          }))
        };
      });
      
      console.log('Header menu elements:', headerMenu);
      
      if (headerMenu.hasLogo && headerMenu.hasDesktopMenu) {
        console.log('✅ Dashboard header menu is present');
        console.log('📋 Menu items found:', headerMenu.menuItems.length);
        
        headerMenu.menuItems.forEach((item, index) => {
          console.log(`  ${index + 1}. ${item.text} (${item.type})`);
        });
      } else {
        console.log('❌ Dashboard header menu missing elements');
      }
      
      // Test mobile menu toggle
      if (headerMenu.hasMobileMenuButton) {
        console.log('\n📱 Testing mobile menu...');
        
        // Click mobile menu button
        await page.click('button[class*="lg:hidden"]');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Check if mobile menu is visible
        const mobileMenu = await page.evaluate(() => {
          const mobileMenuItems = document.querySelectorAll('.lg\\:hidden .flex.flex-col.space-y-4 a, .lg\\:hidden .flex.flex-col.space-y-4 button');
          return {
            isVisible: mobileMenuItems.length > 0,
            itemCount: mobileMenuItems.length,
            items: Array.from(mobileMenuItems).map(item => ({
              text: item.textContent?.trim(),
              type: item.tagName.toLowerCase()
            }))
          };
        });
        
        console.log('Mobile menu state:', mobileMenu);
        
        if (mobileMenu.isVisible) {
          console.log('✅ Mobile menu is working');
        } else {
          console.log('❌ Mobile menu not visible');
        }
      }
      
      // Take screenshot
      await page.screenshot({ path: 'dashboard-header-menu-test.png' });
      console.log('📸 Screenshot saved');
      
    } else {
      console.log('❌ Unexpected page loaded:', currentUrl);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testDashboardHeaderMenu().catch(console.error);
