# General Curriculum Mapper — Technology Stack

**Status:** ACTIVE / EVOLVING  
**Project:** General Curriculum Mapper  
**Purpose:** Define the preferred technology stack and high-level technical architecture for the General Curriculum Mapper.

---

# 1. Technology Philosophy

The General Curriculum Mapper should use a modern, maintainable stack that supports:

- structured curriculum data;
- AI-assisted curriculum processing;
- human verification;
- curriculum exploration and comparison;
- future teacher-facing tools;
- and eventual SaaS deployment.

The project should favour technologies that are:

- widely supported;
- reasonably easy to maintain;
- suitable for incremental development;
- compatible with AI-assisted coding;
- and capable of evolving as the curriculum model becomes more mature.

The architecture should remain modular.

The project should avoid prematurely building complex infrastructure before real curriculum data demonstrates that it is necessary.

---

# 2. Locked Technology Stack

| Layer | Locked Technology | Role |
|---|---|---|
| Frontend | React | Application UI |
| Build Tool | Vite | Frontend development and build tooling |
| Language | TypeScript | Primary frontend/application language |
| Styling | Tailwind CSS | UI styling |
| Backend platform | Supabase | Hosted PostgreSQL, Auth, Storage, and related backend services when required |
| Backend / API logic | TypeScript and/or Python | Application logic, AI workflows and data processing |
| AI | Google Gemini API | Curriculum extraction and AI-assisted curriculum processing |
| Structured Curriculum Data | JSON | Canonical curriculum dataset format |
| Database | Supabase PostgreSQL | Application, operational and relational metadata |
| Flexible Database Storage | PostgreSQL JSONB | Available where database persistence/querying of curriculum documents is useful |
| File / Object Storage | Supabase Storage | PDFs, canonical JSON files and other large artifacts when object storage is required |
| Authentication | Supabase Auth | User authentication and authorization when required |
| Hosting | Vercel preferred for frontend | Web application deployment |
| Version Control | Git + GitHub | Source control and project history |
| Development Environment | Cursor | Primary AI-assisted coding environment |
| Python tooling | Python (scripts/libraries) | Validation, processing, batch/document work, AI workflows |

### Locked vs currently implemented

| Area | Status |
|---|---|
| Vite + React + TypeScript + Tailwind app under `app/` | **Implemented** — landing, auth pages, app shell, curriculum/series libraries, book workspace prototype, Validation workspace |
| Supabase Auth + `profiles` | **Implemented** — login/signup/forgot/reset; role on profile (`teacher` / `admin`) |
| Curriculum catalog (Postgres) | **Implemented** — live `book_series` / `books` / `book_files` / `dataset_versions` with RLS; UI loads catalog from Supabase |
| Private Storage buckets | **Implemented** — `book-sources`, `book-datasets`, `book-assets`; upload scripts under `scripts/` |
| Phase 1 Validation UI (`/app/validation`) | **Implemented** — unit-batch JSON + source PDF (PDF.js) + admin status writes to `book_files.status` |
| Book Workspace interactive spreads | **Partial / mock** — Beehive 1 page spreads only; other books show empty state |
| Teacher AI assistant | **Mock** — deterministic responses; Gemini not wired |
| Gemini API integration | Locked provider preference; **not implemented** in the app |
| Automated extraction pipeline | **Not implemented** — Phase 1 extraction is manual via Google AI Studio |
| Python processing/validation tools | Environment scaffolded; no production curriculum tools yet |
| Vercel deployment | Preferred; **not deployed** from this repo |

Locking a technology does **not** mean every capability is finished. Prefer [`docs/5-PROGRESS.md`](./5-PROGRESS.md) for the live snapshot.

---

# 3. Frontend

The preferred frontend stack is:

```text
Vite
+
React
+
TypeScript
+
Tailwind CSS
```

React should provide the primary application interface.

Vite should provide the development and build environment.

TypeScript should be preferred over plain JavaScript for application code because the project will eventually work with increasingly structured curriculum data and API contracts.

Tailwind CSS should provide the primary styling system.

The frontend should remain component-based and feature-oriented rather than becoming one large application layer.

---

# 4. Frontend Architecture

Where practical, the application should use a **feature-based architecture**.

Example:

```text
src/
├── app/
├── components/
├── features/
│   ├── curriculum-browser/
│   ├── extraction/
│   ├── verification/
│   ├── mapping/
│   └── lesson-planning/
├── services/
├── lib/
├── types/
└── utils/
```

Exact folders should emerge from real application requirements.

Do not create architectural layers merely because they may eventually be useful.

---

# 5. UI Separation

Where practical, the interface should distinguish between:

```text
Application Shell
↓
Feature / View
↓
Reusable Components
```

The application shell may eventually contain persistent elements such as:

- navigation;
- account controls;
- project or curriculum selection;
- global application actions;
- and status information.

Individual curriculum tools should live inside clearly separated feature areas.

Reusable UI components should remain independent of specific curriculum datasets wherever practical.

---

# 6. Curriculum Data

The canonical curriculum representation should initially remain:

> **Structured JSON**

Phase 1 extraction produces structured JSON representing curriculum evidence.

Canonical datasets should eventually exist at book level.

Example:

```text
beehive_1_sb.json
big_english_1_sb.json
reach_higher_2a.json
```

Unit-level JSON files may exist during extraction and verification.

These are working artifacts.

Once processing is complete, verified unit batches should ultimately contribute to a canonical book dataset.

---

# 7. JSON as Curriculum Source of Truth

The curriculum model is still evolving.

Different textbook series contain different structures.

For this reason, the project should avoid prematurely forcing all curriculum entities into a large fixed relational database schema.

The preferred current direction is:

```text
Canonical Curriculum Data
        ↓
JSON / JSONB document
```

rather than immediately creating permanent relational tables for every:

```text
unit
page
vocabulary item
language structure
activity
curriculum component
relationship
```

The Phase 1 schema should first be tested and stabilized using real curriculum sources.

Relational projections can be introduced later where a real product requirement justifies them.

---

# 8. Database Direction

The locked relational database provider is:

> **Supabase PostgreSQL**

PostgreSQL is expected to support stable application and operational data such as:

- users;
- organizations;
- permissions;
- curriculum source registry;
- dataset versions;
- processing jobs;
- verification status;
- extraction status;
- and application metadata.

Canonical curriculum data remains JSON-first.

Do not normalize Phase 1 curriculum JSON into relational tables until a concrete product requirement justifies it.

PostgreSQL JSONB may be used later where persisting/querying curriculum documents inside the database is useful.

---

# 9. Hybrid Data Architecture

The current preferred architectural direction is a hybrid model:

```text
Curriculum Content
        ↓
JSON / JSONB

Application Metadata
        ↓
PostgreSQL relational tables
```

This allows the curriculum schema to evolve without requiring constant database migrations while preserving relational structure for stable SaaS concerns.

If future features require efficient querying across thousands of curriculum entities, selected curriculum information may later be projected into relational tables or another search/indexing layer.

That decision should be driven by demonstrated product requirements rather than assumed in advance.

---

# 10. Source Files and Object Storage

Original curriculum files such as PDFs should not normally be stored directly inside the relational database.

Long-term storage may include:

```text
Supabase Storage
├── source PDFs
├── extraction artifacts
├── canonical JSON datasets
└── generated exports
```

The locked object-storage provider is:

> **Supabase Storage**

Private buckets and upload workflows are in use for the pilot:

- `book-sources` — source PDFs  
- `book-datasets` — unit-batch (and later canonical) JSON  
- `book-assets` — series/book cover images  

See `supabase/migrations/`, `supabase/README.md`, and `scripts/upload_*.mjs`.

---

# 11. Backend / API Layer

The frontend should not communicate directly with privileged services or expose private API credentials.

The intended architecture is:

```text
React Frontend
        ↓
Backend / API
        ↓
AI Services
Database
Object Storage
```

Backend functionality may initially use TypeScript server-side functions where this provides the simplest implementation.

Python may be introduced where it provides clear advantages for:

- AI workflows;
- data processing;
- validation;
- curriculum analysis;
- batch processing;
- document processing;
- or future machine-learning functionality.

The project does not need to choose exclusively between TypeScript and Python.

Each should be used where it provides the clearest practical benefit.

---

# 12. AI Layer

The current AI extraction workflow is based on Google Gemini through Google AI Studio.

The future application should be capable of moving this workflow toward:

> **Google Gemini API**

A future automated flow may resemble:

```text
Curriculum Source
        ↓
Backend Processing
        ↓
Gemini API
        ↓
Structured JSON
        ↓
Schema Validation
        ↓
Human Verification
        ↓
Canonical Dataset
```

AI-generated curriculum data must not automatically be treated as verified curriculum truth.

Human verification and source traceability remain important architectural requirements.

---

# 13. AI Provider Independence

Although Gemini is the current preferred AI provider for curriculum extraction, the broader application architecture should avoid unnecessary dependence on one model provider.

Where practical, AI functionality should be accessed through a service layer.

Conceptually:

```text
Application
        ↓
AI Service
        ↓
Provider
```

rather than tightly coupling curriculum features directly to a specific provider SDK throughout the application.

This leaves room for:

- model changes;
- provider changes;
- different models for different tasks;
- testing;
- cost optimization;
- and future capabilities.

This does not require building a complex multi-provider abstraction immediately.

---

# 14. Validation Layer

Structured AI output should be validated before entering the trusted curriculum dataset.

The system should eventually support validation such as:

```text
AI Output
↓
JSON Parsing
↓
Schema Validation
↓
Structural / Integrity Checks
↓
Human Verification
↓
Approved Dataset
```

Validation should detect problems such as:

- malformed JSON;
- missing required fields;
- invalid identifiers;
- broken relationships;
- invalid classifications;
- duplicate records;
- missing references;
- and incompatible schema versions.

Automated structural validation does not replace human curriculum verification.

---

# 15. Hosting

The preferred frontend deployment direction is:

> **Vercel**

Vercel is suitable for hosting the Vite/React application and potentially lightweight backend/serverless functionality.

However, Vercel's application filesystem should not be treated as persistent curriculum storage.

Persistent data should live in:

```text
Database
and/or
Object Storage
```

The application should retrieve that data through APIs or storage services.

---

# 16. Development Environment

The primary development environment is:

> **Cursor**

Cursor is used for:

- application development;
- project documentation;
- repository maintenance;
- AI-assisted coding;
- code review;
- refactoring;
- and project workflow automation.

Project documentation should remain inside the repository so that development decisions and technical context remain available alongside the code.

---

# 17. Version Control

Version control uses:

```text
Git
+
GitHub
```

The project repository should contain:

- application source code;
- technical documentation;
- project rules;
- schema definitions;
- development datasets where appropriate;
- tests;
- scripts;
- and configuration.

Sensitive information must not be committed.

This includes:

- API keys;
- passwords;
- private credentials;
- production secrets;
- and environment-specific secrets.

These should use environment variables or appropriate secret-management systems.

---

# 18. Current Development Architecture

The project is currently still primarily in curriculum-data development rather than full SaaS implementation.

The current practical workflow is approximately:

```text
Curriculum PDF
        ↓
Google AI Studio / Gemini
        ↓
Phase 1 JSON batches
        ↓
Human Verification
        ↓
Repository
        ↓
Canonical Dataset
```

The future application architecture is expected to evolve toward:

```text
User
↓
React Application
↓
Backend / API
↓
Gemini + Validation
↓
Persistent Storage
↓
Human Verification
↓
Canonical Curriculum Dataset
↓
Curriculum Mapping / Enrichment / Lesson Tools
```

The second architecture is a direction, not a claim that all components currently exist.

---

# 19. Architecture Principle

The project should follow:

> **Build the smallest useful architecture supported by current evidence.**

Avoid premature complexity.

Do not build:

- large relational curriculum schemas before the JSON model stabilizes;
- unnecessary microservices;
- elaborate AI orchestration frameworks;
- complex queues before asynchronous processing requires them;
- multiple abstraction layers without a concrete use case;
- or infrastructure designed only for hypothetical future scale.

The project should remain capable of becoming more sophisticated without requiring that sophistication from the beginning.

---

# 20. Current Technical Decisions vs Open Decisions

## Locked

```text
Frontend              → Vite + React + TypeScript
Styling               → Tailwind CSS
Backend platform      → Supabase
Database              → Supabase PostgreSQL
Flexible documents    → PostgreSQL JSONB where useful
Object storage        → Supabase Storage
Authentication        → Supabase Auth
Curriculum format     → JSON canonical datasets (JSON-first)
AI                    → Google Gemini API
Frontend hosting      → Vercel preferred
Versioning            → Git + GitHub
Development           → Cursor
Architecture          → Feature-based / modular
Data strategy         → Hybrid JSON + relational app/ops metadata
Python                → processing / validation / AI tooling where appropriate
```

## Not yet locked / not yet implemented

```text
Exact backend API shape (beyond direct Supabase client from the Vite app)
Exact Python library choices beyond the tooling folder
Background-job / automated extraction factory
Search/indexing technology
Final production deployment architecture beyond Vercel preference
Final relational curriculum projections (if any)
When/how to use JSONB for curriculum documents
Gemini (or other) live AI in the teacher assistant
Canonical merge tooling and dataset_versions population
Automated structural validation of Phase 1 JSON
```

Live Supabase Auth, catalog tables, RLS, Storage buckets, and the Validation UI are already implemented for the pilot. Remaining items should be decided when product requirements provide enough evidence.

---

# 21. Guiding Principle

Technology exists to support the curriculum system.

The project should not reshape the curriculum model merely because a particular framework, database or hosting platform prefers a different structure.

The intended direction is:

> **Understand the curriculum first. Stabilize the data second. Build the software around that evidence.**

The technology stack should remain flexible enough to support that process as the General Curriculum Mapper develops.