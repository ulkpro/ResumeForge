---
company: "Axiata Digital Labs"
location: "Colombo, Sri Lanka"
designation: "Software Engineer"
startDate: "Jan 2019"
endDate: "Jan 2023"
---

- Secured internal and external APIs with Spring Security (JWT/OAuth2 resource server, role- and scope-based authorization, method-level guards), standardizing authentication/authorization across billing microservices. [Spring Security, OAuth2, JWT]
- Built an event-driven read model by consuming Kafka change events to materialize subscriber overviews in DynamoDB and push-invalidate Redis for dashboards aggregating slow endpoints; reduced >60s-stale reads from 18% → 3%, lowered median page load time by 25%, and added SQS priority refresh as a safety valve for missed events. [Kafka, DynamoDB, Redis]
- Built and owned a read-heavy billing/account view service using tiered caching (Caffeine → Redis) with request coalescing and adaptive TTLs, shielding downstream systems; increased cache hit rate to 92%, reduced MongoDB calls by 65%, and maintained p95 180ms / p99 420ms using Resilience4j timeouts, retries, and circuit breakers. [Caffeine, Redis, MongoDB]
- Led high-level and low-level design reviews, drove architecture decisions, and mentored engineers through implementation and production hardening. [Architecture, Mentorship]
