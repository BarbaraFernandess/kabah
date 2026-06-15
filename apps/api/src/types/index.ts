/**
 * JWT payload stored in token
 */
export interface JwtPayload {
  sub: string // user id
  email: string
  role: string
  iat?: number
  exp?: number
}

/**
 * Authenticated request user attached by auth middleware
 */
export interface AuthUser {
  id: string
  email: string
  role: string
}

/**
 * Standard API response envelope
 */
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

/**
 * Pagination params
 */
export interface PaginationParams {
  page: number
  limit: number
  offset: number
}
