import type { UserRole } from '../../types/user'

/** True when the profile role is the locked admin value (`profiles.role`). */
export function isAdminProfile(
  role: UserRole | string | null | undefined,
): boolean {
  return role === 'admin'
}
