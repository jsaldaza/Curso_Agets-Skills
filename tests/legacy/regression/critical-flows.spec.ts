import { test, expect } from "@playwright/test";

test("critical route smoke: home, login, contact", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /launch customer-ready features/i })).toBeVisible();

  await page.goto("/login");
  await expect(page.getByRole("heading", { name: /login/i })).toBeVisible();

  await page.goto("/contact");
  await expect(page.getByRole("heading", { name: /contact sales/i })).toBeVisible();
});
