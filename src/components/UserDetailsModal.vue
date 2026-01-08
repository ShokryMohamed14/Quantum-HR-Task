<template>
  <a-modal
    v-model:open="usersStore.showModal"
    title="User Details"
    :footer="null"
    width="520px"
    centered
    class="user-modal"
    @cancel="usersStore.closeUserModal"
  >
    <template v-if="usersStore.selectedUser">
      <div class="user-details">
        <!-- Profile Picture -->
        <div class="user-avatar">
          <a-avatar
            :src="usersStore.selectedUser.picture.large"
            :size="120"
          />
        </div>

        <!-- User Info -->
        <a-descriptions
          :column="1"
          bordered
          size="small"
          style="margin-top: 24px"
        >
          <a-descriptions-item label="Full Name">
            <strong>
              {{ usersStore.selectedUser.name.title }}
              {{ usersStore.selectedUser.name.first }}
              {{ usersStore.selectedUser.name.last }}
            </strong>
          </a-descriptions-item>

          <a-descriptions-item label="Email">
            <a-typography-text copyable>
              {{ usersStore.selectedUser.email }}
            </a-typography-text>
          </a-descriptions-item>

          <a-descriptions-item label="Phone">
            <PhoneOutlined style="margin-right: 8px" />
            {{ usersStore.selectedUser.phone }}
          </a-descriptions-item>

          <a-descriptions-item label="Cell">
            <MobileOutlined style="margin-right: 8px" />
            {{ usersStore.selectedUser.cell }}
          </a-descriptions-item>

          <a-descriptions-item label="Address">
            <EnvironmentOutlined style="margin-right: 8px" />
            {{ fullAddress }}
          </a-descriptions-item>

          <a-descriptions-item label="Nationality">
            <GlobalOutlined style="margin-right: 8px" />
            {{ usersStore.selectedUser.nat }}
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </template>

    <template v-else>
      <a-empty description="No user selected" />
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUsersStore } from '@/stores/users'
import {
  PhoneOutlined,
  MobileOutlined,
  EnvironmentOutlined,
  GlobalOutlined
} from '@ant-design/icons-vue'

const usersStore = useUsersStore()

const fullAddress = computed(() => {
  if (!usersStore.selectedUser) return ''

  const { street, city, state, country, postcode } = usersStore.selectedUser.location
  return `${street.number} ${street.name}, ${city}, ${state}, ${country} ${postcode}`
})
</script>

<style scoped>
.user-details {
  padding: 16px 0;
}

.user-avatar {
  display: flex;
  justify-content: center;
}
</style>
