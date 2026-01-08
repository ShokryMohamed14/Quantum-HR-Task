import type { LoginCredentials, AuthTokens, UserProfile } from '@/types/auth'

// Simulated network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Valid credentials
const VALID_EMAIL = 'q@quantum.io'
const VALID_PASSWORD = 'qTask123#'

// Default user profile
const defaultProfile: UserProfile = {
  name: 'Quantum User',
  email: VALID_EMAIL,
  phone: '+1 (555) 123-4567',
  jobTitle: 'Software Engineer',
  yearsOfExperience: 5,
  address: '123 Tech Street, San Francisco, CA 94102',
  workingHours: '9:00 AM - 5:00 PM'
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthTokens> {
    // Simulate API call delay
    await delay(1500)

    if (credentials.email === VALID_EMAIL && credentials.password === VALID_PASSWORD) {
      const tokens: AuthTokens = {
        access: 'fake-token',
        refresh: 'fake-refresh'
      }
      return tokens
    }

    throw new Error('Invalid email or password')
  },

  async logout(): Promise<void> {
    await delay(500)
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user_profile')
  },

  async getProfile(): Promise<UserProfile> {
    await delay(300)
    const stored = localStorage.getItem('user_profile')
    if (stored) {
      return JSON.parse(stored)
    }
    return defaultProfile
  },

  async updateProfile(profile: UserProfile): Promise<UserProfile> {
    await delay(1000)
    localStorage.setItem('user_profile', JSON.stringify(profile))
    return profile
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token')
  },

  getStoredTokens(): AuthTokens | null {
    const access = localStorage.getItem('access_token')
    const refresh = localStorage.getItem('refresh_token')
    if (access && refresh) {
      return { access, refresh }
    }
    return null
  },

  storeTokens(tokens: AuthTokens): void {
    localStorage.setItem('access_token', tokens.access)
    localStorage.setItem('refresh_token', tokens.refresh)
  }
}
