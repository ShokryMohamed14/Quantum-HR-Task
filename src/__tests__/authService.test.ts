import { describe, it, expect, beforeEach } from 'vitest'
import { authService } from '@/services/authService'

describe('authService', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('login', () => {
    it('should return tokens for valid credentials', async () => {
      const result = await authService.login({ email: 'q@quantum.io', password: 'qTask123#' })

      expect(result).toEqual({
        access: 'fake-token',
        refresh: 'fake-refresh'
      })
    })

    it('should throw error for invalid email', async () => {
      await expect(authService.login({ email: 'wrong@email.com', password: 'qTask123#' }))
        .rejects.toThrow('Invalid email or password')
    })

    it('should throw error for invalid password', async () => {
      await expect(authService.login({ email: 'q@quantum.io', password: 'wrongpassword' }))
        .rejects.toThrow('Invalid email or password')
    })
  })

  describe('logout', () => {
    it('should remove tokens from localStorage', async () => {
      localStorage.setItem('access_token', 'test-token')
      localStorage.setItem('refresh_token', 'test-refresh')

      await authService.logout()

      expect(localStorage.getItem('access_token')).toBeNull()
      expect(localStorage.getItem('refresh_token')).toBeNull()
    })
  })

  describe('isAuthenticated', () => {
    it('should return true when access token exists', () => {
      localStorage.setItem('access_token', 'test-token')
      expect(authService.isAuthenticated()).toBe(true)
    })

    it('should return false when access token does not exist', () => {
      expect(authService.isAuthenticated()).toBe(false)
    })
  })

  describe('getStoredTokens', () => {
    it('should return tokens when both exist', () => {
      localStorage.setItem('access_token', 'my-token')
      localStorage.setItem('refresh_token', 'my-refresh')
      expect(authService.getStoredTokens()).toEqual({
        access: 'my-token',
        refresh: 'my-refresh'
      })
    })

    it('should return null when tokens do not exist', () => {
      expect(authService.getStoredTokens()).toBeNull()
    })
  })

  describe('storeTokens', () => {
    it('should store tokens in localStorage', () => {
      authService.storeTokens({ access: 'new-token', refresh: 'new-refresh' })
      expect(localStorage.getItem('access_token')).toBe('new-token')
      expect(localStorage.getItem('refresh_token')).toBe('new-refresh')
    })
  })
})
