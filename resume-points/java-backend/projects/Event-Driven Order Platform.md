---
project_name: "Event-Driven Order Platform"
---

- Built a microservices platform in Go with dockerized services, service-owned databases, and gRPC with Proto Buffers
- Designed a Saga-based order workflow with Kafka, outbox pattern, and DLQ handling for reliable event-driven processing.
- Implemented idempotent checkout and payment using Redis deduplication and locking to handle safe retries and duplicates.
- Added Prometheus metrics, Grafana dashboards across services for latency, consumer lag, and workflow failures.
- Load-tested checkout workflow with k6 at 300 concurrent users / 120 RPS, achieving p95 under 350ms and zero duplicates.
