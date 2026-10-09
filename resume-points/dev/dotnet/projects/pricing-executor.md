---
project_name: "Exactly-Once Pricing Rule Executor"
role: "dotnet"
order: "99"
---

- Developed an idempotent pricing-rule execution layer using Redis deduplication keys, versioned event IDs, and atomic "check-and-set" guards to ensure exactly-once processing across retries, duplicate messages, and out-of-order arrivals. [Redis, Idempotency, Event-Driven]
- Added distributed concurrency control with StackExchange.Redis and RedLock.net locks plus TTL-based key lifecycle (lock + dedup + result caching). [RedLock, Concurrency, Distributed Locks]
- Enabled safe parallel execution at scale; sustained 100K/day payment computations at <200ms p99, cutting cross-service mispricing by 70%+ and preventing $500K annual revenue leakage.
