const puppeteer = require('puppeteer');

async function testCompleteSignupFlow() {
  console.log('🧪 Testing complete signup flow to ensure 100% success...');
  
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 1000,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Test both mobile and desktop viewports
    const viewports = [
      { width: 375, height: 667, name: 'Mobile' },
      { width: 1200, height: 800, name: 'Desktop' }
    ];
    
    for (const viewport of viewports) {
      console.log(`\n📱 Testing on ${viewport.name} viewport...`);
      await page.setViewport(viewport);
      
      // 1. Test homepage logo navigation
      console.log('🏠 Testing homepage logo navigation...');
      await page.goto('https://reviewsandmarketing.com', { waitUntil: 'networkidle0' });
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const logoClickable = await page.evaluate(() => {
        const logo = document.querySelector('a[href="/"]');
        return !!logo;
      });
      
      if (logoClickable) {
        console.log('✅ Homepage logo is clickable and links to home');
      } else {
        console.log('❌ Homepage logo is not clickable');
      }
      
      // 2. Test navigation to auth page
      console.log('🔐 Testing navigation to auth page...');
      await page.goto('https://reviewsandmarketing.com/auth', { waitUntil: 'networkidle0' });
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Check if auth page loads properly
      const authPageLoaded = await page.evaluate(() => {
        const title = document.querySelector('h1');
        const form = document.querySelector('form');
        const emailInput = document.querySelector('input[type="email"]');
        const passwordInput = document.querySelector('input[type="password"]');
        
        return {
          title: title ? title.textContent : '',
          hasForm: !!form,
          hasEmailInput: !!emailInput,
          hasPasswordInput: !!passwordInput
        };
      });
      
      console.log('Auth page info:', authPageLoaded);
      
      if (authPageLoaded.hasForm && authPageLoaded.hasEmailInput && authPageLoaded.hasPasswordInput) {
        console.log('✅ Auth page loaded successfully with all required elements');
      } else {
        console.log('❌ Auth page missing required elements');
      }
      
      // 3. Test logo navigation from auth page
      console.log('🏠 Testing logo navigation from auth page...');
      const authLogoClickable = await page.evaluate(() => {
        const logo = document.querySelector('a[href="/"]');
        return !!logo;
      });
      
      if (authLogoClickable) {
        console.log('✅ Auth page logo is clickable and links to home');
      } else {
        console.log('❌ Auth page logo is not clickable');
      }
      
      // 4. Test complete signup flow
      console.log('📝 Testing complete signup flow...');
      
      // Generate unique email
      const timestamp = Date.now();
      const testEmail = `test${timestamp}@example.com`;
      const testPassword = 'TestPassword123!';
      
      // Fill out signup form
      await page.click('button:has-text("Sign Up")');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await page.type('input[type="email"]', testEmail);
      await page.type('input[type="password"]', testPassword);
      
      // Submit the form
      await page.click('button[type="submit"]');
      
      // Wait for form submission
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Check for success or errors
      const signupResult = await page.evaluate(() => {
        const errorMessage = document.querySelector('.text-red-600, .bg-red-50');
        const successMessage = document.querySelector('.text-success-700, .bg-success-50');
        const loadingState = document.querySelector('.animate-spin');
        
        return {
          hasError: !!errorMessage,
          hasSuccess: !!successMessage,
          isLoading: !!loadingState,
          errorText: errorMessage ? errorMessage.textContent : '',
          successText: successMessage ? successMessage.textContent : ''
        };
      });
      
      console.log('Signup result:', signupResult);
      
      if (signupResult.hasError) {
        console.log('❌ Signup failed with error:', signupResult.errorText);
      } else if (signupResult.hasSuccess) {
        console.log('✅ Signup successful:', signupResult.successText);
      } else if (signupResult.isLoading) {
        console.log('⏳ Signup is still processing...');
      } else {
        console.log('⚠️ Signup result unclear');
      }
      
      // 5. Test logo navigation from other pages
      console.log('🏠 Testing logo navigation from other pages...');
      
      const pagesToTest = ['/subscribe', '/contact', '/about', '/privacy'];
      
      for (const pagePath of pagesToTest) {
        try {
          await page.goto(`https://reviewsandmarketing.com${pagePath}`, { waitUntil: 'networkidle0' });
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          const logoClickable = await page.evaluate(() => {
            const logo = document.querySelector('a[href="/"]');
            return !!logo;
          });
          
          if (logoClickable) {
            console.log(`✅ Logo on ${pagePath} is clickable and links to home`);
          } else {
            console.log(`❌ Logo on ${pagePath} is not clickable`);
          }
        } catch (error) {
          console.log(`⚠️ Could not test ${pagePath}: ${error.message}`);
        }
      }
    }
    
    console.log('\n🎯 Signup flow test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testCompleteSignupFlow().catch(console.error);
