<template>
  <a-layout class="dashboard-layout">
    <!-- Sidebar -->
    <a-layout-sider
      v-model:collapsed="collapsed"
      :trigger="null"
      collapsible
      class="dashboard-sider"
      :width="220"
      :collapsed-width="80"
      breakpoint="lg"
      @breakpoint="onBreakpoint"
    >
      <!-- Logo -->
      <div class="logo-container" :class="{ collapsed }">
        <h2 v-if="!collapsed">
          <DashboardOutlined /> User Dashboard
        </h2>
        <h2 v-else>
          <DashboardOutlined />
        </h2>
      </div>

      <!-- Navigation Menu -->
      <a-menu
        v-model:selectedKeys="selectedKeys"
        theme="dark"
        mode="inline"
        @click="handleMenuClick"
      >
        <a-menu-item key="dashboard">
          <TeamOutlined />
          <span>Users</span>
        </a-menu-item>
        <a-menu-item key="profile">
          <UserOutlined />
          <span>My Profile</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>

    <a-layout>
      <!-- Header -->
      <a-layout-header class="dashboard-header">
        <div style="display: flex; align-items: center; gap: 16px">
          <a-button
            type="text"
            @click="collapsed = !collapsed"
          >
            <MenuUnfoldOutlined v-if="collapsed" />
            <MenuFoldOutlined v-else />
          </a-button>
          <h3 style="margin: 0; font-size: 18px">{{ pageTitle }}</h3>
        </div>

        <div style="display: flex; align-items: center; gap: 16px">
          <a-dropdown>
            <a-space style="cursor: pointer">
              <a-avatar :style="{ backgroundColor: '#1890ff' }">
                {{ userInitials }}
              </a-avatar>
              <span class="user-name">{{ authStore.user?.name || 'User' }}</span>
              <DownOutlined />
            </a-space>
            <template #overlay>
              <a-menu>
                <a-menu-item key="profile" @click="goToProfile">
                  <UserOutlined /> My Profile
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item key="logout" @click="handleLogout" :disabled="authStore.loading">
                  <LogoutOutlined /> Logout
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </a-layout-header>

      <!-- Main Content -->
      <a-layout-content class="dashboard-content">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  DashboardOutlined,
  TeamOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  DownOutlined
} from '@ant-design/icons-vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const collapsed = ref(false)
const selectedKeys = ref<string[]>(['dashboard'])

// Compute page title based on route
const pageTitle = computed(() => {
  switch (route.name) {
    case 'Dashboard':
      return 'User Management'
    case 'Profile':
      return 'My Profile'
    default:
      return 'Dashboard'
  }
})

// Get user initials for avatar
const userInitials = computed(() => {
  const name = authStore.user?.name || 'User'
  return name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

// Watch route changes to update selected menu
watch(
  () => route.name,
  (name) => {
    if (name === 'Dashboard') {
      selectedKeys.value = ['dashboard']
    } else if (name === 'Profile') {
      selectedKeys.value = ['profile']
    }
  },
  { immediate: true }
)

function handleMenuClick({ key }: { key: string }) {
  if (key === 'dashboard') {
    router.push('/dashboard')
  } else if (key === 'profile') {
    router.push('/profile')
  }
}

function goToProfile() {
  router.push('/profile')
}

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
}

function onBreakpoint(broken: boolean) {
  collapsed.value = broken
}
</script>

<style scoped>
.user-name {
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .user-name {
    display: none;
  }
}
</style>
