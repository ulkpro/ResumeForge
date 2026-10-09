---
project_name: "Real-Time Spatial Information System"
order: "1"
---

- Architected a React and Redux Toolkit data flow utilizing normalized O(1) entity state lookups and asynchronous React Query (SWR) pipes to reconcile volatile WebSocket telemetry. [React, Redux Toolkit, React Query (SWR)]
- Optimized high-frequency spatial DOM updates using requestAnimationFrame for batched vector redraws and IntersectionObserver to deliberately lazy-load off-screen charting components. [DOM API, Web Vitals, Performance]
- Engineered customized React lifecycles to explicitly manage AbortController signals, cleanly canceling visually stale API requests to eliminate rendering race conditions and reduce overall network payload by 30%. [Concurrency, Networking, Optimization]
