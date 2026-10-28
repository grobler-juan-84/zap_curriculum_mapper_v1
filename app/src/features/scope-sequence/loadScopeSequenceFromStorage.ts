import { isSupabaseConfigured, SUPABASE_CONFIG_ERROR, supabase } from '../../lib/supabase'
import {
  parseScopeSequenceV2,
  type ScopeSequenceDocument,
} from './scopeSequence'
import { getScopeSequenceStorageArtifact } from './scopeSequenceStorageRegistry'

export type ScopeSequenceLoadResult =
  | {
      readonly ok: true
      readonly data: ScopeSequenceDocument
      readonly sha256: string
    }
  | { readonly ok: false; readonly errors: readonly string[] }

async function sha256Hex(bytes: ArrayBuffer): Promise<string> {
  const subtle = globalThis.crypto?.subtle
  if (!subtle) throw new Error('SHA-256 verification is unavailable in this browser.')
  const digest = await subtle.digest('SHA-256', bytes)
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * Downloads and verifies an approved publisher SS artifact. This path is kept
 * separate from Student Book/Workbook canonical evidence and AI interpretation.
 */
export async function loadScopeSequenceFromStorage(
  catalogBookId: string,
): Promise<ScopeSequenceLoadResult> {
  const artifact = getScopeSequenceStorageArtifact(catalogBookId)
  if (!artifact) {
    return {
      ok: false,
      errors: [`No Scope & Sequence authority registered for ${catalogBookId}.`],
    }
  }
  if (!isSupabaseConfigured || !supabase) {
    return { ok: false, errors: [SUPABASE_CONFIG_ERROR] }
  }

  const { data: signed, error } = await supabase.storage
    .from(artifact.bucket)
    .createSignedUrl(artifact.storagePath, 60)
  if (error || !signed) {
    return {
      ok: false,
      errors: [
        error?.message ??
          `Could not authorize ${artifact.bucket}/${artifact.storagePath}.`,
      ],
    }
  }

  try {
    const separator = signed.signedUrl.includes('?') ? '&' : '?'
    const response = await fetch(
      `${signed.signedUrl}${separator}sha256=${artifact.expectedSha256}`,
      { cache: 'no-store' },
    )
    if (!response.ok) {
      throw new Error(`download returned HTTP ${response.status}`)
    }
    const bytes = await response.arrayBuffer()
    const sha256 = await sha256Hex(bytes)
    if (sha256 !== artifact.expectedSha256) {
      return {
        ok: false,
        errors: [
          `Scope & Sequence checksum mismatch for ${artifact.storagePath}: expected ${artifact.expectedSha256}, got ${sha256}.`,
        ],
      }
    }

    const raw = JSON.parse(new TextDecoder().decode(bytes)) as unknown
    const parsed = parseScopeSequenceV2(raw)
    if (!parsed.ok) return parsed

    const unitNumbers = parsed.data.units.map((unit) =>
      String(Number(unit.unitNumberRaw)),
    )
    const expectedUnitNumbers = Array.from(
      { length: artifact.expectedUnitCount },
      (_, index) => String(index + 1),
    )
    const errors: string[] = []
    if (parsed.data.extractionMetadata.targetLevel !== artifact.expectedTargetLevel) {
      errors.push(
        `Expected target_level=${artifact.expectedTargetLevel}; got ${parsed.data.extractionMetadata.targetLevel}.`,
      )
    }
    if (parsed.data.sourceMetadata.series !== 'Big English') {
      errors.push(
        `Expected source_metadata.series=Big English; got ${parsed.data.sourceMetadata.series}.`,
      )
    }
    if (
      parsed.data.units.length !== artifact.expectedUnitCount ||
      unitNumbers.some((value, index) => value !== expectedUnitNumbers[index])
    ) {
      errors.push(
        `Expected ordered units ${expectedUnitNumbers.join(', ')}; got ${unitNumbers.join(', ')}.`,
      )
    }
    if (errors.length > 0) return { ok: false, errors }

    return { ok: true, data: parsed.data, sha256 }
  } catch (error: unknown) {
    return {
      ok: false,
      errors: [
        `Invalid Scope & Sequence JSON in ${artifact.storagePath}: ${
          error instanceof Error ? error.message : 'unknown error'
        }`,
      ],
    }
  }
}
