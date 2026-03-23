---
project_name: "Multi-Environment Kubernetes Platform"
order: "1"
---

- Provisioned production-grade Kubernetes (v1.28) clusters flawlessly using Terraform / Bicep; securely managed workload compute node groups, persistent volume claims, and cluster CNI configurations across Microsoft Azure. [Kubernetes, Terraform / Bicep, Infrastructure]
- Developed an end-to-end GitOps delivery pipeline via ArgoCD to continuously sync declarative Helm chart configurations directly into the cluster, enforcing strictly immutable infrastructure-as-code principles. [ArgoCD, GitOps, Helm]
- Hardened CI/CD security perimeters by integrating continuous Trivy container scanning and custom quality gates natively into CI workflows prior to pushing images securely to registries. [CI/CD, Trivy, DevSecOps]
- Deployed Prometheus and Grafana observability stacks immediately inside the cluster using Helm, configuring proactive PromQL alerts for system throttling and responsive node provisioning utilizing AKS Cluster Autoscaler. [Prometheus, Grafana, Autoscaling]
