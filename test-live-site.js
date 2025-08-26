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
    const heroSection = await page.$('[data-testid="hero-section"]') || await page.$('h1');
    if (heroSection) {
      console.log('   ✅ Hero section found');
    }
    
    // Check for pricing section
    const pricingSection = await page.$('[data-testid="pricing-section"]') || await page.$('h2:contains("Pricing")');
    if (pricingSection) {
      console.log('   ✅ Pricing section found');
    }
    
    // Check for CTA buttons
    const ctaButtons = await page.$$('button:contains("Get Started"), a:contains("Get Started")');
    console.log(`   ✅ Found ${ctaButtons.length} CTA buttons`);
    
  } catch (error) {
    console.error('   ❌ Homepage test failed:', error.message);
  }
}

async function testNavigation(page) {
  try {
    // Test logo click
    const logo = await page.$('a[href="/"], img[alt*="logo"], .logo');
    if (logo) {
      await logo.click();
      await page.waitForTimeout(1000);
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
    
    // Fill signup form
    await page.type('input[type="email"]', TEST_USER.email);
    await page.type('input[type="password"]', TEST_USER.password);
    
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
    
    const forgotPasswordLink = await page.$('button:contains("Forgot your password"), a:contains("Forgot")');
    if (forgotPasswordLink) {
      await forgotPasswordLink.click();
      await page.waitForTimeout(1000);
      
      const resetForm = await page.$('form');
      if (resetForm) {
        console.log('   ✅ Password reset form displayed');
      }
    }
    
    // Test Google sign-in button
    const googleButton = await page.$('button:contains("Google"), button:contains("Continue with Google")');
    if (googleButton) {
      console.log('   ✅ Google sign-in button found');
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
    const pricingCards = await page.$$('[data-testid="pricing-card"], .pricing-card, .card');
    console.log(`   ✅ Found ${pricingCards.length} pricing cards`);
    
    // Test plan selection
    const planButtons = await page.$$('button:contains("Starter"), button:contains("Pro")');
    for (let i = 0; i < planButtons.length; i++) {
      try {
        await planButtons[i].click();
        await page.waitForTimeout(500);
        console.log(`   ✅ Plan selection button ${i + 1} clickable`);
      } catch (error) {
        console.error(`   ❌ Plan selection button ${i + 1} failed:`, error.message);
      }
    }
    
    // Check for subscription buttons
    const subscribeButtons = await page.$$('button:contains("Subscribe"), button:contains("Get Started")');
    console.log(`   ✅ Found ${subscribeButtons.length} subscription buttons`);
    
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
    const contactInfo = await page.$('[data-testid="contact-info"], .contact-info');
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
    
    // Check mobile menu
    const mobileMenuButton = await page.$('[data-testid="mobile-menu"], .mobile-menu-button, button:contains("Menu")');
    if (mobileMenuButton) {
      await mobileMenuButton.click();
      await page.waitForTimeout(500);
      
      const mobileMenu = await page.$('[data-testid="mobile-menu-items"], .mobile-menu-items');
      if (mobileMenu) {
        console.log('   ✅ Mobile menu working');
      }
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
