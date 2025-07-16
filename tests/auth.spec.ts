// tests/auth.spec.ts

import { test, expect } from '@playwright/test';

// We group related tests together with `test.describe`
test.describe('Authentication and Onboarding', () => {

  // This is our first test case.
  test('should allow a new user to sign up and create a review request', async ({ page }) => {
    
    // --- Step 1: Sign Up ---

    // Tell the robot to go to the homepage.
    await page.goto('/');

    // Generate a unique email for each test run to avoid conflicts.
    const uniqueEmail = `testuser_${Date.now()}@example.com`;
    const password = 'password123';
    const businessName = 'Robot Test Cafe';

    // Find the email input field by its placeholder text and type in the email.
    await page.getByPlaceholder('you@example.com').fill(uniqueEmail);

    // Find the password input field and type in the password.
    await page.getByPlaceholder('••••••••').fill(password);

    // Find the "Continue" button by its role and text, and click it.
    await page.getByRole('button', { name: 'Continue' }).click();

    // --- Step 2: Verify Successful Login and Create a Request ---

    // After login, the robot should be on the dashboard.
    // We'll wait for the main heading "ReviewPilot" to be visible to confirm.
    await expect(page.getByRole('heading', { name: 'ReviewPilot' })).toBeVisible();

    // Now, find the input for the business name and fill it out.
    await page.getByPlaceholder("Enter Business Name (e.g., 'Acme Coffee Shop')").fill(businessName);

    // Find the "Create" button and click it.
    await page.getByRole('button', { name: 'Create' }).click();

    // --- Step 3: Assert the Result ---

    // This is the most important part of the test.
    // We expect to see the name of the business we just created somewhere on the page.
    // If it's visible, the test passes. If not, it fails.
    await expect(page.getByText(businessName)).toBeVisible();

    console.log(`\n✅ Test passed: Successfully signed up as ${uniqueEmail} and created '${businessName}'.`);
  });

});

