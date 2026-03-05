---
company: "Axiata Digital Labs, Sri Lanka"
designation: "Software Engineer"
startDate: "Jan 2019"
endDate: "Jan 2023"
role: "backend"
order: "0"
---

- Integrated backend systems with ESB-based APIs on TIBCO BusinessWorks, handling XML/JSON transformations, asynchronous messaging, and service orchestration in telecom workflows. [TIBCO BusinessWorks]
- Developed a Kafka event driven invoice lifecycle microservice in SpringBoot using Saga and transactional outbox; achieved zero duplicate invoice postings and reduced billing incident recovery time by 65% across 100K+ monthly invoices. [Kafka, Saga, Outbox]
- Developed a large CSV file ingestion microservice with Ports & Adapters, using S3 multipart upload and an async validate & transform pipeline into PostgreSQL COPY + idempotent upserts; sustained >1K records/sec and reducing processing time by 40%. [Postgres, AWS]
- Implemented idempotent pricing rule execution using Redis deduplication caches, Redisson distributed locks, and versioned event keys, with transactional boundaries, retries, and automated rollback; processed 100K/day payment computations at <200ms p99 latency, reducing cross-service mispricing by 70%+ and preventing $500K annual revenue leakage. [Redis, Redisson, Distributed Locks]
- Built and owned a read-heavy billing/account view service using tiered caching (Caffeine → Redis) with request coalescing and adaptive TTLs, shielding downstream systems; increased cache hit rate to 92%, reduced MongoDB calls by 65%, and maintained p95 180ms / p99 420ms using Resilience4j timeouts, retries, and circuit breakers. [Caffeine, Redis, MongoDB, Resilience4j]
- Built an event-driven read model by consuming Kafka change events to materialize subscriber overviews in DynamoDB and push-invalidate Redis for dashboards aggregating slow endpoints; reduced >60s-stale reads from 18% → 3%, lowered median page load time by 25%, and added SQS priority refresh as a safety valve for missed events. [Kafka, DynamoDB, Redis, SQS]
- Secured internal and external APIs with Spring Security (JWT/OAuth2 resource server, role- and scope-based authorization, method-level guards), standardizing authentication/authorization across billing microservices. [Spring Security, OAuth2, JWT]
- Solid understanding of TCP/IP networking in AWS VPC environments, with hands-on experience troubleshooting DNS (Route 53) , DHCP-based IP addressing, and service connectivity behind ALB/NLB for distributed Java microservices. [AWS VPC, Route 53, Networking]
- Led high-level and low-level design reviews, drove architecture decisions, and mentored engineers through implementation and production hardening. [Architecture, Mentorship]
