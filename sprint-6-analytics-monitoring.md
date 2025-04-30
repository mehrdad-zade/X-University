# 📊 Sprint 6 – Analytics, Monitoring & Final Polish

## 🧠 Objective
Implement user behavior analytics and system observability with metrics, logs, and alerts. Finalize testing, security, and performance to prepare for production launch.

---

## 📈 Analytics Service

### 🎯 Goal
Track student and teacher activity, usage trends, LLM cost metrics, and feature engagement.

### ✅ Requirements
- Track key events: logins, assignment views/submissions, chat usage
- Store in time-series database (InfluxDB, TimescaleDB, or ClickHouse)
- Provide aggregated insights

### 🔧 Implementation Instructions
```plaintext
1. Language: Python or Node.js
2. Event Schema:
   {
     "user_id": "...",
     "event": "assignment.viewed",
     "timestamp": "...",
     "metadata": {
       "assignment_id": "...",
       "subject": "math"
     }
   }

3. API:
   - `POST /analytics/event`
     → Accepts a single or batch event (validate payload)
   - Internal: `GET /analytics/summary?user_id=...`

4. Store events in:
   - InfluxDB or TimescaleDB (PostgreSQL extension)
   - Index on user_id, event, timestamp

5. Use aggregation queries to generate:
   - Daily active users (DAU)
   - Most-used subjects
   - Time spent per assignment
   - LLM prompt/usage metrics per user
```

---

## 🧪 Observability – Logs, Metrics & Tracing

### 🎯 Goal
Enable real-time system health tracking, performance insights, and error tracing.

### ✅ Requirements
- Centralized structured logging (e.g. JSON logs)
- Request tracing across microservices
- Metrics exposed via Prometheus
- Dashboards in Grafana

### 🔧 Implementation Instructions
```plaintext
1. Logging:
   - Use Winston (Node) or Loguru/Structlog (Python)
   - Log structure:
     {
       level: "info" | "error",
       message: "...",
       service: "assignment-service",
       request_id: "...",
       timestamp: ...
     }

2. Correlation:
   - Assign request ID in gateway, forward in headers
   - Use this ID in logs across all services

3. Metrics:
   - Expose Prometheus-compatible `/metrics` endpoint in each service:
     - `http_requests_total{service=...}`
     - `http_response_time_seconds`
     - `llm_calls_total`, `llm_cost_usd`

4. Grafana:
   - Dashboards for service latency, API errors, usage spikes
   - Use alerting rules for high error rate or CPU/memory

5. Alerting:
   - Integrate Grafana or Prometheus Alertmanager with Slack/Email
   - Example rules:
     - >10% error rate in 5min
     - API latency > 1s
```

---

## ✅ Final QA, Security & Polish

### 🔧 Instructions
```plaintext
1. Run full security scan (e.g., Snyk, Trivy, Bandit)
2. Perform load testing (e.g., k6, Locust) on major endpoints
3. Validate RBAC enforcement in all routes
4. Ensure HTTPS everywhere
5. Enable autoscaling on Kubernetes workloads
6. Backup policies for all persistent DBs + blobs
7. Finalize OpenAPI docs for all services
8. Run production smoke test and monitor logs
```

---

## 📦 Deliverables for Sprint 6
- Analytics Service with usage/event tracking
- Grafana dashboards and alert rules
- Prometheus metrics on all services
- Centralized structured logging
- Tracing via request IDs
- Load/security testing and bug fixes
- Deployment checklists and final documentation

---
