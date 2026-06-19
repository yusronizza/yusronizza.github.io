---
title: "Writing Tests You Actually Trust"
excerpt: "A test suite that's green but lying to you is worse than no test suite at all."
publishedAt: "2024-05-20"
tags: ["testing", "engineering"]
---

I've worked on codebases with thousands of passing tests that still shipped regressions weekly. The problem wasn't coverage — it was that the tests mocked away the exact thing that broke in production.

A rule that's served me well: **test through the same boundary your users hit**. If your API contract is the boundary, test the API contract — not the internal function that happens to back it today.

Mocking is a tool for isolating slow or non-deterministic dependencies, not for avoiding the discomfort of setting up a realistic test environment. If a mock is hiding a real integration risk, it's the wrong mock.
