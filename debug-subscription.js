const puppeteer = require('puppeteer');

async function debugSubscription() {
  console.log('🔍 Debugging subscription page...');
  
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 1000,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    
    await page.goto('https://reviewsandmarketing.com/subscribe', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Get all buttons and their text
    const allButtons = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.map((btn, index) => ({
        index,
        text: btn.textContent.trim(),
        className: btn.className,
        id: btn.id,
        type: btn.type
      }));
    });
    
    console.log('All buttons found:', allButtons);
    
    // Look for plan selection buttons specifically
    const planButtons = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.filter(btn => 
        btn.textContent.toLowerCase().includes('starter') || 
        btn.textContent.toLowerCase().includes('pro')
      ).map(btn => ({
        text: btn.textContent.trim(),
        className: btn.className
      }));
    });
    
    console.log('Plan selection buttons:', planButtons);
    
    // Take screenshot
    await page.screenshot({ path: 'subscription-debug.png' });
    console.log('📸 Screenshot saved as subscription-debug.png');
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  } finally {
    await browser.close();
  }
}

debugSubscription().catch(console.error);
