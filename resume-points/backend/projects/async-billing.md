---
project_name: "Async Dashboard Service"
role: "backend"
order: "99"
---

- Developed an async, read-heavy dashboard microservice using Guava ListenableFuture based request orchestration. [Java, Guava, Redis]
- Implemented request coalescing and tiered caching (Caffeine → Redis); increased cache hit rate to 92% and reduced MongoDB load by 65%. [Resilience4j, Distributed Systems, Caffeine, Redis]
- Enforced latency and fault isolation using Resilience4j timeouts, retries, and circuit breakers with adaptive TTL tuning, sustaining p95 180ms under high-concurrency production traffic. [Resilience4j]
