const puppeteer = require('puppeteer');

async function debugHomepageDOM() {
  console.log('🔍 Debugging homepage DOM structure...');
  
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 1000,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    await page.goto('https://reviewsandmarketing.com', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Get all buttons and their details
    const buttonDetails = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.map((btn, index) => ({
        index,
        text: btn.textContent.trim(),
        className: btn.className,
        visible: btn.offsetParent !== null,
        tagName: btn.tagName,
        innerHTML: btn.innerHTML.substring(0, 100), // First 100 chars
        attributes: Array.from(btn.attributes).map(attr => `${attr.name}="${attr.value}"`).join(' ')
      }));
    });
    
    console.log('\n🔍 All buttons found:');
    buttonDetails.forEach((btn, i) => {
      console.log(`${i}: ${btn.text} | ${btn.className} | Visible: ${btn.visible}`);
      console.log(`   HTML: ${btn.innerHTML}`);
      console.log(`   Attrs: ${btn.attributes}`);
      console.log('---');
    });
    
    // Look specifically for mobile menu button
    const mobileMenuButton = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find(btn => 
        btn.className.includes('md:hidden') || 
        btn.innerHTML.includes('M4 6h16M4 12h16M4 18h16') ||
        btn.innerHTML.includes('hamburger') ||
        btn.getAttribute('aria-label')?.includes('menu')
      );
    });
    
    if (mobileMenuButton) {
      console.log('\n✅ Mobile menu button found!');
      console.log('   Text:', mobileMenuButton.textContent?.trim());
      console.log('   Class:', mobileMenuButton.className);
      console.log('   Visible:', mobileMenuButton.offsetParent !== null);
    } else {
      console.log('\n❌ Mobile menu button not found');
      
      // Check if there are any hidden buttons
      const hiddenButtons = buttonDetails.filter(btn => !btn.visible);
      if (hiddenButtons.length > 0) {
        console.log('\n🔍 Hidden buttons found:');
        hiddenButtons.forEach(btn => {
          console.log(`   ${btn.text} | ${btn.className}`);
        });
      }
    }
    
    // Check navigation structure
    const navStructure = await page.evaluate(() => {
      const nav = document.querySelector('nav');
      if (!nav) return 'No nav element found';
      
      const navHTML = nav.innerHTML;
      const hasMobileButton = navHTML.includes('md:hidden');
      const hasHamburger = navHTML.includes('M4 6h16');
      
      return {
        hasNav: true,
        hasMobileButton,
        hasHamburger,
        navClasses: nav.className,
        navChildren: nav.children.length
      };
    });
    
    console.log('\n🔍 Navigation structure:', navStructure);
    
    // Take screenshot
    await page.screenshot({ path: 'homepage-dom-debug.png' });
    console.log('📸 Screenshot saved');
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  } finally {
    await browser.close();
  }
}

debugHomepageDOM().catch(console.error);
