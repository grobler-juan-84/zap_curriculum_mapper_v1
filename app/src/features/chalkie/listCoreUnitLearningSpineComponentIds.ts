/**
 * Read-only Unit Learning Spine consumer — core component IDs only.
 *
 * Proves the stored spine can be queried safely. Does not influence Step 2,
 * ranking, selection, handoff, packages, or canaries.
 *
 * Design: `docs/phase-5/unit-learning-spine-and-prior-learning-ranking-design-v0.1.md`
 */
import { getUnitLearningSpine } from './be3U08UnitLearningSpine'
import { coreComponents } from './unitLearningSpine'

/**
 * Return author-curated `core` component IDs for a book/unit, in declared spine order.
 * Empty when no spine exists. Never invents roles, ranks, or mutates the spine record.
 */
export function listCoreUnitLearningSpineComponentIds(
  catalogBookId: string,
  unitNumber: number,
): readonly string[] {
  const spine = getUnitLearningSpine(catalogBookId, unitNumber)
  if (spine == null) return []
  return coreComponents(spine).map((component) => component.componentId)
}
