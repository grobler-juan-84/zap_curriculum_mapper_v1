/**
 * Admin role helper.
 * Run: npx tsx --test scripts/tests/isAdminProfile.test.ts
 */
import assert from 'node:assert/strict'
import test from 'node:test'

import { isAdminProfile } from '../../app/src/features/auth/isAdminProfile.ts'

test('isAdminProfile accepts only the admin role string', () => {
  assert.equal(isAdminProfile('admin'), true)
  assert.equal(isAdminProfile('teacher'), false)
  assert.equal(isAdminProfile(null), false)
  assert.equal(isAdminProfile(undefined), false)
  assert.equal(isAdminProfile(''), false)
  assert.equal(isAdminProfile('Admin'), false)
})
