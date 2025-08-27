const puppeteer = require('puppeteer');

async function debugAuthSimple() {
  console.log('🔍 Simple auth page debug...');
  
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 1000,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    console.log('🌐 Loading auth page...');
    await page.goto('https://reviewsandmarketing.com/auth', { waitUntil: 'networkidle0' });
    
    // Wait and check content
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const pageContent = await page.evaluate(() => {
      return {
        title: document.title,
        h1: document.querySelector('h1')?.textContent?.trim(),
        forms: document.querySelectorAll('form').length,
        inputs: document.querySelectorAll('input').length,
        buttons: document.querySelectorAll('button').length,
        bodyText: document.body.textContent.substring(0, 1000),
        url: window.location.href
      };
    });
    
    console.log('Auth page debug info:', pageContent);
    
    // Take screenshot
    await page.screenshot({ path: 'debug-auth-simple.png' });
    console.log('📸 Screenshot saved');
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  } finally {
    await browser.close();
  }
}

debugAuthSimple().catch(console.error);
