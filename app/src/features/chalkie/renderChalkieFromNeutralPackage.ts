/**
 * Shared Chalkie dispatcher for the parity-proved neutral SB→WB packages.
 *
 * Production UI may call Opener/Story only through their guarded canaries or
 * the bounded Stage 5 Opener pilot (all default off). The LiA renderer is
 * registered for non-serving package/renderer parity tests only and is not
 * wired into the overlay or lesson-context serving path.
 */
import type { NeutralSbWbLessonPackage } from './buildNeutralSbWbLessonPackage'
import { renderBe3U08LiaNeutralPackageToChalkieShadow } from './renderBe3U08LiaNeutralPackageToChalkieShadow'
import { renderBe3U08OpenerNeutralPackageToChalkieShadow } from './renderBe3U08OpenerNeutralPackageToChalkieShadow'
import { renderBe3U08StoryNeutralPackageToChalkieShadow } from './renderBe3U08StoryNeutralPackageToChalkieShadow'

const OPENER_RELATIONSHIP_ID =
  'be3_sb_wb_rel_u08_opener_sb128-129_wb104-105'
const STORY_RELATIONSHIP_ID =
  'be3_sb_wb_rel_u08_story_sb130-131_wb106'
const LIA_RELATIONSHIP_ID =
  'be3_sb_wb_rel_u08_lia_sb132-133_wb107-108'

export type ChalkieNeutralPackageRenderOutput = {
  readonly detailedHandoff: string
  readonly lesson1Outline: string
  readonly lesson1Vocabulary: string
  readonly lesson2Outline: string
  readonly lesson2Vocabulary: string
}

export class UnsupportedNeutralPackageRendererError extends Error {
  readonly code = 'unsupported_neutral_package_renderer'
  readonly relationshipId: string
  readonly packageReference: string

  constructor(
    relationshipId: string,
    packageReference: string,
  ) {
    super(
      `No test-only Chalkie renderer is registered for relationship ${relationshipId} (${packageReference}).`,
    )
    this.name = 'UnsupportedNeutralPackageRendererError'
    this.relationshipId = relationshipId
    this.packageReference = packageReference
  }
}

export function renderChalkieFromNeutralPackage(
  lessonPackage: NeutralSbWbLessonPackage,
): ChalkieNeutralPackageRenderOutput {
  switch (lessonPackage.identity.relationshipId) {
    case OPENER_RELATIONSHIP_ID:
      return renderBe3U08OpenerNeutralPackageToChalkieShadow(lessonPackage)
    case STORY_RELATIONSHIP_ID:
      return renderBe3U08StoryNeutralPackageToChalkieShadow(lessonPackage)
    case LIA_RELATIONSHIP_ID:
      return renderBe3U08LiaNeutralPackageToChalkieShadow(lessonPackage)
    default:
      throw new UnsupportedNeutralPackageRendererError(
        lessonPackage.identity.relationshipId,
        lessonPackage.identity.packageReference,
      )
  }
}
