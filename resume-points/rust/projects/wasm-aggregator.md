---
project_name: "WebAssembly Data Pipeline Aggregator"
---

- Interfaced a high-speed data aggregator utilizing Rust compiled down to WebAssembly (Wasm) inside Next.js/React frontend frameworks; moved heavy GeoJSON polygon manipulation logic out of JS Main Thread V8 engines down to near-native execution buffers. [Rust, WebAssembly, Frontend WASM]
- Managed robust shared memory integrations leveraging wasm-bindgen and js-sys, eliminating serialization bottlenecks resulting in 50% frontend data parsing efficiency. [wasm-bindgen, JS interop]
