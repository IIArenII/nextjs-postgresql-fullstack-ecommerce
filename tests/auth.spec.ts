import { test, expect } from "@playwright/test";

test("Full Auth Flow: Register and then Redirect", async ({ page }) => {
  const randomEmail = `user_${Math.random().toString(36).substring(7)}@test.com`;

  await page.goto("/auth");

  // Toggle to Register
  await page.click("text=New here? Create an account");

  // Fill form
  await page.fill('input[name="name"]', "John Doe");
  await page.fill('input[name="email"]', randomEmail);
  await page.fill('input[name="password"]', "StrongPassword123!");

  // Submit
  await page.click('button:has-text("Create Account")');

  // Wait for redirect to home page
  await expect(page).toHaveURL("/");
});
