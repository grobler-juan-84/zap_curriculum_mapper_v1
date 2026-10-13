# P2-EXP-BE3-SB-BOOK-OVERVIEW-D017-EXP-A — Inference refinement only

**Date:** 2026-10-13  
**Decision:** D017 — Progressive Curriculum Intelligence (LOCKED)  
**Experiment:** Controlled BE3 methodology refinement — **Experiment A**  
**Control (unchanged):** [`be3-sb-u01-u09-book-overview-d017-v1.md`](./be3-sb-u01-u09-book-overview-d017-v1.md)  
**Companion:** [`be3-methodology-refinement-comparison-d017-v1.md`](./be3-methodology-refinement-comparison-d017-v1.md)  
**Source dataset:** `data/phase1/big_english_3_sb/canonical/v1.json` (catalog `big_english_3_sb`, schema 0.1)  
**Publisher S&S:** **not used to generate this overview**  
**Scope:** Big English 3 Student Book, Units 1–9 only  
**Status:** EXPERIMENTAL — **not accepted**; not a methodology or schema lock

---

## A. Experiment header

| Field | Value |
|---|---|
| Experiment ID | `P2-EXP-BE3-SB-BOOK-OVERVIEW-D017-EXP-A` |
| Hypothesis under test | Writing underrepresentation is primarily caused by **learning-outcome inference rules** |
| Method change | **Inference only** — when Phase 1 has a `component_type: writing` row, include a concise writing competency in Learning Outcomes if supported |
| Presentation | **Unchanged** — exact original eight columns; no Writing column |
| Primary input | Phase 1 canonical JSON — all nine units `human_verified` |
| Explicitly out of scope | Publisher-driven rewriting; new Writing column; schema/DB/API/UI; methodology lock; Phase 3 |

**Generation rule:** Learning Outcomes remain **AI-inferred from Phase 1** (language, vocabulary, components — including writing). Publisher I Can / Writing targets were **not** consulted while drafting this table.

**Isolation note:** Vocabulary, Grammar / Structures, Communicative Functions, CLIL / Culture, Values, and Phonics cells are carried forward from the control v1 overview so that only Learning Outcomes change.

---

## B. Whole-book snapshot

Same book spine as the control: Big English 3 SB keeps the Big English unit structure and adds stronger **writing** micro-skills (sentence/paragraph craft) beside CLIL, culture, values, and phonics. Themes cover routines/time, jobs, chores, animals/habitats, weather, senses, food nutrition, healthy living, and school trips.

Grammar expands into **frequency adverbs**, **have to**, fuller **present simple** paradigms, **can/can't**, **sense verbs + adjectives**, **quantifiers (much/many/a few/a little)**, and **past simple** (*was/were*, *did*, regular/irregular).

This overview summarizes **what the book teaches unit by unit**. It does **not** claim mastery of BE1/BE2 priors.

---

## C. Units 1–9 curriculum overview (Experiment A)

| Unit | Vocabulary | Grammar / Structures | Communicative Functions | Learning Outcomes *(AI-inferred)* | CLIL / Culture | Values | Phonics |
|---|---|---|---|---|---|---|---|
| **1 Wake Up!** (pp. 4–19) | Daily routines; clock times beyond o’clock (*seven thirty, seven forty-five…*); parts of day; hygiene content words | *When does…? at… / in the morning…*; *before/after*; frequency adverbs (*always–never*); subject + verb sentences | Talk about routine times; sequence with before/after; state habit frequency | Talk about daily routines and times; use frequency adverbs for habits; find and use subjects and verbs in sentences about routines; talk about keeping clean / chores timing | Science: Keep It Clean (germs); Culture: time zones / e-pals | Do your chores | **a_e, i_e, o_e** |
| **2 A Lot of Jobs!** (pp. 20–35) | Jobs (*firefighter, nurse, scientist…*); workplaces (*hospital, farm, laboratory…*); creative-job words | *What does he do? / Where does he work?*; full present simple (aff/neg/Wh/Y-N); compound subjects/verbs | Ask/answer about jobs and workplaces; ask personal information questions; offer polite help | Talk about jobs and workplaces; ask/answer present-simple personal questions; write sentences with two subjects and two verbs; show respect to others | Social science: creative jobs; Culture: making communities better | Respect others | **sm, st, sp, sk** |
| **3 Working Hard!** (pp. 36–51) | Chores (*make my bed, walk the dog, do the dishes…*); pocket-money words | *have to / has to*; frequency with chores; *like/love/hate + -ing*; *can* for requests/help | State obligations; express chore preferences; ask for/offer/refuse help | Talk about chores and obligations; say what I like/hate doing; ask for and give help; use capital letters correctly in paragraph titles | Math: pocket money; Culture: children helping family work | Always be happy to help | **ay, oy** |
| **4 Amazing Animals** (pp. 58–73) | Animals (*bear, camel, shark…*); habitats (*desert, rain forest, ocean…*); camouflage / pet words | *Where do … live?*; *can/can't* abilities; adverbs of manner; habitat corrections | Talk about habitats and abilities; discuss pet suitability; describe manner | Talk about animals and abilities; talk about where animals live; find and write topic sentences; talk about protecting animals/habitats | Science: camouflage; Culture: pets in different places | Protect animals and their habitats | **ea, oi, oe** |
| **5 Wonderful Weather!** (pp. 74–89) | Weather (*windy, snowy, rainy…*); clothes for weather; climate words | *What's the weather like today?*; *What was it like yesterday?*; *was/were*; *There was/were* | Describe present/past weather; link clothes to weather; discuss climates | Talk about weather and clothes; talk about past weather with *was/were*; write detail sentences that support a topic; prepare for the weather | Geography: changing climates; Culture: all-weather fun | Prepare for the weather | **sc, sw, sn, sl** |
| **6 Smells Good!** (pp. 90–105) | Sense verbs (*look/sound/smell/taste/feel*); sensory adjectives (*delicious, tight, rough…*) | Sense verb + adjective; *How does/do …?*; *would like to*; invitations | Describe sensory qualities; play guessing games; express preferences; invite | Describe how things look/sound/smell/taste/feel; talk about animal senses; write final sentences that restate the main idea; try new things | Science: senses keep us safe; Culture: how jobs smell | Try new things | **fl, pl, gl, bl** |
| **7 Fabulous Food!** (pp. 112–127) | Sandwich/pizza foods; vitamin/nutrition words; breakfast foods worldwide | *There is/are + some/any*; quantifiers (*a lot of, a few, a little, much, many*); *How much/How many?* | Talk about food existence/quantity; describe eating habits; discuss nutrition | Talk about food with *some/any* and quantifiers; ask *how much/how many*; write a paragraph with title, topic, detail, and final sentences; talk about healthy eating / trying foods | Science: vitamins; Culture: breakfasts worldwide | Try different foods | **br, cr, dr, fr, gr, pr, tr** |
| **8 Healthy Living** (pp. 128–143) | Healthy/unhealthy habits; calorie/fitness words; unusual sports words | Past simple questions with *Did…?*; regular/irregular past (*played, went, saw…*); *and/but/or* | Ask about past healthy habits; narrate past actions; combine ideas | Talk about past healthy/unhealthy actions; use regular/irregular past forms; combine sentences with *and*, *but*, or *or*; talk about getting exercise | PE: calories; Culture: strange sports | Get exercise | **all, au, aw** |
| **9 School Trips!** (pp. 144–159) | Places to visit (*museum, aquarium, zoo…*); past trip verbs (*went, saw, ate…*); art/theater words | Past simple Wh/Y-N (*Where did you go? / Did you…?*); *didn't* + base; SVO sentence order | Narrate past trips; contrast what was/wasn't done; identify sentence parts | Talk about past school trips and places visited; use past affirmative/negative; write sentences with subjects, verbs, and objects; recognize talents | Art: art gallery; Culture: world stage / theater | Recognize your talents | **nt, ld, nd, st** |

---

## D. Evidence and uncertainty notes

### Phase 1 writing evidence used for LO additions

| Unit | Component ID | Phase 1 title | Page (printed) | LO writing fragment (this experiment) |
|---|---|---|---|---|
| 1 | `bep3_comp_0003` | Sentence: Subjects and Verbs | p. 16 | find and use subjects and verbs in sentences about routines |
| 2 | `bep_sb_3_comp_0003` | Sentence: Two Subjects and Verbs | p. 32 | write sentences with two subjects and two verbs |
| 3 | `be_plus_3_sb_comp_003` | Paragraph: Titles | p. 48 | use capital letters correctly in paragraph titles |
| 4 | `big_english_3_sb_component_0012` | Paragraph: Topic Sentences | p. 70 | find and write topic sentences |
| 5 | `bep_sb_3_comp_003` | Paragraph: Detail Sentences | p. 86 | write detail sentences that support a topic |
| 6 | `bep3_comp_u6_003` | Paragraph: Final Sentences | p. 102 | write final sentences that restate the main idea |
| 7 | `bep_3_sb_u07_comp_0008` | Paragraphs (Title, Topic, Detail, Final) | p. 124 | write a paragraph with title, topic, detail, and final sentences |
| 8 | `bep3_sb_comp_08_08` | Combining Sentences with and, but, or | p. 140 | combine sentences with *and*, *but*, or *or* |
| 9 | `bep3_sb_u09_comp_0008` | Writing Sentences: Subjects, Verbs, and Objects | p. 156 | write sentences with subjects, verbs, and objects |

**Rule applied:** Writing outcomes added only where a Phase 1 `writing` component exists (all nine units here). No writing outcome was invented without that component. U8 writing title alone was used (component has no `description` field).

### Intentional limits

| Issue | Impact |
|---|---|
| Eight columns retained | Writing still has no dedicated column; visibility depends on LO cell density |
| Exact I Can wording not in Phase 1 | Outcomes remain AI-inferred paraphrases of component titles/descriptions |
| Publisher S&S not used in generation | Alignment checks belong only in the comparison report |
| Printed pp. 66–67 open `missing_source` (D013) | No invented Unit 4 page content |

**Verification:** All nine units `human_verified`. Whole-book audit: [`docs/phase-1/audits/BE3-SB_canonical_v1_audit.md`](../../phase-1/audits/BE3-SB_canonical_v1_audit.md) PASSED (with documented missing-source exception).

---

## E. Compact self-check

| Criterion | Result |
|---|---|
| Source accuracy (Phase 1 only) | **PASS** |
| Eight-column parity with control | **PASS** (LOs only changed) |
| Writing in Learning Outcomes when Phase 1 supports | **PASS** (9/9 units) |
| No Writing column added | **PASS** |
| Acceptance / methodology lock | **Not accepted / not locked** |

---

## Change log

| Date | Change |
|---|---|
| 2026-10-13 | Created Experiment A overview: inference-only writing LO refinement from Phase 1; control v1 preserved. |
