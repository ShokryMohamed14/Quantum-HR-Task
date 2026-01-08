<template>
  <div>
    <!-- Stats Cards -->
    <a-row :gutter="[16, 16]" style="margin-bottom: 24px">
      <a-col :xs="24" :sm="12" :md="6">
        <a-card class="stats-card">
          <a-statistic
            title="Total Users"
            :value="usersStore.users.length"
            :prefix="h(TeamOutlined)"
          />
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="12" :md="6">
        <a-card class="stats-card">
          <a-statistic
            title="Filtered Results"
            :value="usersStore.totalUsers"
            :prefix="h(FilterOutlined)"
          />
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="12" :md="6">
        <a-card class="stats-card">
          <a-statistic
            title="Current Page"
            :value="usersStore.currentPage"
            :suffix="`/ ${usersStore.totalPages || 1}`"
            :prefix="h(FileTextOutlined)"
          />
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="12" :md="6">
        <a-card class="stats-card">
          <a-statistic
            title="Page Size"
            :value="usersStore.pageSize"
            :prefix="h(TableOutlined)"
          />
        </a-card>
      </a-col>
    </a-row>

    <!-- Search and Actions -->
    <a-row :gutter="[16, 16]" style="margin-bottom: 16px" align="middle">
      <a-col :xs="24" :sm="12" :md="8">
        <a-input-search
          v-model:value="searchInput"
          placeholder="Search users by name..."
          size="large"
          allow-clear
          @search="handleSearch"
          @change="handleSearchChange"
        />
      </a-col>
      <a-col :xs="24" :sm="12" :md="16" style="text-align: right">
        <a-space>
          <a-button
            type="primary"
            :loading="usersStore.loading"
            @click="usersStore.refreshUsers"
          >
            <ReloadOutlined />
            Refresh
          </a-button>
        </a-space>
      </a-col>
    </a-row>

    <!-- Users Table -->
    <a-table
      :dataSource="usersStore.paginatedUsers"
      :columns="columns"
      :loading="usersStore.loading"
      :pagination="false"
      row-key="login.uuid"
      class="user-table"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'name'">
          <a-space>
            <a-avatar :src="record.picture.thumbnail" />
            <span>{{ record.name.first }} {{ record.name.last }}</span>
          </a-space>
        </template>

        <template v-else-if="column.key === 'email'">
          <a-typography-text copyable>{{ record.email }}</a-typography-text>
        </template>

        <template v-else-if="column.key === 'location'">
          {{ record.location.city }}, {{ record.location.country }}
        </template>

        <template v-else-if="column.key === 'actions'">
          <a-button type="link" @click="usersStore.openUserModal(record)">
            <EyeOutlined /> View Details
          </a-button>
        </template>
      </template>
    </a-table>

    <!-- Pagination -->
    <div style="margin-top: 16px; text-align: right">
      <a-pagination
        v-model:current="currentPage"
        :total="usersStore.totalUsers"
        :pageSize="usersStore.pageSize"
        :show-size-changer="false"
        show-quick-jumper
        :show-total="(total: number, range: [number, number]) => `${range[0]}-${range[1]} of ${total} users`"
        @change="handlePageChange"
      />
    </div>

    <!-- User Details Modal -->
    <UserDetailsModal />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, h } from 'vue'
import { useUsersStore } from '@/stores/users'
import UserDetailsModal from '@/components/UserDetailsModal.vue'
import {
  TeamOutlined,
  FilterOutlined,
  FileTextOutlined,
  TableOutlined,
  ReloadOutlined,
  EyeOutlined
} from '@ant-design/icons-vue'

const usersStore = useUsersStore()

const searchInput = ref('')
const currentPage = ref(1)

const columns = [
  {
    title: 'Name',
    key: 'name',
    width: '30%'
  },
  {
    title: 'Email',
    key: 'email',
    width: '30%'
  },
  {
    title: 'Location',
    key: 'location',
    width: '25%'
  },
  {
    title: 'Actions',
    key: 'actions',
    width: '15%',
    align: 'center' as const
  }
]

// Debounce search
let searchTimeout: ReturnType<typeof setTimeout>
function handleSearchChange() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    usersStore.setSearchQuery(searchInput.value)
  }, 300)
}

function handleSearch(value: string) {
  usersStore.setSearchQuery(value)
}

function handlePageChange(page: number) {
  usersStore.setPage(page)
}

// Sync current page with store
watch(
  () => usersStore.currentPage,
  (page) => {
    currentPage.value = page
  }
)

// Fetch users on mount
onMounted(() => {
  if (usersStore.users.length === 0) {
    usersStore.fetchUsers()
  }
})
</script>

<style scoped>
.user-table {
  background: #fff;
  border-radius: 8px;
}
</style>
