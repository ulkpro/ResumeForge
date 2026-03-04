---
company: "Axiata Digital Labs"
location: "Colombo, Sri Lanka"
designation: "Software Engineer"
startDate: "Jan 2019"
endDate: "Jan 2023"
---
- Developed a large CSV file ingestion microservice with Ports & Adapters, using S3 multipart upload and an async validate & transform pipeline into PostgreSQL COPY + idempotent upserts; sustained >1K records/sec and reducing processing time by 40%. [SpringBoot, S3, PostgreSQL]
- Developed a Kafka event driven invoice lifecycle microservice in SpringBoot using Saga and transactional outbox; achieved zero duplicate invoice postings and reduced billing incident recovery time by 65% across 100K+ monthly invoices. [SpringBoot, Kafka, Saga, Transactional Outbox]
- Secured internal and external APIs with Spring Security (JWT/OAuth2 resource server, role- and scope-based authorization, method-level guards), standardizing authentication/authorization across billing microservices. [Spring Security, OAuth2, JWT]
- Built an event-driven read model by consuming Kafka change events to materialize subscriber overviews in DynamoDB and push-invalidate Redis for dashboards aggregating slow endpoints; reduced >60s-stale reads from 18% → 3%, lowered median page load time by 25%, and added SQS priority refresh as a safety valve for missed events. [Kafka, DynamoDB, Redis]
- Built and owned a read-heavy billing/account view service using tiered caching (Caffeine → Redis) with request coalescing and adaptive TTLs, shielding downstream systems; increased cache hit rate to 92%, reduced MongoDB calls by 65%, and maintained p95 180ms / p99 420ms using Resilience4j timeouts, retries, and circuit breakers. [Caffeine, Redis, MongoDB]
- Led high-level and low-level design reviews, drove architecture decisions, and mentored engineers through implementation and production hardening. [Architecture, Mentorship]
- Architected full-stack enterprise dashboards using React, Redux, and Node.js, delivering real-time visualization of key metric data for 10M+ users. [React, Node.js, Full Stack]
- Developed REST APIs in Express.js integrating complex third-party marketing services, handling a concurrent traffic spike of 40%. [Express, REST API, Scalability]
- Redesigned the primary component library strictly adhering to React Hooks and Context API, boosting front-end rendering efficiency. [React Hooks, Component Design]
- Connected MongoDB backend schemas with Mongoose models, optimizing deep nested references for faster user-query rendering. [MongoDB, Mongoose, NoSQL]
- Transitioned a legacy AngularJS codebase into a robust React single-page application, improving initial load speed globally by 60%. [React, Migrations, Performance]
- Configured Webpack to lazy-load routes and implement code splitting, decreasing the main bundle size drastically to 150kb. [Webpack, Optimization]
- Coordinated closely with UX designers parsing Figma mockups into reusable styled components tailored exactly to design systems. [CSS-in-JS, Figma, UI/UX]
