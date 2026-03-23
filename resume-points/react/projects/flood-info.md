---
project_name: "Flood Information System"
role: "react"
order: "1"
---

- Architected a React and Redux Toolkit data flow with createEntityAdapter for normalized O(1) state lookups and createAsyncThunk for WebSocket reconciliation.
- Optimized high-frequency DOM updates using requestAnimationFrame for batched map redraws and IntersectionObserver to lazy-load off-screen components.
- Engineered custom React hooks to manage AbortController lifecycles, canceling stale API requests to eliminate race conditions and reduce network payload by 30%.
- Profiled and eliminated unnecessary re-renders using React.memo, useMemo, and useCallback, dropping interaction latency from 150ms to 16ms to achieve 60 FPS scrolling.
- Implemented JWT-based authentication with Axios interceptors and React Error Boundaries to gracefully catch unauthorized routes and refresh stale tokens silently.
