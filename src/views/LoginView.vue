<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const mode = ref('login')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const working = ref('')
const errorMessage = ref('')

function getErrorMessage(error) {
  const messages = {
    'auth/account-exists-with-different-credential':
      'An account already exists with this email. Sign in using its original method.',
    'auth/cancelled-popup-request': 'A sign-in window is already open. Finish that attempt and try again.',
    'auth/email-already-in-use': 'An account with this email already exists. Try signing in instead.',
    'auth/invalid-email': 'Enter a valid email address.',
    'auth/invalid-credential': 'That email and password combination was not recognized.',
    'auth/network-request-failed': 'Connection failed. Check your internet connection and try again.',
    'auth/operation-not-allowed': 'This sign-in method is not enabled in the Firebase project.',
    'auth/popup-blocked': 'Your browser blocked the Google sign-in window. Allow pop-ups and try again.',
    'auth/popup-closed-by-user': 'The Google sign-in window was closed before finishing.',
    'auth/too-many-requests': 'Too many attempts. Wait a little while before trying again.',
    'auth/weak-password': 'Choose a password with at least 6 characters.',
  }

  if (error?.code && messages[error.code]) return messages[error.code]
  return error instanceof Error ? error.message : 'Authentication failed. Please try again.'
}

async function goToDashboard() {
  await router.replace(auth.role === 'teacher' ? '/teacher' : '/student')
}

async function submitEmailAuth() {
  errorMessage.value = ''

  if (mode.value === 'register' && password.value !== confirmPassword.value) {
    errorMessage.value = 'Your passwords do not match.'
    return
  }

  working.value = 'email'
  try {
    if (mode.value === 'register') {
      await auth.registerWithEmail(email.value.trim(), password.value)
    } else {
      await auth.signInWithEmail(email.value.trim(), password.value)
    }
    await goToDashboard()
  } catch (error) {
    errorMessage.value = getErrorMessage(error)
  } finally {
    working.value = ''
  }
}

async function continueWithGoogle() {
  errorMessage.value = ''
  working.value = 'google'

  try {
    await auth.signInWithGoogle()
    await goToDashboard()
  } catch (error) {
    errorMessage.value = getErrorMessage(error)
  } finally {
    working.value = ''
  }
}

function setMode(nextMode) {
  mode.value = nextMode
  errorMessage.value = ''
  confirmPassword.value = ''
}
</script>

<template>
  <main class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-4 sm:p-6">
    <div class="w-full max-w-md login-panel">
      <header class="text-center mb-8">
        <div class="inline-flex w-14 h-14 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl items-center justify-center text-white text-2xl font-bold shadow-2xl shadow-indigo-500/30 mb-4">
          G
        </div>
        <h1 class="text-3xl font-bold tracking-tight text-white mb-2">GKI Menteng</h1>
        <p class="text-slate-400">Your learning community, all in one place.</p>
      </header>

      <section class="bg-white rounded-3xl p-6 sm:p-8 border border-white/60 shadow-2xl shadow-black/20">
        <div class="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1 mb-6" aria-label="Account access">
          <button
            type="button"
            :aria-pressed="mode === 'login'"
            :disabled="Boolean(working)"
            @click="setMode('login')"
            :class="[
              'rounded-lg px-3 py-2.5 text-sm font-semibold',
              mode === 'login' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-800',
            ]"
          >
            Sign in
          </button>
          <button
            type="button"
            :aria-pressed="mode === 'register'"
            :disabled="Boolean(working)"
            @click="setMode('register')"
            :class="[
              'rounded-lg px-3 py-2.5 text-sm font-semibold',
              mode === 'register' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-800',
            ]"
          >
            Create account
          </button>
        </div>

        <h2 class="text-xl font-bold text-slate-900 mb-1">
          {{ mode === 'register' ? 'Create your account' : 'Welcome back' }}
        </h2>
        <p class="text-sm text-slate-500 mb-6">
          {{ mode === 'register' ? 'Sign up with your email or Google account.' : 'Sign in to continue to your courses.' }}
        </p>

        <p v-if="!auth.isConfigured" role="alert" class="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 mb-5">
          {{ auth.initializationError || 'Firebase is not configured. Add your Firebase web app settings to .env.local.' }}
        </p>
        <p v-if="errorMessage" role="alert" class="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 mb-5">
          {{ errorMessage }}
        </p>

        <form class="space-y-4" @submit.prevent="submitEmailAuth">
          <div>
            <label for="email" class="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
            <input
              id="email"
              v-model="email"
              type="email"
              autocomplete="email"
              required
              placeholder="you@example.com"
              class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              :autocomplete="mode === 'register' ? 'new-password' : 'current-password'"
              minlength="6"
              required
              placeholder="At least 6 characters"
              class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          <div v-if="mode === 'register'">
            <label for="confirm-password" class="block text-sm font-medium text-slate-700 mb-1.5">Confirm password</label>
            <input
              id="confirm-password"
              v-model="confirmPassword"
              type="password"
              autocomplete="new-password"
              minlength="6"
              required
              placeholder="Enter your password again"
              class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          <button
            type="submit"
            :disabled="!auth.isConfigured || Boolean(working)"
            class="w-full rounded-xl bg-indigo-600 px-4 py-3.5 font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 hover:shadow-indigo-600/30 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {{ working === 'email' ? 'Please wait…' : mode === 'register' ? 'Create account' : 'Sign in with email' }}
          </button>
        </form>

        <div class="relative my-5">
          <div aria-hidden="true" class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-slate-200"></div>
          </div>
          <div class="relative flex justify-center">
            <span class="bg-white px-3 text-xs font-medium uppercase tracking-wide text-slate-400">or continue with</span>
          </div>
        </div>

        <button
          type="button"
          :disabled="!auth.isConfigured || Boolean(working)"
          @click="continueWithGoogle"
          class="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <svg aria-hidden="true" viewBox="0 0 48 48" class="h-5 w-5">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z" transform="translate(0 4)" />
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.77 7.18l7.73 6C44.41 37.86 46.98 31.7 46.98 24.55Z" transform="translate(0 4)" />
            <path fill="#FBBC05" d="M10.53 28.59a14.4 14.4 0 0 1 0-9.18l-7.98-6.19a23.9 23.9 0 0 0 0 21.56l7.98-6.19Z" transform="translate(0 4)" />
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.9-5.8l-7.73-6c-2.15 1.45-4.92 2.3-8.17 2.3-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z" transform="translate(0 -4)" />
          </svg>
          {{ working === 'google' ? 'Connecting to Google…' : 'Continue with Google' }}
        </button>

        <p class="mt-6 text-center text-xs leading-relaxed text-slate-500">
          New accounts start with student access. Teacher access is assigned by an administrator.
        </p>
      </section>
    </div>
  </main>
</template>
