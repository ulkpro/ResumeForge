---
project_name: "Flood Information System"
---

- Designed an NgRx data flow (Flux pattern) with modules for auth, stations, alerts, and map; used entity adapters for normalized state, effects for async API/SignalR reconciliation. [Angular, NgRx]
- Implemented high-frequency UI updates using DOM APIs: requestAnimationFrame for batched map redraws, IntersectionObserver to pause off-screen widgets, and RxJS subscription management to cancel stale requests. [RxJS, UI Performance]
- JWT authentication with reusable Angular service patterns, HttpInterceptors, and error handlers for resilient, low-latency UX. [JWT, Angular Services, HttpInterceptor]
