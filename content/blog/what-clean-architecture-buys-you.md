---
title: "What Clean Architecture Actually Buys You"
excerpt: "Clean architecture isn't about folder names — it's about which decisions you can change your mind about later without a rewrite."
publishedAt: "2024-01-12"
tags: ["architecture", "engineering"]
---

Most arguments about "clean architecture" get stuck on folder structure. Should it be `controllers/` and `services/`, or `domain/` and `infrastructure/`? That's the least interesting part of the conversation.

The actual payoff is **reversibility**. A well-separated codebase lets you swap a database, replace a UI framework, or change a third-party API without rewriting your business rules. If you can't do that, the names on your folders were decoration.

In practice, the cheapest version of this for a small app is just:

- Keep data access and domain types in one place.
- Keep presentation in another.
- Keep routing as thin glue between the two.

You don't need ports and adapters for a five-page portfolio site — you need a boundary you can actually maintain.

> If I had to switch from PostgreSQL to a flat file tomorrow, how many files would I touch?

If the answer is "one," the boundary is doing its job.
