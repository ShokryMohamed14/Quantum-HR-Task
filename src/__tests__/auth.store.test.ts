import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'

// Mock the authService with all methods
vi.mock('@/services/authService', () => ({
  authService: {
    login: vi.fn(),
    logout: vi.fn(),
    isAuthenticated: vi.fn(),
    getProfile: vi.fn(),
    updateProfile: vi.fn(),
    getStoredTokens: vi.fn(),
    storeTokens: vi.fn()
  }
}))

// Mock vue-router
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn()
  })
}))

// Mock sweetalert2
vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn().mockResolvedValue({})
  }
}))

import { authService } from '@/services/authService'

describe('useAuthStore', () => {
  beforeEach(() => {
    vi.mocked(authService.getStoredTokens).mockReturnValue(null)
    setActivePinia(createPinia())
    vi.clearAllMocks()
    localStorage.clear()
  })

  describe('initial state', () => {
    it('should have loading as false', () => {
      const store = useAuthStore()
      expect(store.loading).toBe(false)
    })

    it('should have error as null', () => {
      const store = useAuthStore()
      expect(store.error).toBeNull()
    })
  })

  describe('login', () => {
    it('should set isAuthenticated to true on successful login', async () => {
      vi.mocked(authService.login).mockResolvedValue({ access: 'token', refresh: 'refresh' })

      const store = useAuthStore()
      await store.login({ email: 'q@quantum.io', password: 'qTask123#' })

      expect(store.isAuthenticated).toBe(true)
      expect(store.error).toBeNull()
    })

    it('should set error on failed login', async () => {
      vi.mocked(authService.login).mockRejectedValue(new Error('Invalid credentials'))

      const store = useAuthStore()
      await store.login({ email: 'wrong@email.com', password: 'wrongpassword' })

      expect(store.error).toBe('Invalid credentials')
      expect(store.isAuthenticated).toBe(false)
    })
  })

  describe('logout', () => {
    it('should call authService.logout and reset state', async () => {
      vi.mocked(authService.login).mockResolvedValue({ access: 'token', refresh: 'refresh' })
      vi.mocked(authService.logout).mockResolvedValue(undefined)

      const store = useAuthStore()
      await store.login({ email: 'q@quantum.io', password: 'qTask123#' })
      await store.logout()

      expect(authService.logout).toHaveBeenCalled()
      expect(store.isAuthenticated).toBe(false)
    })
  })

  describe('profile', () => {
    it('should load user profile from authService when authenticated', async () => {
      const mockProfile = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123-456-7890',
        jobTitle: 'Developer',
        yearsOfExperience: 5,
        address: '123 Main St',
        workingHours: '9:00 - 17:00'
      }
      vi.mocked(authService.login).mockResolvedValue({ access: 'token', refresh: 'refresh' })
      vi.mocked(authService.getProfile).mockResolvedValue(mockProfile)

      const store = useAuthStore()
      // First login to be authenticated
      await store.login({ email: 'q@quantum.io', password: 'qTask123#' })
      // Then load profile
      await store.loadProfile()

      expect(store.user).toEqual(mockProfile)
    })

    it('should update profile via authService', async () => {
      const newProfile = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        phone: '098-765-4321',
        jobTitle: 'Designer',
        yearsOfExperience: 3,
        address: '456 Oak Ave',
        workingHours: '10:00 - 18:00'
      }
      vi.mocked(authService.updateProfile).mockResolvedValue(newProfile)

      const store = useAuthStore()
      await store.updateProfile(newProfile)

      expect(authService.updateProfile).toHaveBeenCalledWith(newProfile)
    })
  })
})
