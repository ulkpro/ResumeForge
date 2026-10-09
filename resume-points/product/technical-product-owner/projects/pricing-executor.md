---
project_name: "Exactly-Once Pricing Rule Executor"
---

- Developed an idempotent pricing-rule execution layer using Redis deduplication keys, versioned event IDs, and atomic "check-and-set" guards to ensure exactly-once processing across retries, duplicate messages, and out-of-order arrivals. [Redis, Idempotency, Event-Driven]
- Added distributed concurrency control with Redisson locks plus TTL-based key lifecycle (lock + dedup + result caching), enabling safe parallel execution at scale; sustained 100K/day payment computations at <200ms p99, cutting cross-service mispricing by 70%+ and preventing $500K annual revenue leakage. [Redisson, Concurrency, Distributed Locks]
