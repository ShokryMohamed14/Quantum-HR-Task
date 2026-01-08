import api from './api'
import type { User, UsersApiResponse } from '@/types/user'

export const userService = {
  async fetchUsers(count: number = 50): Promise<User[]> {
    const response = await api.get<UsersApiResponse>(`/?results=${count}`)
    return response.data.results
  },

  async fetchUserById(uuid: string, users: User[]): Promise<User | undefined> {
    // Since we're using client-side data, just find from the existing list
    return users.find(user => user.login.uuid === uuid)
  }
}
