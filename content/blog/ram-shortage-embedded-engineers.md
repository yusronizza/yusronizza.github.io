---
title: "The 2026 RAM Shortage Isn't a PC Problem — It's an Embedded Problem"
excerpt: "DRAM and NAND prices haven't moved like this in over a decade, and the reason has nothing to do with laptops. Here's what the AI memory crunch actually means for anyone shipping hardware."
publishedAt: "2026-06-08"
tags: ["hardware", "supply-chain", "embedded-systems"]
---

If you've priced out DRAM recently, you already know something broke. TrendForce pegged conventional DRAM contract prices up roughly 55–60% quarter-over-quarter in Q1 2026 alone, on top of DDR5 spot prices that had already quadrupled since September 2025. Year-over-year, DRAM pricing is up somewhere north of 170%, per [TechRadar's breakdown of the crunch](https://www.techradar.com/pro/why-is-ram-so-expensive-right-now-its-more-complicated-than-you-think). This isn't a normal cyclical dip in chip supply — it's a structural reallocation, and [it isn't finishing soon](https://www.cnbc.com/2026/01/10/micron-ai-memory-shortage-hbm-nvidia-samsung.html).

**Why this happened**

Samsung, SK Hynix, and Micron control more than 95% of global DRAM output between them, and all three have spent the last two years shifting capacity toward high-bandwidth memory (HBM) for AI accelerators. HBM eats roughly four times the wafer area per gigabyte that standard DRAM does, so every wafer redirected to an AI accelerator is a wafer that isn't making the DDR4, DDR5, and NAND flash that embedded products have always relied on. AI-related demand is on track to consume around a fifth of global wafer capacity this year, and none of the big three are walking that back while HBM contracts keep paying better margins than commodity memory ever has — a dynamic [Octopart's supply-chain desk has been tracking closely](https://octopart.com/pulse/p/how-ai-broke-memory-market).

**Why this isn't just a laptop story**

Coverage of the shortage has mostly focused on PCs and phones — Xiaomi is reportedly budgeting for a roughly 25% increase in DRAM cost per phone for its 2026 lineup, and PC prices are expected up 15–20% in the same window. But memory typically makes up 15–20% of total BOM cost on a mid-range embedded device, and unlike a phone refresh, embedded products are often locked into a qualified design for years. You can't always swap in a different DRAM part without re-qualifying the whole board, and for products already in a long production run, that's not a minor inconvenience — it's a redesign nobody budgeted for, a problem [embedded supply-chain teams are now writing survival guides about](https://www.ineltek.co.uk/post/2026-memory-squeeze-dram-nand-survival-guide).

The practical advice circulating in procurement and embedded engineering circles right now is fairly consistent:

- Lock in long-term supply agreements now rather than buying spot.
- Design new boards with second-source memory parts in mind from the start, not as an afterthought.
- Audit current BOMs for single-sourced DRAM/NAND before the next production run, not after a quote comes back three times higher.

**When does it end**

Analyst consensus is bleak on timing: no meaningful relief expected within 2026, with the earliest realistic window for normalization in late 2027 as new fab capacity comes online, and some forecasts pushing that into 2028. If you're scoping a product with a multi-year production life, that's not a footnote — it's a line item in the BOM you should be planning around today.
