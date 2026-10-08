/**
 * Load non-VITE secrets into process.env for Node (Vite middleware / future serverless).
 * Never call this from browser code.
 */
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

function applyEnvFile(path: string): void {
  if (!existsSync(path)) return
  for (const line of readFileSync(path, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq <= 0) continue
    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    // Populate Node process.env only. Vite still only exposes VITE_* to the browser bundle.
    if (!(key in process.env) || !process.env[key]) {
      process.env[key] = value
    }
  }
}

/**
 * Prefer root secrets for R2; app/.env.local for public Supabase VITE_* used by JWT verify.
 * Does not inject secrets into the client bundle.
 */
export function loadServerEnv(appRoot: string): void {
  const repoRoot = resolve(appRoot, '..')
  applyEnvFile(resolve(repoRoot, '.env.local'))
  applyEnvFile(resolve(repoRoot, '.env'))
  applyEnvFile(resolve(appRoot, '.env.local'))
  applyEnvFile(resolve(appRoot, '.env'))
}
