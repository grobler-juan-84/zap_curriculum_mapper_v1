# BE3 U8 NLL activity-summary browser matrix v0.1

**Status:** ACTIVE
**Version:** 0.1
**Date:** 2026-10-31
**Scope:** Authenticated Create-a-prompt modal validation at `http://127.0.0.1:5173/` with `VITE_CHALKIE_NLL_ACTIVITY_SUMMARIES=true`.
**Authority boundary:** Initial matrix was validation-only. Values migration `20261030220000` was later owner-authorized and applied; this file records both the pre-apply matrix and the focused post-apply Values browser check.

---

## Environment

| Item | Note |
|---|---|
| App URL | `http://127.0.0.1:5173/` (Vite client) |
| Book / unit | Big English 3 Student Book · Unit 8: Healthy Living |
| Flag | `VITE_CHALKIE_NLL_ACTIVITY_SUMMARIES=true` (process env on the running NLL Vite; owner also added the same key to local env) |
| Adapter / POC / comparison flags | Held off for this matrix |
| Stopped POC server | Earlier Opener-POC Vite on the same port was stopped so the NLL-flag server could bind `5173`. Recorded as an environmental note only — not a product defect. The NLL-flag Vite remained the active server for this matrix. |

---

## Pass criteria (per lesson)

- Modal SB/WB cards show concise **AI summary · experimental** text from preferred NLL `summary_text` (not full Task evidence / Page vocabulary dump).
- No POC getter / comparison / Optional Teaching Guidance leakage.
- NLL table fetches return **200** for live components.
- Values: before apply, fail closed to publisher evidence; after apply, show the three preferred NLL summaries on SB-only cards.

---

## Matrix results (`flag=true`, pre-Values-apply)

| Lesson | Pages | SB cards | WB cards (incl. THINK BIG) | Mode | Result |
|---|---|---:|---:|---|---|
| Opener | 128–129 / WB 104–105 | 5 | 4 | All NLL | **PASS** |
| Story | 130–131 / WB 106 | 2 | 3 (Acts 5–6 + THINK BIG) | All NLL | **PASS** |
| Language in Action | 132–133 / WB 107–108 | 5 | 4 | All NLL | **PASS** |
| CLIL / P.E. | 134–135 / WB 109–110 | 6 | 5 (Acts 11–14 + THINK BIG) | All NLL | **PASS** |
| Grammar | 136–137 / WB 111–112 | 5 | 5 | All NLL | **PASS** |
| Culture | 138–139 / WB 113–114 | 4 | 5 (Acts 20–23 + THINK BIG) | All NLL | **PASS** |
| Writing | 140 / WB 115 | 4 | 3 | All NLL | **PASS** |
| Phonics | 141 / WB 116 | 4 | 4 | All NLL | **PASS** |
| Values | 142 (SB-only) | 3 | 0 | Evidence fallback | **PASS** (fail-closed; Values NLL not yet live) |
| Review | 143 / WB 117 | 3 | 3 | All NLL | **PASS** |

**Live preferred summaries covered pre-apply:** 74/74 across Opener→Review (Values excluded).
**Network sample:** repeated `nll_components` / `nll_activity_summaries` **200**s while flipping lessons.

### Values fail-closed detail (pre-apply)

Cards stayed on publisher evidence (e.g. Act 36 “Look and listen…”, Act 37 language frame, Act 38 group game). No “AI summary · experimental” strip — expected before `20261030220000` was applied.

---

## Focused Values browser check (post-apply, 2026-10-31)

After owner-authorized linked apply of only `20261030220000_seed_nll_be3_u08_values.sql` (live totals **10 / 77 / 77 / 10**), Create-a-prompt on Unit 8 Values p.142 with the same flag-on Vite:

| Check | Result |
|---|---|
| Three SB cards show **AI summary · experimental** | **PASS** |
| Exact live NLL summary texts for Acts 36–38 | **PASS** |
| Concise summary-only presentation (no Task evidence / Page vocabulary / item dump) | **PASS** |
| No Workbook step / companion | **PASS** (Step 1 of 4 · SB selection only) |
| Selection checkbox toggle functional | **PASS** |
| Navigate to Opener then return — no stale Values summaries on Opener; Values summaries restore on return | **PASS** |
| `nll_components` / `nll_activity_summaries` **200** | **PASS** |

Exact texts observed:

1. Students listen to Audio 168 and classify four pictured activities as healthy or unhealthy.
2. Students use the publisher language frames to tell a partner to do healthy things.
3. Students invent an outdoor game with a group, write the rules, and teach it to the class.

---

## Out of scope

- Flag-off regression sample.
- Promotion, permanent flag default, commit, push.

---

## Combined browser evidence (final 77/77)

| Evidence | Coverage |
|---|---|
| Pre-apply flag-on matrix | **74/74** preferred summaries (Opener→Review; Values fail-closed as expected) |
| Post-apply focused Values check | **3/3** Values SB summaries |
| **Combined** | **77/77** preferred Unit 8 NLL activity summaries verified in browser |

## Verdict

**PASS** — Create-a-prompt modal NLL summaries verified for all ten Unit 8 lessons. Combined evidence = completed 74-summary matrix + focused live Values browser result (**77/77**). Entire matrix was not re-run after Values apply because shared runtime code for Opener→Review was unchanged.
