---
project_name: "Real-Time Telemetry Streaming Data Lake"
---

- Architected an AWS-native streaming data lake using Amazon Kinesis Data Streams to ingest high-frequency IoT sensor metrics, routing structured logs through Kinesis Firehose directly into an S3 raw-data zone. [AWS Kinesis, IoT, S3 Data Lake]
- Implemented an automated AWS Glue (PySpark) crawler pipeline to seamlessly discover and catalog partitions on arrival, utilizing Athena for sub-second ad-hoc analytical queries on parquet-compressed datasets. [AWS Glue, PySpark, Athena]
- Optimized data compression and columnar storage strategies to drop query execution costs by 75% while drastically scaling read availability for downstream Machine Learning models. [Parquet, Columnar Storage, Optimization]
