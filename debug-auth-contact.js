const puppeteer = require('puppeteer');

async function debugAuthContact() {
  console.log('🔍 Debugging Auth and Contact pages...');
  
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 1000,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Debug Contact Page
    console.log('\n📝 Debugging Contact Page...');
    await page.goto('https://reviewsandmarketing.com/contact', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const contactContent = await page.evaluate(() => {
      const forms = document.querySelectorAll('form');
      const inputs = document.querySelectorAll('input');
      const textareas = document.querySelectorAll('textarea');
      const buttons = document.querySelectorAll('button');
      
      return {
        forms: forms.length,
        inputs: inputs.length,
        textareas: textareas.length,
        buttons: buttons.length,
        formHTML: forms.length > 0 ? forms[0].outerHTML : 'No forms found',
        buttonTexts: Array.from(buttons).map(btn => btn.textContent.trim())
      };
    });
    
    console.log('Contact page content:', contactContent);
    
    // Debug Auth Page
    console.log('\n🔐 Debugging Auth Page...');
    await page.goto('https://reviewsandmarketing.com/auth', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const authContent = await page.evaluate(() => {
      const forms = document.querySelectorAll('form');
      const inputs = document.querySelectorAll('input');
      const buttons = document.querySelectorAll('button');
      
      return {
        forms: forms.length,
        inputs: inputs.length,
        buttons: buttons.length,
        buttonTexts: Array.from(buttons).map(btn => btn.textContent.trim()),
        pageTitle: document.querySelector('h1')?.textContent?.trim(),
        pageContent: document.body.textContent.substring(0, 500)
      };
    });
    
    console.log('Auth page content:', authContent);
    
    // Take screenshots
    await page.screenshot({ path: 'debug-auth-contact.png' });
    console.log('📸 Screenshot saved');
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  } finally {
    await browser.close();
  }
}

debugAuthContact().catch(console.error);
