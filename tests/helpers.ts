import { Page } from "@playwright/test";

/**
 * Logs in as a Buyer using the credentials from .env.test
 * Waits for the redirect to the home page before returning.
 */
export async function loginAsBuyer(page: Page) {
  await loginWith(page, {
    email: process.env.TEST_BUYER_EMAIL!,
    password: process.env.TEST_BUYER_PASSWORD!,
  });
}

/**
 * Logs in as a Seller using the credentials from .env.test
 * Waits for the redirect to the home page before returning.
 */
export async function loginAsSeller(page: Page) {
  await loginWith(page, {
    email: process.env.TEST_SELLER_EMAIL!,
    password: process.env.TEST_SELLER_PASSWORD!,
  });
}

/**
 * Core login helper — fills in the auth form and waits for home page.
 */
async function loginWith(page: Page, { email, password }: { email: string; password: string }) {
  await page.goto("/auth");

  // Make sure we're on the login form (not register)
  // Check for the "Sign In" button specifically
  const signInButton = page.locator('button:has-text("Sign In")');
  const toggleToSignIn = page.locator('text=Have an account? Sign in instead');

  if (await toggleToSignIn.isVisible()) {
    await toggleToSignIn.click();
  }

  await page.waitForSelector('input[name="email"]');
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  
  // Click the specific Sign In button
  await page.click('button:has-text("Sign In")');

  // Wait until we land on the home page or dashboard
  await page.waitForURL(url => url.pathname === "/" || url.pathname === "/seller", { timeout: 15_000 });
}

/**
 * Logs out the current user.
 */
export async function logout(page: Page) {
  await page.click("text=Logout");
  await page.waitForURL("/", { timeout: 5_000 });
}
