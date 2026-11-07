import { test, expect, type Page } from "@playwright/test";

function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  // Report failed requests by URL (the console only says "Failed to load resource").
  page.on("response", (r) => r.status() >= 400 && errors.push(`${r.status()} ${r.url()}`));
  page.on("console", (m) => m.type() === "error" && !m.text().startsWith("Failed to load resource") && errors.push(m.text()));
  return errors;
}

const PAGES = ["/", "/about", "/cv", "/projects", "/blog", "/contact"];

for (const lang of ["", "/ja", "/id"]) {
  for (const path of PAGES) {
    const url = lang + (path === "/" && lang ? "" : path);
    test(`${url || "/"} renders in its language`, async ({ page }) => {
      const errors = collectErrors(page);
      const res = await page.goto(url || "/");
      expect(res?.status()).toBe(200);
      await expect(page.locator("html")).toHaveAttribute("lang", lang ? lang.slice(1) : "en");
      await expect(page.locator("h1").first()).toBeVisible();
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
      expect(overflow).toBe(false);
      expect(errors).toEqual([]);
    });
  }
}

test("pages declare canonical and hreflang alternates", async ({ page }) => {
  await page.goto("/ja/blog");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/ja\/blog$/);
  for (const [lang, re] of [["en", /\/blog$/], ["ja", /\/ja\/blog$/], ["id", /\/id\/blog$/], ["x-default", /\/blog$/]] as const) {
    await expect(page.locator(`link[rel="alternate"][hreflang="${lang}"]`)).toHaveAttribute("href", re);
  }
});

test("the language switcher keeps the current page", async ({ page }) => {
  await page.goto("/projects");
  await page.getByRole("navigation", { name: "Language" }).first().getByRole("link", { name: "日本語" }).click();
  await expect(page).toHaveURL(/\/ja\/projects$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "ja");
  await page.getByRole("navigation", { name: "言語" }).first().getByRole("link", { name: "EN" }).click();
  await expect(page).toHaveURL(/\/projects$/);
});

test("a blog post opens from the list", async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto("/blog");
  const first = page.locator("article h3 a, h3 a").first();
  const title = (await first.textContent())?.trim() ?? "";
  await first.click();
  await expect(page).toHaveURL(/\/blog\/[^/]+$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
  expect(errors).toEqual([]);
});

test("unknown pages return 404, /en redirects", async ({ request }) => {
  expect((await request.get("/definitely-not-a-page")).status()).toBe(404);
  expect((await request.get("/ja/definitely-not-a-page")).status()).toBe(404);
  expect((await request.get("/blog/definitely-not-a-post")).status()).toBe(404);
  const r = await request.get("/en/blog", { maxRedirects: 0 });
  expect(r.status()).toBe(308);
  expect(r.headers()["location"]).toMatch(/\/blog$/);
});

test("sitemap and feeds are valid XML", async ({ request }) => {
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toContain("<urlset");
  expect(sitemap).toContain('hreflang="ja"');
  for (const feed of ["/feed.xml", "/ja/feed.xml", "/id/feed.xml"]) {
    const res = await request.get(feed);
    expect(res.headers()["content-type"]).toContain("application/rss+xml");
    expect(await res.text()).toContain("<rss");
  }
});

test("the contact form shows the API's validation errors", async ({ page }) => {
  await page.goto("/contact");
  await page.getByLabel("Email").fill("not-an-email");
  await page.getByRole("button", { name: "Send message" }).click();
  // A field error from validation, or the rate-limit notice if this visitor
  // has already used up the API's contact allowance (5/hour).
  await expect(page.locator('[aria-invalid="true"], [role="alert"]').first()).toBeVisible();
});

test("the contact route rejects cross-site posts", async ({ request }) => {
  const res = await request.post("/api/contact", { headers: { Origin: "https://evil.example", "Content-Type": "application/json" }, data: {} });
  expect(res.status()).toBe(403);
});
