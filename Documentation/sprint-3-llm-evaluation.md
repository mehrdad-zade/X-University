# 🧠 Sprint 3 – LLM Integration & Evaluation

## 🧠 Objective
Integrate a large language model (LLM) to generate content for assignments (reading, writing, questions) and implement the Evaluation Service to assess student responses and provide feedback.

---

## 📖 Content Generation Service (LLM Integration)

### 🎯 Goal
Generate multi-language reading/writing content and comprehension questions based on subject, level, and language.

### ✅ Requirements
- Use OpenAI GPT or fine-tuned LLM via API
- Inputs: subject, level, language, question count
- Output: structured content + questions
- Must sanitize and rate-limit user input to avoid abuse

### 🔧 Implementation Instructions
```plaintext
1. Language: Python or Node.js service
2. API Endpoint: 
   - `POST /content/generate` with payload:
     {
       "subject": "reading",
       "level": "beginner",
       "language": "fr",
       "question_count": 5
     }

3. Use prompt templates:
   - “Generate a {level} {subject} passage in {language} followed by {n} comprehension questions.”
   - Validate prompt to prevent prompt injection

4. Call OpenAI API (or local model) and parse response into:
   {
     "content": "...",
     "questions": [
       {"type": "short_answer", "question": "..."},
       ...
     ]
   }

5. Store generated content in Blob storage and link in MongoDB

6. Rate limit by user/session (e.g. 3 generations/hour)

7. Log all prompts and completions securely for debugging
```

---

## 📝 Evaluation Service

### 🎯 Goal
Grade student responses automatically using AI or predefined answers. Provide hints/feedback.

### ✅ Requirements
- Securely accept student answers
- Compare against correct answers or evaluate via LLM
- Return score, feedback, and learning suggestion

### 🔧 Implementation Instructions
```plaintext
1. Language: Python (FastAPI) or Node.js
2. API Endpoints:
   - `POST /evaluate` with payload:
     {
       "assignment_id": "...",
       "question_id": "...",
       "answer": "...",
       "user_id": "..."
     }

3. Evaluation types:
   a. **Static answer check** (if exact match exists)
   b. **LLM scoring**: prompt like:
      “Evaluate this student response:
Q: {question}
A: {answer}”
      - Return 0-5 score and feedback string

4. Response format:
   {
     "score": 4,
     "feedback": "Good answer, but you missed...",
     "suggestion": "Re-read paragraph 2 about..."
   }

5. Log each evaluation event in DB (Mongo or PostgreSQL)

6. Store feedback for teacher view (analytics)

7. Prevent re-evaluation spam via cooldown or limit

8. Audit logging for traceability
```

---

## 🛡️ Security & Privacy
- Never store raw student answers in logs
- Mask PII in prompt logs (names, email, etc.)
- Validate all inputs, throttle API abuse
- Sign evaluation payloads for integrity (optional)

---

## 🧪 Testing & Best Practices
- Mock LLM in unit tests (predictable response)
- Tests for prompt formatting and response parsing
- Use retries for LLM API call failures
- Document prompt templates in codebase

---

## 📦 Deliverables for Sprint 3
- Content Generation API with structured output
- Safe prompt templates per subject/language
- LLM-based and static evaluation support
- Feedback system with learning suggestions
- Full audit logging and rate limiting
- Tests and OpenAPI documentation

---
