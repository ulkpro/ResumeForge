---
project_name: "Automated Data Quality & Validation Pipeline"
---

- Designed an intelligent AWS Step Functions state machine to coordinate batch file extractions, triggering containerized Python processing scripts inside ECS clusters whenever new file prefixes appeared in source S3 buckets. [AWS Step Functions, ECS, Python]
- Programmed Great Expectations within the transformation step, halting downstream execution flows precisely when data discrepancies were detected, executing custom SNS alerts to the operations team dashboard. [Great Expectations, Data Quality Assurance, SNS]
- Consolidated logging throughout the ETL steps back into CloudWatch, parsing metric patterns continuously with Lambda to track structural drift on inbound analytics schemas. [CloudWatch, Schema Evolution, Validation]
