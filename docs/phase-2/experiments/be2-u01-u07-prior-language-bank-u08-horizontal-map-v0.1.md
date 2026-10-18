# BE2 Units 1–7 → Unit 8 Horizontal-Mapping Investigation (v0.1)

**Date:** 2026-10-18  
**Branch:** `phase-2`  
**Status:** EXPERIMENTAL investigation only — **not** an architecture lock, schema change, D018 change, or Phase 2 closure  
**Pilot application:** Big English 2 · Unit 8 *Wild Animals* opener (SB pp. 128–129; WB pp. 104–105 context from existing D018 docs)  
**Prior pool:** Big English 2 Units 1–7  

**Explicit non-actions:** No schema, code, UI, dataset, Book Intelligence, D018 rubric/results/V2b, Lesson Series prompt, V4/V5, Phase 2 closure, or `docs/4-decisions.md` / operating-tracker updates.

---

## 1. Purpose and boundaries

### Purpose

Test whether existing Big English 2 Scope & Sequence (SS) evidence can produce a reliable, deduplicated prior-language bank from Units 1–7, then apply a small number of suitable patterns to Unit 8 opener vocabulary to create useful cumulative speaking exchanges.

### Guiding question

> What language have students previously encountered, and how can it be naturally reused with Unit 8 vocabulary and objectives to increase meaningful student communication?

### Boundaries

| In scope | Out of scope |
|---|---|
| Horizontal mapping within BE2 only | Vertical mapping (BE1 → BE2) |
| Units 1–7 prior pool | Treating prior exposure as mastery |
| Unit 8 opener: animals vocab + like/can frame | Later U8 habitats, values lesson, phonics, culture, adjective-order grammar pages |
| Structures-first bank + obvious vocab categories | Full communicative-function taxonomy or grammar engine |
| Qualitative comparison with isolated U8 frame | New numerical rubrics; Chalkie lesson generation |

This investigation does **not** discard D018. It treats D018 as evidence that textbook-faithful generation alone can still yield thin cumulative practice.

---

## 2. Sources inspected

### Primary — BE2 companion Scope & Sequence

| Item | Value |
|---|---|
| Local expected path | `data/phase1/big_english_2_sb/canonical/ss_v1.json` |
| Local status at investigation start | **Absent** (gitignored working copy not present) |
| Storage fallback used | `book-datasets` → `big-english/big_english_2_sb/canonical/ss_v1.json` |
| Temporary working copy | `tmp/horizontal-map-be2-ss/ss_v1.json` (gitignored; not committed) |
| SHA-256 | `e701e1d784beffea84ebbf0dd7a24ab0265bdfe3c575d073b699ae0d19c7a918` (**matches** registry) |
| Registry | `docs/phase-1/dataset-registry.md` |

### Selective verification — Student Book canonical

| Item | Value |
|---|---|
| Local path | `data/phase1/big_english_2_sb/canonical/v1.json` (**present**) |
| Use | Only where SS was ambiguous or insufficient for reusable wording / variants |
| Not used as | Replacement for missing SS; exhaustive page-by-page analysis |

### Context only (orientation; not primary evidence)

- `docs/phase-2/experiments/be2-sb-u01-u09-book-overview-d017-v2.md`
- Existing D018 Unit 8 evidence (opener vocab + frame *Do you like cheetahs? Yes, I do! Cheetahs can run.*)
- SB p.129 activity frame from canonical: `Do you like [animals]? Yes, I do! [Animals] can [action].`

### Unit 8 current targets used for application

From SS Unit 8 + SB pp. 128–129 / D018:

- **Animals:** cheetah, crocodile, elephant, giraffe, hippo, kangaroo, monkey, parrot, peacock, polar bear, snake, zebra  
- **Opener verb (SB p.129):** chase  
- **Isolated textbook frame:** *Do you like cheetahs? Yes, I do! Cheetahs can run.*  
- **SS Unit 8 structures (current unit — not prior):** *Can a kangaroo jump? Yes, it can.* / *Can snakes run? No, they can't.* / *A big new camera.*

---

## 3. Actual SS data shape

Top-level keys:

- `source_metadata`
- `original_column_headings`
- `units` (9)
- `checkpoints` (7)
- `extraction_issues` (3)

`original_column_headings` (publisher columns):

1. `Unit`  
2. `Vocabulary`  
3. `Structures`  
4. `CLIL/Culture`  
5. `Values`  
6. `Phonics`  
7. `I can...`

Each unit object:

- `unit_number`, `unit_title`, `student_book_pages`, `source_pages`
- `publisher_categories[]` with `category_name` + `content`

Observed content shapes:

| Category | Typical `content` shape |
|---|---|
| `Vocabulary` | Object of group-name → string arrays |
| `Structures` | Array of example exchange / pattern strings |
| `CLIL/Culture` | Object of strand → `{ items, examples? }` (sometimes `null` items) |
| `Values` | Object with `title` + optional `words` / `dialogue` / `examples` |
| `Phonics` | Object with `target` + `words` |
| `I can...` | Array of outcome strings |

**Not present as dedicated SS columns:** separate “Language”, “Grammar”, or “Communicative functions” fields. Functions must be inferred from Structures / I can… / Values wording. Page/activity references in SS are **unit page ranges** (`student_book_pages`) plus SS source pages in `source_metadata` / `source_pages` — not per-structure SB activity IDs.

---

## 4. Evidence / confidence rules

| Label | Meaning |
|---|---|
| **SS exact** | Exact pattern or wording appears in SS `Structures` (or clearly quoted SS field text) |
| **SS inferred pattern** | SS identifies a structure/function, but complete reusable wording is inferred from SS wording |
| **SB verified** | Exact form or usage selectively confirmed in canonical SB `language` / `activities` |
| **Mapper-generated application** | New Unit 8 example combining eligible prior language with current vocabulary |

Rules used here:

- Do not invent unavailable page/activity references.
- One reusable pattern may cite multiple units/evidence rows.
- Meaningful variants are **not** silently collapsed (`What is it?` vs `What are they?`; noun preference vs like + -ing).
- Ability *can* Q&A in SS Unit 8 is **current-unit** language, not prior-bank inventory.
- Offer/permission *Can I help you?* (SB U4) is **not** treated as ability *can*.

---

## 5. Deduplicated language-structure inventory (Units 1–7)

Experimental bank focused on reusable sentence frames / Q&A patterns / usable grammar patterns. Completeness is SS-first reliability, not linguistic perfection.

| ID | Language family | Reusable pattern | Source unit(s) | Evidence text / reference | Confidence | Notes |
|---|---|---|---|---|---|---|
| PL-01 | Action description (present continuous) | `What's he/she doing? He/She's + -ing.` | 1 | SS U1 Structures: *What's he doing? He's using the computer.* · SB p.5/8: *What's she doing? She's coloring/using the computer.* | SS exact + SB verified | Singular companion forms evidenced |
| PL-02 | Action description (present continuous) | `What are they doing? They're + -ing.` | 1 | SB p.8: *What are they doing? They're gluing.* · SS U1 shows singular only | SB verified (+ SS family) | Keep separate from PL-01 |
| PL-03 | Quantity | `How many + plural noun are there? There's one… / There are…` | 1, 6 | SS U1: *How many pictures are there? There's one picture./There are three pictures.* · SS U6 bare *How many students are there?* · SB p.9 computers example | SS exact + SB verified | Strong picture-count reuse |
| PL-04 | Classroom rules / imperatives | `Be careful.` / `Don't + verb.` | 1 | SS U1 Structures; SB p.12 imperative set | SS exact + SB verified | Low natural fit for U8 opener animals talk |
| PL-05 | Permission / suggestion | `May I …?` / `Let's …` | 1 | SS U1 Values dialogue; SB p.16 | SS exact + SB verified | Values strand; weak U8 opener fit |
| PL-06 | Preference (activity / -ing) | `What do you like doing? I like + -ing.` | 2 | SS U2: *What do you like doing? I like playing tennis.* | SS exact | Gerund preference — related to, but not identical with, U8 noun preference |
| PL-07 | Preference (activity / -ing, 3rd person) | `What does he/she like/love doing? He/She likes/loves + -ing.` | 2 | SS U2; SB p.24 | SS exact + SB verified | Same caution as PL-06 |
| PL-08 | Preference agreement | `… Me, too!` / `… Me neither!` | 2 | SS U2: *They love to swim. Me, too!* / *She doesn't like to play. Me neither!* · SB p.28 | SS exact + SB verified | Useful after like/don't like statements |
| PL-09 | Location | `Where's + noun? It's + prepositional phrase.` | 3 | SS U3: *Where's the TV? It's on the table.* · SB pp.37/40 | SS exact + SB verified | Habitat talk is later U8 — do not force onto opener |
| PL-10 | Location (plural) | `Where are + plural noun? They're + place/prep.` | 3 | SB p.40: *Where are the chairs? They're in the living room.* | SB verified | Plural companion to PL-09 |
| PL-11 | Possession | `She has a bag. The bag is hers.` (+ related possessive set) | 3 | SS U3; SB p.44 possessive pronouns | SS exact + SB verified | Weak opener fit |
| PL-12 | Want / intention | `I/He want(s) to + verb.` | 4, 5 | SS U4/U5 want patterns; SB pp.62/75/78 | SS exact + SB verified | Career/town wants — weak animal opener fit |
| PL-13 | Existence | `Is there a + noun…? Yes, there is. / No, there isn't.` | 4 | SS U4; SB p.63 | SS exact + SB verified | Possible with picture scenes; easy to overextend |
| PL-14 | Price | `How much is/are …?` | 4 | SS U4; SB p.66 | SS exact + SB verified | Not relevant to U8 animals opener |
| PL-15 | Appearance / wellbeing | `You look + adjective. Are you OK?` | 5 | SS U5; SB p.82 | SS exact + SB verified | Thin animal reuse unless adapted carefully |
| PL-16 | Reason | `… because …` | 5 | SS U5; SB p.82 | SS exact + SB verified | Optional enrichment only |
| PL-17 | Time / routines | `When do/does …? … at + time.` | 6 | SS U6; SB p.94 | SS exact + SB verified | Not natural for wild-animal opener |
| PL-18 | Open Wh- questions (set) | `Who…?` / `What's…?` / `Where…?` / `How…?` / `How many…?` | 6 | SS U6 lists bare stems; SB p.98 grammar pattern | SS exact stems + SB verified set | Stems only; full animal applications are mapper-generated |
| PL-19 | Preference (noun) | `Do you like + noun? Yes, I do. I like…` / `No, … don't. … don't like…` | 7 | SS U7: *Do you like fruit? Yes, I do. I like apples. No, we don't. We don't like fruit.* · SB pp.113/116 bananas/fruit | SS exact + SB verified | Closest prior match to U8 opener first half |
| PL-20 | Preference (noun, 3rd person) | `Does he/she like + noun? Yes/No…` | 7 | SB p.116: *Does she like vegetables? No, she doesn't…* · SS U7 shows 1st/2nd-oriented cluster | SB verified (+ SS family) | Keep separate from PL-19 |
| PL-21 | Quantifiers | `a/an/some + noun` (*I want an apple and some pears.* / *He has some water.*) | 7 | SS U7 Structures; SB p.120 countable/uncountable notes | SS exact + SB verified | Can support *a cheetah* / *some zebras*; not a speaking Q&A core |
| PL-22 | Identification (limited) | `What's this?` + naming response | 1 | SB p.11 activity frame *What's this? [Number]!* (numbers context) | SB verified | **Not** in SS Structures. Do not collapse into *What animal is it?* |

**Patterns deliberately not added as prior ability language**

| Candidate | Why excluded from prior bank |
|---|---|
| `Can + subject + verb? Yes, it can. / No, they can't.` | SS + SB place this in **Unit 8** (SS U8 Structures; SB p.132). Current-unit, not prior. |
| `Cheetahs can run.` (ability statement) | SB p.129 Unit 8 opener / D018 required frame — current unit. |
| `Can I help you?` | SB U4 service English — permission/offer *can*, not ability. |

**Count:** **22** deduplicated reusable prior-language patterns in the experimental structure bank.

---

## 6. Obvious reusable vocabulary categories (compact)

Kept separate from structures. No sophisticated vocab-bank model.

| ID | Category | Evidenced items / range | Source | Confidence | U8 opener relevance |
|---|---|---|---|---|---|
| VC-01 | Numbers | numbers 11–100; count to 100 (I can…) | SS U1 CLIL Math + I can… | SS exact | Supports counting animals (with PL-03) |
| VC-02 | Action / activity verbs | coloring, counting, …; climbing trees, playing tennis, …; jump, kick, throw, move; get up, watch TV, … | SS U1–U2/U6 Vocab + U2 CLIL; SB selective | SS exact (+ SB for CLIL verbs) | *jump*, *climb trees* useful beside U8 *chase* / *run* (run not listed as U1–7 SS vocab target) |
| VC-03 | Body-related science words | bones, muscles; strong, weak | SS U2 CLIL Science | SS exact | Partial “body” support only — **not** a classic body-parts set (arm/leg/head…) |
| VC-04 | Descriptive adjectives | strong/weak (U2); new/old (U3); fast/slow (U4); tired (U5/U6) | SS CLIL / SB vocab | SS exact / SB verified | *fast/slow/strong* useful for animal talk; full U8 Values adjectives (*amazing, beautiful…*) are **Unit 8**, not prior |
| VC-05 | Colours | SS U1–7 Vocabulary has **no** colour group. SB shows *favorite color… green/pink* (U3 p.45) and phonics *pink* (U2) | Sparse SB | Incomplete | **Cannot** claim a complete prior colour bank from SS |
| VC-06 | Prepositions / place words | behind, between, in front of, next to; rooms/furniture | SS U3 Vocabulary | SS exact | Better for later habitat/location lessons than opener naming |
| VC-07 | Food nouns | apples, bananas, … | SS U7 Vocabulary | SS exact | Prior preference practice domain; not needed once animals replace food nouns |

**Count:** **7** obvious vocabulary categories recorded (of which VC-05 is an explicit incompleteness finding).

---

## 7. Unit 8 recommendations (contextual; 0–5)

Aim was 3–5 promising candidates. Evidence supports **4** strong-to-usable recommendations. Weak force-fits omitted.

| Rank | Pattern ID | Recommendation | Why it fits Unit 8 opener | Exact vs inferred | Uses which U8 vocab | Cautions |
|---|---|---|---|---|---|---|
| 1 | PL-19 | Noun preference Q&A | Mirrors SB p.129 *Do you like [animals]?* first half; students already practiced *Do you like + noun* with food | SS exact + SB verified | Any animal plural/set (cheetahs, monkeys, …) | Keep singular/plural article choices honest; negative forms evidenced |
| 2 | PL-08 | `Me, too!` / `Me neither!` | Turns preference answers into short communicative exchanges without new grammar | SS exact + SB verified | Same like/don’t-like animal statements | Requires a prior affirmative/negative like-statement |
| 3 | PL-03 | `How many … are there?` | Natural with picture scenes of mixed animals; uses prior quantity language | SS exact + SB verified | Countable animal plurals | Stay with countable plurals; don’t invent habitat content |
| 4 | PL-20 | `Does he/she like + animal?` | Extends preference beyond *Do you like…?* for pair/group talk | SB verified (SS family) | Any animal noun | Third-person forms are SB-stronger than SS string clustering |

**Not recommended for this opener pack (still in bank):**

- PL-06/07 (like + -ing) — related preference family, but gerund pattern is a different reusable pattern from U8 noun likes.  
- PL-09/10 (location) — useful later for habitats; out of opener scope.  
- PL-22 (*What's this?*) — evidenced for numbers, not animals; *What animal is it?* would be mapper-generated adaptation.  
- Ability *can* Q&A — **current Unit 8**, not prior retrieval.

---

## 8. Cumulative speaking exchanges

Every example distinguishes:

1. **Prior pattern** (evidence-backed)  
2. **Current Unit 8 vocabulary**  
3. **Mapper-generated combination** (not claimed as publisher script)

### Exchange A — Preference reuse (closest cumulative upgrade)

| Line | Text | Provenance |
|---|---|---|
| A: Do you like cheetahs? | Prior PL-19 + U8 vocab | Prior pattern SS/SB U7; *cheetahs* = U8 |
| B: Yes, I do. I like cheetahs. | Prior PL-19 | Mapper-generated application (food → animals) |
| A: Me, too! | Prior PL-08 | Mapper-generated application |

Isolated U8 textbook frame often stops at *Yes, I do! Cheetahs can run.* Exchange A shows the preference half can be extended with verified prior agreement language **without** inventing new grammar.

### Exchange B — Preference + current-unit ability (hybrid; labeled)

| Line | Text | Provenance |
|---|---|---|
| A: Do you like kangaroos? | Prior PL-19 + U8 vocab | Mapper-generated application |
| B: Yes, I do. I like kangaroos. | Prior PL-19 | Mapper-generated application |
| A: Kangaroos can jump. | **Current U8** ability statement family | Uses U8 opener *can* + U2/U8-adjacent action *jump* (SS U2 CLIL lists *jump*; U8 SS uses *Can a kangaroo jump?*) |
| B: Me, too! I like kangaroos. | Prior PL-08 + PL-19 | Mapper-generated application |

**Caution:** The *can* line is **not** prior-bank retrieval; it is current-unit language combined with prior preference.

### Exchange C — Quantity with animals

| Line | Text | Provenance |
|---|---|---|
| A: How many zebras are there? | Prior PL-03 + U8 vocab | Mapper-generated application |
| B: There are two zebras. | Prior PL-03 | Mapper-generated application (number chosen for illustration) |

### Exchange D — Third-person preference

| Line | Text | Provenance |
|---|---|---|
| A: Does she like parrots? | Prior PL-20 + U8 vocab | Mapper-generated application |
| B: No, she doesn't. She doesn't like parrots. | Prior PL-20 | Mapper-generated application |
| A: Me neither! | Prior PL-08 | Mapper-generated application |

### Non-example (labeled unsafe silent collapse)

| Line | Why not treated as evidenced prior |
|---|---|
| *What animal is it? It is a cheetah.* | *What animal is it?* is **mapper-generated adaptation** unless later SB-evidenced. *What's this?* (PL-22) is numbers-context only. Do not claim publisher evidence for the animal identification frame. |

---

## 9. Comparison with isolated Unit 8 language

Isolated textbook frame (SB p.129 / D018):

> Do you like cheetahs? Yes, I do! Cheetahs can run.

| Assessment lens | Cumulative mapped exchanges vs isolated frame |
|---|---|
| Meaningful student language production | **Improved** when preference is expanded (I like… / Me, too! / Does she like…?) and when quantity Q&A is added |
| Reuse of verified prior learning | **Yes** for PL-19, PL-08, PL-03, PL-20; *can* remains current-unit |
| Natural / age-appropriate | **Yes** for short preference and counting exchanges; avoid forcing location/career/price patterns |
| Full-sentence Q&A | **Supported** more consistently than the minimal isolated frame alone |
| Unrelated curriculum expansion | **Avoidable** if recommendations stay on preference/quantity and do not pull habitats/phonics/culture |
| Teacher choice | **Useful:** teacher can take 0–4 recommendations; ability *can* can stay current-unit only |

Qualitative verdict: horizontal mapping does **not** replace the Unit 8 frame; it shows how Units 1–7 can make the preference side communicatively richer while keeping ability language correctly labeled as current-unit content.

---

## 10. Gaps and uncertainties

1. **SS alone lacks communicative-function and per-activity provenance.** Functions are inferred; structure page hits need SB.  
2. **No SS colour vocabulary group** for BE2 U1–7; colour bank incomplete.  
3. **No classic body-parts inventory** in SS Vocabulary; only bones/muscles CLIL.  
4. **Identification frames thin:** *What's this?* is SB numbers practice, not animal ID.  
5. **Canonical vs variant decisions remain open:** e.g. whether PL-06 and PL-19 are one preference family with two selectable patterns (current choice: two patterns).  
6. **Ability *can* is not prior.** Any cumulative script that includes *can* must mark current-unit content.  
7. **SS `I can…` outcomes** describe unit goals but are not themselves selectable speaking frames.  
8. **Values dialogues** sometimes contain reusable social language (May I / Let's) with weak U8 opener fit.  
9. **Run** as verb is central to the U8 example frame but was not found as a U1–7 SS Vocabulary target in this pass.  
10. **WB 104–105** not re-opened here; D018 already notes naming/matching practice without dedicated like+can language entities.

---

## 11. Findings

1. **SS-first works for a usable structures bank.** Units 1–7 SS `Structures` plus light SB verification produced **22** deduplicated reusable patterns with traceable provenance.  
2. **The highest-value prior pattern for U8 opener is U7 noun preference** (*Do you like + noun?*), not U2 like + -ing.  
3. **Agreement tokens (*Me, too! / Me neither!*) and quantity (*How many…?*)** are strong, low-risk cumulative additions.  
4. **Ability language is mostly current Unit 8**, so “cumulative” scripts must distinguish prior retrieval from current-unit combination. This is a key instructional-design finding, not a failure of the bank.  
5. **Vocabulary categories are only partially recoverable from SS** (numbers/actions/adjectives yes; colours/body parts incomplete).  
6. **SS-first appears sufficient for the next structures-focused experiment**, with selective SB checks for variants and activity wording.  
7. **This evidence supports — but does not decide — the proposed Phase 2 exit-test idea** (“complete, deduplicated, traceable prior-language structure inventory from BE2 U1–7 for application to U8”). A manual PoC is feasible; closure criteria, ownership phase, and recommendation ranking rules remain unresolved.  
8. **D018 remains valuable negative/positive evidence:** textbook-faithful generation can preserve the isolated frame while still underusing prior language. Horizontal mapping addresses that gap without rewriting D018 results.

---

## 12. Recommended smallest next experiment

**Manual SS→bank packaging dry-run (no UI, no schema lock):**

1. Freeze this v0.1 structure table as the candidate inventory.  
2. For Unit 8 opener only, produce a one-page “teacher choice card”:  
   - Recommended (the 4 patterns above)  
   - Full eligible structure list (IDs PL-01…PL-22)  
   - Explicit labels: prior vs current-unit (*can*)  
3. Have a teacher (or owner-as-teacher) select 0–5 patterns and write/speak 3 short exchanges using only those selections + U8 animals.  
4. Judge qualitatively whether selection + provenance labels reduce thin isolated-frame lessons.

**Do not yet:** build recommendation ranking code, close Phase 2, authorize V4/V5, or change D018 / Lesson Series artifacts.

---

## Appendix A — Units 1–7 SS Structures (raw)

| Unit | Title | SS Structures (exact) |
|---|---|---|
| 1 | In My Classroom | What's he doing? He's using the computer. · How many pictures are there? There's one picture./There are three pictures. · Be careful. Don't be silly. · Listen to me. Don't eat in the classroom. |
| 2 | My Games | What do you like doing? I like playing tennis. · What does she love doing? She loves skating. · They love to swim. Me, too! · She doesn't like to play. Me neither! |
| 3 | In My House | Where's the TV? It's on the table. · Ben's keys are on the table. · She has a bag. The bag is hers. |
| 4 | In My Town | We want to buy a book. · He wants to go to the post office. · Is there a bank on Elm Street? Yes, there is./No, there isn't. · How much is it? It's two dollars and ten cents. |
| 5 | My Dream Job | What do you want to be? I want to be an actor. · What does she want to be? She wants to be a doctor. · Tim wants to be a doctor because he loves science. · You look tired, Are you OK? |
| 6 | My Day | When does he get up? He gets up at six o'clock. · Who are you? · What's your job? · Where do you work? · How many students are there? |
| 7 | My Favorite Food | Do you like fruit? Yes, I do. I like apples. No, we don't. We don't like fruit. · I want an apple and some pears. · He has some water. |

## Appendix B — Access note

Local SS path was missing; Storage object was downloaded read-only to `tmp/` for this investigation, SHA-verified, and left uncommitted per `.gitignore` (`tmp/`).
