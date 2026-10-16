# D018 V1 Experiment — BE2 SB Unit 8 pp. 128–129

**Status:** ACTIVE / READY TO RUN  
**Version:** 1.0  
**Date:** 2026-10-16  
**Decision:** D018 (LOCKED) — iteration **V1** only  
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

1. Copy the **Chalkie paste block** below into Chalkie.ai.
2. Generate one lesson (keep default / usual settings; do not expand scope).
3. Score with the **Evaluation checklist**.
4. Fill **Findings** at the bottom (or reply in chat for the agent to record).

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
| 1 | Scope stays on pp. 128–129 (no habitats/phonics/culture takeover) | | |
| 2 | Uses the 12 [SB] animal names (or clearly the page set) | | |
| 3 | Includes / prepares the [SB] like + can frame | | |
| 4 | Supports book activity types (listen/say, game, song, T/F, ask/answer) without inventing missing audio scripts | | |
| 5 | [SS] vs [SB] not silently fused into unmarked “facts” | | |
| 6 | Short enough to paste/use in Chalkie (not a unit dump) | | |
| 7 | Teacher could run the book pages after this lesson | | |

**Pass rule (working):** At least **5× Yes**, zero hard scope failures on #1, and no invented listening scripts presented as book text.

---

## Findings (fill after Chalkie run)

**Run date:**  
**Chalkie output:** (link / export / short description)  
**Checklist scores:**  
**What worked:**  
**What failed or drifted:**  
**Keep for V2?** (Workbook still out of scope until V1 Pass)  
**Owner decision:** Pass / Iterate V1 / Pause  

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
