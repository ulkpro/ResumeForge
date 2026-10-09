---
company: "Iowa Institute of Hydroscience and Research, University of Iowa"
location: "Iowa City, IA"
designation: "Data Engineer | Graduate Research Assistant"
startDate: "Jan 2023"
endDate: "Present"
---

- Architected a spatial data warehouse using PostgreSQL/PostGIS, consolidating 6 disparate downstream microservices into a unified semantic layer exposed via GraphQL, reducing analytical query latency by 50%. [PostgreSQL, PostGIS, GraphQL]
- Designed an automated AWS Serverless data ingestion pipeline using Lambda and Amazon EventBridge to periodically fetch, validate, and persist NOAA meteorological telemetry into Aurora Serverless. [AWS Lambda, Aurora Serverless, EventBridge]
- Developed robust ETL scripts in Python (Pandas/GeoPandas) to extract raw GeoJSON coordinate arrays, perform 2D Delaunay triangulations, and load the optimized mesh structures into cloud storage for downstream Unreal Engine visualization. [Python, GeoPandas, ETL]
- Integrated machine learning flood-prediction inference models directly into the data pipeline using AWS SageMaker endpoints, feeding continuous real-time classified data back into the PostGIS cluster. [AWS SageMaker, Machine Learning]
