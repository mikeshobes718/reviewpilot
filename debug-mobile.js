const puppeteer = require('puppeteer');

async function debugMobile() {
  console.log('🔍 Debugging mobile page...');
  
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 1000,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    await page.goto('https://reviewsandmarketing.com', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Switch to mobile viewport
    await page.setViewport({ width: 375, height: 667 });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Get all buttons and their text
    const allButtons = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.map((btn, index) => ({
        index,
        text: btn.textContent.trim(),
        className: btn.className,
        id: btn.id,
        type: btn.type,
        innerHTML: btn.innerHTML.substring(0, 100) // First 100 chars
      }));
    });
    
    console.log('All buttons found:', allButtons);
    
    // Look for mobile menu button specifically
    const mobileMenuButton = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('button, a'));
      return elements.find(el => 
        el.textContent.toLowerCase().includes('menu') || 
        el.textContent.toLowerCase().includes('hamburger') ||
        el.getAttribute('aria-label')?.toLowerCase().includes('menu') ||
        el.innerHTML.includes('M4 6h16M4 12h16M4 18h16') // SVG hamburger icon
      );
    });
    
    if (mobileMenuButton) {
      console.log('Mobile menu button found:', {
        text: mobileMenuButton.textContent,
        tagName: mobileMenuButton.tagName,
        className: mobileMenuButton.className
      });
    } else {
      console.log('No mobile menu button found');
    }
    
    // Take screenshot
    await page.screenshot({ path: 'mobile-debug.png' });
    console.log('📸 Screenshot saved as mobile-debug.png');
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  } finally {
    await browser.close();
  }
}

debugMobile().catch(console.error);
