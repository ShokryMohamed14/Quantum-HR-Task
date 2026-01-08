<template>
  <a-config-provider
    :theme="{
      token: {
        colorPrimary: '#1890ff',
        borderRadius: 6
      }
    }"
  >
    <router-view />
  </a-config-provider>
</template>

<script setup lang="ts">
// Root component - just provides theme config and router outlet
</script>

<style>
#app {
  min-height: 100vh;
}
</style>
