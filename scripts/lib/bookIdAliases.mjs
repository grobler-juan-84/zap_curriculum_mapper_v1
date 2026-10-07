/**
 * Catalog book_id alias map + merge-time book_id field normalization.
 * Entity ID strings (unit_id, page_id, …) are never rewritten.
 */

import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DEFAULT_MAP_PATH = resolve(__dirname, '../../docs/phase-1/book_id_aliases.json')

const BOOK_ID_KEYS = new Set(['book_id', 'source_book_id', 'target_book_id'])

/**
 * @param {string} [mapPath]
 */
export function loadBookIdAliasMap(mapPath = DEFAULT_MAP_PATH) {
  if (!existsSync(mapPath)) {
    throw new Error(`book_id alias map not found: ${mapPath}`)
  }
  const raw = JSON.parse(readFileSync(mapPath, 'utf8'))
  if (!raw || !Array.isArray(raw.books)) {
    throw new Error('Invalid book_id alias map: missing books[]')
  }

  /** @type {Map<string, string>} alias → catalog_book_id */
  const aliasToCatalog = new Map()
  /** @type {Map<string, object>} */
  const byCatalog = new Map()

  for (const entry of raw.books) {
    const catalog = entry.catalog_book_id
    if (typeof catalog !== 'string' || !catalog.trim()) {
      throw new Error('Invalid alias map entry: catalog_book_id required')
    }
    byCatalog.set(catalog, entry)
    const aliases = Array.isArray(entry.aliases) ? entry.aliases : []
    for (const alias of aliases) {
      if (typeof alias !== 'string' || !alias.trim()) continue
      const existing = aliasToCatalog.get(alias)
      if (existing && existing !== catalog) {
        throw new Error(`Alias "${alias}" maps to both ${existing} and ${catalog}`)
      }
      aliasToCatalog.set(alias, catalog)
    }
    if (!aliasToCatalog.has(catalog)) aliasToCatalog.set(catalog, catalog)
  }

  return {
    version: raw.version ?? 1,
    path: mapPath,
    books: raw.books,
    aliasToCatalog,
    byCatalog,
    resolveCatalogId(value) {
      if (typeof value !== 'string' || !value.trim()) return null
      return aliasToCatalog.get(value) ?? null
    },
    aliasesFor(catalogBookId) {
      const entry = byCatalog.get(catalogBookId)
      if (!entry) return [catalogBookId]
      const set = new Set([catalogBookId, ...(entry.aliases || [])])
      return [...set]
    },
  }
}

/**
 * Rewrite book_id-like fields that are aliases of catalogBookId.
 * Does not rewrite entity ID strings (unit_id, page_id, …).
 *
 * @param {unknown} root
 * @param {string} catalogBookId
 * @param {ReturnType<typeof loadBookIdAliasMap>} map
 */
export function normalizeBookIdFields(root, catalogBookId, map) {
  const allowed = new Set(map.aliasesFor(catalogBookId))
  const seen = new Set()
  let fieldsRewritten = 0

  function walk(node) {
    if (Array.isArray(node)) {
      for (const item of node) walk(item)
      return
    }
    if (node === null || typeof node !== 'object') return

    for (const [key, value] of Object.entries(node)) {
      if (BOOK_ID_KEYS.has(key) && typeof value === 'string') {
        seen.add(value)
        if (allowed.has(value) && value !== catalogBookId) {
          node[key] = catalogBookId
          fieldsRewritten += 1
        }
      } else if (value !== null && typeof value === 'object') {
        walk(value)
      }
    }
  }

  walk(root)

  return {
    catalog_book_id: catalogBookId,
    aliases_applied: [...allowed].filter((a) => a !== catalogBookId).sort(),
    extracted_book_ids_seen: [...seen].sort(),
    fields_rewritten: fieldsRewritten,
    entity_ids_preserved: true,
  }
}

/**
 * Apply catalog book_id to book object + normalize all book_id fields.
 *
 * @param {Record<string, unknown>} dataset
 * @param {string} catalogBookId
 * @param {ReturnType<typeof loadBookIdAliasMap>} map
 * @param {{ at?: string }} [opts]
 */
export function applyCatalogBookId(dataset, catalogBookId, map, opts = {}) {
  const at = opts.at ?? new Date().toISOString()
  const book =
    dataset.book !== null && typeof dataset.book === 'object' && !Array.isArray(dataset.book)
      ? /** @type {Record<string, unknown>} */ (dataset.book)
      : {}

  dataset.book = book

  const stats = normalizeBookIdFields(dataset, catalogBookId, map)

  book.book_id = catalogBookId
  book.catalog_book_id = catalogBookId
  const allowed = new Set(map.aliasesFor(catalogBookId))
  book.extracted_book_ids = stats.extracted_book_ids_seen
    .filter((id) => allowed.has(id))
    .sort()

  const verification =
    dataset.verification !== null &&
    typeof dataset.verification === 'object' &&
    !Array.isArray(dataset.verification)
      ? /** @type {Record<string, unknown>} */ (dataset.verification)
      : {}
  dataset.verification = verification

  verification.catalog_book_id = catalogBookId
  verification.book_id_normalization = {
    ...stats,
    normalized_at: at,
    map_version: map.version,
  }

  return stats
}
