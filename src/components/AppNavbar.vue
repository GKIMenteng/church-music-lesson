<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const signOutError = ref('')

async function logout() {
  signOutError.value = ''

  try {
    await auth.signOut()
    await router.replace({ name: 'login' })
  } catch (error) {
    signOutError.value = error instanceof Error ? error.message : 'Unable to sign out. Please try again.'
  }
}
</script>

<template>
  <nav aria-label="Main navigation" class="bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-sm sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
      <div class="flex justify-between gap-1 sm:gap-2 h-16 items-center">
        <div class="flex items-center gap-1.5 sm:gap-3">
          <div class="w-9 h-9 shrink-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-500/20">G</div>
          <span class="font-bold text-base sm:text-xl text-slate-800 tracking-tight whitespace-nowrap">GKI Menteng</span>
          <span class="hidden sm:inline-block ml-1 px-2 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-full">Moodle</span>
        </div>
        <div class="flex items-center gap-2 sm:gap-4">
          <div class="hidden sm:flex items-center gap-2">
            <span class="px-2.5 py-1 text-xs font-semibold rounded-full bg-indigo-50 text-indigo-700">
              {{ auth.role === 'teacher' ? 'Teacher' : 'Student' }}
            </span>
            <div aria-hidden="true" class="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold">
              {{ auth.displayName.charAt(0).toUpperCase() }}
            </div>
            <span class="hidden md:block max-w-48 truncate text-sm font-medium text-slate-700">{{ auth.displayName }}</span>
          </div>
          <button
            type="button"
            title="Sign out"
            aria-label="Sign out"
            @click="logout"
            class="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-2.5 sm:px-3 py-2 text-sm font-medium text-slate-600 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="h-4 w-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 8.25V5.625A1.875 1.875 0 0 0 13.875 3.75h-7.5A1.875 1.875 0 0 0 4.5 5.625v12.75a1.875 1.875 0 0 0 1.875 1.875h7.5a1.875 1.875 0 0 0 1.875-1.875V15.75M9.75 12h10.5m0 0-3.75-3.75M20.25 12l-3.75 3.75" />
            </svg>
            <span class="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </div>
    </div>
    <p v-if="signOutError" role="alert" class="bg-red-50 px-4 py-2 text-center text-sm text-red-700">
      {{ signOutError }}
    </p>
  </nav>
</template>