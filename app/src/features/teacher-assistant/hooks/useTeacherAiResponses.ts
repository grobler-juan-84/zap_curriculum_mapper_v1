import { useCallback } from 'react'
import {
  aiAssistantService,
  type AIResponseData,
} from '../../../services/aiAssistantService'
import type { PageSpread, QuickActionType } from '../../../types/curriculum'

export function useTeacherAiResponses() {
  const runQuickAction = useCallback(
    (action: QuickActionType, spread: PageSpread): AIResponseData =>
      aiAssistantService.runQuickAction(action, spread),
    [],
  )

  const answerQuery = useCallback(
    (query: string, spread: PageSpread): AIResponseData =>
      aiAssistantService.answerTeacherQuery(query, spread),
    [],
  )

  return { runQuickAction, answerQuery }
}
