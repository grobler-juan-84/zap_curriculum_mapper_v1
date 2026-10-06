import { useMemo } from 'react'
import { curriculumService } from '../../../services/curriculumService'
import type { CurriculumSeries } from '../../../types/curriculum'

export function useCurriculumCatalog(): CurriculumSeries[] {
  return useMemo(() => curriculumService.listSeries(), [])
}
