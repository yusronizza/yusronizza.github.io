---
title: "The Dashboard Nobody Checks"
excerpt: "Observability tooling fails quietly when it's built for the wrong audience."
publishedAt: "2024-08-09"
tags: ["observability", "engineering"]
---

Every team I've joined had at least one beautifully built dashboard that nobody opened during an incident. The charts were correct. The problem was they answered questions nobody was asking under pressure.

During an outage, people want one thing fast: is this us, is this them, and where do I look next. A dashboard that requires interpretation at 2 a.m. is a dashboard that gets ignored in favor of grepping logs.

Now I design dashboards backwards from the incident review: *what question did we wish we could answer in the first five minutes?* That's the only panel that earns a spot above the fold.
