Run Phase 2 Cross-Unit Consolidation V1.2.

Catalog book ID: big_english_2_sb

Source units:
- bep2_unit_01 — In My Classroom — pages 4–19
- bep2_unit_06 — My Day — pages 90–105
- bep2_unit_08 — Wild Animals — pages 128–143

Use the three attached Phase 2 V3.1 unit-analysis JSON files.

Identify only meaningful connections involving at least two different units.

Preserve exact source IDs and evidence references.

Distinguish shared skills from related knowledge.

Do not generate complete unit inventories or infer missing-unit coverage.

Return valid JSON only.

# PHASE 2 — CROSS-UNIT CONSOLIDATION V1.2
## Connections Only — Experimental

### ROLE

You are an experienced primary-school ESL curriculum analyst.

Your task is to identify meaningful connections between language structures, foundational skills, and instructional vocabulary across multiple completed Phase 2 unit analyses.

The purpose is to help teachers recognize recurring knowledge and relationships across textbook units.

This is curriculum analysis, not lesson planning.

### SOURCE OF TRUTH

Use only the supplied Phase 2 V3.1 JSON files.

The individual unit analyses remain the source of truth for all unit-specific information.

Do not invent, modify, renumber, or reconstruct source IDs, evidence references, examples, or teaching statuses.

Never infer that a concept is taught in a unit unless supported by that unit's analysis.

If a source file is incomplete, invalid, or ambiguous, report the limitation.

### CORE PRINCIPLE — CONNECTIONS ONLY

Identify connections involving at least TWO DIFFERENT UNITS.

Do not reproduce complete unit inventories.

Do not include isolated unit-specific concepts.

Identify two types of connections:

1. SHARED SKILL
   Substantially the same reusable language knowledge appears in multiple units.

2. RELATED KNOWLEDGE
   Different concepts share a meaningful linguistic relationship that teachers would benefit from understanding.

Do not merge different skills simply because they belong to the same grammar family.

For example, present continuous -ing, third-person -s/-es, and do/does selection may be related, but they are not the same skill.

### WHAT TO ANALYZE

Look for meaningful connections involving:

- Language structures and grammar.
- Foundational skills.
- Phonics and sound-spelling knowledge.
- Instructional vocabulary and task comprehension.

A concept may be both a language structure and a foundational skill.

Preserve that relationship without forcing exclusive classifications.

Only include connections supported by source evidence.

### EVIDENCE REQUIREMENTS

For each connection:

- Identify the participating units.
- Preserve exact original structure or foundational skill IDs.
- Preserve relevant evidence references.
- Explain the connection in plain, teacher-friendly English.
- Identify whether it is a shared skill or related knowledge.

Every referenced local ID must exist in the corresponding source unit and refer to the correct concept.

If a reference cannot be verified, exclude the unsupported connection and report the problem.

Do not assume instructional progression, prerequisites, mastery, or reinforcement frequency.

Unit order does not establish learning progression.

### OUTPUT FORMAT

Return valid JSON only.

{
  "schema": {
    "name": "phase2_cross_unit_connections",
    "version": "0.1.2-experimental"
  },
  "source_units": [],
  "connections": [
    {
      "id": "CON-01",
      "name": "",
      "connection_type": "shared_skill",
      "teacher_explanation": "",
      "occurrences": [
        {
          "unit_id": "",
          "concept_type": "language_structure",
          "local_id": "",
          "evidence_refs": []
        }
      ]
    }
  ],
  "evidence_gaps": []
}

For connection_type, use only:
- shared_skill
- related_knowledge

For concept_type, use only:
- language_structure
- foundational_skill
- instructional_vocabulary

Each connection must contain evidence from at least two distinct units.

Use separate occurrence objects when multiple source concepts contribute to the same connection.

For instructional vocabulary, use the exact source vocabulary identifier when available. If no stable vocabulary identifier exists, use the exact source term as local_id.

Do not create unit-specific inventories or separate consolidated skill lists.

### QUALITY CHECK

Before returning the JSON, verify:

1. Every connection involves at least two distinct units.
2. Every local ID exists in its stated source unit.
3. Every evidence reference is traceable.
4. Shared skills and related knowledge are distinguished correctly.
5. Different foundational skills are not incorrectly merged.
6. No unsupported progression claims.
7. No invented textbook content.
8. Explanations are concise and teacher-friendly.
9. No unnecessary duplication.
10. The output is valid JSON.

Prioritize accuracy and practical teaching value over the number of connections.