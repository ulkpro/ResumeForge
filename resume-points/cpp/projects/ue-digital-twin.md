---
project_name: "UnrealEngine DigitalTwin API Integrator"
---

- Created a custom monolithic C++ plugin for UE 5.3 strictly encapsulating FHttpModule web requests, background JsonUtilities parsing, and dynamic struct conversion via USTRUCT reflections on the game thread. [C++, Unreal Engine, JSON]
- Wrote custom delegates and event dispatchers routing raw WebSocket telemetries from the hardware network socket APIs cleanly back into Actor blue-prints for non-programmer design modifications. [Sockets, C++ Delegates]
