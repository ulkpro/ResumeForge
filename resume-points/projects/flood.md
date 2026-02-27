---
project_name: "Flood Information System"
---

- Designed a Redux Toolkit data flow (Flux pattern) with slices for auth, stations, alerts, and map; used createEntityAdapter for normalized state, createAsyncThunk for async API/WebSocket reconciliation. [Redux Toolkit, Flux]
- Implemented high-frequency UI updates using DOM APIs: requestAnimationFrame for batched map redraws, IntersectionObserver to pause off-screen widgets, AbortController to cancel stale requests. [DOM APIs, JavaScript]
- JWT authentication with reusable data-fetching hooks and error-boundary patterns for resilient, low-latency UX. [JWT, React Hooks]
