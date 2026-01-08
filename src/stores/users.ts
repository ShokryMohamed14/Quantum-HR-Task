import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types/user'
import { userService } from '@/services/userService'
import Swal from 'sweetalert2'

export const useUsersStore = defineStore('users', () => {
  // State
  const users = ref<User[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const searchQuery = ref('')
  const currentPage = ref(1)
  const pageSize = ref(10)
  const selectedUser = ref<User | null>(null)
  const showModal = ref(false)

  // Getters
  const filteredUsers = computed(() => {
    if (!searchQuery.value.trim()) {
      return users.value
    }

    const query = searchQuery.value.toLowerCase().trim()
    return users.value.filter((user: User) => {
      const fullName = `${user.name.first} ${user.name.last}`.toLowerCase()
      return fullName.includes(query)
    })
  })

  const paginatedUsers = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    return filteredUsers.value.slice(start, end)
  })

  const totalPages = computed(() => {
    return Math.ceil(filteredUsers.value.length / pageSize.value)
  })

  const totalUsers = computed(() => filteredUsers.value.length)

  // Actions
  async function fetchUsers(): Promise<void> {
    loading.value = true
    error.value = null

    try {
      users.value = await userService.fetchUsers(50)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch users'
      error.value = message

      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: message
      })
    } finally {
      loading.value = false
    }
  }

  async function refreshUsers(): Promise<void> {
    currentPage.value = 1
    searchQuery.value = ''
    await fetchUsers()

    await Swal.fire({
      icon: 'success',
      title: 'Refreshed',
      text: 'User list has been refreshed',
      timer: 1500,
      showConfirmButton: false
    })
  }

  function setSearchQuery(query: string): void {
    searchQuery.value = query
    currentPage.value = 1 // Reset to first page when searching
  }

  function setPage(page: number): void {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  function nextPage(): void {
    if (currentPage.value < totalPages.value) {
      currentPage.value++
    }
  }

  function prevPage(): void {
    if (currentPage.value > 1) {
      currentPage.value--
    }
  }

  function openUserModal(user: User): void {
    selectedUser.value = user
    showModal.value = true
  }

  function closeUserModal(): void {
    showModal.value = false
    selectedUser.value = null
  }

  return {
    // State
    users,
    loading,
    error,
    searchQuery,
    currentPage,
    pageSize,
    selectedUser,
    showModal,
    // Getters
    filteredUsers,
    paginatedUsers,
    totalPages,
    totalUsers,
    // Actions
    fetchUsers,
    refreshUsers,
    setSearchQuery,
    setPage,
    nextPage,
    prevPage,
    openUserModal,
    closeUserModal
  }
})
