import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AuthTokens, UserProfile, LoginCredentials } from '@/types/auth'
import { authService } from '@/services/authService'
import Swal from 'sweetalert2'

export const useAuthStore = defineStore('auth', () => {
  // State
  const tokens = ref<AuthTokens | null>(authService.getStoredTokens())
  const user = ref<UserProfile | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!tokens.value)

  // Actions
  async function login(credentials: LoginCredentials): Promise<boolean> {
    loading.value = true
    error.value = null

    try {
      const authTokens = await authService.login(credentials)
      tokens.value = authTokens
      authService.storeTokens(authTokens)

      // Load user profile
      user.value = await authService.getProfile()

      await Swal.fire({
        icon: 'success',
        title: 'Welcome!',
        text: 'Login successful',
        timer: 1500,
        showConfirmButton: false
      })

      return true
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed'
      error.value = message

      await Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: message
      })

      return false
    } finally {
      loading.value = false
    }
  }

  async function logout(): Promise<void> {
    loading.value = true
    try {
      await authService.logout()
      tokens.value = null
      user.value = null

      await Swal.fire({
        icon: 'success',
        title: 'Logged Out',
        text: 'You have been logged out successfully',
        timer: 1500,
        showConfirmButton: false
      })
    } finally {
      loading.value = false
    }
  }

  async function loadProfile(): Promise<void> {
    if (!isAuthenticated.value) return

    loading.value = true
    try {
      user.value = await authService.getProfile()
    } catch (err) {
      console.error('Failed to load profile:', err)
    } finally {
      loading.value = false
    }
  }

  async function updateProfile(profile: UserProfile): Promise<boolean> {
    loading.value = true
    error.value = null

    try {
      user.value = await authService.updateProfile(profile)

      await Swal.fire({
        icon: 'success',
        title: 'Profile Updated',
        text: 'Your profile has been saved successfully',
        timer: 1500,
        showConfirmButton: false
      })

      return true
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update profile'
      error.value = message

      await Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: message
      })

      return false
    } finally {
      loading.value = false
    }
  }

  // Initialize profile if authenticated
  if (isAuthenticated.value) {
    loadProfile()
  }

  return {
    // State
    tokens,
    user,
    loading,
    error,
    // Getters
    isAuthenticated,
    // Actions
    login,
    logout,
    loadProfile,
    updateProfile
  }
})
