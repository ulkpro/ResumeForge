---
project_name: "Event-Driven Order Platform"
role: "java-backend"
order: "99"
---

- Built a microservices platform in Java with dockerized services, service-owned databases, and gRPC with Proto Buffers
- Designed a Saga-based order workflow with Kafka, outbox pattern, and DLQ handling for event-driven processing.
- Implemented idempotent checkout and payment using Redis deduplication and locking to handle retries and duplicates.
- Added Prometheus metrics, Grafana dashboards across services for latency, consumer lag, and workflow failures.
- Load-tested checkout workflow with k6 at 300 concurrent users / 120 RPS, achieving p95 under 350ms and zero duplicates.
