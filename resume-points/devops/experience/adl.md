---
company: "Axiata Digital Labs"
location: "Colombo, Sri Lanka"
designation: "Software Engineer"
startDate: "Jan 2019"
endDate: "Jan 2023"
---

- Solid understanding of TCP/IP networking in AWS VPC environments, with hands-on experience troubleshooting DNS (Route 53) , DHCP-based IP addressing, and service connectivity behind ALB/NLB for distributed Java microservices. [AWS VPC, Route 53, ALB/NLB]
- Developed and owned a payment ingestion microservice to process 1GB+ usage feeds via presigned, checksum-verified S3 multipart uploads (SSE-KMS) and an async pipeline that bulk-loads data using PostgreSQL COPY with idempotent upserts, sustaining >1K records/sec and delivering 40% faster end-to-end billing-cycle processing. [AWS S3, PostgreSQL, Data Pipeline, KMS]
- Built an event-driven read model by consuming Kafka change events to materialize subscriber overviews in DynamoDB and push-invalidate Redis for dashboards aggregating slow endpoints; reduced >60s-stale reads from 18% → 3%, lowered median page load time by 25%, and added SQS priority refresh as a safety valve for missed events. [Kafka, DynamoDB, Redis, SQS]
