---
project_name: "Internal Automation Dashboard (RAG UI)"
role: "fullstack-python-react"
order: "2"
---

- Developed a multi-tenant RAG application with a React SPA frontend and a FastAPI backend, coordinating highly structured compliance workflow data.
- Engineered an asynchronous document ingestion pipeline using Python Celery workers, Redis brokers, and SQLAlchemy to process and chunk massive PDF uploads in the background.
- Integrated semantic search natively by computing OpenAI vector embeddings and executing cosine similarity queries using pgvector in PostgreSQL.
- Secured all FastAPI endpoints using Pydantic models for strict payload validation and dependency injection to globally enforce JWT bearer and RBAC authorization.
- Configured GitHub Actions for continuous integration, executing Pytest suites with mocked S3 dependencies and deploying the dockerized application to AWS ECS.
