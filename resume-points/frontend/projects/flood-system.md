---
project_name: "Flood Information System Dashboard"
---

- Designed a robust Redux Toolkit architecture applying the Flux pattern with specialized slices for Map, Authentication, Alertings, and Stations. [Redux Toolkit, React, Flux]
- Integrated createEntityAdapter() to maintain normalized client-side state combined with createAsyncThunk() to reconcile complex API and WebSocket message payloads cleanly back into the view component layer. [Redux Adapters, WebSockets]
- Eliminated browser stutter during high-velocity map interactions by completely decoupling API ingest loops from the rendering thread, utilizing memoized partial re-renders against large coordinate arrays. [Rendering Performance, Memoization]
