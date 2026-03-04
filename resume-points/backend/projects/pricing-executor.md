---
project_name: "Exactly-Once Pricing Rule Executor"
role: "backend"
order: "99"
---

- Developed an idempotent pricing-rule execution layer using Redis deduplication keys, versioned event IDs, and atomic "check-and-set" guards to ensure exactly-once processing across retries, duplicate messages, and out-of-order arrivals. [Redis, Idempotency, Event-Driven]
- Added distributed concurrency control with Redisson locks, TTL-based key lifecycle (lock + dedup + result caching; sustained 100K/day payment computations preventing $500K annual revenue leakage. [Redisson, Concurrency, Distributed Locks]
