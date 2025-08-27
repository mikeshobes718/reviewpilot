const puppeteer = require('puppeteer');

async function testButtonAlignment() {
  console.log('🔍 Testing button alignment fix...');
  
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 1000,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Test auth page
    console.log('🌐 Loading auth page...');
    await page.goto('https://reviewsandmarketing.com/auth', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check button structure
    const buttonInfo = await page.evaluate(() => {
      const submitButton = document.querySelector('button[type="submit"]');
      if (!submitButton) return 'No submit button found';
      
      const buttonClasses = submitButton.className;
      const hasFlexbox = buttonClasses.includes('inline-flex') || buttonClasses.includes('flex');
      const hasItemsCenter = buttonClasses.includes('items-center');
      const hasJustifyCenter = buttonClasses.includes('justify-center');
      
      // Check icon and text positioning
      const icon = submitButton.querySelector('svg');
      const text = submitButton.textContent.trim();
      
      return {
        buttonClasses,
        hasFlexbox,
        hasItemsCenter,
        hasJustifyCenter,
        hasIcon: !!icon,
        text,
        iconPosition: icon ? (icon.compareDocumentPosition(submitButton.firstChild) & Node.DOCUMENT_POSITION_PRECEDING ? 'before' : 'after') : 'none'
      };
    });
    
    console.log('Button alignment info:', buttonInfo);
    
    if (buttonInfo.hasFlexbox && buttonInfo.hasItemsCenter && buttonInfo.hasJustifyCenter) {
      console.log('✅ Button has proper flexbox alignment classes');
    } else {
      console.log('❌ Button missing proper flexbox alignment classes');
    }
    
    if (buttonInfo.hasIcon) {
      console.log('✅ Button has icon');
    } else {
      console.log('❌ Button missing icon');
    }
    
    // Take screenshot
    await page.screenshot({ path: 'button-alignment-test.png' });
    console.log('📸 Screenshot saved');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testButtonAlignment().catch(console.error);
