import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { generateChalkieLessonDraftPlugin } from './vite-plugins/generateChalkieLessonDraftPlugin.ts'
import { generateChalkiePromptPlugin } from './vite-plugins/generateChalkiePromptPlugin.ts'
import { signSourcePdfPlugin } from './vite-plugins/signSourcePdfPlugin.ts'

const appRoot = resolve(fileURLToPath(new URL('.', import.meta.url)))

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    signSourcePdfPlugin(appRoot),
    generateChalkiePromptPlugin(appRoot),
    generateChalkieLessonDraftPlugin(appRoot),
  ],
})
