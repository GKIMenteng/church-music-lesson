<script setup>
import { useAuthStore } from '@/stores/auth'
import AppNavbar from '@/components/AppNavbar.vue'
const auth = useAuthStore()
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <AppNavbar v-if="auth.user" />
    <p
      v-if="auth.user && auth.initializationError"
      role="alert"
      class="bg-amber-50 px-4 py-3 text-center text-sm text-amber-800"
    >
      {{ auth.initializationError }}
    </p>
    <p
      v-if="auth.user && auth.profileError"
      role="alert"
      class="bg-amber-50 px-4 py-3 text-center text-sm text-amber-800"
    >
      {{ auth.profileError }}
    </p>
    <RouterView v-slot="{ Component, route }">
      <Transition name="page-transition" mode="out-in">
        <component :is="Component" :key="route.path" />
      </Transition>
    </RouterView>
  </div>
</template>