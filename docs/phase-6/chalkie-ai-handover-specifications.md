# General Curriculum Mapper — Chalkie Handover V1

## Document Status

**Status:** PARKED — RETAIN FOR FUTURE DEVELOPMENT  
**Project:** General Curriculum Mapper  
**Relevant Phases:** Phase 5 — Lesson Packaging & Structure / Phase 6 — Lesson Generation  
**Original Development Context:** Chalkie.ai lesson-slide generation experiments  
**Current Development Priority:** None — Phase 2 controlled interpretation experiments currently take priority (D015)

---

# 1. Why This Document Is Parked

This document records the most successful working method developed for handing mapped curriculum content and teacher enrichment to Chalkie.ai for lesson-slide generation.

It is based primarily on manual testing, especially:

- Sandbox #3 — single-deck generation;
- Sandbox #4A — two-part Floor + Extension generation.

The experiments produced valuable findings about:

- curriculum packaging;
- lesson-generation handover;
- Floor vs Extension;
- scaffolding;
- language progression;
- productive speaking;
- generation variability;
- teacher autonomy;
- and the division of responsibility between the curriculum mapper and the lesson-generation system.

These findings remain useful.

However:

> **Chalkie is not the current development priority.**

The General Curriculum Mapper is currently focused primarily on:

> **Phase 2 — Controlled Curriculum Interpretation Experiments**

Therefore this document should remain available as downstream development evidence but should not drive current architecture decisions prematurely.

**PARKED does not mean obsolete.**

It means:

> **Keep the evidence. Stop active development for now. Return when the upstream curriculum intelligence is stronger.**

---

# 2. Position Within the General Curriculum Mapper

The broader architecture is:

```text
Phase 1 — Curriculum Extraction & Structure
↓
Phase 2 — AI Curriculum & Linguistic Interpretation
↓
Phase 3 — Curriculum Connections & Vertical Mapping
↓
Phase 4 — Teacher Enrichment
↓
Phase 5 — Lesson Packaging & Structure
↓
Phase 6 — Lesson Generation
↓
Phase 7 — Evaluation & Refinement
```

This document primarily provides evidence for:

```text
Phase 5
↓
Lesson Packaging / Handover
↓
Phase 6
↓
Chalkie Generation
```

The conceptual downstream pipeline is:

```text
Curriculum Intelligence
↓
Teacher Enrichment
↓
Lesson Package
↓
Chalkie Handover
↓
Chalkie Generation
↓
Teacher Review
```

The exact future implementation may change.

The findings in this document should therefore be treated as:

> **tested downstream evidence**

rather than:

> **a permanent technical architecture.**

---

# 3. Purpose of the Chalkie Handover

The handover sits between curriculum intelligence and lesson generation.

The General Curriculum Mapper determines:

- what the curriculum source requires;
- what constitutes the curriculum floor;
- important vocabulary;
- important language structures;
- relevant previous learning;
- relevant curriculum relationships;
- necessary scaffolding;
- appropriate enrichment;
- pedagogical learning progression;
- and what should remain optional.

Chalkie determines much of the presentation:

- slide design;
- visuals;
- examples;
- practice formats;
- quizzes;
- games;
- and presentation style.

The teacher remains the final professional decision-maker.

Generated Chalkie lessons are therefore intended to be a:

> **strong teaching skeleton**

rather than a finished lesson that removes teacher judgement.

Teachers may:

- add their own activities;
- remove unnecessary slides;
- reorder where appropriate;
- insert textbook pages;
- add games or external tools;
- adjust repetition;
- change examples;
- adapt pacing;
- and add their own teaching style and personality.

The target is not 100% automated lesson perfection.

A generated lesson that provides approximately **90% of a strong teaching skeleton** is considered highly successful if the remaining work consists mainly of appropriate teacher adaptation rather than repairing poor curriculum or pedagogy.

---

# 4. Core Principle

> **FLOOR FIRST. DEPTH SECOND.**

The textbook remains the curriculum anchor and minimum required learning.

The generated lesson must first provide a coherent route through that required learning.

Only once the Floor is secure should enrichment deepen what students can do with the language.

The teacher must be able to stop after the Floor material without breaking the curriculum.

Extension must therefore remain:

> **optional depth**

rather than:

> **hidden compulsory curriculum.**

---

# 5. Major Finding — Two-Part Lesson Series

Sandbox #3 attempted to combine the curriculum Floor and meaningful enrichment into one generated deck.

The result was approximately **75% successful**.

Chalkie produced useful content including:

- sentence frames;
- plurals;
- colors;
- numbers;
- partner work;
- and speaking.

However, the instructional sequence was inconsistent.

Language could:

```text
appear
↓
disappear
↓
return later
```

and the curriculum Floor competed with Extension for limited slide space.

Sandbox #3 also exposed problems including:

- unnecessary vocabulary definitions;
- overly rigid `I Do / We Do / You Do`;
- duplicate reveal slides;
- and some language-quality problems.

Sandbox #4A tested a different model:

```text
Lesson 1 — CORE / FLOOR
↓
Teach the required curriculum thoroughly and systematically.

Lesson 2 — EXTENSION / DEEPER PRACTICE
↓
Use the secure Floor to develop richer and more flexible language.
```

This produced substantially better results.

---

# 6. Important Interpretation of the Two-Part Model

Two Chalkie lessons do **not necessarily represent two separate curriculum lessons**.

They are better understood as:

```text
Part A — Required Core
+
Part B — Optional Depth Reservoir
```

A lower-level class may spend most or all available time on Part A.

A stronger class using the same curriculum may move substantially into Part B.

This supports differentiation without requiring separate curricula for every ability group.

---

# 7. Lesson 1 — CORE / FLOOR

Lesson 1 must be capable of standing completely on its own.

Its purpose is to teach the required curriculum truth and the language necessary for students to use it successfully.

Lesson 1 should prioritize:

- required vocabulary;
- required language structures;
- required grammar or language functions;
- required textbook skills;
- clear modelling;
- controlled practice;
- retrieval;
- speaking;
- and sufficient repetition.

The teacher should not need Lesson 2 in order to complete the required curriculum.

---

# 8. Lesson 2 — EXTENSION / DEEPER PRACTICE

Lesson 2 should deepen secure learning rather than repair an incomplete Lesson 1.

Possible Extension content includes:

- recycled language;
- additional sentence combinations;
- question formation;
- longer answers;
- more independent speaking;
- personalization;
- useful additional vocabulary;
- additional grammar reinforcement;
- learner-error prevention;
- and increasingly flexible language production.

Extension should answer:

> **What else can students meaningfully do with the language they now know?**

rather than simply:

> **What else can we add?**

---

# 9. Extension Means Depth, Not More Words

A major principle from the enrichment and Chalkie experiments is:

> **Extension does not simply mean adding vocabulary.**

Students may already know:

```text
desk
chair
red
blue
```

Extension may instead develop:

```text
It's a desk.

It's a red desk.

What color is the desk?

The desk is red.

Can you see a desk?

Yes, I can.

Where is the desk?

It's next to the chair.
```

The objective is increasingly flexible productive English.

---

# 10. Recommended Language Progression

The handover should encourage a coherent progression such as:

```text
Vocabulary
↓
Useful Language Frame
↓
Scaffolded Practice
↓
Reduced Support
↓
Additional Required Language
↓
Book Task Preparation
↓
Consolidation / Production
```

For individual structures:

```text
Model
↓
Practise
↓
Vary
↓
Reduce Support
↓
Independent Production
```

The exact sequence does not need to be mechanically identical for every lesson.

Pedagogical progression matters more than labels.

---

# 11. Speaking Progression

Where appropriate, language development should move through stages resembling:

```text
Recognize
↓
Recall
↓
Say
↓
Answer
↓
Ask
↓
Combine
↓
Independent Use
```

For example:

```text
desk
```

becomes:

```text
It's a desk.
```

then:

```text
What is it?

It's a desk.
```

then:

```text
Student A:
What is it?

Student B:
It's a desk.
```

The generated lesson should progressively increase student responsibility for producing the language.

---

# 12. Scaffold, Then Fade

The handover should encourage support to decrease over time.

A useful pattern is:

```text
Full Model
↓
Whole-Class Practice
↓
Guided Practice
↓
Substitution
↓
Partial Support
↓
Visual Cue
↓
Partner Production
↓
Independent Production
```

Students should not remain permanently dependent on full models.

The purpose of scaffolding is to enable eventual independence.

---

# 13. Maintain Sentence-Frame Consistency During Controlled Practice

One problem observed during Chalkie generation was **sentence-frame drift**.

For example, a taught frame such as:

```text
How many chairs can you see?
```

might later become:

```text
How many clocks?
```

Both may be valid English.

However, controlled EAL practice benefits from consistency while students are developing automaticity.

Preferred rule:

> **Maintain the taught sentence frame during controlled practice. Allow greater natural variation later during freer production.**

---

# 14. Keep Grammar Concrete

Grammar should generally be taught through:

- examples;
- pictures;
- contrasts;
- repetition;
- sentence frames;
- correction;
- and meaningful use.

Avoid unnecessary abstract grammar lectures.

For example:

```text
It is a desk.

They are desks.
```

or:

```text
There is one chair.

There are four chairs.
```

may be more useful than lengthy grammatical explanation.

---

# 15. Separate New Structures Before Combining Them

If students are learning multiple structures, each should normally receive sufficient practice before they are combined.

For example:

```text
What is it?
It's a desk.
```

can become secure before adding:

```text
What color is it?
It's brown.
```

and later:

```text
Where is the desk?
It's next to the chair.
```

The final lesson may combine them.

The early stages should avoid unnecessary cognitive overload.

---

# 16. Instructional Vocabulary

Instructional words should not automatically become target vocabulary.

For example:

```text
sequence
```

may appear in an instruction while the actual curriculum target is basic classroom vocabulary.

Where necessary, Chalkie or the teacher may:

- simplify;
- explain;
- demonstrate;
- gesture;
- or temporarily scaffold

the instructional language.

Do not automatically turn it into a vocabulary-teaching section.

---

# 17. Vocabulary Definitions

Definitions should only be added when they genuinely improve understanding.

For simple concrete vocabulary, lengthy definitions may be less useful than:

```text
Picture
↓
Recognition
↓
Retrieval
↓
Sentence Use
↓
Speaking
```

For example, students learning `desk` generally do not need a lengthy dictionary-style definition of `desk`.

The slide space is better used helping them **use the word**.

---

# 18. Vocabulary Meaning-Matching

Activities that match simple concrete words to written definitions may consume time without meaningfully improving the target productive language.

Where appropriate, prefer:

- picture recognition;
- retrieval;
- sentence production;
- question-answer practice;
- and speaking.

This is not a universal prohibition.

Meaning-matching may be useful when meaning itself is genuinely challenging.

---

# 19. Games and Quizzes

Games and quizzes should normally practise language students have already encountered.

They should reinforce:

- retrieval;
- vocabulary;
- sentence production;
- question formation;
- listening;
- speaking;
- or useful curriculum content.

A game should not be included simply because a lesson is expected to contain a game.

Useful production matters more than entertainment value alone.

---

# 20. Use the Real Classroom

Where relevant, students should interact with the real environment.

They can:

- look at;
- point to;
- find;
- count;
- describe;
- compare;
- and ask about

actual classroom objects.

For example:

```text
Can you see a clock?

Yes, I can.
```

then:

```text
Where is the clock?

It's on the wall.
```

This creates meaningful production without requiring unnecessary additional resources.

---

# 21. Reverse Question Formation

Where appropriate, students should practise reconstructing questions from answers.

For example:

```text
Answer:
It is a desk.

Question:
What is it?
```

or:

```text
Answer:
The desk is brown.

Question:
What color is the desk?
```

This can help students develop active control over question formation rather than only answering teacher questions.

---

# 22. Error Correction

Predictable learner errors can be deliberately incorporated into practice.

For example:

```text
It are desks.
```

Students correct:

```text
They are desks.
```

Or:

```text
Are you play baseball?
```

Students correct:

```text
Do you play baseball?
```

Error correction should reinforce useful patterns without turning the lesson into a long grammar lecture.

---

# 23. Avoid Overly Rigid I Do / We Do / You Do

The framework can be useful.

However, Chalkie should not force every language point into an identical:

```text
I Do
↓
We Do
↓
You Do
```

sequence.

Different language may require different amounts and forms of practice.

The important principle is:

> **coherent scaffolding toward independent production**

rather than rigid adherence to labels.

---

# 24. Generation Variability — Important Finding

Sandbox #4A revealed that Chalkie can produce materially different outlines from the **exact same prompt**.

The first generation misplaced important Floor content.

Location language such as:

```text
Can you see...?
```

and:

```text
Where is...?
```

was pushed into Lesson 2, leaving Lesson 1 incomplete.

No prompt change was made.

The lesson was simply regenerated.

The second generation correctly placed the location language inside Lesson 1 and produced a substantially stronger Floor / Extension separation.

Therefore:

> **Same Chalkie prompt ≠ guaranteed same pedagogical output.**

This is an important finding for future Phase 6 development.

---

# 25. Generated Output Is a Proposal

The Chalkie outline should be treated as:

> **a generated proposal requiring review**

rather than:

> **a deterministic execution of the curriculum mapper.**

Where possible, the working process should be:

```text
Generate Outline
↓
Review Broad Pedagogical Sequence
↓
Regenerate if Clearly Poor
↓
Approve Outline
↓
Generate Full Slides
↓
Teacher Review
↓
Teacher Adaptation
```

This human checkpoint currently adds substantial value.

---

# 26. Slide Efficiency

Chalkie has limited generation capacity.

Slides should primarily contribute to:

```text
Teach
↓
Model
↓
Practise
↓
Retrieve
↓
Speak
↓
Apply
```

Avoid unnecessarily spending slides on:

- generic welcome slides;
- generic goodbye slides;
- decorative transitions;
- duplicated explanations;
- unnecessary definitions;
- one slide per vocabulary word;
- and recreated textbook pages.

However, do not impose rigid numerical slide quotas.

The Floor may legitimately require most available slides.

The priority is successful learning progression, not an arbitrary ratio.

---

# 27. Duplicate Reveal Slides

Chalkie sometimes creates a question slide followed by an almost identical answer/reveal slide.

Some duplication may be inherent to Chalkie's presentation mechanics.

However, unnecessary duplication should not be encouraged.

Slide capacity should preferably be used for meaningful:

- teaching;
- practice;
- retrieval;
- speaking;
- and application.

---

# 28. Generic Filler Slides

Generic:

- welcome;
- goodbye;
- congratulation;
- decorative transition;
- and motivational filler

slides are low priority.

They should not consume substantial generation capacity at the expense of useful instructional material.

---

# 29. Do Not Recreate Textbook Pages

The generated lesson does not need to reproduce the textbook itself.

The teacher can insert or display textbook pages where appropriate.

Chalkie should instead focus on material that supports the textbook:

- modelling;
- scaffolding;
- additional examples;
- controlled practice;
- retrieval;
- speaking;
- and useful extension.

---

# 30. Teacher Autonomy

Generated lessons are not intended to dictate exact classroom delivery.

Different teachers may use the same skeleton differently.

One teacher may follow most generated slides.

Another may replace sections with:

- Kahoot;
- Blooket;
- physical classroom games;
- notebook activities;
- pair work;
- scavenger hunts;
- teacher-created examples;
- additional drilling;
- or other appropriate activities.

This is expected.

The General Curriculum Mapper and Chalkie should provide high-quality instructional material and progression while leaving space for professional teacher judgement.

---

# 31. Current Working Handover Pattern

The successful Sandbox #4A experiment used a handover based broadly on:

```text
CURRICULUM FLOOR
+
REQUIRED VOCABULARY
+
REQUIRED LANGUAGE
+
SCAFFOLDING
+
PRODUCTIVE PRACTICE
+
OPTIONAL ENRICHMENT
+
GENERATION CONSTRAINTS
```

with the requested output divided into:

```text
Lesson 1
CORE / FLOOR
```

and:

```text
Lesson 2
EXTENSION / DEEPER PRACTICE
```

This pattern remains useful evidence.

However:

> **It should not currently be treated as the permanent universal Phase 5 handover format.**

Future curriculum mapping may reveal a better packaging structure.

---

# 32. Why We Should Not Lock the Handover Yet

The original Chalkie experiments were based on a relatively small curriculum sample.

The General Curriculum Mapper will now process substantially different sources across:

- Beehive;
- Big English;
- Reach Higher;
- and potentially other textbook series later.

Phase 1–4 development may reveal new information that should influence lesson packaging.

For example:

- better curriculum relationships;
- documented prior learning;
- expected prior knowledge;
- richer language classification;
- stronger grammar interpretation;
- future-learning relationships;
- learner-context information;
- and improved enrichment metadata.

Therefore:

> **Do not overfit the final handover architecture to the original At School / Beehive experiments.**

Preserve what worked.

Re-test it later against stronger upstream curriculum intelligence.

---

# 33. Future Phase 5 Questions

When active development resumes, Phase 5 should determine:

- What curriculum information does a lesson generator actually need?
- What information should be excluded?
- How should Book Evidence be represented?
- How should AI Interpretation be represented?
- How much Previous / Current / Future Learning should be included?
- How should enrichment be distinguished from required curriculum?
- Which components must be explicitly mandatory?
- Which components should remain optional?
- How much scaffolding should the mapper prescribe?
- How much should the lesson generator decide?
- How should learner-specific information be included?
- How should the package remain generator-agnostic where practical?

These questions should be answered using evidence from the richer General Curriculum Mapper dataset.

---

# 34. Future Phase 6 Questions

When Chalkie or another lesson-generation system is tested again, Phase 6 should investigate:

- generation consistency;
- Floor protection;
- enrichment placement;
- language-frame consistency;
- scaffolding quality;
- student-production opportunities;
- slide efficiency;
- unnecessary filler;
- regeneration variability;
- teacher editing requirements;
- and overall lesson usefulness.

The target remains:

> **a strong teaching skeleton requiring adaptation rather than repair.**

---

# 35. Quality Check for Future Chalkie Testing

Before accepting a generated lesson, check:

1. Is all required curriculum truth protected?
2. Does the Core/Floor material thoroughly secure required learning?
3. Can the Floor stand alone without Extension?
4. Does each important language frame receive sufficient scaffolded practice?
5. Is the progression coherent?
6. Are vocabulary visuals clearly matched?
7. Are instructional words scaffolded rather than automatically treated as targets?
8. Does Extension deepen rather than replace the Floor?
9. Are new structures practised sufficiently before being combined?
10. Does support gradually decrease?
11. Are students producing more English than the teacher is explaining?
12. Are unnecessary definitions and filler minimized?
13. Are textbook pages left for the teacher to insert where appropriate?
14. Are quizzes and games practising language students have already learned?
15. Is Book Evidence distinguishable from enrichment?
16. Does the generated lesson preserve teacher autonomy?

---

# 36. Overall Teaching Principles Preserved From Testing

## FLOOR FIRST. DEPTH SECOND.

Secure the required curriculum before optional depth.

## RECYCLE BEFORE ADDING.

Use familiar vocabulary in increasingly useful combinations.

## MAXIMIZE STUDENT SPEAKING.

Students should repeatedly say and manipulate the target English.

## KEEP GRAMMAR CONCRETE.

Prefer examples, contrasts and repetition over unnecessary explanation.

## SCAFFOLD, THEN FADE.

Move from strong support toward independent production.

## MAINTAIN COHERENT SEQUENCING.

Each stage should prepare students for the next.

## EXTEND THROUGH LANGUAGE USE.

Extension should deepen what students can do, not simply increase the number of words taught.

## PROTECT TEACHER AUTONOMY.

AI-generated material remains a teaching resource, not a replacement for professional judgement.

---

# 37. Evidence From Existing Experiments

The previous Chalkie experiments established several useful working findings.

### Sandbox #3

Approximately **75% successful**.

Demonstrated that Chalkie could generate useful:

- vocabulary practice;
- sentence frames;
- plurals;
- colors;
- numbers;
- speaking;
- and partner work.

But combining Floor and substantial Extension inside one deck created sequencing and capacity problems.

### Sandbox #4A

Produced a substantially stronger result.

The separation between:

```text
CORE / FLOOR
```

and:

```text
EXTENSION / DEEPER PRACTICE
```

improved the generated teaching skeleton significantly.

The successful generation was estimated to be close to the project's working target of approximately:

> **90% useful teaching skeleton**

with remaining work consisting primarily of teacher review and adaptation.

This evidence should be retained.

It should not yet be generalized into a permanent universal rule without broader testing.

---

# 38. Reason for Parking

The Chalkie work has already answered the immediate strategic question:

> **Can sufficiently strong curriculum intelligence be handed to an AI lesson generator and produce something genuinely useful?**

The current evidence suggests:

> **Yes — the concept is viable.**

The more important question now sits upstream:

> **Can the General Curriculum Mapper reliably build the curriculum intelligence required to support this across different books and textbook series?**

That is why current development remains upstream in:

> **Phase 2 — AI Curriculum & Linguistic Interpretation.**

---

# 39. Resume Conditions

Active Chalkie / Phase 5–6 development should resume when upstream work provides enough evidence to justify another meaningful test.

Useful triggers may include:

- representative Phase 1 datasets exist across Beehive, Big English and Reach Higher;
- the Phase 1 schema has become reasonably stable;
- Phase 2 interpretation has been tested;
- Phase 3 curriculum relationships are producing useful Previous / Current / Future Learning intelligence;
- Phase 4 enrichment can be generated consistently from structured curriculum data;
- or a downstream test is needed to expose an unresolved upstream requirement.

We do not need every earlier phase to be completely finished.

We need enough upstream maturity for the next Chalkie experiment to teach us something new.

---

# 40. Current Project Position

Current development priority:

```text
PHASE 1
Curriculum Extraction & Dataset Development
```

Current downstream status:

```text
Phase 4 — Teacher Enrichment
Strong working philosophy exists

Phase 5 — Lesson Packaging
Useful experimental evidence exists
PARKED

Phase 6 — Chalkie Generation
Concept demonstrated
PARKED
```

The Chalkie work remains part of the General Curriculum Mapper.

It is simply not where development effort should currently be concentrated.

---

# 41. Current General Curriculum Mapper Pipeline

The broader project now follows:

```text
CURRICULUM SOURCE
↓
PHASE 1
Structured Curriculum Evidence
↓
PHASE 2
AI Curriculum & Linguistic Interpretation
↓
PHASE 3
Curriculum Connections
↓
PHASE 4
Teacher Enrichment
↓
PHASE 5
Lesson Packaging
↓
PHASE 6
Lesson Generation
↓
PHASE 7
Teacher Evaluation & System Refinement
```

Chalkie currently sits primarily at:

```text
Phase 6 — Lesson Generation
```

The Chalkie Handover work primarily informs:

```text
Phase 5 → Phase 6
```

---

# 42. Final Principle

The Chalkie experiments have already provided valuable evidence.

Do not discard that evidence.

Do not continue refining Chalkie simply because it can be refined.

Instead:

> **Preserve what we learned. Strengthen the upstream curriculum system. Return to lesson generation when another downstream experiment can teach us something meaningful.**

The long-term objective remains:

> **Reliable curriculum truth + deliberate interpretation + meaningful curriculum connections + purposeful teacher enrichment + coherent lesson packaging + AI generation + professional teacher judgement.**

For now:

> **Chalkie Handover V1 is PARKED — not abandoned, not obsolete, and not the current development priority.**