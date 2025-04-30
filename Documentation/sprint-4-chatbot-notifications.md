# 🤖 Sprint 4 – Chatbot, Teacher Bot & Notifications

## 🧠 Objective
Implement real-time AI-powered interaction between students and a teacher-like chatbot. Also, build the Notification Service to handle alerts (assignment updates, feedback, system messages).

---

## 💬 Chatbot Service (Teacher Bot)

### 🎯 Goal
Provide an AI-powered chat interface for students to ask questions about assignments, topics, or feedback.

### ✅ Requirements
- Stateful per user session (context-aware)
- Use LLM to generate tutor-style responses
- Store logs per session for analytics & review

### 🔧 Implementation Instructions
```plaintext
1. Language: Node.js (NestJS) or Python (FastAPI)
2. Protocol: Use **WebSockets** (preferred) or REST long-polling fallback

3. API:
   - `POST /chat/send` or `WS event: message`
   - Payload: { user_id, message }

4. Maintain session state (short-term context):
   - Store recent messages in Redis or in-memory store
   - Include chat history in LLM prompt

5. Example Prompt Template:
   "You are a friendly and knowledgeable tutor helping a {level} student. Respond clearly and help them learn."

6. Response payload:
   {
     "message": "...",
     "timestamp": "...",
     "source": "bot"
   }

7. Optional: Allow follow-up mode (“ask again”), feedback rating on replies

8. Store full chat logs in Redis and archive in Mongo/PostgreSQL after 24h

9. Rate-limit messages (e.g. 1 every 3s) to prevent flooding

10. Track usage per student for moderation/insights
```

---

## 🔔 Notification Service

### 🎯 Goal
Send alerts to users when an assignment is graded, new task is posted, or system update occurs.

### ✅ Requirements
- Should support Email and Web Push
- Should be asynchronous and decoupled (message queue)
- Can integrate with providers like SendGrid, SES, Firebase

### 🔧 Implementation Instructions
```plaintext
1. Language: Python or Node.js

2. Queue-based event listener (Kafka, RabbitMQ, or SQS):
   - `assignment.graded`, `assignment.assigned`, `system.announcement`

3. Notification schema:
   {
     "user_id": "...",
     "channel": "email" | "webpush",
     "event": "assignment.graded",
     "message": "...",
     "metadata": {...}
   }

4. Email:
   - Use SendGrid, SES, or SMTP
   - HTML templates per notification type
   - Include unsubscribe token if applicable

5. Web Push:
   - Use Firebase Cloud Messaging (FCM) or WebPush API
   - Register token on frontend
   - Retry on failure, clean up expired tokens

6. Endpoint: `POST /notify/test` for QA and preview

7. Allow user preferences for notifications (stored in User Service):
   {
     "email": true,
     "webpush": false
   }
```

---

## 🔐 Security & Privacy
- Validate all message payloads against schema
- Encrypt sensitive tokens (e.g., FCM tokens)
- Only allow bot/chat access post-login
- Store minimal necessary logs

---

## 🧪 Testing & Best Practices
- Unit test event triggers and bot logic
- Mock LLM/chat and email/web push providers
- Record delivery logs (success/failure) with status codes
- Use dev/test queues for local testing

---

## 📦 Deliverables for Sprint 4
- Real-time teacher bot (WebSocket or fallback)
- Context-aware responses using LLM
- Chat history storage and user/session linking
- Notification Service with queue-based events
- Email + WebPush integration
- Preferences support and logging
- Tests + OpenAPI doc for Notification API

---
