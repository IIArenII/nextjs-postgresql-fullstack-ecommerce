import { test, expect } from "@playwright/test";
import { loginAsBuyer, loginAsSeller } from "./helpers";

// ─────────────────────────────────────────────────────────────
// AUTH PAGE TESTS
// ─────────────────────────────────────────────────────────────

test("Auth page loads with login form by default", async ({ page }) => {
  await page.goto("/auth");

  // Should show Sign In heading
  await expect(page.getByRole("heading", { name: /welcome back/i })).toBeVisible();

  // Should have email and password fields
  await expect(page.locator('input[name="email"]')).toBeVisible();
  await expect(page.locator('input[name="password"]')).toBeVisible();
});

test("Toggling to register form shows extra fields", async ({ page }) => {
  await page.goto("/auth");

  // Click the toggle to switch to Register
  await page.click("text=New here? Create an account");

  // Registration form should now show name field and role radio options
  await expect(page.locator('input[name="name"]')).toBeVisible();
  await expect(page.locator('input[name="role"][value="buyer"]')).toBeVisible();
  await expect(page.locator('input[name="role"][value="seller"]')).toBeVisible();
});

test("Registering shows verification code screen (not a redirect)", async ({ page }) => {
  // Use a unique random email so this test can run repeatedly
  const email = `testuser_${Date.now()}@example.com`;

  await page.goto("/auth");
  await page.click("text=New here? Create an account");

  await page.fill('input[name="name"]', "Test User");
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', "TestPass123!");
  
  // Select "buyer" radio button
  await page.check('input[name="role"][value="buyer"]');

  await page.click('button:has-text("Create Account")');

  // Should NOT redirect to home — should show the 6-digit code input
  // Your code uses placeholder="000000"
  await expect(page.locator('input[placeholder="000000"]')).toBeVisible({ timeout: 10_000 });
  await expect(page).not.toHaveURL("/");
});

test("Login with wrong password shows an error", async ({ page }) => {
  await page.goto("/auth");

  await page.fill('input[name="email"]', process.env.TEST_BUYER_EMAIL!);
  await page.fill('input[name="password"]', "WrongPassword999");
  await page.click('button:has-text("Sign In")');

  // Should show an error message
  // Using a more flexible text match for "Invalid email or password"
  await expect(page.getByText(/invalid/i)).toBeVisible({ timeout: 10_000 });

  // Should remain on the auth page
  await expect(page).toHaveURL(/\/auth/);
});

test("Buyer can log in and sees home page", async ({ page }) => {
  await loginAsBuyer(page);

  // After login, should be on home page
  await expect(page).toHaveURL("/");

  // Should see the Bag button (buyers have shopping bag)
  // We use the aria-label because the "Bag" text is hidden on mobile screens
  await expect(page.getByLabel("Shopping bag")).toBeVisible();
});

test("Seller can log in and is redirected to seller dashboard", async ({ page }) => {
  await loginAsSeller(page);

  // Sellers are redirected to /seller
  await expect(page).toHaveURL("/seller");

  // Sellers should NOT see the bag button in the navbar
  await expect(page.locator('[aria-label="Shopping bag"]')).not.toBeVisible();
});

test("OAuth buttons are visible on auth page", async ({ page }) => {
  await page.goto("/auth");

  await expect(page.getByText("Continue with Google")).toBeVisible();
  await expect(page.getByText("Continue with GitHub")).toBeVisible();
});
