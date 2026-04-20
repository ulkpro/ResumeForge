---
project_name: "Asynchronous Read-Optimized Billing View Service"
---

- Developed an asynchronous, read-heavy account view microservice using C# Task–based non-blocking request orchestration with request coalescing and tiered caching (MemoryCache → Redis); increased cache hit rate to 92% and reduced MongoDB load by 65%. [C#, TPL, Redis, MemoryCache, MongoDB]
- Enforced latency and fault isolation using Polly timeouts, retries, and circuit breakers with adaptive TTL tuning, sustaining p95 180ms under high-concurrency production traffic. [Polly, Distributed Systems]
