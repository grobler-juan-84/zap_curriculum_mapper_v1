/**
 * Automated audit of the ten live BE3 U8 NLL preferred summaries (77 rows).
 * Distinguishes authored NLL summary_text from canonical evidence dumps.
 * Run: npx tsx --test scripts/tests/nllBe3U08PreferredSummaryAudit.test.ts
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const DIR = path.join(ROOT, 'supabase/migrations')

const SPECS = [
  {
    file: '20261029120000_create_nll_pilot.sql',
    componentKey: 'be3-u08-opener',
    uuid: '3e800008-0000-4000-8000-000000000001',
    activities: [
      'bep3_sb_act_08_01',
      'bep3_sb_act_08_02',
      'bep3_sb_act_08_03',
      'bep3_sb_act_08_04',
      'bep3_sb_act_08_05',
      'bep_3_wb_act_104_1',
      'bep_3_wb_act_104_2',
      'bep_3_wb_act_105_3',
      'bep_3_wb_act_105_4',
    ],
  },
  {
    file: '20261029180000_seed_nll_be3_u08_story.sql',
    componentKey: 'be3-u08-story',
    uuid: '3e800008-0000-4000-8000-000000000002',
    activities: [
      'bep3_sb_act_08_06',
      'bep3_sb_act_08_07',
      'bep_3_wb_act_106_5',
      'bep_3_wb_act_106_6',
      'bep_3_wb_act_106_tb',
    ],
  },
  {
    file: '20261029213000_seed_nll_be3_u08_lia.sql',
    componentKey: 'be3-u08-lia',
    uuid: '3e800008-0000-4000-8000-000000000003',
    activities: [
      'bep3_sb_act_08_08',
      'bep3_sb_act_08_09',
      'bep3_sb_act_08_10',
      'bep3_sb_act_08_11',
      'bep3_sb_act_08_12',
      'bep_3_wb_act_107_7',
      'bep_3_wb_act_107_8',
      'bep_3_wb_act_108_9',
      'bep_3_wb_act_108_10',
    ],
  },
  {
    file: '20261030160000_seed_nll_be3_u08_grammar.sql',
    componentKey: 'be3-u08-grammar',
    uuid: '3e800008-0000-4000-8000-000000000004',
    activities: [
      'bep3_sb_act_08_19',
      'bep3_sb_act_08_20',
      'bep3_sb_act_08_21',
      'bep3_sb_act_08_22',
      'bep3_sb_act_08_23',
      'bep_3_wb_act_111_15',
      'bep_3_wb_act_111_16',
      'bep_3_wb_act_111_17',
      'bep_3_wb_act_112_18',
      'bep_3_wb_act_112_19',
    ],
  },
  {
    file: '20261030170000_seed_nll_be3_u08_clil_pe.sql',
    componentKey: 'be3-u08-clil-pe',
    uuid: '3e800008-0000-4000-8000-000000000005',
    activities: [
      'bep3_sb_act_08_13',
      'bep3_sb_act_08_14',
      'bep3_sb_act_08_15',
      'bep3_sb_act_08_16',
      'bep3_sb_act_08_17',
      'bep3_sb_act_08_18',
      'bep_3_wb_act_109_11',
      'bep_3_wb_act_109_12',
      'bep_3_wb_act_110_13',
      'bep_3_wb_act_110_14',
      'bep_3_wb_act_110_tb',
    ],
  },
  {
    file: '20261030180000_seed_nll_be3_u08_culture.sql',
    componentKey: 'be3-u08-culture',
    uuid: '3e800008-0000-4000-8000-000000000006',
    activities: [
      'bep3_sb_act_08_24',
      'bep3_sb_act_08_25',
      'bep3_sb_act_08_26',
      'bep3_sb_act_08_27',
      'bep_3_wb_act_113_20',
      'bep_3_wb_act_113_21',
      'bep_3_wb_act_114_22',
      'bep_3_wb_act_114_23',
      'bep_3_wb_act_114_tb',
    ],
  },
  {
    file: '20261030190000_seed_nll_be3_u08_writing.sql',
    componentKey: 'be3-u08-writing',
    uuid: '3e800008-0000-4000-8000-000000000007',
    activities: [
      'bep3_sb_act_08_28',
      'bep3_sb_act_08_29',
      'bep3_sb_act_08_30',
      'bep3_sb_act_08_31',
      'bep_3_wb_act_115_24',
      'bep_3_wb_act_115_25',
      'bep_3_wb_act_115_26',
    ],
  },
  {
    file: '20261030200000_seed_nll_be3_u08_phonics.sql',
    componentKey: 'be3-u08-phonics',
    uuid: '3e800008-0000-4000-8000-000000000008',
    activities: [
      'bep3_sb_act_08_32',
      'bep3_sb_act_08_33',
      'bep3_sb_act_08_34',
      'bep3_sb_act_08_35',
      'bep_3_wb_act_116_27',
      'bep_3_wb_act_116_28',
      'bep_3_wb_act_116_29',
      'bep_3_wb_act_116_30',
    ],
  },
  {
    file: '20261030210000_seed_nll_be3_u08_review.sql',
    componentKey: 'be3-u08-review',
    uuid: '3e800008-0000-4000-8000-000000000009',
    activities: [
      'bep3_sb_act_08_39',
      'bep3_sb_act_08_40',
      'bep3_sb_act_08_41',
      'bep_3_wb_act_117_31',
      'bep_3_wb_act_117_32',
      'bep_3_wb_act_117_33',
    ],
  },
  {
    file: '20261030220000_seed_nll_be3_u08_values.sql',
    componentKey: 'be3-u08-values',
    uuid: '3e800008-0000-4000-8000-000000000010',
    activities: [
      'bep3_sb_act_08_36',
      'bep3_sb_act_08_37',
      'bep3_sb_act_08_38',
    ],
  },
] as const

function extractQuoted(sql: string, startIdx: number) {
  if (sql[startIdx] !== "'") return null
  let i = startIdx + 1
  let out = ''
  while (i < sql.length) {
    const ch = sql[i]
    if (ch === "'" && sql[i + 1] === "'") {
      out += "'"
      i += 2
      continue
    }
    if (ch === "'") return { value: out, end: i + 1 }
    out += ch
    i += 1
  }
  return null
}

function firstInsertBlock(sql: string, table: string): string | null {
  const re = new RegExp(`insert\\s+into\\s+public\\.${table}\\b`, 'i')
  const m = re.exec(sql)
  if (!m) return null
  const valuesIdx = sql.toLowerCase().indexOf('values', m.index)
  if (valuesIdx < 0) return null
  let depth = 0
  let started = false
  for (let i = valuesIdx; i < sql.length; i += 1) {
    const ch = sql[i]
    if (ch === '(') {
      depth += 1
      started = true
    } else if (ch === ')') {
      depth -= 1
    } else if (ch === ';' && started && depth === 0) {
      return sql.slice(valuesIdx, i)
    }
  }
  return null
}

function parseMemberships(sql: string, componentId: string) {
  const block = firstInsertBlock(sql, 'nll_component_activities')
  if (!block) return []
  const re = new RegExp(
    `\\('${componentId}',\\s*'([^']+)',\\s*(\\d+)\\)`,
    'g',
  )
  return [...block.matchAll(re)].map((m) => ({
    activityId: m[1]!,
    position: Number(m[2]),
  }))
}

function parseSummaries(sql: string) {
  const block = firstInsertBlock(sql, 'nll_activity_summaries')
  if (!block) return []
  const rows: Array<{
    id: string
    activityId: string
    version: number
    text: string
    displayStatus: string | null
    reviewState: string | null
    isPreferred: boolean
  }> = []
  let i = 0
  while (i < block.length) {
    if (block[i] !== '(') {
      i += 1
      continue
    }
    const peek = block.slice(i, i + 80)
    if (!/^\(\s*'big_english_3_/.test(peek)) {
      i += 1
      continue
    }
    i += 1
    while (/\s/.test(block[i]!)) i += 1
    const id = extractQuoted(block, i)
    if (!id) break
    i = id.end
    while (block[i] === ',' || /\s/.test(block[i]!)) i += 1
    const activityId = extractQuoted(block, i)
    if (!activityId) break
    i = activityId.end
    while (block[i] === ',' || /\s/.test(block[i]!)) i += 1
    const versionMatch = block.slice(i).match(/^(\d+)/)
    if (!versionMatch) break
    i += versionMatch[1]!.length
    while (block[i] === ',' || /\s/.test(block[i]!)) i += 1
    const text = extractQuoted(block, i)
    if (!text) break
    i = text.end
    const rest = block.slice(i, i + 800)
    const flags = rest.match(
      /'(sufficient|insufficient)',\s*'(hidden|available)',\s*'(experimental|reviewed|teacher_corrected)',\s*(true|false)/,
    )
    rows.push({
      id: id.value,
      activityId: activityId.value,
      version: Number(versionMatch[1]),
      text: text.value,
      displayStatus: flags?.[2] ?? null,
      reviewState: flags?.[3] ?? null,
      isPreferred: flags?.[4] === 'true',
    })
  }
  return rows
}

/** True item-bank dumps — not protective phrasing about keyed answers. */
const UNSUITABLE_PATTERNS = [
  /^\s*1\.\s+.+\n\s*2\.\s+/m,
  /\bAnswer:\s*\S+/i,
  /\bexpected answers?:\s*/i,
  /\blanguage frame:\s*/i,
  /\bpage vocabulary:\s*/i,
]

test('all 77 live preferred NLL summaries pass the teacher-facing audit', () => {
  let totalMemberships = 0
  let totalSummaries = 0
  const unsuitable: Array<{
    componentKey: string
    activityId: string
    text: string | null
    issues: string[]
  }> = []

  for (const spec of SPECS) {
    const sql = fs.readFileSync(path.join(DIR, spec.file), 'utf8')
    const memberships = parseMemberships(sql, spec.uuid)
    const summaries = parseSummaries(sql)
    totalMemberships += memberships.length
    totalSummaries += summaries.length
    assert.equal(memberships.length, spec.activities.length, spec.componentKey)
    assert.equal(summaries.length, spec.activities.length, spec.componentKey)
    if (spec.componentKey === 'be3-u08-values') {
      assert.ok(
        memberships.every((row) => row.activityId.startsWith('bep3_sb_')),
        'Values must remain SB-only',
      )
    }

    const byActivity = new Map(summaries.map((row) => [row.activityId, row]))
    for (const [index, activityId] of spec.activities.entries()) {
      const mem = memberships.find((row) => row.activityId === activityId)
      const summary = byActivity.get(activityId)
      const issues: string[] = []
      if (!mem) issues.push('missing_membership')
      else if (mem.position !== index + 1) issues.push(`bad_position:${mem.position}`)
      if (!summary) issues.push('missing_summary')
      else {
        if (!summary.text.trim()) issues.push('empty_text')
        if (summary.version !== 1) issues.push(`bad_version:${summary.version}`)
        if (!summary.isPreferred) issues.push('not_preferred')
        if (summary.displayStatus !== 'hidden')
          issues.push(`display:${summary.displayStatus}`)
        if (summary.reviewState !== 'experimental')
          issues.push(`review:${summary.reviewState}`)
        if (summary.text.length > 320) issues.push(`too_long:${summary.text.length}`)
        if (summary.text.split(/\n/).length >= 4) issues.push('multiline_dump')
        if (UNSUITABLE_PATTERNS.some((re) => re.test(summary.text)))
          issues.push('item_bank_like')
        // Concise teacher summary should not be a raw canonical prompt paste.
        if (/^Listen and (look|read)\.?$/i.test(summary.text.trim()))
          issues.push('raw_prompt_only')
      }
      if (issues.length) {
        unsuitable.push({
          componentKey: spec.componentKey,
          activityId,
          text: summary?.text ?? null,
          issues,
        })
      }
    }
  }

  assert.equal(SPECS.length, 10)
  assert.equal(totalMemberships, 77)
  assert.equal(totalSummaries, 77)
  assert.deepEqual(unsuitable, [])
})
