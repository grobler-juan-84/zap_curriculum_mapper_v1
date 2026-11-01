/**
 * NLL/NLP Inspector trusted admin access gate.
 * Run: npx tsx --test scripts/tests/nllNlpInspectorAccess.test.ts
 */
import assert from 'node:assert/strict'
import test from 'node:test'

import { handleNllNlpInspectorAccessRequest } from '../../app/server/handleNllNlpInspectorAccessRequest.ts'

test('Inspector access rejects missing Bearer when env missing (unauthenticated path)', async () => {
  const previousUrl = process.env.VITE_SUPABASE_URL
  const previousKey = process.env.VITE_SUPABASE_ANON_KEY
  const previousUrl2 = process.env.SUPABASE_URL
  const previousKey2 = process.env.SUPABASE_ANON_KEY
  delete process.env.VITE_SUPABASE_URL
  delete process.env.VITE_SUPABASE_ANON_KEY
  delete process.env.SUPABASE_URL
  delete process.env.SUPABASE_ANON_KEY

  const result = await handleNllNlpInspectorAccessRequest({
    authorizationHeader: undefined,
  })
  assert.equal(result.status, 503)
  assert.equal(result.body.allowed, false)
  assert.equal(result.body.error, 'not_configured')

  if (previousUrl !== undefined) process.env.VITE_SUPABASE_URL = previousUrl
  if (previousKey !== undefined) process.env.VITE_SUPABASE_ANON_KEY = previousKey
  if (previousUrl2 !== undefined) process.env.SUPABASE_URL = previousUrl2
  if (previousKey2 !== undefined) process.env.SUPABASE_ANON_KEY = previousKey2
})

test('Inspector access rejects missing token when Supabase env is present', async () => {
  const previousUrl = process.env.VITE_SUPABASE_URL
  const previousKey = process.env.VITE_SUPABASE_ANON_KEY
  process.env.VITE_SUPABASE_URL = previousUrl || 'https://example.supabase.co'
  process.env.VITE_SUPABASE_ANON_KEY = previousKey || 'anon-test-key'

  const result = await handleNllNlpInspectorAccessRequest({
    authorizationHeader: undefined,
  })
  assert.equal(result.status, 401)
  assert.equal(result.body.allowed, false)
  assert.equal(result.body.error, 'unauthorized')

  if (previousUrl !== undefined) process.env.VITE_SUPABASE_URL = previousUrl
  else delete process.env.VITE_SUPABASE_URL
  if (previousKey !== undefined) process.env.VITE_SUPABASE_ANON_KEY = previousKey
  else delete process.env.VITE_SUPABASE_ANON_KEY
})

test('Inspector access rejects non-Bearer Authorization header', async () => {
  const previousUrl = process.env.VITE_SUPABASE_URL
  const previousKey = process.env.VITE_SUPABASE_ANON_KEY
  process.env.VITE_SUPABASE_URL = previousUrl || 'https://example.supabase.co'
  process.env.VITE_SUPABASE_ANON_KEY = previousKey || 'anon-test-key'

  const result = await handleNllNlpInspectorAccessRequest({
    authorizationHeader: 'Basic abc',
  })
  assert.equal(result.status, 401)
  assert.equal(result.body.allowed, false)

  if (previousUrl !== undefined) process.env.VITE_SUPABASE_URL = previousUrl
  else delete process.env.VITE_SUPABASE_URL
  if (previousKey !== undefined) process.env.VITE_SUPABASE_ANON_KEY = previousKey
  else delete process.env.VITE_SUPABASE_ANON_KEY
})
