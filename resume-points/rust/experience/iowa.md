---
company: "Iowa Institute of Hydroscience and Research, University of Iowa"
designation: "Rust Developer | Graduate Research Assistant"
location: "Iowa City, IA"
startDate: "Jan 2023"
endDate: "Present"
role: "rust"
order: "99"
---

- Built GraphQL APIs integrating 6 downstream services and Postgres queries, improving frontend data efficiency by 50% [GraphQL]
- Revamped a legacy service with GraphQL APIs, composing PostGIS spatial queries with 6 downstream services; designed a flexible schema with resolvers with DataLoader batching/caching, improving frontend data efficiency by 50%. [GraphQL, Node.js, PostGIS]
- Developed high-throughput WebSocket real-time streaming services for a flood-monitoring dashboard using tokio-tungstenite; engineered lock-free channels and async stream processing to broadcast million-point metrics with virtually zero memory overhead. [Rust, Tokio, WebSockets]
- Implemented core mathematical algorithms for flood-map rendering by wrapping the C++ Poly2Tri library with Rust FFI bindings, compiling computationally expensive 2D Delaunay triangulations safely utilizing Rust's strict memory borrowing rules. [Rust, FFI, Memory Safety]
- Migrated a single-page application into a Next.js framework leveraging Server-Side Rendering (SSR) and Incremental Static Regeneration (ISR) dropping total initial network volume by 45%. [Next.js]
- Deployed lightweight, memory-safe serverless function handlers in AWS Lambda using the official rust-runtime; integrated with Aurora Serverless and AWS Secrets Manager using aws-sdk-rust, dropping cold-start latency from JVM levels down to under 20ms. [AWS Lambda, Rust SDK, Serverless]
