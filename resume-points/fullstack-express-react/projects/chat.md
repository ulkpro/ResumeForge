---
project_name: "Real-Time Bi-Directional Chat"
role: "fullstack-express-react"
order: "2"
---

- Developed a full-stack real-time chat application using React, Node.js, Express, and Socket.io, scaling to support 500+ concurrent active connections.
- Engineered a scalable WebSocket architecture utilizing Redis Pub/Sub adapters to broadcast persistent socket events seamlessly across multiple Node.js cluster instances.
- Secured real-time connections by injecting JWT verification into the Socket.io middleware handshake, preventing unauthorized socket attachment and session hijacking.
- Designed horizontal scaling strategies in Docker Swarm using Nginx ip_hash load balancing to guarantee stickiness for long-polling fallback transports.
- Built a responsive UI mapping Redux actions directly to Socket.io event listeners, delivering sub-50ms message delivery times and real-time typing indicators.
