---
title: "Static Export Still Wins for Small Sites"
excerpt: "Before reaching for a server, ask whether your site actually needs one. Most portfolios and marketing pages don't."
publishedAt: "2024-03-02"
tags: ["next.js", "performance"]
---

It's easy to default to server rendering because that's what the framework defaults emphasize. But a personal site with no user accounts, no real-time data, and content that changes a few times a month doesn't need a server at all.

Static export gives you a folder of HTML, CSS, and JS that can be served from literally anywhere — including free static hosts like GitHub Pages. There's no runtime to patch, no cold starts, and no surprise hosting bill.

The trade-off is real:

- No server actions.
- No request-time personalization.
- No on-demand revalidation.

For a portfolio, none of that is missing anything you need.
