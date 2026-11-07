import { test, expect } from "@playwright/test";

test("the mobile menu opens, navigates, and closes with Escape", async ({ page }) => {
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Toggle navigation menu" });
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.click();
  await page.locator("#mobile-nav").getByRole("link", { name: "Blog" }).click();
  await expect(page).toHaveURL(/\/blog$/);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  expect(overflow).toBe(false);
});
