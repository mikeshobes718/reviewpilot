const puppeteer = require('puppeteer');

async function debugRemaining() {
  console.log('🔍 Debugging remaining issues...');
  
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 1000,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Debug Subscription Page
    console.log('\n💳 Debugging Subscription Page...');
    await page.goto('https://reviewsandmarketing.com/subscribe', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Get all buttons
    const allButtons = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.map((btn, index) => ({
        index,
        text: btn.textContent.trim(),
        className: btn.className,
        type: btn.type
      }));
    });
    
    console.log('All buttons on subscription page:', allButtons);
    
    // Look for plan selection buttons
    const planButtons = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.filter(btn => 
        btn.textContent.toLowerCase().includes('starter') || 
        btn.textContent.toLowerCase().includes('pro')
      );
    });
    
    console.log('Plan selection buttons found:', planButtons.length);
    if (planButtons.length > 0) {
      console.log('Plan button details:', planButtons.map(btn => ({
        text: btn.textContent.trim(),
        className: btn.className
      })));
    }
    
    // Debug Mobile Page
    console.log('\n📱 Debugging Mobile Page...');
    await page.goto('https://reviewsandmarketing.com', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    await page.setViewport({ width: 375, height: 667 });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Get all buttons on mobile
    const mobileButtons = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.map((btn, index) => ({
        index,
        text: btn.textContent.trim(),
        className: btn.className,
        type: btn.type,
        innerHTML: btn.innerHTML.substring(0, 100)
      }));
    });
    
    console.log('All buttons on mobile page:', mobileButtons);
    
    // Look for mobile menu button
    const mobileMenuButton = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find(btn => 
        btn.className.includes('md:hidden') || 
        btn.innerHTML.includes('M4 6h16M4 12h16M4 18h16')
      );
    });
    
    if (mobileMenuButton) {
      console.log('Mobile menu button found:', {
        text: mobileMenuButton.textContent,
        className: mobileMenuButton.className
      });
    } else {
      console.log('No mobile menu button found');
    }
    
    // Take screenshots
    await page.screenshot({ path: 'mobile-debug-final.png' });
    console.log('📸 Mobile screenshot saved');
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  } finally {
    await browser.close();
  }
}

debugRemaining().catch(console.error);
