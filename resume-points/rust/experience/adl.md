---
company: "Axiata Digital Labs"
location: "Colombo, Sri Lanka"
designation: "Software Engineer"
startDate: "Jan 2019"
endDate: "Jan 2023"
---

- Transitioned high-throughput data processing JVM workers into safe Rust executables bridging Kafka events via rdkafka; maintained memory guarantees over 1GB+ S3 multipart usages streams and PostgreSQL COPY idempotent setups using deadpool-postgres connection polling. [Rust, Async/Await, rdkafka, S3]
- Engineered an idempotent pricing rule executor daemon in Rust handling 100K/day critical financial events; capitalized on Redis deduplication lock boundaries via redis-rs, utilizing atomic operations to completely eradicate cross-service mispricing by 70%. [Rust, Redis, Idempotency]
- Designed a scalable, read-heavy API service in Actix-Web, leveraging internal RwLock struct caching strategies to replace external tiered cache overhead, efficiently coalescing thousands of subscriber requests and shielding MongoDB backfires via request debouncing. [Actix-Web, RwLock, MongoDB]
- Streamlined invoice lifecycle processing using Saga orchestration workflows and Transactional Outbox patterns directly ported to Rust; built strictly typed ser/de pipelines with serde to handle deterministic replaying and achieve zero duplicate invoices. [Rust Macros, Serde, Event-Driven]
