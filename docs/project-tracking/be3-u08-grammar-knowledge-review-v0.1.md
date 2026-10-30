# BE3 Unit 8 Grammar Knowledge Review v0.1

**Status:** GRAMMAR-A STEP A / OWNER-ACCEPTED 2026-10-30 — documentation/content acceptance only; no NLL insertion
**Version:** 0.1
**Date:** 2026-10-30
**Authority:** Owner-accepted Grammar-A Step A content decisions (2026-10-30). Canonical SB/WB evidence is authoritative over historical docs.
**Implementation authorization:** **None beyond this accepted review record.** Grammar-A Step B, Grammar-B, and Grammar-C remain unauthorized. No NLL write, migration, seed, database write or Storage mutation, application change, deployment, promotion, stage, commit, or push is authorized by this file.

---

## 0. Hard boundary statements

- A **read-only download** of the exact SB canonical from Supabase Storage (`book-datasets` / `big-english/big_english_3_sb/canonical/v1.json`) occurred for source-authority verification and local restoration of the gitignored canonical path.
- No Storage mutation, upload, replacement, deletion, metadata change, or database write occurred.
- No live NLL/component/summary/SS-link collision check occurred.
- No Supabase CLI action occurred.
- The gitignored local SB canonical restoration was the only non-document filesystem change.
- No NLL write occurred.
- No migration or seed was created.
- No application, configuration, test, flag, overlay, package, renderer, adapter, or resolver behavior changed.
- Grammar-A Step B, Grammar-B (neutral package/renderer), and Grammar-C (adapter) remain unauthorized.
- Default serving for this relationship remains **`sb_only`**.
- Owner-accepted summary designs, membership order, and the future Structures `proposed` link remain **design acceptance only** — no NLL records have been inserted; nothing is available or promoted.

---

## 1. Exact boundary

| Field | Value |
|---|---|
| Proposed component key | `be3-u08-grammar` (not created) |
| Title (proposed) | Big English 3 Unit 8 Grammar |
| Relationship | `be3_sb_wb_rel_u08_grammar_sb136-137_wb111-112` |
| Stable reference | `be3-sb-wb-u08-p136-137-wb111-112` |
| Student Book | pp.136–137 · `bep3_sb_p136`, `bep3_sb_p137` · Activities **19–23** |
| Workbook | pp.111–112 · `bep_3_wb_p111`, `bep_3_wb_p112` · Activities **15–19** |
| Exact inventory | Five SB + five WB = **ten** verified activities |
| Learning-spine role | Core 5 / `grammar` |
| Current packaging | `sb_only` (resolver companion View Workbook only; no Grammar SB→WB series handoff) |
| Adjacent exclusions | SB p.135 CLIL/P.E.; SB p.138 Culture; WB p.110 CLIL; WB p.113 Culture; LiA 132–133 / 107–108 |

The accepted curated companion proves the exact SB↔WB page pairing. It does **not** authorize an SB→WB series, neutral package, renderer, NLL adapter, or visibility change.

---

## 2. Evidence and verification method

Step A (corrected) used read-only sources after restoring the authoritative SB object:

1. SB canonical `data/phase1/big_english_3_sb/canonical/v1.json` — restored from Storage `book-datasets` / `big-english/big_english_3_sb/canonical/v1.json` (`938463` bytes / `3924fa23…67e6`)
2. WB canonical `data/phase1/big_english_3_wb/canonical/v1.json` — unchanged trusted local (`779981` bytes / `811deea2…04fa`)
3. Approved SS-V2 `docs/SS_JSON_FILES NEW/BE3_SS.JSON`
4. Provisional Grammar planning brief (boundary context only)
5. Companion/resolver records in `verifiedSbWbCompanions.ts`
6. Grammar preflight and Experiment 10 / handoff-design docs (historical; not evidence overrides)
7. LiA knowledge-review + NLL migrations **only** for identifier, fingerprint, provenance, and record-shape conventions
8. Opener/Story/LiA NLL components as schema/convention references only

Every eligible activity was checked for page identity, activity number, activity type, verification status, instruction, items/expected answers, language frame, media flags, and isolation from adjacent pages. Historical WB descriptions were re-verified against the restored canonical and corrected where they differed.

### Verified source order

Publisher activity numbers establish order within each book; SB activities precede WB activities in the proposed component membership (same convention as LiA-A).

| Position | activity_id | Source | Page | Publisher instruction |
|---:|---|---|---:|---|
| 1 | `bep3_sb_act_08_19` | SB | 136 | Look, listen, and read. How did Donna's dad come home? |
| 2 | `bep3_sb_act_08_20` | SB | 136 | Copy the chart in your notebook and complete. Use the words from the box. |
| 3 | `bep3_sb_act_08_21` | SB | 137 | Read and complete. |
| 4 | `bep3_sb_act_08_22` | SB | 137 | Read and match. |
| 5 | `bep3_sb_act_08_23` | SB | 137 | Tell your partner about what you did yesterday. |
| 6 | `bep_3_wb_act_111_15` | WB | 111 | Complete the chart. Use the words from the box. |
| 7 | `bep_3_wb_act_111_16` | WB | 111 | Read and write. |
| 8 | `bep_3_wb_act_111_17` | WB | 111 | Read and write. Use the correct form of the verb in parentheses. |
| 9 | `bep_3_wb_act_112_18` | WB | 112 | Complete the questions and answers. |
| 10 | `bep_3_wb_act_112_19` | WB | 112 | Write negative sentences. |

All ten records are `human_verified` and belong only to the four accepted Grammar pages. Each `activity_id` occurs **exactly once** in the combined SB+WB activity arrays.

---

## 3. Canonical hashes, fingerprints, and source bindings

### File SHA-256

SHA-256 was computed over the raw file bytes on 2026-10-30.

| Object | Path used for review | Size (bytes) | SHA-256 | Binding decision |
|---|---|---:|---|---|
| SB canonical (authoritative Storage restore) | `data/phase1/big_english_3_sb/canonical/v1.json` | `938463` | `3924fa23e6a70d9bb5af139544915a8954b5f1d5b8bdd3833f9aa834911b67e6` | Bind all proposed SB summaries to Storage path `big-english/big_english_3_sb/canonical/v1.json` |
| WB canonical (unchanged trusted local) | `data/phase1/big_english_3_wb/canonical/v1.json` | `779981` | `811deea2e5b04bef2a0c0223d5d75ffe94218bfb5aecc58a1898ecabf43504fa` | Bind future WB summaries to Storage path `big-english/big_english_3_wb/canonical/v1.json` |
| Approved SS-V2 | `docs/SS_JSON_FILES NEW/BE3_SS.JSON` | — | `f6f756e15becb1fd7aea2f172bdcacc043a520aeee81813472561cc877d6bb5a` | Bind any proposed links to Storage path `big-english/big_english_3_sb/canonical/ss_v1.json` |

**Authoritative SB source:** Supabase Storage bucket `book-datasets`, path `big-english/big_english_3_sb/canonical/v1.json` (read-only download; no Storage mutation). Local bytes were restored only after exact size, SHA-256, JSON parse, and language `page_id` checks passed. This matches the SB hash already used by LiA-A. A prior local copy (`938639` bytes / `9f006f79…e845`) was **stale local evidence**, not authoritative canonical drift — see §9.

### Activity fingerprints

Algorithm: stable recursively key-sorted JSON of the full canonical activity object (same `stableCanonicalJson` / `fingerprintCanonicalActivity` convention as NLL), SHA-256 over UTF-8 bytes.

| activity_id | activity_sha256 |
|---|---|
| `bep3_sb_act_08_19` | `aa749d55fdc96f1b08efa95824c688bd06d5af786013c2ec9064397c5fe0133c` |
| `bep3_sb_act_08_20` | `cf280c387907a1cdfe41919cc7845ccc442247273b78f306d4c86665d1ea12e4` |
| `bep3_sb_act_08_21` | `3b39624df961791c53e2f095bbc57f9833146d8b209e431ed7e847223412237b` |
| `bep3_sb_act_08_22` | `aabd99915eddb739229a9a3f24d7e1a03ef85021e5afda1dd8d8c62da2077ec7` |
| `bep3_sb_act_08_23` | `50e5750d70b5af0f8816bfcf599945496db1ae9694bb30cb749f21722b5d6052` |
| `bep_3_wb_act_111_15` | `c1cfb0e700232a8b83a074e73af78fa6bb4f5c0fb2a62440b38d183649e543b2` |
| `bep_3_wb_act_111_16` | `5fe70c5bb93e7b475182257435f7d875e7e96d4372c3336fc04ad3a57b1d7678` |
| `bep_3_wb_act_111_17` | `e49a9db3deec16cf04c1bb1a6d2118141eeac90b3444f5d2240667e7a4d28bbc` |
| `bep_3_wb_act_112_18` | `c95ce7e9e36352db1d38107f5667d8c613b0944db36884a4e1a7fb718feb39f4` |
| `bep_3_wb_act_112_19` | `3868686e77c2d55c8692ae183162fc28ec95d3e32d5feea77cf911ce5a018073` |

---

## 4. Exact activity inventory

### 4.1 Student Book pp.136–137

Trusted-page grammar-pattern language on **p.136** (not membership rows; page context only):

| language_id | page_id | Label | full_text (abbrev.) |
|---|---|---|---|
| `bep3_sb_lang_08_03` | `bep3_sb_p136` | Regular simple past tense (-ed endings) | `I/You/He/She/It/We/They played / walked / stayed.` |
| `bep3_sb_lang_08_04` | `bep3_sb_p136` | Irregular simple past tense verbs | `I/You/He/She/It/We/They went / saw / came.` |

#### `bep3_sb_act_08_19` — p.136 Activity 19

| Field | Canonical fact |
|---|---|
| Type | `listen_and_read_dialogue` |
| Instruction | Look, listen, and read. How did Donna's dad come home? |
| Items | none (activity-level expected answer) |
| Expected answer boundary | `He came home on his bicycle / by bike.` (book-check only) |
| Media | `audio_dependency=true` · `visual_dependency=true` · note **Audio track 159** |
| Related continuous text | `bep3_sb_text_08_04` dialogue on p.136 (audio-dependent grammar presentation dialogue) |
| Keyed vs open | Keyed comprehension |

#### `bep3_sb_act_08_20` — p.136 Activity 20

| Field | Canonical fact |
|---|---|
| Type | `chart_completion_spelling` |
| Instruction | Copy the chart in your notebook and complete. Use the words from the box. |
| Items | 4 chart columns keyed as pattern exemplars `started` / `cried` / `liked` / `stopped` |
| Word box (prompt on first item) | bake, carry, change, climb, cry, drop, exercise, finish, help, join, love, tip, try, worry |
| Notes | Classification of regular past simple verb spelling groups |
| Media | none |
| Keyed vs open | Keyed chart sorting |

#### `bep3_sb_act_08_21` — p.137 Activity 21

| Field | Canonical fact |
|---|---|
| Type | `read_and_complete_text` |
| Instruction | Read and complete. |
| Items | **9** narrative gap-fill prompts with bracketed base verbs |
| Dual spelling | Item `1.4` expected answer **`traveled / travelled`** |
| Media | none |
| Keyed vs open | Keyed cloze |

#### `bep3_sb_act_08_22` — p.137 Activity 22

| Field | Canonical fact |
|---|---|
| Type | `read_and_match` |
| Instruction | Read and match. |
| Items | **8** base→irregular past matches (go, come, have, sleep, fall, write, fly, put) |
| Notes | Matching present base verbs to irregular past forms |
| Media | none |
| Keyed vs open | Keyed matching |

#### `bep3_sb_act_08_23` — p.137 Activity 23

| Field | Canonical fact |
|---|---|
| Type | `pair_speaking` |
| Instruction | Tell your partner about what you did yesterday. |
| Language frame | `Yesterday, I woke up early and walked to school. / Yesterday, I went to the park after school. I played soccer.` |
| Items | none |
| Media | none |
| Keyed vs open | **Open** speaking (verified frames only) |

### 4.2 Workbook pp.111–112

#### `bep_3_wb_act_111_15` — p.111 Activity 15

| Field | Canonical fact |
|---|---|
| Type | `categorization_chart` |
| Instruction | Complete the chart. Use the words from the box. |
| Prompt | Sort verbs into columns: climbed (-ed), tried (-ied), changed (-d), dropped (double consonant + -ed) |
| Items | 1 word-box item (`arrive, clap, control, cook, dry, fry, jog, live, look, love, study, work`) with keyed column answers |
| Media | none |
| Page language entity | `bep_3_wb_lang_08_005` grammar_pattern on p.111 (regular spelling exemplars) |
| Keyed vs open | Keyed chart sorting |

#### `bep_3_wb_act_111_16` — p.111 Activity 16

| Field | Canonical fact |
|---|---|
| Type | `verb_form_writing` |
| Instruction | Read and write. |
| Prompt | Write the simple past irregular forms |
| Items | **10** keyed base→past pairs (eat, get, hurt, make, ride, run, say, sit, swim, wake) |
| Media | none |
| Keyed vs open | Keyed writing |

#### `bep_3_wb_act_111_17` — p.111 Activity 17

| Field | Canonical fact |
|---|---|
| Type | `narrative_cloze` |
| Instruction | Read and write. Use the correct form of the verb in parentheses. |
| Items | **13** narrative gaps mixing irregular and regular past forms |
| Media | none |
| Keyed vs open | Keyed cloze |

#### `bep_3_wb_act_112_18` — p.112 Activity 18

| Field | Canonical fact |
|---|---|
| Type | `question_answer_formation` |
| Instruction | Complete the questions and answers. |
| Language frame | `Did [subject] [verb] ...? Yes, [subject] did. / No, [subject] didn't.` |
| Items | **6** keyed Q&A completions |
| Form evidence | Items 1, 2, 4, 6 use **`Did` + base verb** with `did` / `didn't` short answers; items 3 and 5 use **`Was` / `Were`** (past of *be*), not `Did` |
| Media | `visual_dependency=true` |
| Keyed vs open | Keyed formation |

#### `bep_3_wb_act_112_19` — p.112 Activity 19

| Field | Canonical fact |
|---|---|
| Type | `sentence_transformation` |
| Instruction | Write negative sentences. |
| Language frame | `[Subject] didn't [verb] ...` |
| Items | **3** affirmative→negative transforms with **base form after `didn't`** |
| Page language entity | `bep_3_wb_lang_08_006` negative `didn't` model on p.112 |
| Media | none |
| Keyed vs open | Keyed writing |

### 4.3 Isolation check

| Adjacent page | Section | In Grammar scope? |
|---|---|---|
| SB p.135 | Content Connection / P.E. Acts 15–18 | **No** |
| SB p.138 | Culture Connection Acts 24–26 | **No** |
| WB p.110 | Content Connection Acts 13–14 (+ THINK BIG) | **No** |
| WB p.113 | Culture Connection Acts 20–21 | **No** |

---

## 5. Record-by-record evidence review and proposed summaries

`evidence_status = sufficient` means the verified record supports the narrow teacher-friendly action summary. It does **not** authorize reconstructing missing audio scripts, illustrations, full answer keys in teacher-facing prose, or general grammar rules beyond the publisher task.

Shared proposed fields for every summary row:

- `version = 1`
- `display_status = hidden`
- `review_state = experimental`
- `is_preferred = true`
- provenance `prompt_version = grammar-a-step-a-knowledge-prep-v0.1`

### 5.1 `bep3_sb_act_08_19`

- **Proposed summary ID:** `big_english_3_sb_unit_08_activity_19_summary_grammar_a_v1`
- **Evidence:** Audio 159; visual; listen-and-read dialogue; keyed comprehension question about how Donna's dad came home; expected-answer dual wording recorded for book-check only.
- **Proposed summary:** Students look, listen to Audio 159, and read the dialogue to answer how Donna's dad came home.
- **evidence_status:** `sufficient`
- **Boundary note:** Do not invent the audio script or restate the keyed bike answer in teacher-facing NLL prose. Experiment 10 historically failed by inventing *on foot* against the verified bike answer.

### 5.2 `bep3_sb_act_08_20`

- **Proposed summary ID:** `big_english_3_sb_unit_08_activity_20_summary_grammar_a_v1`
- **Evidence:** Regular-past spelling chart with four pattern columns and a word box; keyed classification; same-page grammar box `bep3_sb_lang_08_03` (regular *-ed* patterns) is present on p.136 for page context only.
- **Proposed summary:** Students copy the regular-past spelling chart and complete it by sorting the word-box verbs into the chart columns.
- **evidence_status:** `sufficient`
- **Boundary note:** Do not import external spelling rules or expand the verb inventory beyond the word box. Do not treat the grammar-box language entity as a selectable activity.

### 5.3 `bep3_sb_act_08_21`

- **Proposed summary ID:** `big_english_3_sb_unit_08_activity_21_summary_grammar_a_v1`
- **Evidence:** Nine keyed narrative gaps; dual `traveled` / `travelled` on one item.
- **Proposed summary:** Students read and complete a nine-item past-form narrative gap-fill.
- **evidence_status:** `sufficient`
- **Boundary note:** Preserve dual `traveled` / `travelled` in any future keyed handling; do not list full answer sets in the summary.

### 5.4 `bep3_sb_act_08_22`

- **Proposed summary ID:** `big_english_3_sb_unit_08_activity_22_summary_grammar_a_v1`
- **Evidence:** Eight keyed base→irregular past matches; same-unit irregular grammar box `bep3_sb_lang_08_04` sits on p.136 (page context), while this matching task is on p.137.
- **Proposed summary:** Students match eight base verbs to their irregular past forms.
- **evidence_status:** `sufficient`
- **Boundary note:** Do not invent irregular verbs beyond the eight keyed items; do not treat the p.136 grammar-box language entity as a selectable activity.

### 5.5 `bep3_sb_act_08_23`

- **Proposed summary ID:** `big_english_3_sb_unit_08_activity_23_summary_grammar_a_v1`
- **Evidence:** Open pair speaking; two verified yesterday model frames only.
- **Proposed summary:** Students tell a partner what they did yesterday, using the verified model frames.
- **evidence_status:** `sufficient`
- **Boundary note:** Open production; do not treat optional prior LiA cards as current Grammar evidence.

### 5.6 `bep_3_wb_act_111_15`

- **Proposed summary ID:** `big_english_3_wb_unit_08_p111_activity_15_summary_grammar_a_v1`
- **Evidence:** Keyed regular-past spelling chart + word box; companion language entity on the same page.
- **Proposed summary:** Students complete the regular-past spelling chart by sorting the word-box verbs into the given columns.
- **evidence_status:** `sufficient`

### 5.7 `bep_3_wb_act_111_16`

- **Proposed summary ID:** `big_english_3_wb_unit_08_p111_activity_16_summary_grammar_a_v1`
- **Evidence:** Ten keyed irregular past writings.
- **Proposed summary:** Students write the simple-past forms of ten irregular verbs.
- **evidence_status:** `sufficient`

### 5.8 `bep_3_wb_act_111_17`

- **Proposed summary ID:** `big_english_3_wb_unit_08_p111_activity_17_summary_grammar_a_v1`
- **Evidence:** Thirteen keyed narrative cloze items mixing regular and irregular past forms.
- **Proposed summary:** Students complete a thirteen-item narrative cloze with the correct past forms of the verbs in parentheses.
- **evidence_status:** `sufficient`

### 5.9 `bep_3_wb_act_112_18`

- **Proposed summary ID:** `big_english_3_wb_unit_08_p112_activity_18_summary_grammar_a_v1`
- **Evidence:** Six keyed Q&A completions; `Did` + base verb items and `Was`/`Were` items; visual dependency; language frame emphasizes `Did` / `did` / `didn't`.
- **Proposed summary:** Students use the page models and illustrations to complete six questions and answers about past activities.
- **evidence_status:** `sufficient`
- **Boundary note:** This is **morphological / formation practice** on the Grammar spread, not LiA communicative `Did…?` dialogue practice. Do not collapse items 3 and 5 into a `Did`-only description. Do not invent missing illustration content.

### 5.10 `bep_3_wb_act_112_19`

- **Proposed summary ID:** `big_english_3_wb_unit_08_p112_activity_19_summary_grammar_a_v1`
- **Evidence:** Three keyed affirmative→`didn't` + base-form negatives.
- **Proposed summary:** Students rewrite three affirmative past sentences as negatives with `didn't`.
- **evidence_status:** `sufficient`
- **Boundary note:** Preserve base-form restoration after `didn't`; do not print full answer keys in the summary.

---

## 6. Proposed membership list (not inserted)

Proposed component key: **`be3-u08-grammar`** · proposed live status if later authorized: `draft` only.

| position | activity_id |
|---:|---|
| 1 | `bep3_sb_act_08_19` |
| 2 | `bep3_sb_act_08_20` |
| 3 | `bep3_sb_act_08_21` |
| 4 | `bep3_sb_act_08_22` |
| 5 | `bep3_sb_act_08_23` |
| 6 | `bep_3_wb_act_111_15` |
| 7 | `bep_3_wb_act_111_16` |
| 8 | `bep_3_wb_act_111_17` |
| 9 | `bep_3_wb_act_112_18` |
| 10 | `bep_3_wb_act_112_19` |

Membership count: **10**. Membership does **not** select an activity for packaging; teacher selection remains authoritative. No component UUID, summary UUID, or SS-link UUID is assigned here (no live collision check authorized).

Shared provenance shape (proposal only):

```json
{
  "record_type": "teacher_friendly_summary",
  "source": "SB|WB",
  "verification_status": "human_verified",
  "original_review_status": "experimental_review_required",
  "generation": {
    "method": "ai_assisted_draft",
    "prompt_version": "grammar-a-step-a-knowledge-prep-v0.1"
  }
}
```

---

## 7. Curriculum-authority review (SS)

SS authority: approved SS-V2 hash `f6f756e1…bb5a`. Unit 8 = **Healthy Living** (`unit_number_raw = "8"`).

Structures raw entries:

- `Did (you) get enough sleep yesterday?`
- `Yes, I did./No, I didn't.`
- `They walked.`
- `She saw a film.`

I can... raw entries include:

- `...ask and answer about activities in the past.`

### Recommendations

| Candidate | Recommendation | Rationale |
|---|---|---|
| Structures (`column_order` 2) | **Proposed** (`status = proposed` only, if later authorized) | Grammar is the morphology home for affirmative regular/irregular past forms across SB Acts 20–22 and WB Acts 15–17 (`They walked.` / `She saw a film.` align). WB Acts 18–19 additionally practice question/negative formation with `did` / `didn't` and base-form restoration on the Grammar pages. This is component-level and supported by full SB+WB evidence. It overlaps LiA’s communicative use of the same Structures cell; the link would locate Grammar relevance, not claim exclusive ownership or make the link `available`. |
| I can... ask/answer about past activities (`column_order` 7) | **Withheld** | Stronger primary fit remains LiA ask/answer practice. Grammar Act 23 is **tell**-your-partner speaking; WB Act 18 is keyed formation, not communicative ask/answer cycles. Linking here would over-share unit language already proposed for LiA. |
| Vocabulary | **Unsuitable** | Healthy-living vocabulary is not the Grammar component’s primary purpose; no independent Vocabulary alignment justifies a link. |
| CLIL/Culture, Writing, Phonics, Values | **Unsuitable** | No defensible component-level alignment from Grammar pp.136–137 / 111–112. |

No SS link is marked available. No link is inserted.

**LiA vs Grammar on shared `Did…?` language:** LiA (132–133 / 107–108) practices communicative past questions and short answers. Grammar WB Act 18–19 practices morphological formation (including base form after `did` / `didn't`, plus `Was`/`Were` items). They must not be conflated in future packaging or summaries.

---

## 8. Integrity and dependency matrix

| Concern | Finding |
|---|---|
| Source order | SB 19→23 then WB 15→19; preserve publisher numbers and page boundaries |
| Keyed vs open | Acts 19–22 and WB 15–19 keyed; Act 23 open speaking |
| Audio | Act 19 / dialogue text only (Audio **159**); no WB audio in scope |
| Visual/layout | Act 19 visual; WB Act 18 visual; other scoped activities non-visual in canonical flags |
| Grammar box / pattern language | Trusted SB places `bep3_sb_lang_08_03` and `bep3_sb_lang_08_04` on **p.136**; WB p.111/112 carry pattern/negative language entities. Language entities are page context, not selectable memberships |
| Chart/table | SB Act 20; WB Act 15 |
| Narrative/cloze | SB Act 21; WB Act 17 |
| Matching | SB Act 22 |
| Speaking/writing | SB Act 23 open speaking; WB Acts 16/19 keyed writing; WB Act 18 keyed Q&A writing |
| Answer-key protection | Do not dump full keys into summaries; Act 19 bike answer is book-check only |
| Cross-activity dependencies | No hard WB Act-to-Act reconstruction chain like LiA 9→10; charts/word boxes are within-activity dependencies |
| Affirmative / negative / question | Affirmative morphology SB 20–22 + WB 15–17; Q&A WB 18; negatives WB 19 |
| Regular vs irregular | Keep spelling-chart regulars distinct from irregular match/write inventories |
| Dual spelling | Preserve `traveled` / `travelled` on SB Act 21 |
| Base form after `did` / `didn't` | Required for WB Acts 18–19 honesty |
| All / partial / zero selection | Membership ≠ selection; unchecked activities must stay absent; zero selection stays empty |
| No reconstruction | Do not rebuild excluded chart columns, dialogue answers, irregular lists, or WB gaps from page memory, NLL membership, or prior-learning cards |
| LiA prior support | Optional later; must never replace current Grammar evidence |

### Representative future Grammar-B exclusion tests

1. Exclude SB Act 19 → Audio 159 and dialogue comprehension evidence absent everywhere.
2. Exclude SB Act 20 → regular spelling chart / word-box classification absent; do not reconstruct from WB Act 15.
3. Exclude SB Act 21 → narrative gaps absent; dual `traveled`/`travelled` handling not required unless selected.
4. Exclude SB Act 22 → irregular match inventory absent; do not borrow WB Act 16 verbs.
5. Exclude SB Act 23 → open speaking / yesterday frames absent.
6. Exclude WB Act 15 → WB regular chart absent; do not substitute SB Act 20.
7. Exclude WB Act 16 → irregular write list absent.
8. Exclude WB Act 17 → thirteen-item cloze absent.
9. Exclude WB Act 18 → Q&A formation and visual dependency absent; do not invent `Did…?` from LiA.
10. Exclude WB Act 19 → negative transforms absent; do not reconstruct base-form negatives from Act 18.
11. Zero SB / zero WB / zero both remain honest empty states.
12. Partial page selection cannot leak adjacent CLIL/Culture pages (135/138/110/113).

---

## 9. Evidence corrections and remaining documentation notes

1. **Resolved stale-local SB incident (not canonical drift):** The first Grammar-A draft inspected a stale local SB file (`938639` bytes / SHA-256 `9f006f79…e845`) that incorrectly placed `bep3_sb_lang_08_03` and `bep3_sb_lang_08_04` on `bep3_sb_p134`. Authoritative Storage object `book-datasets` / `big-english/big_english_3_sb/canonical/v1.json` (`938463` bytes / SHA-256 `3924fa23…67e6`) places both on **`bep3_sb_p136`**. Local SB was restored from that exact object via read-only Storage download after size/hash/JSON/`page_id` checks. Grammar SB summaries bind to **`3924fa23…67e6`**. Do not treat `9f006f79…e845` as authoritative.
2. **Material stale vs trusted difference for Grammar pp.136–137:** SB Activities 19–23, pages `bep3_sb_p136`/`bep3_sb_p137`, continuous text `bep3_sb_text_08_04`, and component `bep3_sb_comp_08_06` are **byte-identical** between stale and trusted objects (activity fingerprints unchanged). The Grammar-page material difference is language placement: trusted `08_03`/`08_04` on p.136 vs stale on p.134 (only `page_id` differed on those two language rows). Outside Grammar membership, the same stale file also misplaced LiA language `08_01`/`08_02` onto p.130 instead of trusted p.132 — recorded here only as further proof of stale-local corruption, not as a Grammar inventory change.
3. **Provisional Grammar brief:** earlier stated WB inventory was evidence-blocked; WB is present and hash-verified (`811deea2…04fa`); inventory is **five** WB activities (15–19).
4. **Companion supportingEvidence:** foreshadows regulars chart, irregular writing, narrative cloze, and Did…?/negatives, but underspecifies that WB Act 18 also includes **`Was` / `Were`** items.
5. **Preflight alignment:** preflight’s claim that `bep3_sb_lang_08_03` / `08_04` belong on Grammar p.136 matches the **trusted** canonical. No future “canonical correction” of these page IDs is proposed.
6. **Experiment 10:** closed SB-only operational history with a raw answer-fidelity failure (*on foot* vs verified bike). Negative honesty lesson only — **not** an SB→WB parity oracle.

---

## 10. What remains unauthorized

- Grammar-A Step B insertion (migration/seed/NLL write)
- Grammar-B package/renderer work
- Grammar-C adapter/flag/overlay work
- Visibility promotion, deployment, broad `supabase db push`
- Changing default `sb_only` serving
- Staging, commit, or push of this document (unless separately authorized)

---

## 11. Owner acceptance record (2026-10-30)

Grammar-A Step A was **formally owner-accepted on 2026-10-30** as a documentation/content milestone only.

Accepted content decisions:

| Decision | Accepted value |
|---|---|
| Proposed component key | `be3-u08-grammar` (not created; not inserted) |
| Relationship | `be3_sb_wb_rel_u08_grammar_sb136-137_wb111-112` |
| Stable reference | `be3-sb-wb-u08-p136-137-wb111-112` |
| Inventory | SB Activities 19–23 + WB Activities 15–19; **ten** ordered proposed memberships |
| Summary designs | Ten activity-specific summaries; preferred v1; `display_status = hidden`; `review_state = experimental`; `evidence_status = sufficient` |
| Source bindings | SB `3924fa23…67e6`; WB `811deea2…04fa` |
| SS Structures | Accepted as a **future `proposed` link only** (not inserted; not available) |
| SS I can… ask/answer | **Withheld** |
| SS Vocabulary / unrelated columns | **Unsuitable** |
| Grammar-box language | `bep3_sb_lang_08_03` and `bep3_sb_lang_08_04` accepted as **p.136 page context**, not selectable memberships |
| Integrity | Activity-specific selection, partial/zero selection, media, answer-key, and no-reconstruction safeguards remain mandatory |

**Still unauthorized:** Grammar-A Step B (migration/seed/NLL insertion), Grammar-B, Grammar-C, promotion, deployment, resolver/`sb_only` changes, and any database/Storage mutation.

**Next possible owner gate:** separately authorize Grammar-A Step B if desired — not active work.
