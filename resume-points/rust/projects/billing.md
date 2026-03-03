---
project_name: "Async Optimized Billing Service"
---

- Rewrote a blocking account view service architecture into fully asynchronous Rust utilizing the Tokio runtime combined with hyper, pushing raw non-blocking I/O limits directly down to OS network layers. [Rust, Tokio, Hyper, I/O]
- Implemented concurrent fault-isolation paradigms from scratch utilizing custom exponential backoff wrappers and crossbeam bounded channels to orchestrate retries over MongoDB boundaries, maintaining p95 180ms response rates under extreme traffic latency attacks. [Crossbeam, Retry, Fault Isolation]
