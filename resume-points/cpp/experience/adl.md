---
company: "Axiata Digital Labs"
designation: "Software Engineer"
location: "Colombo, Sri Lanka"
startDate: "Jan 2019"
endDate: "Jan 2023"
role: "cpp"
order: "10"
---

- Developed a large CSV file ingestion microservice with Ports & Adapters, using S3 multipart upload and an async validate & transform pipeline into PostgreSQL COPY + idempotent upserts; sustained >1K records/sec and reducing processing time by 40%. [Postgres, AWS]
- Developed a Kafka event driven invoice lifecycle microservice in SpringBoot using Saga and transactional outbox; achieved zero duplicate invoice postings and reduced billing incident recovery time by 65% across 100K+ monthly invoices. [Kafka, Saga, Outbox]
- Designed a custom C++ high-performance file parser leveraging memory-mapped I/O (mmap) for gigabyte-scale sequential transaction logs, drastically dropping the IO overhead compared to standard POSIX fread cycles. [C++, File I/O, POSIX]
- Developed highly-optimized SIMD vectorized loops in C++ utilizing AVX-512 intrinsics, accelerating repetitive billing rule matrix-multiplications inside batch execution endpoints. [C++, SIMD, Performance Optimization]
