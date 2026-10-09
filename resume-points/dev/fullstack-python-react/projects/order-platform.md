---
project_name: "Event-Driven Order Platform"
role: "fullstack-python-react"
order: "1"
---

- Built a microservices platform using FastAPI and React with dockerized services, PostgreSQL service-owned databases, and gRPC internal communication.
- Designed a Saga-based order workflow employing Kafka, outbox pattern, and DLQ handling inside Python consumers for reliable event-driven processing.
- Implemented idempotent checkout using Redis deduplication and distributed locking in Python to safely handle retries and prevent payment duplicates.
- Exposed Prometheus metrics via FastAPI middleware and visualized system health in Grafana for endpoint latency, consumer lag, and database pool utilization.
- Load-tested checkout workflow with k6 at 300 concurrent users / 120 RPS, tuning Uvicorn workers to achieve p95 under 350ms and zero duplicates.
