---
project_name: "Distributed Pricing Rule Executor"
role: "fullstack-python-react"
order: "3"
---

- Architected a distributed pricing-rule execution layer using FastAPI and React, bridging asynchronous web dashboards with synchronous heavy computational tasks.
- Developed an idempotent pipeline in Python utilizing Redis versioned event IDs and atomic check-and-set guards to ensure exactly-once processing across out-of-order arrivals.
- Managed complex distributed concurrency control using Redis-py distributed locks with strict TTL lifecycles to prevent race conditions during parallel price mutations.
- Optimized synchronous Python blocking calls by utilizing asyncio paired with ThreadPoolExecutors, unblocking the main event loop and raising API throughput by 400%.
- Enabled safe parallel execution at scale; sustained 100K/day payment computations at <200ms p99, preventing $500K annual revenue leakage via race conditions.
