export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthTokens {
  access: string
  refresh: string
}

export interface AuthState {
  isAuthenticated: boolean
  tokens: AuthTokens | null
  user: UserProfile | null
  loading: boolean
  error: string | null
}

export interface UserProfile {
  name: string
  email: string
  phone: string
  jobTitle: string
  yearsOfExperience: number
  address: string
  workingHours: string
}
