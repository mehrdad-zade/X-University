# 🎓 X-University – AI-Powered Learning Platform

X-University is a scalable, resilient, and multilingual educational platform powered by AI and microservices. It supports personalized learning through assignment delivery, auto-evaluation, teacher-like chatbots, and an integrated payment and analytics system.

---

## 🧩 Core Features

- 🌐 Multi-language support for users worldwide
- 🔐 OAuth2 authentication and role-based access (students, teachers, admins)
- 📚 Assignment management by subject, level, and language
- 🤖 AI-generated content and feedback (via LLM)
- 🧠 Real-time teacher chatbot for help and tutoring
- 💬 WebSocket-based chat with full logging
- 🧾 Payment processing (Stripe/PayPal) for subscriptions and credits
- 🔔 Email and push notifications
- 📊 Analytics dashboard for engagement and usage
- 📦 CDN and blob storage for content distribution
- 🔍 Full observability via Prometheus + Grafana

---

## 🛠️ Tech Stack

| Layer         | Technology                        |
|--------------|------------------------------------|
| Frontend      | Next.js (React + TypeScript)       |
| Auth          | Auth0 / Keycloak (OAuth2 + OIDC)   |
| API Gateway   | Kong / AWS API Gateway             |
| Microservices | Python (FastAPI) / Node.js (NestJS)|
| Databases     | PostgreSQL, MongoDB, Redis         |
| Storage       | S3 / Blob + CloudFront CDN         |
| Messaging     | Kafka / RabbitMQ / SQS             |
| Payments      | Stripe / PayPal                    |
| Analytics     | InfluxDB / TimescaleDB             |
| Observability | Prometheus, Grafana, ELK/Sentry    |

---

## 🚀 Microservices Overview

- **User Service** – User profiles and RBAC
- **Assignment Service** – Manage and deliver assignments
- **Content Gen Service** – LLM-generated reading/writing materials
- **Evaluation Service** – Auto-grade answers with feedback
- **Chatbot Service** – AI teacher for student queries
- **Notification Service** – Email + push alerts
- **Payment Service** – Subscription & credits handling
- **Analytics Service** – Track usage & metrics

---

## 🧪 Development Setup

```bash
# Clone the repo
git clone https://github.com/mehrdad-zade/X-University
cd x-university

# Install dependencies per service
cd services/user-service
npm install / pip install -r requirements.txt

# Run locally (example)
npm run dev  # or uvicorn main:app --reload
```

---

## 📦 Deployment

- All services are containerized via Docker
- Kubernetes deployment using Helm charts
- CI/CD with GitHub Actions or Jenkins
- Secrets managed via Vault / AWS Secrets Manager

---

## 📄 Documentation

- API docs: `/docs` via Swagger/OpenAPI per service
- Architecture diagrams in `/docs/diagrams`
- Sprint-wise development plans in `/docs/sprints`

---

## 👨‍👩‍👧‍👦 Roles

| Role    | Capabilities                     |
|---------|----------------------------------|
| Student | View, submit assignments, chat   |
| Teacher | Create/edit assignments, chat    |
| Admin   | Manage users, all data access    |


---

MIT License © 2025 X-University
