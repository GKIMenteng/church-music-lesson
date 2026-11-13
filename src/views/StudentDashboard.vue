<script setup>
import { useAuthStore } from '@/stores/auth'
import { useMoodleStore } from '@/stores/moodle'

const auth = useAuthStore()
const store = useMoodleStore()
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <section class="dashboard-hero rounded-3xl border border-indigo-100/80 p-6 sm:p-8 mb-8">
      <p class="text-sm font-semibold uppercase tracking-wider text-indigo-600 mb-2">Your learning space</p>
      <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-2">Welcome back, {{ auth.displayName }}!</h1>
      <p class="text-slate-600">Pick up where you left off and keep building your knowledge.</p>
    </section>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <p class="text-sm text-slate-500 mb-1">Available Lessons</p>
        <p class="text-3xl font-bold text-indigo-600">{{ store.lessons.length }}</p>
      </div>
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <p class="text-sm text-slate-500 mb-1">Tests to Take</p>
        <p class="text-3xl font-bold text-emerald-600">{{ store.tests.length }}</p>
      </div>
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <p class="text-sm text-slate-500 mb-1">Completed Tests</p>
        <p class="text-3xl font-bold text-amber-600">{{ store.studentResults.length }}</p>
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <RouterLink to="/student/lessons" class="group block bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div class="flex items-center justify-between mb-2">
          <h2 class="text-lg font-semibold text-slate-800">📖 Learn Lessons</h2>
          <span aria-hidden="true" class="text-indigo-500 transition-transform group-hover:translate-x-1">→</span>
        </div>
        <p class="text-sm text-slate-500">Read through course materials at your own pace.</p>
      </RouterLink>
      <RouterLink to="/student/tests" class="group block bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div class="flex items-center justify-between mb-2">
          <h2 class="text-lg font-semibold text-slate-800">✅ Take Tests</h2>
          <span aria-hidden="true" class="text-indigo-500 transition-transform group-hover:translate-x-1">→</span>
        </div>
        <p class="text-sm text-slate-500">Test your knowledge and see your scores.</p>
      </RouterLink>
    </div>
    <div v-if="store.studentResults.length" class="mt-8">
      <h2 class="text-lg font-semibold text-slate-800 mb-4">Recent Results</h2>
      <div class="space-y-2">
        <div v-for="r in store.studentResults.slice(-3).reverse()" :key="r.id" class="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex justify-between items-center">
          <div>
            <p class="font-medium text-slate-800">{{ r.testTitle }}</p>
            <p class="text-xs text-slate-400">{{ r.date }}</p>
          </div>
          <span :class="['px-3 py-1 rounded-lg text-sm font-bold', r.score / r.total >= 0.7 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700']">{{ r.score }}/{{ r.total }}</span>
        </div>
      </div>
    </div>
  </div>
</template>