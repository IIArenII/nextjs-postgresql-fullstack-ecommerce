import { test, expect } from "@playwright/test";

test("Home page shows featured products", async ({ page }) => {
  await page.goto("/");
  
  // Check for the Storefront logo in the header
  await expect(page.getByLabel("Storefront Home")).toBeVisible();

  // Should see some product cards
  // Your code uses "Details" as the button text
  const productCards = page.locator('text=Details');
  await expect(productCards.first()).toBeVisible();
});

test("Can navigate to all products page", async ({ page }) => {
  await page.goto("/");
  
  // Use the new aria-label for reliability on all device sizes
  const productsLink = page.getByLabel("Products").first();
  await expect(productsLink).toBeVisible();
  await productsLink.click();

  await expect(page).toHaveURL("/products");
  await expect(page.getByRole("heading", { name: /all products/i })).toBeVisible();
});

test("Product detail page shows correct information", async ({ page }) => {
  await page.goto("/products");

  // Find the first product card name link
  // We look for a link that is NOT the "Details" button
  const firstProductNameLocator = page.locator('a[href^="/products/"]').filter({ hasNotText: 'Details' }).first();
  const firstProductName = (await firstProductNameLocator.textContent())?.trim();
  
  console.log(`Testing product: "${firstProductName}"`);

  // Click the first product's "Details" button
  await page.locator('text=Details').first().click();

  // Check if we are on the product page
  await page.waitForURL(/\/products\/\d+/);
  
  // Should see the product name as the biggest heading (h1)
  // We use regex to handle any hidden characters or extra spaces
  await expect(page.locator('h1')).toContainText(firstProductName!);
  
  // Should see the Price section
  await expect(page.getByText(/Price/i)).toBeVisible();
});

test("Categories page allows filtering", async ({ page }) => {
  await page.goto("/categories");

  // Should see list of categories (AppShell title is "Categories")
  await expect(page.getByRole("heading", { level: 1, name: "Categories" })).toBeVisible();

  // Find a category link
  const firstCategoryLink = page.locator('a[href*="/categories/"]').first();
  // Grab the text from the bold part only
  const catName = (await firstCategoryLink.locator('.font-semibold').textContent())?.trim();
  
  console.log(`Testing category: ${catName}`);
  
  await firstCategoryLink.click();

  // URL should contain /categories/
  await page.waitForURL(/\/categories\/.+/);
  
  // Page should show the category name as the main H1 heading
  await expect(page.getByRole("heading", { level: 1, name: catName!, exact: false })).toBeVisible({ timeout: 10_000 });
});

test("Search functionality works", async ({ page, isMobile }) => {
  // Skip this test on mobile as requested by user
  test.skip(isMobile, "Search test is only for desktop projects");

  await page.goto("/products");

  // Click the search button/icon first to ensure it's focused and expanded
  const searchBtn = page.getByLabel("Search");
  await searchBtn.click();

  // Now fill the input (wait for it to be visible after click)
  const searchInput = page.getByPlaceholder(/Search/i);
  await expect(searchInput).toBeVisible();
  await searchInput.fill("NonExistentProductXYZ123");
  await searchInput.press("Enter");

  // Should see the 'no products found' UI - wait longer for the filter to apply
  await expect(page.getByText(/No products found/i)).toBeVisible({ timeout: 10_000 });
  await expect(page.getByText(/We couldn't find anything matching/i)).toBeVisible();
  
  const clearLink = page.getByRole('link', { name: /Clear search/i });
  await expect(clearLink).toBeVisible();
  await clearLink.click();

  await expect(page).toHaveURL("/products");
  await expect(page.getByRole("heading", { name: /all products/i })).toBeVisible();
});
