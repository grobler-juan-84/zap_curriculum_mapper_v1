# Phase 5 Prototype — Chalkie Workspace UI

**Status:** ACTIVE  
**Version:** 2.2  
**Route:** `/app/chalkie` (protected)

---

## Purpose and scope

First teacher-facing **UI slice** for Phase 5 lesson packaging: browse the textbook PDF, see concise Phase 1 evidence summaries, and launch a guided teacher-choice setup before prompt preparation.

**In scope:**

- Three-pane layout aligned with Validation Workspace (header, left context, PDF, compact bottom action area).
- Series / book / unit navigation and R2-backed PDF viewing (same authorized pathway as Validation).
- **Unit Summary** and **Visible Pages Summary** derived from Phase 1 canonical or batch JSON only.
- **Prepare Chalkie prompt** launch into a focused four-step teacher-choice overlay ending in a local copy-ready prompt preview.
- Packaging choices: **Single lesson** from the resolved visible pages, or **Two-lesson series** only on the exact BE2 U8 SB 128–129 → WB 104–105 route.
- Optional teacher-triggered **Generate Chalkie lesson draft** via server-side OpenAI (`POST /api/chalkie/generate`); no persistence.
- **Dynamic source-context binding** + **page-scope guard**: lesson title, Step 1, local preview, and OpenAI request metadata all use one resolved context from selected book/unit + open PDF pages.

**Out of scope (explicit):**

- Loading Phase 2–4 experiment markdown into the app / inventing interpretation.
- Persisting generated drafts, creating slides, or submitting to the Chalkie product.
- Arbitrary configurable series packaging beyond the agreed BE2 U8 SB→WB route.
- Validation status writes or ops tooling.
- Book Workspace mock Teacher AI / `chalkie-prompt` quick action.

---

## What was implemented

| Area | Detail |
|---|---|
| Navigation | Sidebar **Chalkie Workspace** → `/app/chalkie` |
| Header | Reuses `ValidationHeader` with verification status badge hidden |
| PDF | Reuses `ValidationPdfPane`; optional callback lifts visible **printed** page numbers to the workspace |
| Left panel | Collapsible Unit Summary + Visible Pages Summary (`chalkieEvidence.ts`) |
| Bottom panel | Calm **Prepare Chalkie prompt** action + helper text (no generated output yet) |
| Overlay | Teacher-choice Steps 1–4 + local prompt preview/copy; optional server OpenAI lesson-draft button after preview |
| Context resolver | `resolveChalkieLessonContext` — book/unit/visible pages → one context; blocks launch when pages are outside the unit or lack page evidence |
| API | `POST /api/chalkie/generate` (teacher-triggered lesson draft; Bearer JWT; `OPENAI_API_KEY` + `OPENAI_MODEL`) |
| Legacy API | `POST /api/generate-chalkie-prompt` still exists; not used by the teacher-choice overlay path |

---

## Teacher-choice overlay: information-source map

This section records the current implementation, so that each visible item can be kept consistent with its source and evidence status. The shared UI renderer is [`TeacherChoiceFlowOverlay.tsx`](../../app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx). It receives one frozen `ChalkieLessonContext` when the teacher selects **Prepare Chalkie prompt**; it does not independently fetch curriculum data.

### Source chain and scope rule

`ChalkieWorkspace.tsx` loads the selected unit's Phase 1 JSON. When a canonical book JSON exists, it first slices it to the selected unit; otherwise it loads that unit's batch JSON. `validationService.ts` produces the `BatchJsonSummary`. The PDF pane reports the currently visible **printed** pages. `resolveChalkieLessonContext.ts` combines the selected book, unit summary, and visible printed pages, then either opens the overlay (`ready`) or shows a scope/evidence guard.

The PDF is the **page-scope selector**, not the normal content extractor. For normal routes, `chalkieEvidence.ts` reads the structured Phase 1 JSON rows whose `printed_page` or linked `page_id` match the visible pages. It therefore supplies the page labels, vocabulary, language, and activities. This is why an otherwise valid spread can show no vocabulary: no vocabulary row is linked to those printed pages. Unit theme/focus is unit-level context and is explicitly labelled as **not visible-page evidence**.

| Overlay screen | What the teacher sees | Immediate source | Underlying source / exception |
|---|---|---|---|
| **Step 1 — What are you teaching now?** | Book, unit, visible page range, current focus, unit-context note, current vocabulary and language | `ChalkieLessonContext` from `resolveChalkieLessonContext.ts` | Normal route: selected book metadata + current PDF printed-page numbers + matching Phase 1 JSON in `chalkieEvidence.ts`. Exact BE2 Student Book Unit 8, pp. 128–129 instead uses curated values in `teacherChoicePrototypeContent.ts`. |
| **Step 2 — What might be useful to reuse?** | Prior-learning cards, including source, frame, reason, caution, and evidence note | `lesson.priorLearningSuggestions` | Currently populated only for the exact BE2 U8 prototype route, from `teacherChoiceSuggestions.ts` (`BE2_U08_AI_SUGGESTIONS`). All other routes receive an empty list; they do not yet query Phase 2/3 mappings. |
| **Step 3 — What do you choose?** | The chosen Step 2 cards and teacher-added language | Overlay session state: `selectedIds`, `teacherAdditions` | Selected cards remain references to the Step 2 fixture data. Teacher-added frame/note text is entered by the teacher in this open overlay only, is labelled unverified, and is not persisted. |
| **Step 4 — What will support this lesson?** | Lesson title, package choice, current lesson recap, selected prior learning, teacher additions, and guidance | Resolved context plus Step 2/3 session state | Single-lesson title is dynamic for normal routes. The two-lesson option, title, and SB pp. 128–129 → WB pp. 104–105 explanation exist only on the exact BE2 U8 prototype route; its workbook evidence is curated in `buildChalkiePromptPreview.ts`, not read from the PDF currently open. |
| **Prompt preview** | Copy-ready prompt and title | `buildChalkiePromptPreview.ts` | Normal single lesson is deterministically assembled from the resolved context plus selections/additions. BE2 U8 uses curated single/series prompt templates in that file, with prototype constants from `teacherChoicePrototypeContent.ts`. |
| **Generated lesson draft** | Returned Markdown draft, title, and package type | `chalkieLessonDraftService.ts` → `POST /api/chalkie/generate` | The request sends the already-assembled local prompt and selected package metadata. The returned draft is session-only, has no curriculum-data fetch in the overlay, and is cleared when it closes. |

### Field-level Step 1 mapping

| Step 1 field | Normal route | BE2 U8 prototype route |
|---|---|---|
| Book label | Selected `Book` record, normalized by `resolveChalkieLessonContext.ts` | Same, normalized to “Big English 2” |
| Unit line and unit page range | Selected unit's `units[0]` summary fields | Same unit identity; fixture only replaces current-page content |
| Visible pages | `ValidationPdfPane` → `onVisiblePrintedPagesChange` → workspace state | Same |
| Current focus | Matching page labels from `summary.pages` in `buildVisiblePagesView` | `BE2_U08_PROTOTYPE_FOCUS` |
| Unit-context note | Unit `theme` or derived `learningFocus` from `buildUnitSummaryView`; never page evidence | Full-unit range note only |
| Vocabulary | Matching `raw.vocabulary` rows (fallback: summarized vocabulary rows linked by `pageId`) | `BE2_U08_VOCABULARY` |
| Language | Matching `raw.language` rows | `BE2_U08_LANGUAGE` |
| Clarification, page labels, activities | No clarification; labels and activities from matching Phase 1 JSON rows. Activity display text preference: `title` → `activity_title` → `instruction` (do not invent labels from prompts, answers, notes, or activity types when a verified instruction exists). Visible-page activity lines are bounded to six. | Curated BE2 U8 constants |

### Regression case — BE3 Unit 8 Grammar pp. 136–137

Canonical Student Book Unit 8 *Healthy Living* Grammar pages `bep3_sb_p136` / `bep3_sb_p137` carry verified Activities **19–23** with `instruction` text and typically **no** page-linked vocabulary or language rows. Before the activity `instruction` fallback, `hasStructuredEvidence` was false and Prepare Chalkie prompt showed “Source evidence is not available for these pages yet.” After the fix, that spread resolves as `ready` from the five verified instructions. This does **not** claim the assembled prompt matches the detailed Experiment 10 handoff — that comparison remains a separate step.

### Guards and consistency rules

- The overlay opens only when visible printed pages are present, fall within the selected unit's verified printed-page range, and have at least one matching vocabulary, language, or activity item. Page labels alone do not qualify.
- Normal routes currently have **no** prior-learning suggestions and cannot use the two-lesson option. Empty Step 2 is intentional, not an evidence lookup failure.
- Do not describe the normal screen as reading text directly from the PDF. Its truthful description is: **Phase 1 JSON content filtered by the pages currently visible in the PDF viewer**.
- Do not present unit-level context, teacher-added language, or BE2 U8 planning allocations as page-scoped publisher evidence.
- Activity evidence may come from verified `instruction` when `title` / `activity_title` are absent; expected answers are not used as activity labels.

### How the four screens are compiled today

The overlay performs no new curriculum fetches after **Prepare Chalkie prompt**. The workspace resolves one `ChalkieLessonContext`, stores it as `activeLesson`, and passes it to the overlay. Steps 2–4 only combine that context with choices held in browser memory.

| Stage | Compilation action | Result used by the next stage |
|---|---|---|
| **Before Step 1** | `ChalkieWorkspace.tsx` loads/slices the selected unit JSON; `ValidationPdfPane` reports visible printed pages; `resolveChalkieLessonContext.ts` validates scope and compiles page-matched evidence. | A single `ChalkieLessonContext`, or a guard message instead of the overlay. |
| **Step 1** | Renders the resolved context unchanged. | The teacher reviews current lesson evidence; nothing is selected or saved. |
| **Step 2** | Renders `priorLearningSuggestions` from that context. | Teacher checkbox IDs are kept in local `selectedIds` state. On normal routes the list is empty today. |
| **Step 3** | Filters Step 2 suggestions by `selectedIds`; appends teacher-entered frames/notes held in local `teacherAdditions` state. | Selected verified suggestions plus explicitly unverified teacher additions. |
| **Step 4** | Re-renders current lesson context and the Step 2/3 local state. It applies the teacher's local package choice (`single` or, for the U8 fixture only, `series`). | Final review inputs; this is still not a generated lesson. |
| **Prompt preview** | `buildChalkiePromptPreview.ts` composes fixed instruction text + resolved page evidence + selections/additions. | Copyable deterministic prompt string. |
| **Optional draft** | `chalkieLessonDraftService.ts` sends the completed prompt, package type, and title to `POST /api/chalkie/generate`. | Session-only Markdown response; it does not change the underlying evidence or selections. |

### Future API-backed prior-learning cards — proposed, not implemented or locked

The appropriate replacement for the U8 fixture is an **evidence-backed retrieval API**, not new hardcoded arrays in the UI. This is a proposed integration boundary only; it does not approve a Phase 2 schema, a Phase 3 policy, or a production endpoint.

1. The workspace resolves the current book, unit, and visible printed pages exactly as it does now.
2. A server-side endpoint receives that bounded context, for example the catalog book ID, current unit ID/number, and visible printed pages. The client must not be trusted to supply arbitrary prior-learning claims.
3. The endpoint retrieves only verified, eligible horizontal-mapping records from the project data store. Each returned candidate needs the information already required by the Step 2 card: stable ID, label, source unit/page reference, language frame, reason, caution, and evidence note.
4. The endpoint returns a typed suggestion list with source/provenance metadata. `resolveChalkieLessonContext.ts` (or a dedicated suggestion resolver) attaches it as `priorLearningSuggestions`; the existing Steps 2–4 UI can then remain substantially unchanged.
5. The teacher selects, rejects, or adds language. The prompt builder preserves the distinction: verified retrieved items are `[HM]`; teacher-entered items remain `[TEACHER-ADDED · UNVERIFIED]`.

Suggested response shape, expressed conceptually rather than as a committed schema:

| Field | Purpose |
|---|---|
| `id` | Stable record identifier used by selection state and auditability. |
| `label`, `frame` | Teacher-facing summary and reusable language frame. |
| `source` | Concise source shown on the card, such as unit and printed-page reference. |
| `whyItMayHelp`, `caution` | Teaching guidance; must remain clearly distinct from source evidence. |
| `evidenceNote` | Human-readable provenance, including enough detail to inspect the underlying record. |
| `provenance` | Machine-readable record/source IDs, evidence location, retrieval version, and eligibility decision for audit/review. |

The current `/api/chalkie/generate` endpoint is **not** this future retrieval API. It only receives a prompt that the browser has already compiled and returns a generated draft. A future suggestion endpoint must keep curriculum retrieval separate from generative lesson drafting.

### Important implementation boundaries

- **Do not move the U8 fixture into a generic fallback.** A missing retrieval result must show no cards; it must not silently show cards from another unit.
- **Do not infer prior learning from topic similarity or use an LLM as the sole evidence source.** Candidate retrieval must be grounded in recorded, reviewable curriculum evidence and eligibility rules.
- **Do not treat prior exposure as mastery.** Cards are optional teaching supports; the teacher may select none.
- **Do not let a suggestion API enlarge current-page scope.** Step 1/page evidence stays limited to the printed pages open in the PDF. Prior learning must be labelled separately.
- **Do not label generated teaching advice as publisher text.** Keep source evidence, mapper interpretation, teacher additions, and model-generated draft content visibly separate.
- **Do not persist teacher additions or selections by accident.** If persistence is later wanted, require an explicit save action, ownership/access rules, and an audit record.
- **Do not use the draft-generation response to rewrite the lesson context.** It is downstream output, not curriculum source of truth.

---

## Environment (OpenAI key)

Server-only secret. Never prefix with `VITE_` (that would expose it to the browser).

| Where | Purpose |
|---|---|
| **Root** [`.env.local`](../../.env.local) (gitignored) | **Put `OPENAI_API_KEY` and `OPENAI_MODEL` here** — Vite middleware via `loadServerEnv` |
| Root [`.env.example`](../../.env.example) | Documented empty template (committed; no secrets) |
| `app/.env.local` | Public Supabase `VITE_*` only — **do not** put OpenAI here |

After adding the key/model, restart the Vite dev server (`npm run dev` in `app/`). Never use `VITE_OPENAI_API_KEY`.

## What remains pending

1. Owner live validation of the OpenAI lesson-draft path; decide keep / harden / park.
2. Optional: teacher page-range picker beyond the current PDF spread.
3. Optional: Vercel/serverless adapter for `/api/chalkie/generate` (local Vite middleware works today).

---

## Current limitations

- Visible scope = current PDF spread only (typically two printed pages).
- Summaries depend on Phase 1 JSON linkage (`printed_page`, `page_id`); sparse links may yield empty spread vocabulary even when activities resolve.
- Activity labels prefer `title` → `activity_title` → `instruction`; spreads that are activity-only (e.g. BE3 U8 Grammar pp. 136–137) can now open the teacher-choice flow, but the prompt is still a generic dynamic single-lesson assembly — not Experiment 10.
- Local prompt preview remains deterministic and copyable; OpenAI is called only when the teacher presses **Generate Chalkie lesson draft**.
- Generated drafts are session-local only (cleared on overlay close); nothing is persisted.
- Two-lesson series uses Workbook pp. 104–105 as packaging source evidence; those pages may not be the PDF open in the workspace viewer.
- Curated BE2 U8 fixture (prior-learning cards + SB→WB series) applies only to the exact route `big_english_2_sb` Unit 8 with visible pages **128–129**. Horizontal suggestions remain fixture-only for that route.
- Other in-unit spreads use Phase 1 visible-page evidence only (single-lesson path); missing page evidence blocks generation honestly.
- Header may still show “from canonical” when applicable; verification status is hidden only.

---

## Relationship to Phase 5 methodology and Phase 6

- Aligns with **page-scoped packaging** discipline documented in [`p5-exp-be2-u08-p128-129-chalkie-brief-v1.md`](./p5-exp-be2-u08-p128-129-chalkie-brief-v1.md) (manual paste brief; not yet automated).
- **Phase 6** [`chalkie-ai-handover-specifications.md`](../phase-6/chalkie-ai-handover-specifications.md) remains **PARKED** for downstream generation productization; this prototype is Phase 5 teacher packaging UI, not Phase 6 lesson generation.

---

## Change log

| Date | Change |
|---|---|
| 2026-10-10 | Initial UI prototype on `feature/chalkie-workspace`. |
| 2026-10-10 | Owner approved UI prototype and pp. 128–129 packaging brief; OpenAI wiring not started. |
| 2026-10-10 | Documented `OPENAI_API_KEY` env setup (root `.env.local`); Generate route still pending. |
| 2026-10-10 | Wired Generate via OpenAI server route; copy controls enabled. |
| 2026-10-19 | Bottom panel replaced with **Prepare Chalkie prompt** launch; Step 1 teacher-choice overlay for BE2 U8. |
| 2026-10-19 | Step 2 AI suggestions (four unchecked prior-learning rows; local selection; Step 3 placeholder). |
| 2026-10-19 | Step 3 Your choices: review selections, teacher-added language, use-no-prior-learning; Step 4 placeholder. |
| 2026-10-19 | Step 4 Lesson-input summary: current lesson + selected/teacher-added inputs; Back to workspace without generation. |
| 2026-10-19 | Local Chalkie prompt preview/copy from Step 4; removed non-page kangaroo Q&A from Steps 1/4 current language. |
| 2026-10-19 | Step 4 lesson-shape choice (Single lesson default; two-lesson series visible but unavailable) + copyable lesson title. |
| 2026-10-19 | Enabled BE2 U8 two-lesson series local preview (SB 128–129 → WB 104–105) with left prompt / right Lesson 1–2 rundown. |
| 2026-10-19 | Added teacher-triggered server-side OpenAI lesson-draft path (`POST /api/chalkie/generate`); no persistence. |
| 2026-10-19 | Dynamic source-context binding and page-scope guard; horizontal suggestions remain fixture-only for BE2 U8 pp. 128–129. |
| 2026-10-20 | Documented the end-to-end source map for every teacher-choice screen, including the Phase 1 JSON/PDF scope distinction and BE2 U8 fixture exceptions. |
| 2026-10-20 | Added the four-screen compilation sequence, proposed API-backed card-retrieval boundary, and evidence/provenance safeguards. |
| 2026-10-20 | Activity evidence resolution: `title` → `activity_title` → `instruction`; visible activity bound raised to six; BE3 U8 pp. 136–137 regression noted. |
