---
project_name: "Distributed API Rate Limiting Gateway"
---

- Designed a distributed API gateway in Go (Golang) serving over 50K Requests/Sec, utilizing the net/http and fasthttp libraries for low-level connection pooling and ultra-fast network routing. [Go, fasthttp, API Gateway]
- Implemented Token Bucket and Leaky Bucket algorithmic limits relying on Redis pipelines and Lua scripting to guarantee strict cross-node consistency and block abusive clients in <1ms. [Go, Redis, Lua]
- Incorporated robust graceful shutdown mechanisms via context.Context and sync.WaitGroup layers to ensure active network requests were never dropped during Kubernetes rolling deployments. [Go, Context API, Graceful Degradation]
