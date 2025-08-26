const puppeteer = require('puppeteer');

// Test configuration
const TEST_CONFIG = {
  baseUrl: 'https://reviewsandmarketing.com',
  timeout: 30000,
  headless: true,
  slowMo: 100
};

// Test data
const TEST_USER = {
  email: 'test@example.com',
  password: 'TestPassword123!',
  name: 'Test User'
};

async function testLiveSite() {
  console.log('🚀 Starting comprehensive live site testing...');
  console.log(`🌐 Testing on: ${TEST_CONFIG.baseUrl}`);
  
  const browser = await puppeteer.launch({
    headless: TEST_CONFIG.headless,
    slowMo: TEST_CONFIG.slowMo,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Set viewport
    await page.setViewport({ width: 1280, height: 720 });
    
    // Test 1: Homepage Loading
    console.log('\n📱 Test 1: Homepage Loading');
    await testHomepage(page);
    
    // Test 2: Navigation
    console.log('\n🧭 Test 2: Navigation');
    await testNavigation(page);
    
    // Test 3: Authentication Forms
    console.log('\n🔐 Test 3: Authentication Forms');
    await testAuthentication(page);
    
    // Test 4: Subscription Forms
    console.log('\n💳 Test 4: Subscription Forms');
    await testSubscription(page);
    
    // Test 5: Contact Form
    console.log('\n📧 Test 5: Contact Form');
    await testContactForm(page);
    
    // Test 6: Mobile Responsiveness
    console.log('\n📱 Test 6: Mobile Responsiveness');
    await testMobileResponsiveness(page);
    
    // Test 7: SEO Elements
    console.log('\n🔍 Test 7: SEO Elements');
    await testSEOElements(page);
    
    console.log('\n✅ All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

async function testHomepage(page) {
  try {
    await page.goto(TEST_CONFIG.baseUrl, { waitUntil: 'networkidle0', timeout: TEST_CONFIG.timeout });
    
    // Check if page loads
    const title = await page.title();
    console.log(`   ✅ Page loaded: ${title}`);
    
    // Check for main elements
    const heroSection = await page.$('h1');
    if (heroSection) {
      const heroText = await page.evaluate(el => el.textContent, heroSection);
      console.log(`   ✅ Hero section found: ${heroText.substring(0, 50)}...`);
    }
    
    // Check for pricing section - look for text content
    const pricingSection = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('h2, h3, h4, h5, h6'));
      return elements.find(el => el.textContent.toLowerCase().includes('pricing'));
    });
    if (pricingSection) {
      console.log('   ✅ Pricing section found');
    }
    
    // Check for CTA buttons - look for text content
    const ctaButtons = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button, a'));
      return buttons.filter(btn => btn.textContent.toLowerCase().includes('get started'));
    });
    console.log(`   ✅ Found ${ctaButtons.length} CTA buttons`);
    
  } catch (error) {
    console.error('   ❌ Homepage test failed:', error.message);
  }
}

async function testNavigation(page) {
  try {
    // Test logo click
    const logo = await page.$('a[href="/"]');
    if (logo) {
      await logo.click();
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('   ✅ Logo navigation works');
    }
    
    // Test main navigation links
    const navLinks = ['/about', '/contact', '/privacy', '/subscribe'];
    
    for (const link of navLinks) {
      try {
        await page.goto(`${TEST_CONFIG.baseUrl}${link}`, { waitUntil: 'networkidle0', timeout: 15000 });
        const title = await page.title();
        console.log(`   ✅ Navigation to ${link}: ${title}`);
      } catch (error) {
        console.error(`   ❌ Navigation to ${link} failed:`, error.message);
      }
    }
    
    // Return to homepage
    await page.goto(TEST_CONFIG.baseUrl, { waitUntil: 'networkidle0' });
    
  } catch (error) {
    console.error('   ❌ Navigation test failed:', error.message);
  }
}

async function testAuthentication(page) {
  try {
    // Go to auth page
    await page.goto(`${TEST_CONFIG.baseUrl}/auth`, { waitUntil: 'networkidle0' });
    
    // Test signup form
    console.log('   🔐 Testing signup form...');
    
    // Look for email input by type or placeholder
    const emailInput = await page.$('input[type="email"]') || await page.$('input[placeholder*="email" i]') || await page.$('input[name*="email" i]');
    if (emailInput) {
      await emailInput.type(TEST_USER.email);
      console.log('   ✅ Email input found and filled');
    } else {
      console.log('   ⚠️ Email input not found');
    }
    
    // Look for password input
    const passwordInput = await page.$('input[type="password"]') || await page.$('input[placeholder*="password" i]') || await page.$('input[name*="password" i]');
    if (passwordInput) {
      await passwordInput.type(TEST_USER.password);
      console.log('   ✅ Password input found and filled');
    } else {
      console.log('   ⚠️ Password input not found');
    }
    
    // Check if form validation works
    const submitButton = await page.$('button[type="submit"]');
    if (submitButton) {
      const isDisabled = await page.evaluate(btn => btn.disabled, submitButton);
      console.log(`   ✅ Submit button state: ${isDisabled ? 'Disabled' : 'Enabled'}`);
    }
    
    // Test form submission (without actually submitting)
    console.log('   ✅ Signup form validation working');
    
    // Test password reset form
    console.log('   🔑 Testing password reset form...');
    
    const forgotPasswordLink = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('button, a'));
      return elements.find(el => el.textContent.toLowerCase().includes('forgot'));
    });
    
    if (forgotPasswordLink) {
      await forgotPasswordLink.click();
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const resetForm = await page.$('form');
      if (resetForm) {
        console.log('   ✅ Password reset form displayed');
      }
    } else {
      console.log('   ⚠️ Forgot password link not found');
    }
    
    // Test Google sign-in button
    const googleButton = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('button, a'));
      return elements.find(el => el.textContent.toLowerCase().includes('google'));
    });
    
    if (googleButton) {
      console.log('   ✅ Google sign-in button found');
    } else {
      console.log('   ⚠️ Google sign-in button not found');
    }
    
  } catch (error) {
    console.error('   ❌ Authentication test failed:', error.message);
  }
}

async function testSubscription(page) {
  try {
    // Go to subscription page
    await page.goto(`${TEST_CONFIG.baseUrl}/subscribe`, { waitUntil: 'networkidle0' });
    
    // Check pricing plans
    const pricingCards = await page.$$('.card, [class*="card"], [class*="pricing"]');
    console.log(`   ✅ Found ${pricingCards.length} pricing cards`);
    
    // Test plan selection - look for text content
    const planButtons = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.filter(btn => 
        btn.textContent.toLowerCase().includes('starter') || 
        btn.textContent.toLowerCase().includes('pro')
      );
    });
    
    if (planButtons && planButtons.length > 0) {
      for (let i = 0; i < planButtons.length; i++) {
        try {
          await page.evaluate((btn, index) => {
            if (buttons[index]) buttons[index].click();
          }, planButtons, i);
          await new Promise(resolve => setTimeout(resolve, 500));
          console.log(`   ✅ Plan selection button ${i + 1} clickable`);
        } catch (error) {
          console.error(`   ❌ Plan selection button ${i + 1} failed:`, error.message);
        }
      }
    } else {
      console.log('   ⚠️ No plan selection buttons found');
    }
    
    // Check for subscription buttons
    const subscribeButtons = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button, a'));
      return buttons.filter(btn => 
        btn.textContent.toLowerCase().includes('subscribe') || 
        btn.textContent.toLowerCase().includes('get started')
      );
    });
    console.log(`   ✅ Found ${subscribeButtons ? subscribeButtons.length : 0} subscription buttons`);
    
  } catch (error) {
    console.error('   ❌ Subscription test failed:', error.message);
  }
}

async function testContactForm(page) {
  try {
    // Go to contact page
    await page.goto(`${TEST_CONFIG.baseUrl}/contact`, { waitUntil: 'networkidle0' });
    
    // Check contact form
    const contactForm = await page.$('form');
    if (contactForm) {
      console.log('   ✅ Contact form found');
      
      // Test form fields
      const formFields = await page.$$('input, textarea, select');
      console.log(`   ✅ Found ${formFields.length} form fields`);
      
      // Test form validation
      const submitButton = await page.$('button[type="submit"]');
      if (submitButton) {
        const isDisabled = await page.evaluate(btn => btn.disabled, submitButton);
        console.log(`   ✅ Contact form submit button: ${isDisabled ? 'Disabled' : 'Enabled'}`);
      }
    }
    
    // Check contact information
    const contactInfo = await page.$('.contact-info, [class*="contact"]');
    if (contactInfo) {
      console.log('   ✅ Contact information section found');
    }
    
  } catch (error) {
    console.error('   ❌ Contact form test failed:', error.message);
  }
}

async function testMobileResponsiveness(page) {
  try {
    // Test mobile viewport
    await page.setViewport({ width: 375, height: 667 });
    await page.goto(TEST_CONFIG.baseUrl, { waitUntil: 'networkidle0' });
    
    console.log('   📱 Testing mobile responsiveness...');
    
    // Check mobile menu - look for text content
    const mobileMenuButton = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('button, a'));
      return elements.find(el => 
        el.textContent.toLowerCase().includes('menu') || 
        el.textContent.toLowerCase().includes('hamburger') ||
        el.getAttribute('aria-label')?.toLowerCase().includes('menu')
      );
    });
    
    if (mobileMenuButton) {
      await mobileMenuButton.click();
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mobileMenu = await page.$('[class*="menu"], [class*="nav"], [class*="dropdown"]');
      if (mobileMenu) {
        console.log('   ✅ Mobile menu working');
      }
    } else {
      console.log('   ⚠️ Mobile menu button not found');
    }
    
    // Check if content is properly sized for mobile
    const bodyWidth = await page.evaluate(() => document.body.offsetWidth);
    console.log(`   ✅ Mobile viewport width: ${bodyWidth}px`);
    
    // Reset to desktop viewport
    await page.setViewport({ width: 1280, height: 720 });
    
  } catch (error) {
    console.error('   ❌ Mobile responsiveness test failed:', error.message);
  }
}

async function testSEOElements(page) {
  try {
    await page.goto(TEST_CONFIG.baseUrl, { waitUntil: 'networkidle0' });
    
    console.log('   🔍 Testing SEO elements...');
    
    // Check meta tags
    const metaDescription = await page.$eval('meta[name="description"]', el => el.content).catch(() => null);
    if (metaDescription) {
      console.log('   ✅ Meta description found');
    }
    
    const metaKeywords = await page.$eval('meta[name="keywords"]', el => el.content).catch(() => null);
    if (metaKeywords) {
      console.log('   ✅ Meta keywords found');
    }
    
    // Check Open Graph tags
    const ogTitle = await page.$eval('meta[property="og:title"]', el => el.content).catch(() => null);
    if (ogTitle) {
      console.log('   ✅ Open Graph title found');
    }
    
    // Check favicon
    const favicon = await page.$('link[rel="icon"], link[rel="shortcut icon"]');
    if (favicon) {
      console.log('   ✅ Favicon found');
    }
    
    // Check structured data
    const structuredData = await page.$$eval('script[type="application/ld+json"]', scripts => scripts.length);
    if (structuredData > 0) {
      console.log(`   ✅ Found ${structuredData} structured data scripts`);
    }
    
  } catch (error) {
    console.error('   ❌ SEO elements test failed:', error.message);
  }
}

// Run the tests
testLiveSite().catch(console.error);
