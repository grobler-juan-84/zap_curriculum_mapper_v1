export type ScopeSequenceStorageArtifact = {
  readonly catalogBookId: string
  readonly bucket: 'book-datasets'
  readonly storagePath: string
  readonly expectedSha256: string
  readonly expectedTargetLevel: string
  readonly expectedUnitCount: 9
}

export const SCOPE_SEQUENCE_STORAGE_BUCKET = 'book-datasets' as const

/**
 * Approved publisher Scope & Sequence authority artifacts.
 * BE1–2 are intentionally absent and therefore remain unchanged.
 */
export const SCOPE_SEQUENCE_STORAGE_ARTIFACTS: Readonly<
  Record<string, ScopeSequenceStorageArtifact>
> = {
  big_english_3_sb: {
    catalogBookId: 'big_english_3_sb',
    bucket: SCOPE_SEQUENCE_STORAGE_BUCKET,
    storagePath: 'big-english/big_english_3_sb/canonical/ss_v1.json',
    expectedSha256: 'f6f756e15becb1fd7aea2f172bdcacc043a520aeee81813472561cc877d6bb5a',
    expectedTargetLevel: 'Big English 3',
    expectedUnitCount: 9,
  },
  big_english_4_sb: {
    catalogBookId: 'big_english_4_sb',
    bucket: SCOPE_SEQUENCE_STORAGE_BUCKET,
    storagePath: 'big-english/big_english_4_sb/canonical/ss_v1.json',
    expectedSha256: 'e48b0832ec1ac1e2aafa690a69900ecf6b2a50aaed54946d02f6daf3fee354ce',
    expectedTargetLevel: 'Big English 4',
    expectedUnitCount: 9,
  },
  big_english_5_sb: {
    catalogBookId: 'big_english_5_sb',
    bucket: SCOPE_SEQUENCE_STORAGE_BUCKET,
    storagePath: 'big-english/big_english_5_sb/canonical/ss_v1.json',
    expectedSha256: 'a3b221412a765b5e2f323d86b67df1163b71b534dcdb1ac7fe19e231af8128c5',
    expectedTargetLevel: 'Big English 5',
    expectedUnitCount: 9,
  },
  big_english_6_sb: {
    catalogBookId: 'big_english_6_sb',
    bucket: SCOPE_SEQUENCE_STORAGE_BUCKET,
    storagePath: 'big-english/big_english_6_sb/canonical/ss_v1.json',
    expectedSha256: '5ec3a4bd6e93380db0d796e49d63e5551f4ead859876de3570dfdfeafbd4d746',
    expectedTargetLevel: 'Big English 6',
    expectedUnitCount: 9,
  },
}

export function getScopeSequenceStorageArtifact(
  catalogBookId: string | null | undefined,
): ScopeSequenceStorageArtifact | null {
  if (!catalogBookId) return null
  return SCOPE_SEQUENCE_STORAGE_ARTIFACTS[catalogBookId] ?? null
}

export function hasScopeSequenceAuthority(
  catalogBookId: string | null | undefined,
): boolean {
  return getScopeSequenceStorageArtifact(catalogBookId) !== null
}
