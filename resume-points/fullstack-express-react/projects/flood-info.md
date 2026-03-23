---
project_name: "Flood Information System"
role: "fullstack-express-react"
order: "3"
---

- Architected an end-to-end full-stack dashboard featuring a React frontend and Node.js REST API interacting with a spatial PostgreSQL/PostGIS database.
- Integrated heavy spatial data queries using Knex.js query builders to stream multi-polygon boundary geometry into the frontend, reducing memory overhead by 40%.
- Configured Redis caching middleware on expensive Express GET routes, serving aggregated hydrological data streams to the map UI with a 95% cache hit rate.
- Implemented comprehensive error handling middleware in Express combined with React Error Boundaries ensuring unified diagnostic logging without exposing sensitive stack traces.
