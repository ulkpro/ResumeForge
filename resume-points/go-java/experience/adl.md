---
company: "Axiata Digital Labs"
location: "Colombo, Sri Lanka"
designation: "Software Engineer"
startDate: "Jan 2019"
endDate: "Jan 2023"
---

- Built and owned an invoice lifecycle state machine microservice in SpringBoot(Java/Kotlin) using Saga orchestration and transactional outbox (PostgreSQL → Kafka), ensuring exactly-once billing and deterministic replay; eliminated duplicate invoice postings (0 duplicates/month) and cut billing incident recovery time by 65% across 100K+ invoices/month. [Java, Spring Boot, Kafka, Saga]
- Developed and owned a payment ingestion microservice to process 1GB+ usage feeds via presigned, checksum-verified S3 multipart uploads (SSE-KMS) and an async pipeline that bulk-loads data using PostgreSQL COPY with idempotent upserts, sustaining >1K records/sec and delivering 40% faster end-to-end billing-cycle processing. [Java, PostgreSQL, AWS S3]
- Built a read-heavy billing/account view service using tiered caching (Caffeine → Redis) with request coalescing and adaptive TTLs, shielding downstream systems; increased cache hit rate to 92%, reduced MongoDB calls by 65%, and maintained p95 180ms / p99 420ms using Resilience4j timeouts, retries, and circuit breakers. [Java, Redis, MongoDB, Resilience4j]
- Built an event-driven read model by consuming Kafka change events to materialize subscriber overviews in DynamoDB and push-invalidate Redis for dashboards aggregating slow endpoints; reduced >60s-stale reads from 18% → 3%, lowered median page load time by 25%. [Kafka, DynamoDB, Redis]
