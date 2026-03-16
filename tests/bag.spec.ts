import { test, expect } from "@playwright/test";
import { loginAsBuyer } from "./helpers";

test.describe("Shopping Bag Functionality", () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to products and wait for it to be ready
    await page.goto("/products");
    await expect(page.getByRole('heading', { name: /all products/i })).toBeVisible();
  });

  test("Guest user is prompted to login when adding to bag", async ({ page }) => {
    // 1. Go to first product
    await page.locator('text=Details').first().click();
    await page.waitForURL(/\/products\/\d+/);

    // 2. Click Add to bag as Guest
    await page.getByRole('button', { name: /Add to Bag/i }).click();

    // 3. Verify Login Modal appears (per your code logic)
    await expect(page.locator('text=Sign in to continue')).toBeVisible();
    await expect(page.locator('text=You need to be logged in to purchase items')).toBeVisible();
  });

  test("Logged in buyer can add items to bag and update quantity", async ({ page }) => {
    // 1. Login first
    await loginAsBuyer(page);
    await page.goto("/products");
    
    // Ensure we are TRULY logged in by checking navbar
    // We use the aria-label we just added for mobile robustness
    await expect(page.getByLabel("Account Settings")).toBeVisible();

    // 2. Go to first product and add to bag
    await page.locator('text=Details').first().click();
    await page.waitForURL(/\/products\/\d+/);
    
    const productName = (await page.locator('h1').textContent())?.trim();
    
    // Click Add to Bag
    const addButton = page.getByRole('button', { name: /Add to Bag/i });
    await addButton.click();

    // 3. Wait for the button to show success! 
    // This proves the component state updated.
    await expect(page.getByText(/Added to Bag!/i)).toBeVisible();

    // 4. Verify badge updates to '1' in the header
    const bagButton = page.getByLabel("Shopping bag");
    await expect(bagButton.locator('span').filter({ hasText: /^1$/ })).toBeVisible();

    // 5. Go to bag page and verify item is there
    await bagButton.click();
    await page.waitForURL("/bag");
    await expect(page.getByText(productName!, { exact: false })).toBeVisible();

    // 6. Test quantity updates and removal
    await page.getByLabel("Increase quantity").click();
    await expect(page.locator('.lg\\:col-span-2 span').filter({ hasText: /^2$/ })).toBeVisible();

    await page.getByLabel("Remove item").click();
    await expect(page.getByText(/Your bag is empty/i)).toBeVisible();
  });

  test("Full purchase flow for a logged in buyer", async ({ page }) => {
    // 1. Login 
    await loginAsBuyer(page);
    
    // 2. Direct approach: add a product
    await page.goto("/products");
    
    // Wait for product cards to load
    await expect(page.locator('text=Details').first()).toBeVisible();
    await page.locator('text=Details').first().click();
    
    // IMPORTANT: Wait for navigation to finish!
    await page.waitForURL(/\/products\/\d+/);

    // 3. Add to bag
    const addButton = page.getByRole('button', { name: /Add to Bag/i });
    await expect(addButton).toBeVisible();
    await addButton.click();
    await expect(page.getByText(/Added to Bag!/i)).toBeVisible();

    // 4. Go to bag and checkout
    await page.goto("/bag");
    await page.getByRole('button', { name: /Confirm & Pay Now/i }).click();

    // 5. Verify Success Screen
    await expect(page.getByText(/Thank you for shopping!/i)).toBeVisible({ timeout: 15_000 });
    
    // 6. Cleanup: Go to orders
    await page.getByRole('link', { name: /Track My Orders/i }).click();
    await page.waitForURL("/orders");
    await expect(page.getByRole("heading", { level: 1, name: "My Orders" })).toBeVisible();
  });
});
