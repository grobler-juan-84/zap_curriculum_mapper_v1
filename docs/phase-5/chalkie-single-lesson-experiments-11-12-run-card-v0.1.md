# Chalkie Single Lesson Workflow + Experiments 11–12 Run Card (v0.1)

**Status:** OBSERVED WORKFLOW / CONTROLLED RUN CARD / **GENERATED — RESULTS RECORDED**  
**Date:** 2026-10-20  
**Target:** Big English 3 Student Book, Unit 8 *Healthy Living*, Language in Action, pp. 132–133  
**Local lesson reference:** `be3-sb-u08-p132-133`  
**Results (post-run; do not rewrite this design from memory):** [`chalkie-single-lesson-experiments-11-13-results-v0.1.md`](./chalkie-single-lesson-experiments-11-13-results-v0.1.md)

## 1. Purpose

Record the current Chalkie **Single Lesson** path exactly enough that later work does not reconstruct it from memory, then compare two bounded outline paths using the same local four-artifact handoff.

This run card does not lock a production methodology or claim that Chalkie's interface will remain unchanged. Pre-run design below is preserved; outcomes live in the results record.

## 2. Current local handoff

The Curriculum Mapper prepares these four items locally from verified JSON plus teacher choices; no OpenAI generation is used:

1. **Lesson title:** `BE3 SB Unit 08 pp. 132–133 — Healthy Living — Asking About Yesterday`
2. **Detailed Chalkie prompt:** current-page evidence, selected `[PRIOR]` vocabulary, guidance and boundaries.
3. **Concise teacher-controlled outline:** `[PRIOR]` retrieval, Activities 8–12 in source order, brief `[SUPPLEMENTARY]` recap.
4. **Suggested Chalkie vocabulary:** `do any exercise, drink lots of water, have a healthy lunch, get enough sleep, ride my bike`.

## 3. Observed Chalkie Single Lesson workflow

### Screen 1 — Topic

Visible three-stage path: **Topic → Refine → Theme**.

Observed controls and actions:

- Topic/title field.
- Grade: `3rd grade`.
- English ability/level: `2nd grade`.
- Slide count: `25 slides`.
- Language: `American English`.
- Large prompt/instructions field: paste the detailed Chalkie prompt.
- Optional **Create outline** control on this first screen.
- Optional source/resource upload area.
- Continue.

### New title behavior

The teacher pasted the local standard title, but Chalkie displayed the AI-suggested title **Healthy Living Language in Action** with a `Suggested` indicator. This is a newly observed UI behavior; earlier runs did not behave this way.

For controlled comparisons, record both:

- **Pasted title** from the Curriculum Mapper.
- **Final title displayed/accepted in Chalkie** before continuing.

Experiments 11 and 12 must use the same final Chalkie title. If Chalkie allows the standard title to be restored, restore it in both runs. If Chalkie insists on its suggestion, accept the same suggestion in both and record it. Do not allow title variation to contaminate the outline comparison.

### Screen 2 — Refine

Observed in the supplied run:

- Lesson framework: **Chalkie default**.
- Align to standards: **Off**.
- Learning goals/objectives: **On** in the screenshot.
- Key vocabulary list: **On**.
- Manually entered vocabulary: the five local suggested phrases, tokenized as separate chips.
- YouTube video: **Off**.
- Audio activities: **Off**.
- Activity sheet: **Off**.
- Image styles and sources: **AI-generated** in the screenshot.
- Continue.

Manual vocabulary entry is important: verify the resulting chips rather than assuming pasted text was parsed correctly.

### Screen 3 — Theme

The final screen is **Pick your theme**. It exposes the Chalkie theme library and Custom MAX. For Experiments 11 and 12, select **Simple** and keep it fixed before generation.

The screenshot establishes the Theme screen, not that a particular theme had already been selected at capture time.

## 4. Controlled comparison

### Question

With title, detailed prompt, vocabulary and all visible settings held constant, does explicitly supplying the local concise outline improve the Single Lesson output compared with the same workflow without requesting an outline?

### Fixed in both runs

| Field | Fixed value |
|---|---|
| Mode | Single Lesson |
| Target | BE3 SB Unit 8 pp. 132–133 only |
| Pasted title | Local deterministic title above |
| Final Chalkie title | Must be identical across both runs; record it |
| Detailed prompt | Exact local detailed prompt |
| Grade / ability | 3rd grade / 2nd grade |
| Slides | 25 |
| Language | American English |
| Framework | Chalkie default |
| Standards | Off |
| Learning goals/objectives | On |
| Vocabulary | Exact five current-page phrases |
| YouTube / audio / activity sheet | Off / Off / Off |
| Image source | AI-generated |
| Theme | Simple |
| Source uploads | None, unless deliberately changed and recorded before both runs |

### Experiment 11 — no outline request

1. Paste the standard title and detailed prompt on Topic.
2. **Do not select Create outline.**
3. Complete Refine with the fixed settings and five vocabulary chips.
4. Choose Simple.
5. Generate and export the PDF.

This is the Single Lesson baseline for this comparison.

### Experiment 12 — local outline replacement

1. Repeat the same title, prompt and Topic settings.
2. Select **Create outline**.
3. Record the Chalkie-generated outline before editing.
4. Replace its outline body with the exact local concise teacher-controlled outline.
5. Keep the final title, Refine settings, vocabulary and theme identical to Experiment 11.
6. Generate and export the PDF.

The only intended experimental difference is the outline path.

## 5. Run record

| Item | Experiment 11 | Experiment 12 |
|---|---|---|
| Pasted title | Local deterministic title (run card §2) | Same as Exp 11 |
| Final Chalkie title | Displayed as *Healthy Living Language in Action* (export filename) | Displayed as *Healthy and Unhealthy Activities* (export filename) |
| Create outline used | No | Yes |
| Chalkie auto-outline captured | N/A | Replaced with local concise outline (see results) |
| Local outline pasted | No | Yes (as outline-body replacement) |
| Export filename | `Healthy Living Language in Action - Experiment 11 NO OUTLINE.pdf` | `Healthy and Unhealthy Activities - Experiment 12 CHANGED OUTLINE.pdf` |
| Requested slides | 25 | 25 |
| Exported PDF pages | 31 (25 intended + six reveals) | 31 (25 intended + six reveals) |
| Generation date/time | 2026-10-20 (owner run) | 2026-10-20 (owner run) |

**Follow-on Experiment 13** (not part of this card’s original two-path design): detailed handoff + concise outline appended in the same initial Topic field; `Create outline` not clicked. Export: `Healthy Living Language in Action - Experiment 13 INITIAL PROMPT WITH APPENDED DETAILED RUN DOWN.pdf` (31 PDF pages). Full findings and the provisional preferred workflow: results record §4–§5.

## 6. Review lenses

Compare the exports on:

- page and topic fidelity;
- preservation of the `Did…?` / short-answer focus;
- use of the five scoped vocabulary phrases;
- use of selected p.128 prior learning as support rather than forced reteaching;
- Activities 8–12 sequence and genuine Student Book working time;
- invented publisher content or audio claims;
- unnecessary definitions, quizzes, repetition or expansion;
- slide economy, allowing for reveal pages in PDF export;
- teacher corrections required before classroom use.

## 7. Interpretation boundary

Experiments 11 and 12 are a practical workflow comparison, not proof of Chalkie's internal mechanism or determinism. At design time this card did not authorize a third run. After Exp 11–12 were reviewed, the owner ran **Experiment 13** (append outline under the detailed handoff; no `Create outline` click); that follow-on is recorded only in the results document and does **not** rewrite this pre-run design.

No result removes the teacher-review requirement. Further generation is **not** authorized by this card.
