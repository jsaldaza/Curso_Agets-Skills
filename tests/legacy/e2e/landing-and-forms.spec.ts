import { expect, test } from "@playwright/test";

test("hero CTA navigates to login", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /get started/i }).click();
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole("heading", { name: /login/i })).toBeVisible();
});

test("login shows validation error when empty", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: /sign in/i }).click();
  await expect(page.getByText(/email is required/i)).toBeVisible();
});

test("contact submits successfully with valid data", async ({ page }) => {
  await page.goto("/contact");
  await page.getByLabel("Name").fill("Morgan");
  await page.getByLabel("Email").fill("morgan@example.com");
  await page.getByLabel("Message").fill("I want to know more about enterprise support.");
  await page.getByRole("button", { name: /send message/i }).click();
  await expect(page.getByRole("status")).toContainText(/message received|message sent/i);
});
