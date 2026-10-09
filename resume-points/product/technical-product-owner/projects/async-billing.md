---
project_name: "Asynchronous Read-Optimized Billing View Service"
---

- Developed an asynchronous, read-heavy account view microservice using Guava ListenableFuture–based non-blocking request orchestration with request coalescing and tiered caching (Caffeine → Redis); increased cache hit rate to 92% and reduced MongoDB load by 65%. [Java, Guava, Redis, Caffeine, MongoDB]
- Enforced latency and fault isolation using Resilience4j timeouts, retries, and circuit breakers with adaptive TTL tuning, sustaining p95 180ms under high-concurrency production traffic. [Resilience4j, Distributed Systems]
