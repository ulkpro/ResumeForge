---
company: "Iowa Institute of Hydroscience and Research, University of Iowa"
location: "Iowa City, IA"
designation: "Machine Learning / Backend Engineer | Graduate Research Assistant"
startDate: "Jan 2023"
endDate: "Present"
---

- Developed a highly concurrent spatial data aggregator in Go (Golang), utilizing goroutines and channels to concurrently stream and fuse GeoJSON datasets from 6 disparate downstream microservices, slashing data aggregation latency by 50%. [Go, Concurrency, Goroutines]
- Re-architected a Python-based academic REST backend into a performant Go application utilizing the Gin framework; integrated GORM with PostGIS to execute heavy GIS spatial queries efficiently over PostgreSQL. [Go, Gin, GORM, PostGIS]
- Built high-throughput data ingestion pipelines using Go channels and worker pools to process millions of NOAA meteorological telemetry events natively, completely bypassing high-overhead legacy parsers. [Go, Worker Pools, Data Pipelines]
- Integrated machine learning flood prediction outputs seamlessly back into the Go API via CGO bindings, maintaining extreme low latency on highly unpredictable neural network response times. [Go, CGO, Machine Learning]
