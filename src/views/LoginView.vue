<template>
  <div class="login-container">
    <a-card class="login-card" :bordered="false">
      <!-- Logo -->
      <div class="login-header">
        <div class="login-logo">
          <DashboardOutlined :style="{ fontSize: '48px', color: '#1890ff' }" />
        </div>
        <h1>User Dashboard</h1>
        <p>Sign in to your account</p>
      </div>

      <!-- Login Form -->
      <a-form
        :model="formState"
        :rules="rules"
        layout="vertical"
        @finish="handleLogin"
        ref="formRef"
      >
        <a-form-item label="Email" name="email">
          <a-input
            v-model:value="formState.email"
            placeholder="Enter your email"
            size="large"
            :prefix="h(UserOutlined)"
          >
          </a-input>
        </a-form-item>

        <a-form-item label="Password" name="password">
          <a-input-password
            v-model:value="formState.password"
            placeholder="Enter your password"
            size="large"
            :prefix="h(LockOutlined)"
          />
        </a-form-item>

        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            size="large"
            block
            :loading="authStore.loading"
          >
            <LoginOutlined v-if="!authStore.loading" />
            {{ authStore.loading ? 'Signing in...' : 'Sign In' }}
          </a-button>
        </a-form-item>
      </a-form>

      <!-- Demo credentials hint -->
      <a-divider>Demo Credentials</a-divider>
      <div class="demo-credentials">
        <a-typography-text type="secondary">
          <strong>Email:</strong> q@quantum.io
        </a-typography-text>
        <br />
        <a-typography-text type="secondary">
          <strong>Password:</strong> qTask123#
        </a-typography-text>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, h } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { Rule } from 'ant-design-vue/es/form'
import {
  DashboardOutlined,
  UserOutlined,
  LockOutlined,
  LoginOutlined
} from '@ant-design/icons-vue'

const router = useRouter()
const authStore = useAuthStore()

const formState = reactive({
  email: '',
  password: ''
})

const rules: Record<string, Rule[]> = {
  email: [
    { required: true, message: 'Please enter your email' },
    { type: 'email', message: 'Please enter a valid email' }
  ],
  password: [
    { required: true, message: 'Please enter your password' },
    { min: 6, message: 'Password must be at least 6 characters' }
  ]
}

async function handleLogin() {
  const success = await authStore.login({
    email: formState.email,
    password: formState.password
  })

  if (success) {
    router.push('/dashboard')
  }
}
</script>

<style scoped>
.login-card {
  width: 100%;
  max-width: 420px;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-logo {
  margin-bottom: 16px;
}

.login-header h1 {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 600;
  color: #1a1a1a;
}

.login-header p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.demo-credentials {
  text-align: center;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 8px;
}
</style>
