<template>
  <div>
    <a-card title="Edit Profile" :bordered="false">
      <template #extra>
        <a-tag color="blue">
          <UserOutlined /> {{ authStore.user?.email || 'User' }}
        </a-tag>
      </template>

      <a-form
        :model="formState"
        :rules="rules"
        layout="vertical"
        class="profile-form"
        @finish="handleSave"
      >
        <a-row :gutter="24">
          <a-col :xs="24" :md="12">
            <a-form-item label="Full Name" name="name">
              <a-input
                v-model:value="formState.name"
                placeholder="Enter your full name"
                size="large"
              />
            </a-form-item>
          </a-col>

          <a-col :xs="24" :md="12">
            <a-form-item label="Phone Number" name="phone">
              <a-input
                v-model:value="formState.phone"
                placeholder="Enter your phone number"
                size="large"
              />
            </a-form-item>
          </a-col>

          <a-col :xs="24" :md="12">
            <a-form-item label="Job Title" name="jobTitle">
              <a-input
                v-model:value="formState.jobTitle"
                placeholder="Enter your job title"
                size="large"
              />
            </a-form-item>
          </a-col>

          <a-col :xs="24" :md="12">
            <a-form-item label="Years of Experience" name="yearsOfExperience">
              <a-input-number
                v-model:value="formState.yearsOfExperience"
                :min="0"
                :max="50"
                placeholder="Years"
                size="large"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>

          <a-col :xs="24">
            <a-form-item label="Address" name="address">
              <a-textarea
                v-model:value="formState.address"
                placeholder="Enter your full address"
                :rows="3"
              />
            </a-form-item>
          </a-col>

          <a-col :xs="24" :md="12">
            <a-form-item label="Working Hours" name="workingHours">
              <a-input
                v-model:value="formState.workingHours"
                placeholder="e.g., 9:00 AM - 5:00 PM"
                size="large"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-divider />

        <a-form-item>
          <a-space>
            <a-button
              type="primary"
              html-type="submit"
              size="large"
              :loading="authStore.loading"
            >
              <SaveOutlined v-if="!authStore.loading" />
              {{ authStore.loading ? 'Saving...' : 'Save Changes' }}
            </a-button>
            <a-button size="large" @click="resetForm">
              <UndoOutlined />
              Reset
            </a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import type { Rule } from 'ant-design-vue/es/form'
import type { UserProfile } from '@/types/auth'
import {
  UserOutlined,
  SaveOutlined,
  UndoOutlined
} from '@ant-design/icons-vue'

const authStore = useAuthStore()

const formState = reactive<UserProfile>({
  name: '',
  email: '',
  phone: '',
  jobTitle: '',
  yearsOfExperience: 0,
  address: '',
  workingHours: ''
})

const rules: Record<string, Rule[]> = {
  name: [
    { required: true, message: 'Please enter your name' },
    { min: 2, message: 'Name must be at least 2 characters' }
  ],
  phone: [
    { required: true, message: 'Please enter your phone number' }
  ],
  jobTitle: [
    { required: true, message: 'Please enter your job title' }
  ],
  yearsOfExperience: [
    { required: true, message: 'Please enter years of experience', type: 'number' }
  ],
  address: [
    { required: true, message: 'Please enter your address' }
  ],
  workingHours: [
    { required: true, message: 'Please enter your working hours' }
  ]
}

function loadProfileData() {
  if (authStore.user) {
    Object.assign(formState, authStore.user)
  }
}

function resetForm() {
  loadProfileData()
}

async function handleSave() {
  await authStore.updateProfile({ ...formState })
}

// Load profile data when component mounts or user data changes
watch(
  () => authStore.user,
  () => {
    loadProfileData()
  },
  { immediate: true }
)

onMounted(() => {
  if (!authStore.user) {
    authStore.loadProfile()
  }
})
</script>

<style scoped>
.profile-form {
  max-width: 800px;
}
</style>
