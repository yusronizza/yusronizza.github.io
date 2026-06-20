---
title: "Clean Architecture on Bare Metal: What Survives Contact With Hardware"
excerpt: "Most clean-architecture advice assumes you have a heap, an OS, and a test runner. Embedded systems have none of those by default — here's what's actually worth keeping."
publishedAt: "2026-05-20"
tags: ["embedded-systems", "architecture", "firmware"]
---

Most clean-architecture writing is implicitly written for a web backend: swap PostgreSQL for MongoDB, swap REST for gRPC, the domain layer doesn't care. Try to apply that advice literally on a Cortex-M with 64KB of RAM and no operating system, and it falls apart fast — you don't have a database to swap, you have a register map, an interrupt vector table, and a memory budget measured in kilobytes, not gigabytes.

That doesn't mean the underlying idea is wrong. It means the boundary has to move.

**The boundary that actually matters in firmware**

In an embedded project, the volatile thing isn't your data store — it's the hardware itself. The MCU you taped out for rev A is not guaranteed to be the MCU in rev C once a memory shortage or an EOL notice forces a part swap. The sensor you're reading over I2C today might be SPI next year because the vendor discontinued the part. The one thing that changes more often than people plan for in embedded work is the silicon underneath the firmware.

So the boundary that earns its keep in firmware is the **hardware abstraction layer (HAL)**: a thin interface between your control logic and the registers, timers, and peripherals it depends on. Control logic — state machines, filters, protocol parsing, business rules — should know nothing about which pin maps to which timer channel. It should only know it can call `motor.setSpeed()` or `sensor.read()` and get a value back.

**Where textbook clean architecture needs adapting**

A few constraints that don't show up in backend tutorials but are non-negotiable on bare metal:

- **No heap, often.** Dependency injection patterns built around allocating objects at runtime don't translate cleanly to a system that allocates everything statically at boot. Compile-time composition — selecting the concrete HAL implementation at build time — replaces runtime DI.
- **ISRs are not a place for abstraction.** An interrupt handler needs to do the minimum possible — flag an event, copy a register, return — and hand the actual decision-making to the main loop or a task. Clean boundaries still apply; they just live outside the ISR, not inside it.
- **Timing is part of the contract.** A `sensor.read()` call that's instant on a host machine but takes two milliseconds over a real bus is not a transparent abstraction if your control loop runs at 1kHz. The interface has to expose timing behavior, not hide it.

**The payoff is the same as everywhere else: testability**

The actual reward for getting this boundary right is being able to run your control logic on a laptop, in a unit test, with a fake HAL standing in for real registers — no hardware in the loop, no flashing a board for every change. That's the same payoff clean architecture promises anywhere else; it just requires a different boundary to get there.

> If swapping your MCU vendor means touching your control logic, the boundary was in the wrong place.
