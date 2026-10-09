---
project_name: "High-Performance CLI Log Aggregator"
---

- Authored a high-performance CLI utility in Go utilizing the Cobra framework to concurrently tail, parse, and structure gigabytes of disparate production server logs in parallel. [Go, CLI, Cobra]
- Heavily utilized Go's bufio and io.Reader interfaces to read chunked data efficiently without inflating memory boundaries, ensuring stable heap profiles even when scanning massive untruncated 10GB+ file streams. [Go, bufio, Memory Optimization]
- Integrated a custom regex-engine wrapping RE2 via CGO to quickly extract anomalies and push structured metrics directly into a Prometheus push-gateway via remote asynchronous webhooks. [Go, CGO, Prometheus]
