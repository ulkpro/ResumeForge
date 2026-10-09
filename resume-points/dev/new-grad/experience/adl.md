---
company: "Axiata Digital Labs"
location: "Colombo, Sri Lanka"
designation: "Software Engineer"
startDate: "Jan 2019"
endDate: "Jan 2023"
---

- Built and owned an invoice lifecycle state machine microservice in SpringBoot(Java/Kotlin) using Saga orchestration and transactional outbox (PostgreSQL → Kafka), ensuring exactly-once billing and deterministic replay; eliminated duplicate invoice postings (0 duplicates/month) and cut billing incident recovery time by 65% across 100K+ invoices/month. [Java, Spring Boot, Kafka, Saga]
- Developed and owned a payment ingestion microservice to process 1GB+ usage feeds via presigned, checksum-verified S3 multipart uploads (SSE-KMS) and an async pipeline that bulk-loads data using PostgreSQL COPY with idempotent upserts, sustaining >1K records/sec and delivering 40% faster end-to-end billing-cycle processing. [AWS S3, PostgreSQL, Async Pipeline]
- Implemented idempotent pricing rule execution using Redis deduplication caches, Redisson distributed locks, and versioned event keys, with transactional boundaries, retries, and automated rollback; processed 100K/day payment computations at <200ms p99 latency, reducing cross-service mispricing by 70%+ and preventing $500K annual revenue leakage. [Redis, Distributed Locks]
- Built and owned a read-heavy billing/account view service using tiered caching (Caffeine → Redis) with request coalescing and adaptive TTLs, shielding downstream systems; increased cache hit rate to 92%, reduced MongoDB calls by 65%, and maintained p95 180ms / p99 420ms using Resilience4j timeouts, retries, and circuit breakers. [Caffeine, Redis, MongoDB, Resilience4j]
- Built an event-driven read model by consuming Kafka change events to materialize subscriber overviews in DynamoDB and push-invalidate Redis for dashboards aggregating slow endpoints; reduced >60s-stale reads from 18% → 3%, lowered median page load time by 25%, and added SQS priority refresh as a safety valve for missed events. [Kafka, DynamoDB, Redis, SQS]
- Secured internal and external APIs with Spring Security (JWT/OAuth2 resource server, role- and scope-based authorization, method-level guards), standardizing authentication/authorization across billing microservices. [Spring Security, OAuth2, JWT]
- Solid understanding of TCP/IP networking in AWS VPC environments, with hands-on experience troubleshooting DNS (Route 53) , DHCP-based IP addressing, and service connectivity behind ALB/NLB for distributed Java microservices. [AWS VPC, Route 53, Networking]
- Led high-level and low-level design reviews, drove architecture decisions, and mentored engineers through implementation and production hardening. [Architecture, Mentorship]
- Transitioned primary inventory management APIs from Java 8 to Java 11, implementing modern language features to cut codebase size by 15%. [Java 11, Refactoring]
- Integrated external payment gateways (Stripe, PayPal) using RESTful APIs, securing endpoints with OAuth 2.0 and JWT. [REST, OAuth 2.0, Security]
- Developed automated batch processing cron jobs using Spring Batch to routinely aggregate and analyze multi-regional sales data. [Spring Batch, Data Aggregation]
- Architected and developed scalable payment processing microservices using Java 17 and Spring Boot, handling over 500,000 transactions daily with sub-second latency. [Java, Spring Boot, Microservices]
- Migrated legacy monolithic core banking applications to an event-driven Kafka architecture, improving system decoupling and reliability. [Kafka, Event-Driven Architecture, Migration]
- Optimized database queries using Spring Data JPA and Hibernate, resulting in a 40% reduction in query execution time for complex reporting modules. [JPA, Hibernate, SQL]
- Implemented comprehensive JUnit and Mockito test suites, achieving 85% code coverage and significantly reducing regression issues across deployment cycles. [JUnit, Mockito, Testing]
