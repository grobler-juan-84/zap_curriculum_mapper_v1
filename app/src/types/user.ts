export type UserRole = 'teacher' | 'admin'

export interface UserProfile {
  id: string
  first_name: string | null
  last_name: string | null
  role: UserRole
  created_at: string
  updated_at: string
}
