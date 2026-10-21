# Phase 5 Prototype — Chalkie Workspace UI

**Status:** ACTIVE  
**Version:** 2.16  
**Route:** `/app/chalkie` (protected)

---

## Purpose and scope

First teacher-facing **UI slice** for Phase 5 lesson packaging: browse the textbook PDF, see concise Phase 1 evidence summaries, and launch a guided teacher-choice setup before prompt preparation.

### Platform boundary (deliberate)

**Chalkie Workspace is a Chalkie-specific handoff adapter, not the project’s curriculum or lesson-planning source of truth.** Its copyables deliberately use the workflow Chalkie currently responds to best. The durable layer is the verified source evidence, SB→WB component mappings, teacher-selected prior learning, scope, and future neutral lesson package.

If another generator later becomes more suitable, add a parallel workspace (for example, MagicSchool Workspace or Canva Workspace) that translates the same package for that platform. Do **not** rename or replace Chalkie Workspace, rebuild the curriculum mapping, or hardwire every lesson prompt again. This is an architectural boundary and future direction, not authorization to build another integration now. See [F021](../7-future.md).

### Student Book–first preparation ([D021](../4-decisions.md) — LOCKED)

Standard teacher workflow starts from the **Student Book** unit/component. Teachers may view the Workbook; they do **not** create a separate Workbook-origin Single Lesson, and they are not asked to choose SB vs WB as the generation origin. Verified SB→WB companions may attach WB as consolidation/practice with a clear SB/WB evidence split; unverified pairs must not be guessed. Workbook data and mappings remain.

**Implemented UI slice (2026-10-21):** teacher book dropdown is Student Books only (display e.g. `Big English 3`); optional **View Workbook** / **View Student Book** toggle when a verified companion exists (mapped pages only; PDF nav locked); left panel **SB Pages Summary** + conditional **WB Pages Summary**; prepare prompt stays SB-anchored in both viewer states.

**In scope:**

- Three-pane layout aligned with Validation Workspace (header, left context, PDF, compact bottom action area).
- Series / Student Book / unit navigation and R2-backed PDF viewing (Workbook books omitted from teacher dropdown; WB PDF still loadable via verified companion toggle).
- **Unit Summary**, **SB Pages Summary** (primary lesson source), optional **WB Pages Summary** (verified companion only), and **Unit Intelligence**.
- **Unit Intelligence** — read-only Phase 2 Book Intelligence overview for the selected book/unit (Storage-backed loader when registered); labelled planning support, **not** current-page source evidence; does not alter handoff/context. **This is the teacher-facing home for Book Intelligence content** — the dedicated `/app/book-intelligence` preview UI is retired (legacy URLs redirect here).
- **Prepare Chalkie prompt** launch into a focused three-step teacher-choice overlay ending in a local four-artifact handoff (title, detailed prompt, concise outline, suggested vocabulary) — always SB-anchored.
- Packaging choices: **Single lesson** from the resolved SB pages, or **Two-lesson series** on (a) the curated BE2 U8 fixture, (b) the accepted BE3 U8 opener pair SB 128–129 → WB 104–105, or (c) the asymmetric BE3 U8 story pair SB 130–131 → WB **p.106 only** — each with six local copyables ([`chalkie-be3-u08-sb-wb-pairing-gap-v0.1.md`](./chalkie-be3-u08-sb-wb-pairing-gap-v0.1.md)). Opener production Chalkie series: **PASS AFTER LIGHT TEACHER REVIEW** ([`chalkie-be3-u08-sb-wb-production-pilot-results-v0.1.md`](./chalkie-be3-u08-sb-wb-production-pilot-results-v0.1.md)). Story series local handoff: **ACCEPTED FOR PROVISIONAL USE** (no Story Chalkie export claimed; no further Story Chalkie experiments now). No other BE3 series mappings.
- Fully local, deterministic handoff — no visible OpenAI / model-draft step.
- **Dynamic source-context binding** + **page-scope guard**: lesson title, Step 1, and local handoff all use one resolved context from selected Student Book/unit + SB printed pages (frozen while inspecting WB).

**Out of scope (explicit):**

- Feeding Unit Intelligence (or any Phase 2 interpretation) into source scope, prior learning, vocabulary, packaging, or Chalkie handoff builders.
- Loading arbitrary Phase 2–4 experiment markdown into the app / inventing interpretation beyond the registered Book Intelligence Storage overview.
- Calling or exposing the dormant OpenAI lesson-draft endpoint from the current handoff UI.
- Persisting generated drafts, creating slides, or submitting to the Chalkie product.
- Arbitrary configurable series packaging beyond the agreed BE2 U8 fixture and the two accepted BE3 U8 curated SB→WB pairs (opener; asymmetric story).
- Validation status writes or ops tooling.
- Book Workspace mock Teacher AI / `chalkie-prompt` quick action.

---

## What was implemented

| Area | Detail |
|---|---|
| Navigation | Sidebar **Chalkie Workspace** → `/app/chalkie` |
| Header | Reuses `ValidationHeader` with verification status badge hidden |
| PDF | Reuses `ValidationPdfPane`; optional callback lifts visible **printed** page numbers to the workspace |
| Left panel | Unit Summary + SB Pages Summary + optional WB Pages Summary + Unit Intelligence |
| WB toggle | **View Workbook** / **View Student Book** when curated companion matches visible SB pages; PDF nav locked on mapped WB pages only |
| Bottom panel | Calm **Prepare Chalkie prompt** action + helper text (no generated output yet) |
| Overlay | Teacher-choice Steps 1–3 + local handoff only (title, detailed prompt, concise outline, suggested vocabulary) |
| Context resolver | `resolveChalkieLessonContext` — book/unit/visible pages → one context; blocks launch when pages are outside the unit or lack page evidence |
| API | `POST /api/chalkie/generate` remains on disk (**dormant**; not exposed or called from the current handoff UI) |
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
| **Step 2 — What might be useful to reuse?** | Prior-learning cards plus **Add language of your own** (frame, optional note, Add) on one screen; selected-count in the footer | `lesson.priorLearningSuggestions` + overlay `selectedIds` / `teacherAdditions` | BE2 U8: curated `[HM]` cards. Other ready routes: same-unit earlier-page `[PRIOR]` vocabulary bundles. Custom language is teacher-entered, labelled unverified, session-only. The old separate “What do you choose?” confirmation step is removed. |
| **Step 3 — What will support this lesson?** | Lesson title, package choice, current lesson recap, selected prior learning, teacher additions, and guidance; then four separate copyable handoff items: title, detailed prompt, concise outline, suggested Chalkie vocabulary | Resolved context plus Step 2 session state | Suggested vocabulary uses current-page words/models only (not PRIOR/HM/teacher-added). Empty state when none exist. Detailed prompt and outline unchanged. |
| **Prompt preview / handoff** | Copy-ready title, detailed prompt, concise outline, suggested vocabulary; optional small `Ref:` line for tracking | `buildChalkieLessonNaming.ts`, `buildChalkiePromptPreview.ts`, `buildChalkieConciseOutline.ts`, `buildSuggestedChalkieVocabulary.ts` | Teacher-facing title uses `{series} {SB\|WB} Unit {NN} {page ref} — {unit title} — {short focus}` (e.g. BE3 SB Unit 08 pp. 132–133 — Healthy Living — Asking About Yesterday). Stable ref e.g. `be3-sb-u08-p132-133` is tracking-only (not copied). Optional `-l01` / `-l02` may be appended later for multi-lesson spreads. Detailed prompt keeps full book/unit/page wording. |

### Field-level Step 1 mapping

| Step 1 field | Normal route | BE2 U8 prototype route |
|---|---|---|
| Book label | Selected `Book` record, normalized by `resolveChalkieLessonContext.ts` | Same, normalized to “Big English 2” |
| Unit line and unit page range | Selected unit's `units[0]` summary fields | Same unit identity; fixture only replaces current-page content |
| Visible pages | `ValidationPdfPane` → `onVisiblePrintedPagesChange` → workspace state | Same |
| Current focus | Matching page labels from `summary.pages` in `buildVisiblePagesView` | `BE2_U08_PROTOTYPE_FOCUS` |
| Unit-context note | Unit `theme` or derived `learningFocus` from `buildUnitSummaryView`; never page evidence | Full-unit range note only |
| Lesson topic | Page-linked curriculum-component titles (preferred) or `page_heading` — orientation only, not a teaching aim. | Not used on BE2 U8 fixture |
| Words and models | Dedicated `vocabulary` rows when present; otherwise conservative activity-item models (bracket fills; base→form match pairs; `matching_and_speaking` phrase halves). Bound **24**. Chart/comprehension dumps skipped. UI: **Current words and models**. | `BE2_U08_VOCABULARY` |
| Language | Dedicated rows via `prompt`/`response`, else verified `full_text`; activity `language_frame` with `|` separating complete Q&A exchanges (`/` inside an exchange preserved). | `BE2_U08_LANGUAGE` |
| Teaching focus | Deterministic planning summary; vocabulary/song, story/reading, and CLIL lanes take priority over secondary `Did…?` frames; grammar / LiA past-tense behaviour unchanged (`read_and_match` alone is not irregular evidence). | Curated prototype focus string |
| Clarification, page labels, activities | No clarification; labels and activities from matching Phase 1 JSON rows. Activity display text preference: `title` → `activity_title` → `instruction`. Visible-page activity lines are bounded to six. | Curated BE2 U8 constants |

### Regression case — BE3 Unit 8 Grammar pp. 136–137

Canonical Student Book Unit 8 *Healthy Living* Grammar pages `bep3_sb_p136` / `bep3_sb_p137` carry verified Activities **19–23** with typically **no** dedicated vocabulary/language rows. After the instruction fallback and activity-derived model/frame extraction, the spread resolves as `ready` and Screen 1 / prompt can show regular/irregular past models, Act 23 language frames, and a derived teaching-focus planning summary. This does **not** claim Experiment 10 handoff parity.

### Guards and consistency rules

- The overlay opens only when visible printed pages are present, fall within the selected unit's verified printed-page range, and have at least one matching vocabulary, language, or activity item. Page labels alone do not qualify.
- Normal routes may show same-unit earlier-page vocabulary bundles on Step 2; they still cannot use the two-lesson option. Empty Step 2 means no earlier verified target vocabulary was found in the loaded unit summary.
- Do not describe the normal screen as reading text directly from the PDF. Its truthful description is: **Phase 1 JSON content filtered by the pages currently visible in the PDF viewer**.
- Do not present unit-level context, teacher-added language, or BE2 U8 planning allocations as page-scoped publisher evidence.
- Activity evidence may come from verified `instruction` when `title` / `activity_title` are absent; expected answers are not used as activity labels.

### How the four screens are compiled today

The overlay performs no new curriculum fetches after **Prepare Chalkie prompt**. The workspace resolves one `ChalkieLessonContext`, stores it as `activeLesson`, and passes it to the overlay. Steps 2–4 only combine that context with choices held in browser memory.

| Stage | Compilation action | Result used by the next stage |
|---|---|---|
| **Before Step 1** | `ChalkieWorkspace.tsx` loads/slices the selected unit JSON; `ValidationPdfPane` reports visible printed pages; `resolveChalkieLessonContext.ts` validates scope and compiles page-matched evidence. | A single `ChalkieLessonContext`, or a guard message instead of the overlay. |
| **Step 1** | Renders the resolved context unchanged. | The teacher reviews current lesson evidence; nothing is selected or saved. |
| **Step 2** | Renders suggestion cards and custom-language controls together. | `selectedIds` + `teacherAdditions` in overlay session state; footer shows selection counts. |
| **Step 3** | Re-renders current lesson context and Step 2 local state; package choice (`single` or BE2 U8 `series`); then local prompt preview. | Confirmation of inputs; still not a persisted generated lesson. |
| **Prompt preview / handoff** | Local builders compose title, detailed prompt, concise outline, and suggested vocabulary from the resolved context + selections. | Four copyable local artifacts. The OpenAI lesson-draft path is dormant and not called. |

### Future API-backed prior-learning cards — proposed, not implemented or locked

The appropriate replacement for the U8 fixture is an **evidence-backed retrieval API**, not new hardcoded arrays in the UI. This is a proposed integration boundary only; it does not approve a Phase 2 schema, a Phase 3 policy, or a production endpoint. Its required future coverage is both **earlier lessons/pages in the current unit** and **earlier units in the same book**; both remain optional teacher-selected supports, never automatic assumptions of mastery.

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

## Environment (OpenAI key — dormant path only)

The lesson-draft endpoint and env wiring remain on disk for a possible future prompt/question capability. The current Chalkie handoff UI does **not** call them. Server-only secret if revived later. Never prefix with `VITE_` (that would expose it to the browser).

| Where | Purpose |
|---|---|
| **Root** [`.env.local`](../../.env.local) (gitignored) | `OPENAI_API_KEY` / `OPENAI_MODEL` for the dormant server route only |
| Root [`.env.example`](../../.env.example) | Documented empty template (committed; no secrets) |
| `app/.env.local` | Public Supabase `VITE_*` only — **do not** put OpenAI here |

Never use `VITE_OPENAI_API_KEY`.

## What remains pending

1. Generic detailed-handoff depth — see gap audit [`chalkie-generic-detailed-handoff-gap-audit-v0.1.md`](./chalkie-generic-detailed-handoff-gap-audit-v0.1.md) (next coding slice: richer activity evidence, not Exp 10 fixture).
2. Optional: teacher page-range picker beyond the current PDF spread.
3. OpenAI lesson-draft endpoint remains dormant on disk; decide later whether to revive for prompt/question help, harden, or park permanently.

---

## Current limitations

- Visible scope = current PDF spread only (typically two printed pages).
- Summaries depend on Phase 1 JSON linkage (`printed_page`, `page_id`); sparse links may yield empty spread vocabulary even when activities resolve.
- Activity labels prefer `title` → `activity_title` → `instruction`; activity-rich spreads (e.g. BE3 U8 Grammar pp. 136–137) can open the teacher-choice flow with activity-derived words/models, language frames, and a derived teaching-focus planning summary. The prompt is still a generic dynamic single-lesson assembly — not Experiment 10. Gap analysis: [`chalkie-generic-detailed-handoff-gap-audit-v0.1.md`](./chalkie-generic-detailed-handoff-gap-audit-v0.1.md).
- Act 20 chart category dumps (comma-separated answer lists) are intentionally not shown as word models — only safely shaped item pairs are extracted.
- Local handoff remains fully deterministic and copyable (title, detailed prompt, concise outline, suggested vocabulary). The OpenAI lesson-draft UI is removed; the server path stays dormant and unused.
- Two-lesson series uses Workbook pp. 104–105 as packaging source evidence; those pages may not be the PDF open in the workspace viewer.
- Curated BE2 U8 fixture (prior-learning cards + SB→WB series) applies only to the exact route `big_english_2_sb` Unit 8 with visible pages **128–129**. Horizontal suggestions remain fixture-only for that route.
- Other in-unit spreads use Phase 1 visible-page evidence only (single-lesson path); missing page evidence blocks generation honestly.
- Header may still show “from canonical” when applicable; verification status is hidden only.

---

## Relationship to Phase 5 methodology and Phase 6

- Aligns with **page-scoped packaging** discipline documented in [`p5-exp-be2-u08-p128-129-chalkie-brief-v1.md`](./p5-exp-be2-u08-p128-129-chalkie-brief-v1.md) (manual paste brief; not yet automated).
- **Provisional two-lesson-first packaging policy** (docs only): for new internal Chalkie generation, prefer two lessons (SB introduce → WB practise when a companion is verified; SB-only two-lesson split when none exists). Recorded in [`../phase-6/chalkie-interface-and-generation-workflow.md`](../phase-6/chalkie-interface-and-generation-workflow.md) §1A. This prototype’s UI still enables series only for the curated BE2 fixture and the two accepted BE3 U8 pairs — the policy does **not** by itself unlock series for other routes or authorize generation.
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
| 2026-10-20 | Cross-linked generic detailed-handoff gap audit (Exp 10 vs current prompt; next coding slice defined). |
| 2026-10-20 | Screen 1 / prompt: activity-derived words/models, language frames, teaching-focus planning summary; honest empty-state wording. |
| 2026-10-20 | Correction pass for BE3 U8 spreads 128–137: lesson topic, Q&A `|` splits, `full_text` language, Did…? focus, phrase halves, models bound 24. |
| 2026-10-21 | Cross-linked provisional two-lesson-first packaging policy (§1A in Phase 6 Chalkie workflow); UI series gates unchanged; no generation authorized. |
| 2026-10-21 | Left-panel **Unit Intelligence** accordion: read-only Phase 2 BI for selected book/unit; honest empty state; does not affect handoff. |
| 2026-10-21 | Unit Intelligence supersedes standalone Book Intelligence preview; sidebar BI item removed; legacy `/app/book-intelligence…` redirects to Chalkie (`?unit=` preserved when present). |
| 2026-10-21 | Cross-linked **D021** Student Book–first lesson preparation (LOCKED); no UI enforcement yet. |
| 2026-10-21 | D021 UI slice: SB-only book dropdown; View Workbook toggle for verified companions; SB/WB page summaries; prepare stays SB-anchored. |
