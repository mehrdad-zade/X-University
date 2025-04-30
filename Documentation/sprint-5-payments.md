# 💳 Sprint 5 – Payments Integration

## 🧠 Objective
Implement a secure, compliant Payment Service allowing users to purchase credits or subscriptions using Stripe, PayPal, or similar gateways. Handle user entitlements, transaction history, and webhook processing.

---

## 💸 Payment Service

### 🎯 Goal
Allow users to initiate payments, process results securely, and manage subscription or credit state.

### ✅ Requirements
- Integrate with **Stripe** (preferred) or **PayPal**
- Support one-time purchases and subscription plans
- Record transaction history
- Handle webhook events (e.g. payment success, refund)

### 🔧 Implementation Instructions
```plaintext
1. Language: Python (FastAPI) or Node.js (Express/NestJS)

2. Endpoints:
   - `POST /payments/create-session`
     Payload: { user_id, plan_id | credit_amount }
     → Returns a redirect URL for Stripe Checkout
   - `GET /payments/history`
     → Authenticated user sees their payment logs
   - `POST /payments/webhook`
     → Secure webhook for events like `payment_intent.succeeded`

3. Session Flow:
   - Create Stripe Checkout Session (with metadata: user_id, type, plan)
   - Redirect user to session.url
   - On success, user is redirected back with session ID

4. Post-payment:
   - Verify session via Stripe API
   - Update user’s record (e.g. credits, subscription active)
   - Send notification email (via Notification Service)

5. Webhook Listener:
   - Verify signature with Stripe secret
   - Parse event and route to appropriate handler
   - Supported events: payment success, failure, subscription cancel, refund

6. Store in PostgreSQL:
   payments (
     id UUID,
     user_id UUID,
     gateway TEXT,
     status TEXT,
     amount NUMERIC,
     currency TEXT,
     session_id TEXT,
     metadata JSONB,
     created_at TIMESTAMPTZ
   )

7. Add DB indexes on user_id, session_id
```

---

## 🔐 Security & Compliance
- Do NOT store card data; rely on tokenized flows
- Validate webhooks with signature + timestamp
- Apply strict CORS, CSRF, and input validation
- Use HTTPS and environment-stored API keys

---

## 📋 User Service Integration

### 🎯 Goal
Update user’s credits or subscription upon confirmed payment.

### ✅ Instructions
```plaintext
1. Expose internal endpoint:
   `POST /users/:id/entitlements`
   - Only callable by Payment Service (internal API key or mTLS)

2. Payload:
   {
     "credits": 10,
     "subscription": {
       "type": "monthly",
       "active_until": "2025-12-31"
     }
   }

3. Store these in the user profile:
   - credits INT DEFAULT 0
   - subscription_type TEXT
   - subscription_expires TIMESTAMPTZ

4. Ensure entitlement enforcement in assignment/evaluation access
```

---

## 🔔 Notification Integration
- On successful payment, notify user via:
  - Email: “Your payment for Plan X is confirmed”
  - Push (optional): “You now have 10 credits available”

---

## 🧪 Testing & Best Practices
- Use Stripe test keys + webhook simulator
- Unit test: session creation, webhook parsing, DB updates
- Integration test: full payment-to-entitlement flow
- Log all payment attempts (success or error)
- Protect webhook endpoints from public abuse

---

## 📦 Deliverables for Sprint 5
- Full Payment Service (API + DB + Webhooks)
- Stripe (or PayPal) Checkout integration
- Secure webhook handler
- User entitlement update system
- Transaction history endpoint
- Notifications on success
- Tests, logging, and OpenAPI documentation

---
