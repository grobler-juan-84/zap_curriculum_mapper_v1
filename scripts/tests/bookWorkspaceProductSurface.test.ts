/**
 * Product-surface checks: sidebar nav model, App routes, GLP neutrality.
 * Run: npx tsx --test scripts/tests/bookWorkspaceProductSurface.test.ts
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')

function read(rel: string): string {
  return fs.readFileSync(path.join(root, rel), 'utf8')
}

test('Sidebar exposes Curriculum Library + Book Workspace; Series demoted', () => {
  const source = read('app/src/components/shared/Sidebar.tsx')
  assert.match(source, /to:\s*'\/app\/curriculum'/)
  assert.match(source, /label:\s*'Curriculum Library'/)
  assert.match(source, /to:\s*'\/app\/book-workspace'/)
  assert.match(source, /label:\s*'Book Workspace'/)
  assert.doesNotMatch(source, /to:\s*'\/app\/series'/)
  assert.doesNotMatch(source, /label:\s*'Series'/)
  assert.doesNotMatch(source, /Beehive Series/)
  assert.doesNotMatch(source, /Chalkie Workspace/)
  assert.doesNotMatch(source, /to:\s*'\/app\/chalkie'/)
  assert.doesNotMatch(source, /to:\s*'\/app\/workspace'/)
  assert.match(source, /Change book \/ level/)
  assert.match(source, /bookWorkspaceChooseBookPath/)
})

test('App routes: entry resolver; book-workspace canonical; series → chooser; chalkie/workspace redirect', () => {
  const source = read('app/src/App.tsx')
  assert.match(source, /index element=\{<AppEntryRedirect/)
  assert.match(source, /path="book-workspace"\s+element=\{<ChalkiePage/)
  assert.match(
    source,
    /path="series"\s+element=\{<SeriesToWorkspaceChooserRedirect/,
  )
  assert.match(
    source,
    /path="chalkie"[\s\S]*PreserveQueryRedirect to="\/app\/book-workspace"/,
  )
  assert.match(
    source,
    /path="workspace"[\s\S]*PreserveQueryRedirect to="\/app\/book-workspace"/,
  )
  assert.match(source, /path="legacy-mock-workspace"\s+element=\{<BookWorkspacePage/)
})

test('Validation header links use Book Workspace wording', () => {
  const source = read('app/src/features/validation/ValidationHeader.tsx')
  assert.match(source, /Open Book Workspace/)
  assert.doesNotMatch(source, /Open Chalkie Workspace/)
})

test('CL opens Book Workspace with series resume or chooseBook; no /app/series handoff', () => {
  const page = read('app/src/features/curriculum-library/CurriculumLibraryPage.tsx')
  assert.match(page, /resolveLastStudentBookForSeries/)
  assert.match(page, /bookWorkspaceChooseBookPath/)
  assert.match(page, /bookWorkspacePath\(\)/)
  assert.doesNotMatch(page, /navigate\('\/app\/series'\)/)
})

test('Book Workspace embeds course-level chooser and change-book path', () => {
  const page = read('app/src/features/chalkie/ChalkiePage.tsx')
  assert.match(page, /chooseBook/)
  assert.match(page, /SeriesLibrary/)
  assert.match(page, /bookWorkspaceChooseBookPath/)
  assert.match(page, /onSelectCourseLevel/)
})

test('General Lesson Plan renderer stays Chalkie-free', () => {
  const source = read(
    'app/src/features/chalkie/renderGeneralLessonPlanFromNeutralPackage.ts',
  )
  assert.doesNotMatch(source, /Chalkie/)
})

test('Create-a-prompt still offers explicit Chalkie output choice', () => {
  const source = read('app/src/features/chalkie/TeacherChoiceFlowOverlay.tsx')
  assert.match(source, />Chalkie</)
  assert.match(source, /Prepare Chalkie prompt/)
  assert.match(source, /Prepare lesson plan/)
})

test('.env.example documents VITE_CHALKIE_NLL_ACTIVITY_SUMMARIES default off', () => {
  const source = read('.env.example')
  assert.match(source, /VITE_CHALKIE_NLL_ACTIVITY_SUMMARIES=false/)
  assert.match(source, /Does not enable NLL delivery adapters/)
})
