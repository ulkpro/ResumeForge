---
project_name: "High-Fidelity Memory Stream Parsing Engine"
---

- Designed an asynchronous, multi-threaded C++ (C++17) transaction aggregator using a thread-pool + concurrent queue model synchronized via std::mutex and std::condition_variable primitives. [C++17, Concurrency, Threading]
- Refactored critical loop sections leveraging cache-oblivious designs to maximize L1/L2 hits; implemented bitwise arithmetic shortcuts in deep iteration loops generating a 2x throughput uplift. [C++, Low-Level Optimization]
