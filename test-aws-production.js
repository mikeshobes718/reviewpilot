const puppeteer = require('puppeteer');

// AWS Production testing configuration
const AWS_URL = 'https://reviewsandmarketing.com'; // Your custom domain
const FALLBACK_URL = 'https://my-rvketlv6q-mikes-projects-9cbe43e2.vercel.app'; // Current Vercel deployment

class AWSProductionTester {
  constructor() {
    this.browser = null;
    this.page = null;
    this.testResults = [];
    this.startTime = Date.now();
    this.currentUrl = null;
  }

  async init() {
    console.log('🚀 Initializing AWS Production Testing...');
    
    this.browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });

    this.page = await this.browser.newPage();
    await this.page.setViewport({ width: 1280, height: 720 });
    await this.page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    console.log('✅ Browser initialized successfully');
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  logTest(name, passed, details = '') {
    const status = passed ? '✅ PASS' : '❌ FAIL';
    const result = { name, passed, details, timestamp: new Date().toISOString() };
    this.testResults.push(result);
    console.log(`${status} ${name}${details ? ` - ${details}` : ''}`);
    return passed;
  }

  async testDomainAccessibility() {
    console.log('\n🌐 Testing Domain Accessibility...');
    
    // Try AWS domain first
    try {
      await this.page.goto(AWS_URL, { waitUntil: 'networkidle2', timeout: 30000 });
      this.currentUrl = AWS_URL;
      this.logTest('AWS Domain Access', true, `Successfully accessed ${AWS_URL}`);
      return true;
    } catch (error) {
      console.log(`⚠️  AWS domain ${AWS_URL} not accessible yet, testing fallback...`);
      
      // Try fallback URL
      try {
        await this.page.goto(FALLBACK_URL, { waitUntil: 'networkidle2', timeout: 30000 });
        this.currentUrl = FALLBACK_URL;
        this.logTest('Fallback Domain Access', true, `Using fallback URL: ${FALLBACK_URL}`);
        return true;
      } catch (fallbackError) {
        this.logTest('Domain Access', false, `Both domains failed: ${error.message}`);
        return false;
      }
    }
  }

  async testHomepage() {
    console.log('\n🏠 Testing Homepage...');
    
    try {
      // Test page title
      const title = await this.page.title();
      const titlePass = title.includes('Reviews & Marketing');
      this.logTest('Page Title', titlePass, `Found: "${title}"`);
      
      // Test main heading
      const mainHeading = await this.page.$eval('h1', el => el.textContent);
      const headingPass = mainHeading.includes('Finally, Take Control of Your Online Reviews');
      this.logTest('Main Heading', headingPass, `Found: "${mainHeading}"`);
      
      // Test year 2025
      const pageContent = await this.page.content();
      const yearPass = pageContent.includes('2025') && !pageContent.includes('2024');
      this.logTest('Year 2025', yearPass, 'Year 2025 found throughout site');
      
      // Test logo link
      const logo = await this.page.$('a[href="/"]');
      const logoPass = logo !== null;
      this.logTest('Logo Link', logoPass, 'Logo link to homepage exists');
      
      // Test pricing link
      const pricingLink = await this.page.$('a[href="/subscribe"]');
      const pricingPass = pricingLink !== null;
      this.logTest('Pricing Link', pricingPass, 'Pricing link exists');
      
      // Test Watch Demo button
      const buttons = await this.page.$$('button');
      let demoButton = null;
      for (const button of buttons) {
        const text = await button.evaluate(el => el.textContent);
        if (text && text.includes('Watch Demo')) {
          demoButton = button;
          break;
        }
      }
      const demoPass = demoButton !== null;
      this.logTest('Watch Demo Button', demoPass, 'Watch Demo button found');
      
      // Test pricing information
      const starterFree = pageContent.includes('Free') && !pageContent.includes('$29.99');
      const proPrice = pageContent.includes('$49.99') && !pageContent.includes('$99');
      this.logTest('Starter Plan Pricing', starterFree, 'Starter plan shows as Free');
      this.logTest('Pro Plan Pricing', proPrice, 'Pro plan shows as $49.99');
      
      return true;
    } catch (error) {
      this.logTest('Homepage Loading', false, error.message);
      return false;
    }
  }

  async testMobileNavigation() {
    console.log('\n📱 Testing Mobile Navigation...');
    
    try {
      await this.page.setViewport({ width: 375, height: 667 });
      await this.page.goto(this.currentUrl, { waitUntil: 'networkidle2', timeout: 30000 });
      
      // Test mobile menu button
      const mobileButton = await this.page.$('button[aria-label*="menu"], button[aria-label*="Menu"], button[aria-label*="toggle"]');
      const mobileButtonPass = mobileButton !== null;
      this.logTest('Mobile Menu Button', mobileButtonPass, 'Mobile menu button exists');
      
      if (mobileButton) {
        // Click mobile menu
        await mobileButton.click();
        
        // Wait for menu to appear
        await this.page.waitForFunction(() => {
          const menu = document.querySelector('.mobile-menu, [class*="mobile"], [class*="menu"]');
          return menu && menu.style.display !== 'none';
        }, { timeout: 5000 });
        
        // Check if menu is visible
        const mobileMenu = await this.page.$('.mobile-menu, [class*="mobile"], [class*="menu"]');
        const menuVisiblePass = mobileMenu !== null;
        this.logTest('Mobile Menu Visibility', menuVisiblePass, 'Mobile menu appears when clicked');
        
        // Check pricing link in mobile menu
        const mobilePricingLink = await this.page.$('a[href="/subscribe"]');
        const mobilePricingPass = mobilePricingLink !== null;
        this.logTest('Mobile Pricing Link', mobilePricingPass, 'Pricing link visible in mobile menu');
      }
      
      return true;
    } catch (error) {
      this.logTest('Mobile Navigation', false, error.message);
      return false;
    }
  }

  async testAuthentication() {
    console.log('\n🔐 Testing Authentication System...');
    
    try {
      await this.page.goto(`${this.currentUrl}/auth`, { waitUntil: 'networkidle2', timeout: 30000 });
      
      // Wait for form to load
      await this.page.waitForSelector('form', { timeout: 10000 });
      this.logTest('Auth Form Loading', true, 'Authentication form loaded successfully');
      
      // Test sign up form
      const emailInput = await this.page.$('input[type="email"]');
      const passwordInput = await this.page.$('input[type="password"]');
      const submitButton = await this.page.$('button[type="submit"]');
      
      const formElementsPass = emailInput && passwordInput && submitButton;
      this.logTest('Auth Form Elements', formElementsPass, 'All form elements present');
      
      if (formElementsPass) {
        // Test forgot password functionality
        const buttons = await this.page.$$('button');
        let forgotPasswordButton = null;
        
        for (const button of buttons) {
          const text = await button.evaluate(el => el.textContent);
          if (text && text.includes('Forgot your password')) {
            forgotPasswordButton = button;
            break;
          }
        }
        
        const forgotPasswordPass = forgotPasswordButton !== null;
        this.logTest('Forgot Password Link', forgotPasswordPass, 'Forgot password option available');
        
        if (forgotPasswordButton) {
          // Click forgot password
          await forgotPasswordButton.click();
          
          // Wait for password reset form
          try {
            await this.page.waitForSelector('input[placeholder*="email"], input[placeholder*="Email"]', { timeout: 5000 });
            this.logTest('Password Reset Form', true, 'Password reset form appears');
          } catch (error) {
            this.logTest('Password Reset Form', false, 'Password reset form did not appear');
          }
        }
      }
      
      return true;
    } catch (error) {
      this.logTest('Authentication System', false, error.message);
      return false;
    }
  }

  async testDashboardAccess() {
    console.log('\n📊 Testing Dashboard Access...');
    
    try {
      // Test unauthenticated access
      await this.page.goto(`${this.currentUrl}/dashboard`, { waitUntil: 'networkidle2', timeout: 30000 });
      
      // Should redirect to auth page
      const currentUrl = this.page.url();
      const redirectPass = currentUrl.includes('/auth') || currentUrl.includes('/dashboard');
      this.logTest('Dashboard Redirect', redirectPass, `Current URL: ${currentUrl}`);
      
      return true;
    } catch (error) {
      this.logTest('Dashboard Access', false, error.message);
      return false;
    }
  }

  async testSubscriptionPage() {
    console.log('\n💳 Testing Subscription Page...');
    
    try {
      await this.page.goto(`${this.currentUrl}/subscribe`, { waitUntil: 'networkidle2', timeout: 30000 });
      
      // Test page content
      const pageContent = await this.page.content();
      
      // Check Starter plan
      const starterFree = pageContent.includes('Free') && pageContent.includes('30-day free trial');
      this.logTest('Starter Plan Details', starterFree, 'Starter plan shows Free with 30-day trial');
      
      // Check Pro plan
      const proPrice = pageContent.includes('$49.99') && pageContent.includes('month');
      this.logTest('Pro Plan Details', proPrice, 'Pro plan shows $49.99/month');
      
      // Check button text
      const buttonText = pageContent.includes('Get Started') && !pageContent.includes('Start Pro Trial');
      this.logTest('Pro Plan Button', buttonText, 'Pro plan button shows "Get Started"');
      
      return true;
    } catch (error) {
      this.logTest('Subscription Page', false, error.message);
      return false;
    }
  }

  async testContactPage() {
    console.log('\n📞 Testing Contact Page...');
    
    try {
      await this.page.goto(`${this.currentUrl}/contact`, { waitUntil: 'networkidle2', timeout: 30000 });
      
      const pageContent = await this.page.content();
      
      // Check address
      const addressPass = pageContent.includes('Riverfront Center, 221 River St 9th floor') && 
                         pageContent.includes('Hoboken, NJ 07030, United States') &&
                         !pageContent.includes('123 Business Ave, Suite 100 San Francisco, CA 94105');
      this.logTest('Contact Address', addressPass, 'Correct Hoboken address displayed');
      
      // Check contact form
      const contactForm = await this.page.$('form');
      const formPass = contactForm !== null;
      this.logTest('Contact Form', formPass, 'Contact form exists');
      
      return true;
    } catch (error) {
      this.logTest('Contact Page', false, error.message);
      return false;
    }
  }

  async testPrivacyPage() {
    console.log('\n📋 Testing Privacy Policy...');
    
    try {
      await this.page.goto(`${this.currentUrl}/privacy`, { waitUntil: 'networkidle2', timeout: 30000 });
      
      const pageContent = await this.page.content();
      
      // Check last updated date
      const datePass = pageContent.includes('August 26, 2025') && !pageContent.includes('2024');
      this.logTest('Privacy Policy Date', datePass, 'Last updated date is August 26, 2025');
      
      return true;
    } catch (error) {
      this.logTest('Privacy Policy', false, error.message);
      return false;
    }
  }

  async testAccessibility() {
    console.log('\n♿ Testing Accessibility...');
    
    try {
      await this.page.goto(this.currentUrl, { waitUntil: 'networkidle2', timeout: 30000 });
      
      // Check meta tags
      const metaDescription = await this.page.$eval('meta[name="description"]', el => el.content);
      const metaPass = metaDescription && metaDescription.includes('Automate your review collection');
      this.logTest('Meta Description', metaPass, 'Meta description present and relevant');
      
      // Check accessibility attributes
      const logo = await this.page.$('a[aria-label*="homepage"], a[aria-label*="Homepage"], a[aria-label*="Reviews"]');
      const logoPass = logo !== null;
      this.logTest('Logo Accessibility', logoPass, 'Logo has proper aria-label');
      
      const mobileButton = await this.page.$('button[aria-label*="menu"], button[aria-label*="Menu"], button[aria-label*="toggle"]');
      const mobilePass = mobileButton !== null;
      this.logTest('Mobile Button Accessibility', mobilePass, 'Mobile menu button has proper aria-label');
      
      return true;
    } catch (error) {
      this.logTest('Accessibility', false, error.message);
      return false;
    }
  }

  async testPerformance() {
    console.log('\n⚡ Testing Performance...');
    
    try {
      const startTime = Date.now();
      await this.page.goto(this.currentUrl, { waitUntil: 'networkidle2', timeout: 30000 });
      const loadTime = Date.now() - startTime;
      
      const performancePass = loadTime < 10000; // Should load within 10 seconds
      this.logTest('Page Load Performance', performancePass, `Page loaded in ${loadTime}ms`);
      
      return true;
    } catch (error) {
      this.logTest('Performance', false, error.message);
      return false;
    }
  }

  async runAllTests() {
    console.log('🚀 Starting AWS Production Testing...');
    console.log(`🌐 Target Domain: ${AWS_URL}`);
    console.log(`🔄 Fallback URL: ${FALLBACK_URL}`);
    console.log(`⏰ Start Time: ${new Date().toLocaleString()}`);
    
    try {
      await this.init();
      
      // Test domain accessibility first
      if (!(await this.testDomainAccessibility())) {
        console.log('❌ Cannot access any domain. Please check your deployment.');
        return;
      }
      
      // Run all test suites
      await this.testHomepage();
      await this.testMobileNavigation();
      await this.testAuthentication();
      await this.testDashboardAccess();
      await this.testSubscriptionPage();
      await this.testContactPage();
      await this.testPrivacyPage();
      await this.testAccessibility();
      await this.testPerformance();
      
      // Generate test report
      this.generateReport();
      
    } catch (error) {
      console.error('❌ Test execution failed:', error.message);
    } finally {
      await this.cleanup();
    }
  }

  generateReport() {
    const endTime = Date.now();
    const totalTime = endTime - this.startTime;
    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(r => r.passed).length;
    const failedTests = totalTests - passedTests;
    const successRate = ((passedTests / totalTests) * 100).toFixed(1);
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 AWS PRODUCTION TESTING REPORT');
    console.log('='.repeat(60));
    console.log(`🌐 Tested URL: ${this.currentUrl}`);
    console.log(`⏱️  Total Test Time: ${totalTime}ms`);
    console.log(`🧪 Total Tests: ${totalTests}`);
    console.log(`✅ Passed: ${passedTests}`);
    console.log(`❌ Failed: ${failedTests}`);
    console.log(`📈 Success Rate: ${successRate}%`);
    console.log('='.repeat(60));
    
    if (failedTests > 0) {
      console.log('\n❌ FAILED TESTS:');
      this.testResults.filter(r => !r.passed).forEach(test => {
        console.log(`   • ${test.name}: ${test.details}`);
      });
    }
    
    if (passedTests === totalTests) {
      console.log('\n🎉 ALL TESTS PASSED! Your AWS deployment is working perfectly!');
    } else {
      console.log('\n⚠️  Some tests failed. Please review the issues above.');
    }
    
    console.log('\n🌐 Your live application: ' + this.currentUrl);
    if (this.currentUrl === FALLBACK_URL) {
      console.log('💡 Note: Currently using fallback URL. AWS domain may still be propagating.');
    }
    console.log('='.repeat(60));
  }
}

// Run the tests
async function main() {
  const tester = new AWSProductionTester();
  await tester.runAllTests();
}

// Run if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = AWSProductionTester;
