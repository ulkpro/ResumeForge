---
project_name: "Asynchronous Read-Optimized Billing View Service"
---

- Developed an asynchronous, read-heavy account view microservice using Node.js Promises and non-blocking request orchestration with request coalescing and tiered caching (In-memory → Redis); increased cache hit rate to 92% and reduced MongoDB load by 65%. [Node.js, TypeScript, Redis, MongoDB]
- Enforced latency and fault isolation using Opossum timeouts, retries, and circuit breakers with adaptive TTL tuning, sustaining p95 180ms under high-concurrency production traffic. [Opossum, Resiliency, Distributed Systems]
