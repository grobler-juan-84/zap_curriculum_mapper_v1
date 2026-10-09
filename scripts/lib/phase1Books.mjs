export const PHASE1_BOOKS = {
  beehive_1_sb: {
    catalogBookId: 'beehive_1_sb',
    registryId: 'BH1',
    displayName: 'Beehive 1 Student Book',
    seriesSlug: 'beehive',
    expectedUnits: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    reportFile: 'BH1_canonical_v1_audit.md',
    unitPaths: Array.from(
      { length: 10 },
      (_, index) =>
        `beehive/beehive_1_sb/batches/unit_${String(index + 1).padStart(2, '0')}.json`,
    ),
  },
  big_english_1_sb: {
    catalogBookId: 'big_english_1_sb',
    registryId: 'BE1-SB',
    displayName: 'Big English 1 Student Book',
    seriesSlug: 'big-english',
    expectedUnits: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    reportFile: 'BE1-SB_canonical_v1_audit.md',
    unitPaths: Array.from(
      { length: 9 },
      (_, index) =>
        `big-english/big_english_1_sb/batches/unit_${String(index + 1).padStart(2, '0')}.json`,
    ),
  },
  big_english_1_wb: {
    catalogBookId: 'big_english_1_wb',
    registryId: 'BE1-WB',
    displayName: 'Big English 1 Workbook',
    seriesSlug: 'big-english',
    expectedUnits: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    reportFile: 'BE1-WB_canonical_v1_audit.md',
    unitPaths: Array.from(
      { length: 9 },
      (_, index) =>
        `big-english/big_english_1_wb/batches/unit_${String(index + 1).padStart(2, '0')}.json`,
    ),
  },
  big_english_2_sb: {
    catalogBookId: 'big_english_2_sb',
    registryId: 'BE2-SB',
    displayName: 'Big English 2 Student Book',
    seriesSlug: 'big-english',
    expectedUnits: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    reportFile: 'BE2-SB_canonical_v1_audit.md',
    unitPaths: Array.from(
      { length: 9 },
      (_, index) =>
        `big-english/big_english_2_sb/batches/unit_${String(index + 1).padStart(2, '0')}.json`,
    ),
  },
  big_english_2_wb: {
    catalogBookId: 'big_english_2_wb',
    registryId: 'BE2-WB',
    displayName: 'Big English 2 Workbook',
    seriesSlug: 'big-english',
    expectedUnits: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    reportFile: 'BE2-WB_canonical_v1_audit.md',
    unitPaths: Array.from(
      { length: 9 },
      (_, index) =>
        `big-english/big_english_2_wb/batches/unit_${String(index + 1).padStart(2, '0')}.json`,
    ),
  },
  big_english_3_sb: {
    catalogBookId: 'big_english_3_sb',
    registryId: 'BE3-SB',
    displayName: 'Big English 3 Student Book',
    seriesSlug: 'big-english',
    expectedUnits: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    reportFile: 'BE3-SB_canonical_v1_audit.md',
    unitPaths: Array.from(
      { length: 9 },
      (_, index) =>
        `big-english/big_english_3_sb/batches/unit_${String(index + 1).padStart(2, '0')}.json`,
    ),
  },
  big_english_3_wb: {
    catalogBookId: 'big_english_3_wb',
    registryId: 'BE3-WB',
    displayName: 'Big English 3 Workbook',
    seriesSlug: 'big-english',
    expectedUnits: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    reportFile: 'BE3-WB_canonical_v1_audit.md',
    unitPaths: Array.from(
      { length: 9 },
      (_, index) =>
        `big-english/big_english_3_wb/batches/unit_${String(index + 1).padStart(2, '0')}.json`,
    ),
  },
  big_english_4_sb: {
    catalogBookId: 'big_english_4_sb',
    registryId: 'BE4-SB',
    displayName: 'Big English 4 Student Book',
    seriesSlug: 'big-english',
    expectedUnits: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    reportFile: 'BE4-SB_canonical_v1_audit.md',
    unitPaths: Array.from(
      { length: 9 },
      (_, index) =>
        `big-english/big_english_4_sb/batches/unit_${String(index + 1).padStart(2, '0')}.json`,
    ),
  },
  big_english_4_wb: {
    catalogBookId: 'big_english_4_wb',
    registryId: 'BE4-WB',
    displayName: 'Big English 4 Workbook',
    seriesSlug: 'big-english',
    expectedUnits: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    reportFile: 'BE4-WB_canonical_v1_audit.md',
    unitPaths: Array.from(
      { length: 9 },
      (_, index) =>
        `big-english/big_english_4_wb/batches/unit_${String(index + 1).padStart(2, '0')}.json`,
    ),
  },
  reach_higher_2a: {
    catalogBookId: 'reach_higher_2a',
    registryId: 'RH2A',
    displayName: 'Reach Higher 2A Student Book',
    seriesSlug: 'reach-higher',
    expectedUnits: [1, 2, 3, 4],
    reportFile: 'RH2A_canonical_v1_audit.md',
    unitPaths: Array.from(
      { length: 4 },
      (_, index) =>
        `reach-higher/reach_higher_2a/batches/unit_${String(index + 1).padStart(2, '0')}.json`,
    ),
  },
}

for (const config of Object.values(PHASE1_BOOKS)) {
  config.canonicalPath =
    `${config.seriesSlug}/${config.catalogBookId}/canonical/v1.json`
}

export function getPhase1Book(bookKey) {
  return PHASE1_BOOKS[bookKey] ?? null
}
