---
company: "Iowa Institute of Hydroscience and Research, University of Iowa"
location: "Iowa City, IA"
designation: "Rust Developer | Graduate Research Assistant"
startDate: "Jan 2023"
endDate: "Present"
---

- Rewrote a legacy geospatial data aggregator into a highly concurrent Rust backend utilizing Axum and async-graphql; composed PostGIS queries across 6 downstream services using sqlx, improving native performance and cutting API response latency by 50%. [Rust, Axum, GraphQL, sqlx]
- Developed high-throughput WebSocket real-time streaming services for a flood-monitoring dashboard using tokio-tungstenite; engineered lock-free channels and async stream processing to broadcast million-point metrics with virtually zero memory overhead. [Rust, Tokio, WebSockets]
- Implemented core mathematical algorithms for flood-map rendering by wrapping the C++ Poly2Tri library with Rust FFI bindings, compiling computationally expensive 2D Delaunay triangulations safely utilizing Rust's strict memory borrowing rules. [Rust, FFI, Memory Safety]
- Deployed lightweight, memory-safe serverless function handlers in AWS Lambda using the official rust-runtime; integrated with Aurora Serverless and AWS Secrets Manager using aws-sdk-rust, dropping cold-start latency from JVM levels down to under 20ms. [AWS Lambda, Rust SDK, Serverless]
