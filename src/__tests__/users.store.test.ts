import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUsersStore } from '@/stores/users'
import type { User } from '@/types/user'

// Mock the userService
vi.mock('@/services/userService', () => ({
  userService: {
    fetchUsers: vi.fn()
  }
}))

// Mock sweetalert2
vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn().mockResolvedValue({})
  }
}))

const mockUsers: User[] = [
  {
    name: { title: 'Mr', first: 'John', last: 'Doe' },
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    location: {
      street: { number: 123, name: 'Main St' },
      city: 'New York',
      state: 'NY',
      country: 'USA',
      postcode: '10001'
    },
    picture: { large: 'https://example.com/photo.jpg', medium: '', thumbnail: '' },
    login: { uuid: '1' }
  },
  {
    name: { title: 'Ms', first: 'Jane', last: 'Smith' },
    email: 'jane.smith@example.com',
    phone: '098-765-4321',
    location: {
      street: { number: 456, name: 'Oak Ave' },
      city: 'Los Angeles',
      state: 'CA',
      country: 'USA',
      postcode: '90001'
    },
    picture: { large: 'https://example.com/photo2.jpg', medium: '', thumbnail: '' },
    login: { uuid: '2' }
  },
  {
    name: { title: 'Dr', first: 'Alice', last: 'Wonder' },
    email: 'alice.wonder@example.com',
    phone: '555-555-5555',
    location: {
      street: { number: 789, name: 'Pine Rd' },
      city: 'Chicago',
      state: 'IL',
      country: 'USA',
      postcode: '60601'
    },
    picture: { large: 'https://example.com/photo3.jpg', medium: '', thumbnail: '' },
    login: { uuid: '3' }
  }
]

describe('useUsersStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('initial state', () => {
    it('should have empty users array', () => {
      const store = useUsersStore()
      expect(store.users).toEqual([])
    })

    it('should have page 1 as default', () => {
      const store = useUsersStore()
      expect(store.currentPage).toBe(1)
    })

    it('should have empty search query', () => {
      const store = useUsersStore()
      expect(store.searchQuery).toBe('')
    })

    it('should have pageSize of 10', () => {
      const store = useUsersStore()
      expect(store.pageSize).toBe(10)
    })
  })

  describe('filteredUsers', () => {
    it('should filter users by first name (case-insensitive)', () => {
      const store = useUsersStore()
      store.users = mockUsers
      store.searchQuery = 'john'

      expect(store.filteredUsers).toHaveLength(1)
      expect(store.filteredUsers[0].name.first).toBe('John')
    })

    it('should filter users by last name (case-insensitive)', () => {
      const store = useUsersStore()
      store.users = mockUsers
      store.searchQuery = 'SMITH'

      expect(store.filteredUsers).toHaveLength(1)
      expect(store.filteredUsers[0].name.last).toBe('Smith')
    })

    it('should return all users when search query is empty', () => {
      const store = useUsersStore()
      store.users = mockUsers
      store.searchQuery = ''

      expect(store.filteredUsers).toHaveLength(3)
    })
  })

  describe('paginatedUsers', () => {
    it('should return correct page of users', () => {
      const store = useUsersStore()
      // Create 15 mock users
      store.users = Array.from({ length: 15 }, (_, i) => ({
        ...mockUsers[0],
        login: { uuid: String(i) },
        name: { title: 'Mr', first: `User${i}`, last: 'Test' }
      }))
      store.currentPage = 1

      expect(store.paginatedUsers).toHaveLength(10)
      expect(store.paginatedUsers[0].name.first).toBe('User0')
    })

    it('should return remaining users on last page', () => {
      const store = useUsersStore()
      store.users = Array.from({ length: 15 }, (_, i) => ({
        ...mockUsers[0],
        login: { uuid: String(i) },
        name: { title: 'Mr', first: `User${i}`, last: 'Test' }
      }))
      store.currentPage = 2

      expect(store.paginatedUsers).toHaveLength(5)
      expect(store.paginatedUsers[0].name.first).toBe('User10')
    })
  })

  describe('setSearchQuery', () => {
    it('should update search query and reset to page 1', () => {
      const store = useUsersStore()
      store.users = Array.from({ length: 50 }, (_, i) => ({
        ...mockUsers[0],
        login: { uuid: String(i) },
        name: { title: 'Mr', first: `User${i}`, last: 'Test' }
      }))
      store.currentPage = 5
      store.setSearchQuery('test')

      expect(store.searchQuery).toBe('test')
      expect(store.currentPage).toBe(1)
    })
  })

  describe('setPage', () => {
    it('should update current page when valid', () => {
      const store = useUsersStore()
      // Need enough users to have multiple pages
      store.users = Array.from({ length: 50 }, (_, i) => ({
        ...mockUsers[0],
        login: { uuid: String(i) },
        name: { title: 'Mr', first: `User${i}`, last: 'Test' }
      }))
      store.setPage(3)

      expect(store.currentPage).toBe(3)
    })
  })

  describe('openUserModal', () => {
    it('should set selected user and show modal', () => {
      const store = useUsersStore()
      store.openUserModal(mockUsers[0])

      expect(store.selectedUser).toEqual(mockUsers[0])
      expect(store.showModal).toBe(true)
    })
  })

  describe('closeUserModal', () => {
    it('should clear selected user and hide modal', () => {
      const store = useUsersStore()
      store.selectedUser = mockUsers[0]
      store.showModal = true
      store.closeUserModal()

      expect(store.selectedUser).toBeNull()
      expect(store.showModal).toBe(false)
    })
  })
})
