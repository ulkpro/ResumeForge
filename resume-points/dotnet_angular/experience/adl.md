---
company: "Axiata Digital Labs"
designation: "Software Engineer"
location: "Colombo, Sri Lanka"
startDate: "Jan 2019"
endDate: "Jan 2023"
role: "dotnet_angular"
order: "99"
---

- Developed a large CSV file ingestion service with Ports & Adapters, using Azure Blob Storage multipart upload and async validate & transform pipeline into Microsoft SQL Server bulk copy + idempotent upserts. Sustained >1K records/sec reducing processing time by 40%. [.NET Core, Azure Blob, SQL Server]
- Developed an Azure Service Bus event driven invoice lifecycle microservice in ASP.NET Core using Saga and transactional outbox; achieved zero duplicate invoice postings and reduced billing incident recovery time by 65% across 100K+ monthly invoices. [ASP.NET Core, Azure Service Bus, Saga, Transactional Outbox]
- Secured internal and external APIs with ASP.NET Core Identity and IdentityServer (JWT/OAuth2 resource server, role- and scope-based authorization, policies), standardizing authentication/authorization across billing microservices. [ASP.NET Core, OAuth2, JWT, IdentityServer]
- Built and owned a read-heavy billing/account view service using tiered caching (MemoryCache → Redis) with request coalescing and adaptive TTLs, shielding downstream systems; increased cache hit rate to 92%, reduced SQL Server calls by 65%, and maintained p95 180ms / p99 420ms using Polly timeouts, retries, and circuit breakers. [Redis, SQL Server, Polly, .NET]
- Led high-level and low-level design reviews, drove architecture decisions, and mentored engineers through implementation and production hardening. [Architecture, Mentorship]
- Architected full-stack enterprise dashboards using Angular, RxJS, and ASP.NET Core, delivering real-time visualization of key metric data for 10M+ users. [Angular, ASP.NET Core, Full Stack]
- Developed REST and SOAP APIs (WCF & Web API) integrating complex third-party marketing services, handling a concurrent traffic spike of 40%. Hosted the application on IIS. [REST API, SOAP, WCF, IIS]
- Redesigned the primary component library strictly adhering to Angular stand-alone components and robust services, boosting front-end rendering efficiency. [Angular, Component Design]
- Connected SQL Server backend schemas with Entity Framework Core models, optimizing complex LINQ queries and data retrieval for faster user-query rendering. [SQL Server, EF Core, ORM]
- Transitioned a legacy MVC application to a robust Angular single-page application, improved initial load speed by 60%. [Angular, Migrations, Performance]
- Configured Angular CLI to lazy-load modules and implement ahead-of-time (AOT) compilation, decreasing the main bundle size drastically to 150kb. [Angular, Optimization]
- Coordinated closely with UX designers parsing Figma mockups into reusable HTML/CSS styled components tailored exactly to design systems. [CSS, HTML, Figma, UI/UX]
- Collaborated in a PR based workflow using Git and peer code reviews, achieving 90%+ code coverage through automated unit (xUnit) and integration tests to ensure the reliability of APIs. [Git, xUnit]
