# 📦 Sprint 2 – Assignments, CDN, Blob Storage

## 🧠 Objective
Implement services to handle assignments (CRUD, levels, languages), integrate blob storage for asset uploads, and connect a CDN for optimized content delivery.

---

## 📚 Assignment Service (Backend Microservice)

### 🎯 Goal
Allow teachers/admins to create and manage assignments by subject, level, language, and type. Allow students to retrieve their personalized assignments.

### ✅ Requirements
- Use **MongoDB** for flexible schema (JSON structure)
- Indexed on `subject`, `level`, `language`, and `assigned_to`
- Must be a **REST API**
- Include basic input validation and role checks

### 🔧 Implementation Instructions
```plaintext
1. Technologies:
   - Language: Python (FastAPI) or Node.js (Express)
   - DB: MongoDB
   - Auth: JWT middleware (student/teacher/admin distinction)

2. Endpoints:
   - `POST /assignments` – teacher/admin creates assignment
   - `GET /assignments` – student fetches available assignments (by level/language)
   - `PUT /assignments/:id` – teacher updates content
   - `DELETE /assignments/:id` – teacher/admin deletes
   - `GET /assignments/:id` – get details

3. MongoDB schema:
   {
     _id: ObjectId,
     title: String,
     subject: "math" | "reading" | "physics" | "writing",
     level: "beginner" | "intermediate" | "advanced",
     language: "en" | "fr" | "es" | etc,
     content_url: String,
     questions: [ { type: "multiple_choice" | "short_answer", text: String, choices: [], answer: Any } ],
     assigned_to: [user_id],
     created_by: user_id,
     created_at, updated_at
   }

4. Add indexes on subject, level, language, assigned_to

5. Ensure teachers can only modify their own content unless admin
6. Input validation + content sanitization
```

---

## 🗃️ Blob Storage (S3 / Azure Blob / GCP Storage)

### 🎯 Goal
Enable secure upload and retrieval of files (PDFs, diagrams, audio) tied to assignments.

### ✅ Requirements
- Store assets under `/assignments/{assignmentId}/[filename]`
- Generate **pre-signed upload/download URLs**
- No direct file handling by backend services

### 🔧 Implementation Instructions
```plaintext
1. Create an S3 bucket (or Blob container)
2. Configure bucket policy:
   - Private by default
   - Allow only signed URL access

3. Add API to Assignment Service:
   - `POST /assignments/:id/upload-url` – returns presigned PUT URL
   - `GET /assignments/:id/download-url` – returns presigned GET URL

4. Ensure signed URLs are:
   - Valid for 5–15 minutes
   - Encrypted in transit (HTTPS)

5. Store `content_url` in assignment document
```

---

## 🚀 CDN Integration (CloudFront / Azure CDN)

### 🎯 Goal
Serve static content (e.g. assignments, lesson PDFs, media) via edge locations with low latency.

### ✅ Requirements
- Integrate **CDN in front of the storage bucket**
- Use **cache headers** to optimize delivery
- Restrict direct public access to the bucket

### 🔧 Implementation Instructions
```plaintext
1. Point CDN origin to S3 bucket (or equivalent)
2. Use signed CDN URLs or restrict origin by referer/header
3. Cache content types:
   - PDFs: 7 days
   - Images/audio: 30 days
   - JSON/text: no-cache

4. Add URL mapping for frontend:
   - `/cdn/assignments/{...}` → actual CDN path

5. Test global access latency from multiple regions
```

---

## 🔐 Security Considerations
- Validate file type and size before generating upload URL
- Use antivirus or content scanning tools for uploaded files (optional)
- Set IAM roles/policies strictly per-service
- Audit all upload/download events in logs

---

## 🧪 Testing & Best Practices
- Mock S3/CDN during testing
- Integration tests for file upload/download flows
- Use Postman/Insomnia collection for assignment endpoints
- Include OpenAPI/Swagger documentation

---

## 📦 Deliverables for Sprint 2
- Assignment Service with full CRUD
- Role-based access to assignments
- Indexed MongoDB schema
- Secure file upload + retrieval with pre-signed URLs
- CDN integration with proper caching
- Swagger docs + test suite

---
