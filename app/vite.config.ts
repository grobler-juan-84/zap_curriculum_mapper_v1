import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { signSourcePdfPlugin } from './vite-plugins/signSourcePdfPlugin.ts'

const appRoot = resolve(fileURLToPath(new URL('.', import.meta.url)))
const repoRoot = resolve(appRoot, '..')
const be3AbBookIntelligenceJson = resolve(
  repoRoot,
  'data/phase2/big_english_3_sb/interpretations/be3-sb-u01-u09-book-intelligence-ab-v0.1-draft.json',
)

export default defineConfig({
  plugins: [react(), tailwindcss(), signSourcePdfPlugin(appRoot)],
  resolve: {
    alias: {
      // Local Phase 2 BI artifact (read-only preview; not Storage/Supabase)
      '@bi-be3-ab-json': be3AbBookIntelligenceJson,
    },
  },
  server: {
    fs: {
      allow: [appRoot, resolve(repoRoot, 'data')],
    },
  },
})
