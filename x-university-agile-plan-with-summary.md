# 🛠️ X-University Agile Development Plan

## 📅 Sprint Overview (2-week Sprints)

| Sprint                             | Dates              | Focus Areas                                     | Duration |
|------------------------------------|--------------------|--------------------------------------------------|----------|
| Sprint 0 – Planning & Setup        | Apr 30 – May 13    | Planning, Infrastructure, CI/CD, Tech Stack     | 14 days  |
| Sprint 1 – Auth, User, UI Scaffold | May 14 – May 27    | Auth (OAuth2), User Service, UI Scaffold        | 14 days  |
| Sprint 2 – Assignments, CDN, Blob  | May 28 – Jun 10    | Assignment Service, CDN, Blob Storage           | 14 days  |
| Sprint 3 – LLM & Evaluation        | Jun 11 – Jun 24    | LLM Integration, Evaluation & Feedback System   | 14 days  |
| Sprint 4 – Chatbot & Notifications | Jun 25 – Jul 08    | Chatbot Service, Teacher Bot, Notifications     | 14 days  |
| Sprint 5 – Payments Integration    | Jul 09 – Jul 22    | Payment Service (Stripe/PayPal), Webhooks       | 14 days  |
| Sprint 6 – Analytics + Monitoring  | Jul 23 – Aug 05    | Analytics, Monitoring (Grafana), Final QA       | 14 days  |

---

## ✅ Key Components by Sprint

### Sprint 0 – Planning & Setup
- Define system architecture
- Set up Git, CI/CD (Jenkins/GitHub Actions), cloud infrastructure
- Prepare Kubernetes cluster, Helm charts, IaC

### Sprint 1 – Auth, User, UI Scaffold
- Integrate OAuth2/OIDC via Auth0/Keycloak
- Build user registration/login APIs
- Scaffold React/Next.js frontend with token-based auth

### Sprint 2 – Assignments, CDN, Blob
- Build Assignment Service with CRUD + metadata
- Integrate CDN (CloudFront) and Blob storage (S3)
- File uploads with pre-signed URLs

### Sprint 3 – LLM & Evaluation
- Connect LLM (OpenAI or fine-tuned model) for content generation
- Create Evaluation Service for automated grading + feedback
- Store responses securely, return feedback to students

### Sprint 4 – Chatbot & Notifications
- Implement real-time Teacher Bot (LLM-based)
- WebSocket/REST chat integration
- Send assignment updates via Notification Service

### Sprint 5 – Payments Integration
- Build Payment Service
- Integrate Stripe/PayPal checkout + webhooks
- Handle subscription/credit system updates

### Sprint 6 – Analytics + Monitoring + Polish
- Track user engagement with Analytics Service
- Use Prometheus + Grafana for monitoring
- Final round of testing, observability & performance tuning

---
