# D018 V1 Experiment — BE2 SB Unit 8 pp. 128–129

**Status:** CLOSED AS COMPARATIVE BASELINE (formal Pass not met; V2 authorized by one-time owner override)  
**Version:** 1.2  
**Date:** 2026-10-16  
**Decision:** D018 (LOCKED) — iteration **V1** closed; **V2** authorized (override)  
**Pilot:** Big English 2 Student Book · Unit 8 *Wild Animals* · **printed pages 128–129**

---

## Purpose

Produce one short, usable Chalkie.ai prompt from **Scope & Sequence + Student Book page evidence only**, paste it into Chalkie, and evaluate the **generated lesson** against that prompt.

This is a **manual packaging experiment**. No new app, API, schema, or Storage wiring.

---

## Explicit non-locks

- Does **not** lock packaging format, Chalkie handover, or prompt schema.
- Does **not** unlock Vertical Mapping, Workbook (V2), Book Intelligence (V3), Teaching Intelligence (V4), or School-Specific Intelligence (V5).
- Does **not** change Phase 1 canonical `v1.json` or merge SS into SB.

---

## Inputs (verified)

| Layer | Source | Path / note |
|---|---|---|
| **SS (publisher)** | Companion Scope & Sequence | Local `data/phase1/big_english_2_sb/canonical/ss_v1.json`; Storage `book-datasets` → `big-english/big_english_2_sb/canonical/ss_v1.json` (SHA-256 `e701e1d784beffea84ebbf0dd7a24ab0265bdfe3c575d073b699ae0d19c7a918`) |
| **SB pages** | Phase 1 canonical | `data/phase1/big_english_2_sb/canonical/v1.json` — pages `bep2_p128`, `bep2_p129` |
| **UI hint** | Chalkie Workspace | Same two-page spread concept (D018: start with the two SB pages displayed in the UI) |

**Out of V1:** Workbook, BI overview columns, enrichment, school context, invented listening scripts.

---

## How to run (owner)

1. Prefer **Single lesson** mode for this V1 baseline (see [`../phase-6/chalkie-interface-and-generation-workflow.md`](../phase-6/chalkie-interface-and-generation-workflow.md)).
2. Copy the **Chalkie paste block** below into Chalkie’s instructions field.
3. Record settings used (framework, slide count, theme, vocabulary, audio on/off, etc.).
4. Generate one lesson (do not expand scope; do not default to Floor / Enrichment / Extension splits).
5. Score with the **Evaluation checklist**.
6. Fill **Findings** at the bottom (or reply in chat for the agent to record).

---

## Chalkie paste block (V1)

```text
Create a SHORT slide lesson to SUPPORT Big English 2 Student Book Unit 8 pages 128–129 ONLY.
Do NOT teach later Unit 8 pages (habitats CLIL, phonics, culture, values). Do NOT replace the textbook.
Do NOT invent audio scripts or missing true/false item text.

LABELS (keep visible to the teacher):
- [SS] = publisher Scope & Sequence (unit-level)
- [SB] = Student Book page evidence for pp. 128–129 only

A. WHAT THESE PAGES TEACH

[SS] Unit 8 title: Wild Animals (SB unit pages pp. 128–143 — this lesson uses 128–129 only)

[SS] Vocabulary — Animals: cheetah, crocodile, elephant, giraffe, hippo, kangaroo, monkey, parrot, peacock, polar bear, snake, zebra
[SS] Vocabulary — Verbs: chase, climb trees

[SS] Structures (unit-level; use lightly if they fit these pages):
- Can a kangaroo jump? Yes, it can.
- Can snakes run? No, they can't.

[SS] I can… (unit aims — do not force all three on these two pages):
- …describe animals.
- …talk about where animals live.
- …talk about appreciating animals.

[SB p.128] Section: Vocabulary · heading: Wild Animals
[SB p.128] Target words on page: giraffe, hippo, kangaroo, cheetah, polar bear, zebra, parrot, monkey, peacock, elephant, crocodile, snake
[SB p.128] Activities: Listen, look, and say. / Listen, find, and say. / Play a game.

[SB p.129] Section: Song / Vocabulary · Song: To the Zoo!
[SB p.129] Word on page: chase
[SB p.129] Language on page (required model):
Do you like cheetahs? Yes, I do! Cheetahs can run.
[SB p.129] Activities: Listen and sing. Then look at 1 and find. / Listen and say true or false. / Look at 1. Ask and answer.

Communicative aim for THESE pages:
Students can name the page-128 animals and use the page-129 like + can frame in short supported talk.

B. TEACHING PROGRESSION (REQUIRED)

1) Animal pictures — hear / see / say the 12 names (page 128).
2) Quick recognition game (point / find / say) — still page 128.
3) Song support for “To the Zoo!” — page 129 (do not invent lyrics beyond what the book provides).
4) Model the page-129 frame once or twice: Do you like cheetahs? Yes, I do! Cheetahs can run.
5) Guided practice with other unit animals + simple ability talk that stays on these pages.
6) Optional light [SS] can/can't question if it helps the song/page — do not expand into full unit Q&A or habitats.

C. HARD RULES

- Stay on pages 128–129 only.
- Prefer book activities; slides support, not replace.
- If true/false audio item text is unknown, tell the teacher to use the book/audio — do not invent items.
- Keep the lesson short and classroom-usable.
- Success = students are ready for the book activities on pages 128–129.
```

---

## Evaluation checklist (score the generated lesson)

Score each **Yes / Partial / No**. V1 passes only if the lesson is usable and page-faithful — not merely longer.

| # | Criterion | Score | Notes |
|---|---|---|---|
| 1 | Scope stays on pp. 128–129 (no habitats/phonics/culture takeover) | **Yes** | No takeover by later unit topics |
| 2 | Uses the 12 [SB] animal names (or clearly the page set) | **Yes** | All appear across vocabulary slides |
| 3 | Includes / prepares the [SB] like + can frame | **Yes** | Explicit model and guided examples |
| 4 | Supports book activity types (listen/say, game, song, T/F, ask/answer) without inventing missing audio scripts | **Partial** | Good coverage, but generated audio needs clearer separation from textbook audio |
| 5 | [SS] vs [SB] not silently fused into unmarked “facts” | **Partial** | Some source labels retained; generated examples not consistently identified |
| 6 | Short enough to paste/use in Chalkie (not a unit dump) | **Partial** | Several wordy slides and redundant checks |
| 7 | Teacher could run the book pages after this lesson | **Yes** | Clear references to textbook activities |

**Totals:** 4× Yes · 3× Partial · 0× No  

**Pass rule (working):** At least **5× Yes**, zero hard scope failures on #1, and no invented listening scripts presented as book text.

**Formal rubric outcome:** **BELOW PASS THRESHOLD** (4 Yes < 5 required). Criterion #1 passed (no hard scope failure).

---

## Findings (recorded after Chalkie run)

**Run date:** 2026-10-16 (generation preceded Chalkie ops-guide integration in docs)  
**Prompt submitted:** Exact V1 paste block in this document — **unchanged**.  
**Creation mode:** Prefer Single Lesson for V1 baseline — **owner-confirmed run**; other Refine settings **unverified** unless listed below.  
**Verified settings:**
- Slide count selected: **25**
- Audio activities: **enabled**
- Exported file: `Wild Animals(1).pdf` (**29** PDF pages)
- Do **not** assume 29 PDF pages = 29 platform slides; answer-reveal states contributed to the page count difference.
- Other settings (framework, theme, image style, vocabulary entry details, grade dropdowns, etc.): **unverified** — not recorded for this run.

**Chalkie output:** Exported presentation `Wild Animals(1).pdf` (local owner export; not committed to the repository). Included a supplementary audio exercise titled *Visiting Wild Animals*. Generated audio must **not** be presented as official publisher audio.

**Checklist scores:** See table above (4 Yes / 3 Partial / 0 No).

**What worked (strengths):**
- Correct curriculum scope (pp. 128–129).
- Complete target animal vocabulary.
- Correct target language frame (like + can).
- Useful textbook references.
- Usable first-generation teaching material.

**What failed or drifted (weaknesses):**
- Excessive student-facing text.
- Some repetitive checking activities.
- Generated content not always clearly distinguished from textbook content.
- Supplementary generated audio could be mistaken for publisher audio.

**Potential improvements to investigate later** (hypotheses only — not locked requirements):
- One teaching purpose per slide.
- Large images before explanations.
- Minimal student-facing text.
- Approximately 15–20 words per ordinary teaching slide, excluding essential target sentences.
- Clear identification of supplementary generated activities.

**Experiment status (accurate):**
| Field | Record |
|---|---|
| Generation + evaluation | **Completed** |
| Formal rubric outcome | **BELOW PASS THRESHOLD** (unchanged; not a formal Pass) |
| Practical outcome | **ACCEPTED AS A USABLE COMPARATIVE BASELINE** |
| V1 rerun | **Not performed** (and not required at this stage) |
| Chalkie workflow guide | Integrated in docs **after** this experiment; **no retest** against that guide |
| V2 | **Authorized to prepare** (one-time owner override); **prompt not generated yet** |
| Owner authorization to bypass formal V1 Pass gate | **RECORDED 2026-10-16** — one-time experimental override under D018 (see [`../4-decisions.md`](../4-decisions.md)); does **not** change the rubric or create a general advancement rule |

**V2 scope (authorized, not started):** Add **Workbook** evidence to existing Scope & Sequence + Student Book evidence for the **same** pilot (BE2 Unit 8, SB pp. 128–129). Preserve D018 cumulative design and the existing seven-criterion evaluation principles. Do **not** start V3–V5 or Phase 5–6 productization from this override.

**Owner decision (2026-10-16):** Formal Pass **not** met. V1 closed as comparative baseline. **Proceed to V2** under a **one-time experimental override** only.

---

## Source notes (not for Chalkie paste)

| Item | Evidence |
|---|---|
| SS Unit 8 | `ss_v1.json` → `units` where `unit_number` = `"8"` |
| SB pages | `v1.json` pages `bep2_p128`, `bep2_p129` |
| SB vocab | 12 animals on `bep2_p128`; `chase` on `bep2_p129` |
| SB language | `bep2_lang_u8_001` on `bep2_p129` |
| SB activities | `bep2_act_u8_01` … `bep2_act_u8_06` |
| Verify SS | `node tmp/verify_be2_ss_v1.mjs` (optional `--upload`) |

---

## Change log

| Date | Note |
|---|---|
| 2026-10-16 | Created smallest D018 V1 BE2 pack: SS companion verified/uploaded + ready paste prompt + evaluation checklist. No app/schema changes. |
| 2026-10-16 | Recorded completed Chalkie run + seven-criterion evaluation: 4 Yes / 3 Partial; formal Pass not met; conditionally accepted as comparative baseline; V2 not started; bypass authorization not recorded. |
| 2026-10-16 | V1 closed as usable comparative baseline; owner one-time override authorizes V2 (+ Workbook) without formal Pass, V1 rerun, rubric change, or productization unlock. V2 prompt not generated. |
| 2026-10-16 | Cross-ref only: V2 pack prepared at [`d018-v2-be2-u08-sb128-129-wb104-105-experiment.md`](./d018-v2-be2-u08-sb128-129-wb104-105-experiment.md) (WB 104–105). V1 findings/formal result unchanged. |
