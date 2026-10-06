import {
  generateQuickActionResponse,
  generateTeacherChatResponse,
  type AIResponseData,
} from '../mocks/ai/aiResponses'
import type { PageSpread, QuickActionType } from '../types/curriculum'

export type { AIResponseData }

/** Mock AI assistant responses. Replace later with a real model/API. */
export const aiAssistantService = {
  runQuickAction(action: QuickActionType, spread: PageSpread): AIResponseData {
    return generateQuickActionResponse(action, spread)
  },

  answerTeacherQuery(query: string, spread: PageSpread): AIResponseData {
    return generateTeacherChatResponse(query, spread)
  },
}
