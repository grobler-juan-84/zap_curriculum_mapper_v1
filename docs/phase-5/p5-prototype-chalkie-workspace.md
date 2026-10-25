# Phase 5 Prototype — Chalkie Workspace UI

**Status:** ACTIVE  
**Version:** 2.66
**Route:** `/app/chalkie` (protected)

---

## Purpose and scope

First teacher-facing **UI slice** for Phase 5 lesson packaging: browse the textbook PDF, see concise Phase 1 evidence summaries, and launch a guided teacher-choice setup before prompt preparation.

### Platform boundary (deliberate)

**Chalkie Workspace is a Chalkie-specific handoff adapter, not the project’s curriculum or lesson-planning source of truth.** Its copyables deliberately use the workflow Chalkie currently responds to best. The durable layer is the verified source evidence, SB→WB component mappings, teacher-selected prior learning, scope, and future neutral lesson package.

If another generator later becomes more suitable, add a parallel workspace (for example, MagicSchool Workspace or Canva Workspace) that translates the same package for that platform. Do **not** rename or replace Chalkie Workspace, rebuild the curriculum mapping, or hardwire every lesson prompt again. This is an architectural boundary and future direction, not authorization to build another integration now. See [F021](../7-future.md).

### Student Book–first preparation ([D021](../4-decisions.md) — LOCKED)

Standard teacher workflow starts from the **Student Book** unit/component. Teachers may view the Workbook; they do **not** create a separate Workbook-origin Single Lesson, and they are not asked to choose SB vs WB as the generation origin. Verified SB→WB companions may attach WB as consolidation/practice with a clear SB/WB evidence split; unverified pairs must not be guessed. Workbook data and mappings remain.

**Implemented UI slice (2026-10-21):** teacher book dropdown is Student Books only (display e.g. `Big English 3`); optional **View Workbook** / **View Student Book** toggle when a verified companion exists (mapped pages only; PDF nav locked); left panel **SB Pages Summary** + conditional **WB Pages Summary**; prepare prompt stays SB-anchored in both viewer states. **View Student Book** restores the frozen SB spread (e.g. pp.128–129), not a one-page PDF report — companion toggle, WB summary, and normal PDF controls return with that spread. PDF rendering uses verified source `pdf_page` (e.g. SB printed 128–129 → PDF 126–127; WB printed 104–105 → PDF 104–105), never printed-as-pdf. The pane paints the exact allowed PDF page pair (both pages); Document remounts on source URL change so SB↔WB cannot stick on cover/`End of document`.

**Active lesson page (2026-10-22):** when a two-page PDF reading spread contains one-page components (e.g. Writing p.140 + Phonics p.141), companion lookup and Prepare Chalkie prompt use the **Go / page-control active page** as lesson scope — not both visible pages as a composite. True two-page curated mappings (e.g. Culture pp.138–139) still match the full visible spread. UI shows `Active lesson page: p.N` (or `Active lesson pages: pp.A–B` for exact two-page matches) and, when a companion exists, `Verified Workbook companion available for the current lesson page.` View Workbook opens only the mapped WB page(s).

**In scope:**

- Three-pane layout aligned with Validation Workspace (header, left context, PDF, compact bottom action area).
- Series / Student Book / unit navigation and R2-backed PDF viewing (Workbook books omitted from teacher dropdown; WB PDF still loadable via verified companion toggle).
- **Unit Summary**, **SB Pages Summary** (primary lesson source), optional **WB Pages Summary** (verified companion only), and **Unit Intelligence**.
- **Unit Intelligence** — **implemented** read-only Phase 2 Book Intelligence overview for the selected book/unit (Storage-backed loader when registered); disclaimer *Phase 2 interpretation / planning support — not current-page source evidence.*; AI-inferred Learning Outcomes badge preserved; honest unavailable copy when BI is missing; does not alter handoff/context. **This is the teacher-facing home for Book Intelligence content** — the dedicated `/app/book-intelligence` preview UI is retired (legacy URLs redirect here). Broader left-pane IA (Horizontal Mapping, School Notes, Future Suggestions) remains design-only: [`teacher-intelligence-left-pane-contract-v0.1.md`](./teacher-intelligence-left-pane-contract-v0.1.md). Prior Learning / Horizontal Mapping: same-unit `[PRIOR]` (vocab/LiA/Grammar) plus curated earlier-unit `[HM]` where verified entries exist (optional/unchecked; light provenance); Slice 4+ not authorized — [`chalkie-prior-learning-horizontal-mapping-audit-v0.1.md`](./chalkie-prior-learning-horizontal-mapping-audit-v0.1.md). Spine design: [`unit-learning-spine-and-prior-learning-ranking-design-v0.1.md`](./unit-learning-spine-and-prior-learning-ranking-design-v0.1.md).
- **Prepare Chalkie prompt** / **Create a prompt** launch into a focused multi-step teacher-choice overlay (Student Book activities → optional Workbook activities → prior skills → neutral review → choose output; Chalkie packaging only after choosing Chalkie) ending in a local four-artifact handoff (title, detailed prompt, concise outline, suggested vocabulary) — always SB-anchored.
- **Current Activity Selection is IMPLEMENTED / MANUALLY ACCEPTED — local handoff curation; provisional workflow.** SB and verified Workbook activities appear as teacher-selectable cards (all selected by default). Selected SB evidence drives the detailed handoff, outline, vocabulary, language/models, and selection-sensitive focus; selected WB evidence drives applicable Workbook / Lesson 2 content. Unchecked activities cannot return through fallback reconstruction. Open-book layouts and Back/Continue persistence are owner-accepted on BE3 U8 opener SB 128–129 ↔ WB 104–105. Does not authorize Chalkie generation or claim classroom validation. See [`chalkie-current-activity-selection-contract-v0.1.md`](./chalkie-current-activity-selection-contract-v0.1.md).
- **Neutral package boundary:** **neutral package assembler implemented for accepted Opener and Story pairs only; no UI/rendering migration yet.** The read-only package contains exact verified scopes, selected evidence, per-lesson intent/evidence states, boundaries, and explicitly targeted prior support. Existing Chalkie titles, prompts, outlines, vocabulary output, and modal routing remain unchanged. See [`chalkie-generic-sb-wb-handoff-adapter-audit-v0.1.md`](./chalkie-generic-sb-wb-handoff-adapter-audit-v0.1.md).
- **Test-only rendering proof:** **Opener shadow-renderer parity proved in tests only; existing production handoff output remains unchanged; no UI migration.** All-selected output matches the five accepted Opener artifacts exactly; partial/zero paths remain selected-evidence-only. The Opener renderer remains isolated.
- **Asymmetric test-only rendering proof:** **Story shadow-renderer parity proved in tests only, including asymmetric SB pp.130–131 → WB p.106 scope; existing production handoff output remains unchanged; no UI migration.** All five accepted Story artifacts match exactly; partial/zero paths remain selected-evidence-only with no WB p.107 leakage.
- **Shared dispatcher boundary:** **Shared Chalkie dispatcher supports the parity-proved Opener and Story packages only.** Unsupported relationships raise an explicit typed error; no generic fallback output is produced.
- **Opener canary:** **`IMPLEMENTED / MANUALLY ACCEPTED — LIMITED OPENER CANARY`** for `be3_sb_wb_rel_u08_opener_sb128-129_wb104-105` only (SB pp.128–129 → WB pp.104–105). Owner-controlled via `VITE_CHALKIE_BE3_U08_OPENER_NEUTRAL_CANARY` (default off; rollback = unset/false + restart). Manual review accepted all-selected normality, selection persistence, and honest exclusions (SB p.129 Act 4 / WB p.105 Act 3) with no reconstruction. No Chalkie generation or classroom-validation claim. See [`chalkie-neutral-package-production-migration-plan-v0.1.md`](./chalkie-neutral-package-production-migration-plan-v0.1.md).
- **Story canary:** **`IMPLEMENTED / MANUALLY ACCEPTED — LIMITED STORY CANARY`** for `be3_sb_wb_rel_u08_story_sb130-131_wb106` (SB pp.130–131 → WB p.106 only; WB p.107 excluded). Owner-controlled via `VITE_CHALKIE_BE3_U08_STORY_NEUTRAL_CANARY` (default off; rollback = unset/false + restart). Manual review accepted all-selected normality, SB Activity 6 / WB Activity 5 exclusions, honest zero-selection, and Opener independence. No Chalkie generation or classroom-validation claim. See [`chalkie-be3-u08-story-neutral-canary-proposal-v0.1.md`](./chalkie-be3-u08-story-neutral-canary-proposal-v0.1.md).
- Packaging choices: **Single lesson** from the resolved SB pages, or **Two-lesson series** on (a) the curated BE2 U8 fixture, (b) the accepted BE3 U8 opener pair SB 128–129 → WB 104–105, or (c) the asymmetric BE3 U8 story pair SB 130–131 → WB **p.106 only** — each with six local copyables ([`chalkie-be3-u08-sb-wb-pairing-gap-v0.1.md`](./chalkie-be3-u08-sb-wb-pairing-gap-v0.1.md)). Opener production Chalkie series: **PASS AFTER LIGHT TEACHER REVIEW** ([`chalkie-be3-u08-sb-wb-production-pilot-results-v0.1.md`](./chalkie-be3-u08-sb-wb-production-pilot-results-v0.1.md)). Story series local handoff: **ACCEPTED FOR PROVISIONAL USE** (no Story Chalkie export claimed; no further Story Chalkie experiments now). BE3 U8 LiA through Review companions are **docs-accepted + resolver-wired** (View Workbook only; Writing/Phonics/Review 1→1 single lesson likely); Values SB p.142 is **SB-only confirmed; no Workbook companion expected**; **no** series handoff; **no** Chalkie generation.
- Fully local, deterministic handoff — no visible OpenAI / model-draft step.
- **Dynamic source-context binding** + **page-scope guard**: lesson title, Step 1, and local handoff all use one resolved context from selected Student Book/unit + SB printed pages (frozen while inspecting WB).

**Out of scope (explicit):**

- Feeding Unit Intelligence (or any Phase 2 interpretation) into **source evidence**: source scope, activity selection, page-scoped vocabulary/language, or prior-learning candidate pools. Optional labelled NLP `curriculumInterpretation` attach is authorized by [D022](../4-decisions.md) and is not silent page evidence.
- Loading arbitrary Phase 2–4 experiment markdown into the app / inventing interpretation beyond the registered Book Intelligence Storage overview.
- Calling or exposing the dormant OpenAI lesson-draft endpoint from the current handoff UI.
- Persisting generated drafts, creating slides, or submitting to the Chalkie product.
- Arbitrary configurable series packaging beyond the agreed BE2 U8 fixture and the two BE3 U8 series pairs (opener; asymmetric story). Resolver-wired companions alone do not unlock series packaging.
- Validation status writes or ops tooling.
- Book Workspace mock Teacher AI / `chalkie-prompt` quick action.
- Persisting SB/WB activity selections to canonical data or a future neutral lesson-package store.

---

## What was implemented

| Area | Detail |
|---|---|
| Navigation | Sidebar **Chalkie Workspace** → `/app/chalkie` |
| Header | Reuses `ValidationHeader` with verification status badge hidden |
| PDF | Reuses `ValidationPdfPane`; optional callback lifts visible **printed** page numbers to the workspace |
| Left panel | **Curriculum & Intelligence** via live `CurrentLessonContext`: **Book Content** (Phase 1 page scope + rich verified SB/WB activity cards from the same builders as Create-a-prompt) and **Book Intelligence** (Unit Intelligence / Phase 2 interpretation only) |
| WB toggle | **View Workbook** / **View Student Book** when curated companion matches the active lesson scope (exact two-page spread, or one-page Go target); PDF nav locked on mapped WB pages only |
| Active page | Go / Prev / Next sets active lesson page; facing-pair Go keeps both PDF pages visible while scoping companion + handoff to the target page |
| Activity selection | Separate numbered screens for Student Book activities and (when available) verified Workbook activities. Every displayed section keeps a two-panel open-book shape. One-page scopes retain their even-left/odd-right physical slot and use a quiet, non-selectable facing placeholder. Separate session-only SB/WB state drives selected-only evidence in the applicable local handoff lesson |
| Bottom panel | Calm **Create a prompt** / **Prepare Chalkie prompt** action + helper text (no generated output yet) |
| Overlay | Teacher-choice Steps 1–5 (Workbook step skipped when no verified companion/activity set) + Chalkie packaging only after choosing Chalkie output + local handoff (title, detailed prompt, concise outline, suggested vocabulary) |
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
| **Step 1 — Student Book activities** | Compact selected book/unit identity and verified SB activity cards as an open-book spread | `ChalkieLessonContext` identity plus SB activity models from the selected unit summary and active lesson pages | Human-verified SB activity rows only; session-only selection; facing placeholders remain visual-only on verified companion routes. |
| **Step 2 — Workbook activities** *(skipped when no verified companion/activity set)* | Verified Workbook companion cards as an open-book spread; progress renumbers to 4 steps when skipped | Companion-resolved WB activity models; never invented | Appears only when `workbookCompanion` resolves and WB cards exist. Separate session-only WB selection. |
| **Prior skills** | Prior-learning cards plus **Add a prior skill**; selected-count in the footer | `lesson.priorLearningSuggestions` + overlay `selectedIds` / `teacherAdditions` | BE2 U8: curated `[HM]` cards. Other ready routes: same-unit `[PRIOR]` bundles. Teacher-added skills are session-only, optional/unchecked on add, labelled `[TEACHER-ADDED · UNVERIFIED]`. Not School Notes. |
| **Neutral review** | Read-only platform-neutral summary: source pages, selected SB/WB activities, prior skills, and a neutral lesson focus/title when safely available | Resolved context + current SB/WB/prior selections | No Chalkie packaging, single/two-lesson choice, or fabricated Workbook relationship. |
| **Choose output** | Output cards: **Chalkie prompt** or **General lesson plan** | Same selected evidence passed through unchanged | General lesson plan stays platform-neutral. Choosing Chalkie may open packaging (single / two-lesson) before the local handoff. |
| **Chalkie packaging** *(after Chalkie output only)* | Package choice, selected-activity recap, prior learning, guidance; then copyable handoff items | Resolved context plus selected SB/WB/prior session state | Current activity recap, words/models, and language are selection-aware. Prior learning stays separate and does not replace excluded current activity evidence. |
| **Prompt preview / handoff** | Copy-ready title, detailed prompt, concise outline, suggested vocabulary; optional small `Ref:` line for tracking | `buildChalkieLessonNaming.ts`, `buildChalkiePromptPreview.ts`, `buildChalkieConciseOutline.ts`, `buildSuggestedChalkieVocabulary.ts`, and bounded BE3 series builders | Title, stable reference, and source scope remain stable. Detailed prompt, outline, vocabulary, language/models, and activity-derived evidence use selected activities only. Partial SB/WB pages have no page-level fallback; zero WB selection produces an explicit empty Lesson 2 state. |

### Resolved current-lesson context mapping

The resolver still provides these fields as source context. Except for compact book/unit identity, they are no longer presented as a summary wall on Step 1; selection-sensitive handoff fields are rebuilt conservatively from selected activity evidence.

| Context field | Normal route | BE2 U8 prototype route |
|---|---|---|
| Book label | Selected `Book` record, normalized by `resolveChalkieLessonContext.ts` | Same, normalized to “Big English 2” |
| Unit line and unit page range | Selected unit's `units[0]` summary fields | Same unit identity; fixture only replaces current-page content |
| Visible pages | `ValidationPdfPane` → `onVisiblePrintedPagesChange` → workspace state | Same |
| Current focus | Matching page labels from `summary.pages` in `buildVisiblePagesView` | `BE2_U08_PROTOTYPE_FOCUS` |
| Unit-context note | Unit `theme` or derived `learningFocus` from `buildUnitSummaryView`; never page evidence | Full-unit range note only |
| Lesson topic | Page-linked curriculum-component titles (preferred) or `page_heading` — orientation only, not a teaching aim. | Not used on BE2 U8 fixture |
| Words and models | Dedicated `vocabulary` rows when present; otherwise conservative activity-item models (bracket fills; base→form match pairs; `matching_and_speaking` phrase halves). Bound **24**. Chart/comprehension dumps skipped. | `BE2_U08_VOCABULARY` |
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
| **Step 1** | Renders compact book/unit identity plus a verified SB spread and, for an exact companion, a separate WB spread. Every section keeps two physical page slots; one-page scopes use a muted facing placeholder with no cards or controls. Every eligible real card starts selected; SB and WB checkbox state stay separate across Back/Continue. | The teacher reviews current SB and mapped WB activities. Both selections feed applicable local handoff content while remaining session-only. |
| **Step 2** | Renders suggestion cards and custom-language controls together. | `selectedIds` + `teacherAdditions` in overlay session state; footer shows selection counts. |
| **Step 3** | Re-renders selected current activity evidence and Step 2 local state; package choice (`single` or supported `series`); then local prompt preview. | Confirmation of selected inputs; still not a persisted generated lesson. |
| **Prompt preview / handoff** | Local builders compose title plus selected-only detailed prompt, concise outline, and suggested vocabulary. | Four copyable local artifacts. No excluded activity can return via page-level focus, outline, vocabulary, language, or bespoke series fallback. |

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

1. Prior Learning / Horizontal Mapping: same-unit `[PRIOR]` + curated `[HM]` (BE2 U8 opener only). `[HM]` expansion blocked (§8a); School Notes product surface not authorized — [`chalkie-prior-learning-horizontal-mapping-audit-v0.1.md`](./chalkie-prior-learning-horizontal-mapping-audit-v0.1.md). Next: new verified `[HM]` pack per authoring contract. Pause further canaries. Do not implement badges, School Notes, or AI automatically.
2. Generic detailed-handoff depth — see gap audit [`chalkie-generic-detailed-handoff-gap-audit-v0.1.md`](./chalkie-generic-detailed-handoff-gap-audit-v0.1.md).
3. Optional: teacher page-range picker beyond the current PDF spread.
4. OpenAI lesson-draft endpoint remains dormant on disk; decide later whether to revive for prompt/question help, harden, or park permanently.

---

## Current limitations

- Visible scope = current PDF spread only (typically two printed pages).
- Summaries depend on Phase 1 JSON linkage (`printed_page`, `page_id`); sparse links may yield empty spread vocabulary even when activities resolve.
- Activity labels prefer `title` → `activity_title` → `instruction`; activity-rich spreads (e.g. BE3 U8 Grammar pp. 136–137) can open the teacher-choice flow with activity-derived words/models, language frames, and a derived teaching-focus planning summary. The prompt is still a generic dynamic single-lesson assembly — not Experiment 10. Gap analysis: [`chalkie-generic-detailed-handoff-gap-audit-v0.1.md`](./chalkie-generic-detailed-handoff-gap-audit-v0.1.md).
- Act 20 chart category dumps (comma-separated answer lists) are intentionally not shown as word models — only safely shaped item pairs are extracted.
- Local handoff remains fully deterministic and copyable (title, detailed prompt, concise outline, suggested vocabulary). The OpenAI lesson-draft UI is removed; the server path stays dormant and unused.
- SB and Workbook activity exclusions are separate session-only state. SB controls current-page artifacts and supported series Lesson 1; WB controls Workbook-bearing detailed prompts and supported-series Lesson 2 outlines, vocabulary, language/models, and activity lists. Titles, stable references, companion scope, and packaging do not change.
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
| 2026-10-21 | Fix View Student Book restore: reinstate frozen SB spread (e.g. 128–129), PDF controls, companion toggle/WB summary; ignore one-page PDF overwrites during restore. |
| 2026-10-21 | Fix PDF binding: render verified `pdf_page` for SB/WB companion views (remove remount-to-cover bug; SB 128–129 → PDF 126–127). |
| 2026-10-21 | Fix renderer spread: force both mapped PDF pages; no clamp-collapse; Document `key={pdfUrl}`; SB restore force-displays 126–127. |
| 2026-10-21 | Confirmed Unit Intelligence accordion against Teacher Intelligence left-pane contract v0.1; other TI sections still not built. |
| 2026-10-21 | BE3 U8 LiA companion resolver-wired (SB 132–133 → WB 107–108); handoff not built; Chalkie not authorized. |
| 2026-10-21 | BE3 U8 CLIL/P.E. companion resolver-wired (SB 134–135 → WB 109–110); handoff not built; Chalkie not authorized. |
| 2026-10-22 | BE3 U8 Grammar companion resolver-wired (SB 136–137 → WB 111–112); handoff not built; Chalkie not authorized. |
| 2026-10-22 | BE3 U8 Culture companion resolver-wired (SB 138–139 → WB 113–114); handoff not built; Chalkie not authorized. |
| 2026-10-22 | BE3 U8 Writing companion resolver-wired (SB p.140 → WB p.115; 1→1); handoff not built; Chalkie not authorized. |
| 2026-10-22 | BE3 U8 Phonics companion resolver-wired (SB p.141 → WB p.116; 1→1); handoff not built; Chalkie not authorized. |
| 2026-10-22 | BE3 U8 Review companion resolver-wired (SB p.143 → WB p.117; 1→1); Values p.142 remains SB-only; handoff not built; Chalkie not authorized. |
| 2026-10-22 | Active lesson page scope: one-page components inside a two-page PDF spread (140/141, 142/143) resolve companion + prepare from Go target; true two-page mappings unchanged. |
| 2026-10-22 | Added Activity Selection contract v0.1 (active design only): verified current-page cards, teacher keep/exclude before prior learning, exclusion must propagate through all handoff artifacts; no UI/schema/builder change. |
| 2026-10-22 | Implemented first bounded Activity Selection slice: SB-only verified activity-card model, deterministic selection/exclusion state, selected-evidence accessor, and focused tests. Visible UI and current handoff output unchanged. |
| 2026-10-22 | Implemented SB activity-card UI on Current Lesson with active-page columns, default-selected checkboxes, session navigation persistence, count/warning/empty feedback, and an explicit unchanged-handoff notice. Workbook cards and handoff propagation remain unimplemented. |
| 2026-10-22 | Refined Current Lesson into a wide, compact SB book-spread picker: removed the summary wall, added restrained page surfaces/gutter, centered one-page layout, denser checkbox-only cards, and moved the concise selection count into the picker header. |
| 2026-10-22 | Added verified Workbook activity cards beneath the SB spread with separate default-selected session state, exact two-page / left-aligned one-page / no-companion layouts, count and warning feedback, and an explicit no-propagation boundary. |
| 2026-10-22 | Corrected one-page Activity Selection visuals to preserve the open-book spread: even pages stay left, odd pages stay right, and the facing panel is a muted non-content placeholder. No selection or handoff behavior changed. |
| 2026-10-22 | Propagated selected Workbook evidence into the accepted opener/Story local series handoffs: selected-only detailed prompt and Lesson 2 artifacts, conservative full-page vocabulary/language attribution, explicit zero-selection state, and no fallback reconstruction. |
| 2026-10-22 | Owner manually accepted Activity Selection for the provisional local handoff workflow (open-book layout, selected-only SB/WB propagation, BE3 U8 opener persistence `4 of 5` / `3 of 4`); no Chalkie generation authorized; Activity Selection feature work paused. |
| 2026-10-22 | Implemented a read-only neutral lesson-package assembler for the accepted Opener and Story pairs only, including exact scope, selected evidence, conservative attribution, empty states, boundaries, and targeted prior support. No UI or renderer migrated. |
| 2026-10-22 | Proved exact five-artifact Opener parity with a test-only neutral-package Chalkie shadow renderer; exclusions, zero-selection, and targeted prior support remain honest. Production UI/output is unchanged. |
| 2026-10-22 | Proved exact five-artifact Story parity with a separate test-only neutral-package renderer, preserving asymmetric WB p.106-only scope, no WB p.107 leakage, and honest partial/zero states. |
| 2026-10-22 | Added one test-only shared dispatcher for the two parity-proved relationships; unsupported packages fail with a typed error and production routing remains unchanged. |
| 2026-10-22 | Drafted a docs-only Opener-first production migration plan with parity gates, mismatch diagnostics, and bespoke rollback; not authorized for production wiring. |
| 2026-10-22 | Implemented Opener-only guarded canary (default off) with exact five-artifact compare, bespoke fallback + developer diagnostic on mismatch; Story remains bespoke. |
| 2026-10-22 | Recorded manual acceptance of the limited Opener canary (`IMPLEMENTED / MANUALLY ACCEPTED — LIMITED OPENER CANARY`); Story remains bespoke; no Chalkie generation or classroom-validation claim. |
| 2026-10-23 | Drafted docs-only Story neutral-canary proposal (`DRAFT / NOT AUTHORIZED FOR PRODUCTION WIRING`); Story production remains bespoke; no implementation. |
| 2026-10-23 | Implemented Story-only guarded canary (`IMPLEMENTED / AWAITING OWNER MANUAL CHECK`); default off; WB p.106-only; Opener canary unchanged. |
| 2026-10-23 | Recorded manual acceptance of the limited Story canary (`IMPLEMENTED / MANUALLY ACCEPTED — LIMITED STORY CANARY`); WB p.107 excluded; Opener remains independent. |
| 2026-10-23 | Drafted docs-only Prior Learning / Horizontal Mapping design audit (`DRAFT / DESIGN ONLY — NOT AUTHORIZED FOR IMPLEMENTATION`); no UI/app code. |
| 2026-10-23 | Implemented Slice 1 read-only same-unit `[PRIOR]` candidate model; existing Step 2 cards unchanged; Slice 2+ not authorized. |
| 2026-10-23 | Implemented Slice 2 same-unit suggestion surfacing against the candidate model (optional selection; never auto-select); Slice 3+ not authorized. |
| 2026-10-23 | Added docs-only Unit Learning Spine design (`DRAFT / DESIGN ONLY — NOT AUTHORIZED FOR IMPLEMENTATION`); no app code. |
| 2026-10-23 | Implemented BE3 U8 Unit Learning Spine read-only data + tests; ranking/UI/Step 2 integration not authorized. |
| 2026-10-23 | Added read-only `listCoreUnitLearningSpineComponentIds` consumer (internal; no UI/Step 2 effect). |
| 2026-10-23 | Added read-only `[PRIOR]` spine metadata (`componentId` / `spineRole`); Step 2 unchanged; ranking/UI not authorized. |
| 2026-10-23 | Added narrow core→support→unclassified same-unit `[PRIOR]` ordering; cards remain optional/unchecked; no badges. |
| 2026-10-23 | Added read-only verified same-unit language/grammar `[PRIOR]` foundation; not surfaced in Step 2 yet. |
| 2026-10-24 | Surfaced verified LiA + Grammar same-unit `[PRIOR]` on Step 2 (optional/unchecked; spine-aware order). |
| 2026-10-24 | Light evidence-kind provenance on same-unit `[PRIOR]` cards (Vocabulary / Language in Action / Grammar); no badges/filters. |
| 2026-10-24 | Slice 3 curated earlier-unit `[HM]` (BE2 U8 opener verified bank); PRIOR preserved; optional/unchecked. |
| 2026-10-24 | Curated `[HM]` coverage expansion gate: no second verified target pack; store unchanged. |
| 2026-10-24 | Strengthened session teacher-added path: visible `[TEACHER-ADDED · UNVERIFIED]` provenance; no auto-select on add. |
| 2026-10-24 | Reverted premature School Notes §8b / unlock-pack prep; School Notes not an active product track. |
| 2026-10-25 | Neutral `CurrentLessonContext` assembler: left panel and Create-a-prompt share verified activity cards; Teaching Intelligence accordion renamed Book Intelligence; selection remains modal-only for this slice. |
| 2026-10-25 | Left-panel Book Activities becomes authoritative selection; Create-a-prompt opens as shared-state review; shared `ActivityEvidenceCard`; F023 remainder parks relocating the neutral module cluster out of `features/chalkie/`. |
