/**
 * Shared Chalkie dispatcher for the parity-proved neutral SB→WB packages.
 *
 * Production UI may call Opener/Story/LiA/Grammar/CLIL/Culture/Writing only through their guarded
 * canaries or default-off NLL adapter pilots. Flag-off Grammar/CLIL/Culture/Writing remain sb_only.
 */
import type { NeutralSbWbLessonPackage } from './buildNeutralSbWbLessonPackage'
import { renderBe3U08ClilPeNeutralPackageToChalkieShadow } from './renderBe3U08ClilPeNeutralPackageToChalkieShadow'
import { renderBe3U08CultureNeutralPackageToChalkieShadow } from './renderBe3U08CultureNeutralPackageToChalkieShadow'
import { renderBe3U08GrammarNeutralPackageToChalkieShadow } from './renderBe3U08GrammarNeutralPackageToChalkieShadow'
import { renderBe3U08LiaNeutralPackageToChalkieShadow } from './renderBe3U08LiaNeutralPackageToChalkieShadow'
import { renderBe3U08OpenerNeutralPackageToChalkieShadow } from './renderBe3U08OpenerNeutralPackageToChalkieShadow'
import { renderBe3U08StoryNeutralPackageToChalkieShadow } from './renderBe3U08StoryNeutralPackageToChalkieShadow'
import { renderBe3U08WritingNeutralPackageToChalkieShadow } from './renderBe3U08WritingNeutralPackageToChalkieShadow'

const OPENER_RELATIONSHIP_ID =
  'be3_sb_wb_rel_u08_opener_sb128-129_wb104-105'
const STORY_RELATIONSHIP_ID =
  'be3_sb_wb_rel_u08_story_sb130-131_wb106'
const LIA_RELATIONSHIP_ID =
  'be3_sb_wb_rel_u08_lia_sb132-133_wb107-108'
const CLIL_PE_RELATIONSHIP_ID =
  'be3_sb_wb_rel_u08_clil_pe_sb134-135_wb109-110'
const GRAMMAR_RELATIONSHIP_ID =
  'be3_sb_wb_rel_u08_grammar_sb136-137_wb111-112'
const CULTURE_RELATIONSHIP_ID =
  'be3_sb_wb_rel_u08_culture_sb138-139_wb113-114'
const WRITING_RELATIONSHIP_ID =
  'be3_sb_wb_rel_u08_writing_sb140_wb115'

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
    case CLIL_PE_RELATIONSHIP_ID:
      return renderBe3U08ClilPeNeutralPackageToChalkieShadow(lessonPackage)
    case GRAMMAR_RELATIONSHIP_ID:
      return renderBe3U08GrammarNeutralPackageToChalkieShadow(lessonPackage)
    case CULTURE_RELATIONSHIP_ID:
      return renderBe3U08CultureNeutralPackageToChalkieShadow(lessonPackage)
    case WRITING_RELATIONSHIP_ID:
      return renderBe3U08WritingNeutralPackageToChalkieShadow(lessonPackage)
    default:
      throw new UnsupportedNeutralPackageRendererError(
        lessonPackage.identity.relationshipId,
        lessonPackage.identity.packageReference,
      )
  }
}
