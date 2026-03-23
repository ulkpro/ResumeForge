---
project_name: "Real-Time Spatial Information System"
order: "1"
---

- Architected a Angular and NgRx data flow utilizing normalized O(1) entity state lookups and asynchronous RxJS Observables pipes to reconcile volatile WebSocket telemetry. [Angular, NgRx, RxJS Observables]
- Optimized high-frequency spatial DOM updates using requestAnimationFrame for batched vector redraws and IntersectionObserver to deliberately lazy-load off-screen charting components. [DOM API, Web Vitals, Performance]
- Engineered customized Angular lifecycles to explicitly manage AbortController signals, cleanly canceling visually stale API requests to eliminate rendering race conditions and reduce overall network payload by 30%. [Concurrency, Networking, Optimization]
