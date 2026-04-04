---
project_name: "Event-Driven Order Platform"
role: "fullstack-express-react"
order: "1"
---

- Built a microservices platform in Node.js and React with dockerized services, domain-driven routing, and containerized MongoDB instances.
- Designed a Saga-based order workflow with Kafka, outbox pattern, and DLQ handling inside Node.js workers.
- Implemented idempotent checkout using Redis SETNX deduplication and locking to safely handle retries, duplicate requests.
- Added Prometheus metrics and configured Grafana dashboards across Express services to continuously monitor endpoint latency, event queue lag, and error rates.
- Load-tested the checkout workflow with k6 at 300 concurrent users / 120 RPS, optimizing Node.js clustered threads to achieve p95 under 350ms with zero duplicate orders.
