---
project_name: "Internal Automation Dashboard (RAG UI)"
role: "react"
order: "2"
---

- Designed a multi-tenant React SPA with Context API to manage localized user-preferences and role-based access control (RBAC) component rendering strategies.
- Built a highly resilient browser-based file upload engine combining HTML5 File APIs with recursive XHR chunking for S3 multi-part uploads with retry mechanisms.
- Integrated real-time progress indicators using RxJS Observables to track upload streams and provide cancelable drag-and-drop operations with 100% accurate visual feedback.
- Integrated a semantic search global navigation bar with debounced input handlers and virtualization (react-window) to seamlessly render 10,000+ historical search parameters without DOM lag.
- Configured Vite build optimizations with manual chunk splitting and dynamic imports (React.lazy), bringing the initial JavaScript payload down from 2MB to 350kb.
