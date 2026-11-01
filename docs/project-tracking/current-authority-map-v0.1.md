# Current authority map v0.1

**Status:** ACTIVE

**Date:** 2026-11-01

**Authority:** D027 durable layer model; D028 Values exception

**Current checkpoint:** `main` at `63a28694ba9c31893a8dfaa8c13443dd74a0c0a8`

## Purpose

This note freezes the current operating model so later work does not confuse canonical evidence, reusable knowledge, lesson assembly, or platform delivery. It describes the system as implemented today, including the feature flags that still keep the durable path in pilot mode.

## Durable stack

```text
SS / SB / WB  ->  NLL  ->  NLP  ->  delivery adapters
publisher         derived   lesson   General Lesson Plan,
authority         knowledge package  Chalkie, future platforms
```

| Layer | Owns | Must not own |
|---|---|---|
| SS | Publisher curriculum claims and unit/category locators | Activity evidence, AI summaries, teacher selections |
| SB / WB | Canonical page and activity evidence | Derived summaries or platform prompts |
| NLL | Activity-keyed reusable knowledge, preferred summaries, ordered component membership, proposed SS links | Canonical book content, transient selections, rendered lesson plans |
| NLP | One prepared lesson's selected evidence plus applicable NLL knowledge | Long-term curriculum authority or platform-specific structure |
| Adapter | Rendering an NLP for a chosen destination | Canonical evidence or NLL schema design |

SS links stored in NLL are locators, mostly `proposed`; they do not replace SS authority. SB/WB remain canonical JSON, and NLL binds to activities by ID and fingerprint rather than copying book blobs.

## When each layer exists in the teacher workflow

```text
Open Create-a-prompt
  -> canonical SB/WB activity cards
  -> optional NLL activity summaries
  -> teacher activity selection

Choose an output and prepare
  -> assemble the lesson-specific NLP
  -> pass the NLP to the selected adapter
  -> render the output
```

The modal is not itself a finished NLP. NLP assembly happens at the prepare/handoff boundary after the teacher has made selections.

## Current BE3 Unit 8 state

- Live NLL: **10 components / 77 memberships / 77 summaries / 10 SS links**.
- Migration history: **29 recorded / 0 pending / 0 remote-only**.
- All ten Unit 8 lessons have preferred NLL activity summaries.
- Modal summaries use the shared NLL loader only; static Opener POC summaries are historical/test fixtures, not runtime fallback.
- Values has NLL knowledge for its three SB activities but remains generic `sb_only`: no Workbook companion, Values NLP package, renderer, or specialized delivery adapter.
- NLL summaries remain `hidden` / `experimental`; no production visibility promotion occurred.
- NLP is assembled in memory at handoff; it is not persisted.

## Active pilot flags

All flags below are default off.

| Flag | Layer/path activated | Exact scope |
|---|---|---|
| `VITE_CHALKIE_NLL_ACTIVITY_SUMMARIES` | NLL summaries on Create-a-prompt activity cards | All ten BE3 Unit 8 lessons; 77 activities |
| `VITE_NLL_GENERAL_LESSON_PLAN_PILOT` | NLL -> NLP -> neutral General Lesson Plan adapter | Opener only |
| `VITE_NLL_CHALKIE_ADAPTER_PILOT` | NLL -> NLP -> Chalkie adapter | Opener |
| `VITE_NLL_CHALKIE_STORY_ADAPTER_PILOT` | NLL -> NLP -> Chalkie adapter | Story |
| `VITE_NLL_CHALKIE_LIA_ADAPTER_PILOT` | NLL -> NLP -> Chalkie adapter | Language in Action |
| `VITE_NLL_CHALKIE_CLIL_PE_ADAPTER_PILOT` | NLL -> NLP -> Chalkie adapter | CLIL/P.E. |
| `VITE_NLL_CHALKIE_GRAMMAR_ADAPTER_PILOT` | NLL -> NLP -> Chalkie adapter | Grammar |
| `VITE_NLL_CHALKIE_CULTURE_ADAPTER_PILOT` | NLL -> NLP -> Chalkie adapter | Culture |
| `VITE_NLL_CHALKIE_WRITING_ADAPTER_PILOT` | NLL -> NLP -> Chalkie adapter | Writing |
| `VITE_NLL_CHALKIE_PHONICS_ADAPTER_PILOT` | NLL -> NLP -> Chalkie adapter | Phonics |
| `VITE_NLL_CHALKIE_REVIEW_ADAPTER_PILOT` | NLL -> NLP -> Chalkie adapter | Review |

Values deliberately has no delivery-adapter flag.

## Retained transitional flags

The following belong to earlier validation lineages and are not the durable default: Opener/Story neutral canaries, Opener activity-enrichment POC, NLL shadow pilot, Opener NLL/POC card comparison, and optional Opener BI framing. Retain them for evidence and controlled comparison until an explicit retirement decision; do not treat them as competing product architecture.

## Default-path reality

The durable architecture is locked, but it is not yet the production default:

- Flags off still preserve legacy `sb_only`, bespoke, or canary fallback paths.
- General Lesson Plan has the neutral NLL -> NLP path only for Opener.
- Component delivery adapters remain default-off and undeployed.
- No NLL visibility promotion, NLP persistence, deployment, or broad POC/canary retirement is authorized.

## Product hierarchy (teacher library → workspace → adapters)

```text
Login / open /app
  → valid last-active workspace? → Book Workspace (restored)
  → else → Curriculum Library (silent; no error)

Curriculum Library
  → pick series
       → last book for series? → Book Workspace (series resume)
       → else → Book Workspace in-workspace course-level chooser (?chooseBook=1)

Book Workspace   (/app/book-workspace)
  → Student Book is primary
  → Workbook attaches contextually via verified companions
  → Change book / level reopens the in-workspace chooser
  → teacher chooses General Lesson Plan, Chalkie, or future output
```

| Concept | Role |
|---|---|
| Course level | In-workspace chooser cards (series + level); not a separate main-flow page |
| Student Book | Primary catalog book loaded into Book Workspace |
| Workbook | Companion material only; never a separate teacher entry card |
| Book Workspace | Neutral preparation surface (rich SB-first UI); owns user-scoped location continuity |
| Last active workspace | Post-login landing pointer (global `lastActiveBook` + that SB’s resume) |
| Last book per series | CL / series-switch pointer (`lastActiveBook` per `seriesId`) |
| Resume state | Operational preference only (last stable unit/lesson/pages per authenticated user + primary SB) |
| Chalkie | One replaceable downstream delivery adapter |
| Canonical route | `/app/book-workspace` |
| Legacy routes | `/app/series` → chooser; `/app/chalkie` and `/app/workspace` redirect here (query preserved); mock spread UI is hidden at `/app/legacy-mock-workspace` |

Historical evidence reports may still mention `/app/chalkie` or “Chalkie Workspace” as the former route/name; those records are not rewritten. Current product language uses Book Workspace.

### Book Workspace resume (validation v1 + continuity)

Book Workspace remembers the last **stable** location for each authenticated user and each primary Student Book so teachers can continue sequentially without claiming lesson completion. Two additional pointers support workspace continuity:

1. **Last active workspace** — if valid after login / `/app`, open Book Workspace there; otherwise land on Curriculum Library with no error.
2. **Last book per series** — choosing a curriculum restores that series’ last primary SB (and its per-book resume); first visit opens the in-workspace course-level chooser.

- Persistence is **browser-local** for validation (`bookWorkspaceResumeStorage`); namespaced by user ID + Student Book `catalogBookId`, plus global and per-series last-active book keys.
- Resume is **not** canonical evidence, NLL knowledge, NLP content, activity-selection state, prompt drafts, generated outputs, or lesson completion.
- Explicit valid `?unit=` (including legacy `/app/chalkie?unit=` redirects) overrides saved state, then becomes the new resume point once stable.
- Workbook never receives a separate resume identity.
- Curriculum Library and the in-workspace course-level chooser remain always available; resume is a convenience, not a lock.
- **Future (not authorized now / F026):** a user-scoped Supabase resume table with RLS plus a local cache may replace browser-local storage for cross-device continuity. That requires a separately authorized migration and must not be inferred from this validation slice.

## Product-language boundary

“Chalkie” is a destination adapter name, not the product spine. It may appear only when a teacher explicitly chooses that destination or in internal adapter implementation names. The neutral preparation flow, NLP, General Lesson Plan prompt, headings, helper text, and copied neutral output should use provider-neutral language. Removing Chalkie wording from those surfaces does not change D027; it makes the UI match it.

## Guardrails

1. Never write derived summaries into canonical SS/SB/WB data.
2. Keep NLL additive, reusable, and activity-keyed.
3. Build NLP after teacher selection, at handoff time.
4. Keep adapters downstream of NLP and replaceable.
5. Keep Values knowledge-only unless D028 is explicitly revised again.
6. Do not use deletion of historical POC/canary code to force architectural promotion.
7. Do not put provider names into neutral General Lesson Plan content.
8. Do not present physical SB/WB catalog rows as separate teacher entry cards for paired series; group by course level.
9. Do not treat Book Workspace resume as completion tracking or auto-advance; never invent next-lesson jumps from saved state.

## Environment documentation

Root `.env.example` documents `VITE_CHALKIE_NLL_ACTIVITY_SUMMARIES=false` (default off): Unit 8 modal activity-card summaries only; may read hidden/experimental summaries; does not enable delivery adapters or change lesson generation. Do not edit `.env.local` for documentation.
