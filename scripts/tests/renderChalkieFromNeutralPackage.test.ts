/**
 * Shared test-only Chalkie dispatcher boundary tests.
 * Run: npx tsx --test scripts/tests/renderChalkieFromNeutralPackage.test.ts
 */
import assert from 'node:assert/strict'
import test from 'node:test'

import type { NeutralSbWbLessonPackage } from '../../app/src/features/chalkie/buildNeutralSbWbLessonPackage.ts'
import {
  renderChalkieFromNeutralPackage,
  UnsupportedNeutralPackageRendererError,
} from '../../app/src/features/chalkie/renderChalkieFromNeutralPackage.ts'

test('unsupported neutral relationship throws a typed error without fallback output', () => {
  const unsupportedPackage = {
    identity: {
      relationshipId: 'be3_sb_wb_rel_u08_lia_sb132-133_wb107-108',
      packageReference: 'be3-sb-wb-u08-p132-133-wb107-108',
    },
  } as unknown as NeutralSbWbLessonPackage

  assert.throws(
    () => renderChalkieFromNeutralPackage(unsupportedPackage),
    (error: unknown) => {
      assert.ok(error instanceof UnsupportedNeutralPackageRendererError)
      assert.equal(error.code, 'unsupported_neutral_package_renderer')
      assert.equal(
        error.relationshipId,
        'be3_sb_wb_rel_u08_lia_sb132-133_wb107-108',
      )
      assert.equal(
        error.packageReference,
        'be3-sb-wb-u08-p132-133-wb107-108',
      )
      assert.match(error.message, /No test-only Chalkie renderer is registered/)
      return true
    },
  )
})
