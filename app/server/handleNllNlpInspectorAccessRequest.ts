/**
 * Trusted admin gate for NLL/NLP Inspector product access.
 * Does not return curriculum report content — only authorization outcome.
 * Report assembly remains client-side (same posture as Chalkie/GLP pilots),
 * but teachers/unauthenticated callers cannot obtain a successful access token.
 */
import { authorizeAdminBearerUser } from './authorizeAdminBearerUser.ts'

export type NllNlpInspectorAccessHttpRequest = {
  authorizationHeader: string | undefined
}

export type NllNlpInspectorAccessHttpResponse = {
  status: number
  body: Record<string, unknown>
}

export async function handleNllNlpInspectorAccessRequest(
  input: NllNlpInspectorAccessHttpRequest,
): Promise<NllNlpInspectorAccessHttpResponse> {
  const auth = await authorizeAdminBearerUser(input.authorizationHeader)
  if (!auth.ok) {
    return {
      status: auth.status,
      body: {
        error: auth.error,
        message: auth.message,
        allowed: false,
      },
    }
  }

  return {
    status: 200,
    body: {
      allowed: true,
      inspectorId: 'nll_nlp_inspector',
      role: auth.role,
      userId: auth.userId,
    },
  }
}
