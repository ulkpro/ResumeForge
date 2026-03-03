---
company: "Axiata Digital Labs"
location: "Colombo, Sri Lanka"
designation: "Data Engineer"
startDate: "Jan 2019"
endDate: "Jan 2023"
---

- Built a high-velocity, fault-tolerant batch ingestion pipeline using AWS S3 multipart uploads (SSE-KMS verified) and Python/Java orchestrations to process massive 1GB+ CSV usage feeds; generated 40% faster end-to-end processing. [AWS S3, ETL, Batch Processing]
- Scaled data sinks by executing Postgres COPY streams with atomic, idempotent upserts via Redisson distributed locking setups, comfortably sustaining ingestion rates of >1K records/sec into persistent storage. [PostgreSQL, Data Sinks, Concurrency]
- Architected an event-driven stream layer using Apache Kafka topics and Redux-based deduplication caches, guaranteeing exactly-once transactional data writing across 100K/day critical financial payment computations. [Apache Kafka, Streaming, Redis]
- Designed a real-time read model pipeline reacting to Kafka change data capture (CDC) events, dynamically materializing complex subscriber dimension tables into Amazon DynamoDB and invalidating slow-running queries. [CDC, DynamoDB, Data Modeling]
