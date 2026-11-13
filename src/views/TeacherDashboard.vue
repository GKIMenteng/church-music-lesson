<script setup>
import { useAuthStore } from '@/stores/auth'
import { useMoodleStore } from '@/stores/moodle'

const auth = useAuthStore()
const store = useMoodleStore()
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <section class="dashboard-hero rounded-3xl border border-indigo-100/80 p-6 sm:p-8 mb-8">
      <p class="text-sm font-semibold uppercase tracking-wider text-indigo-600 mb-2">Teaching workspace</p>
      <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-2">Welcome, {{ auth.displayName }}</h1>
      <p class="text-slate-600">Manage your course materials and keep track of student progress.</p>
    </section>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <p class="text-sm text-slate-500 mb-1">Total Lessons</p>
        <p class="text-3xl font-bold text-indigo-600">{{ store.teacherLessons.length }}</p>
      </div>
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <p class="text-sm text-slate-500 mb-1">Total Tests</p>
        <p class="text-3xl font-bold text-emerald-600">{{ store.teacherTests.length }}</p>
      </div>
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <p class="text-sm text-slate-500 mb-1">Student Submissions</p>
        <p class="text-3xl font-bold text-amber-600">{{ store.studentResults.length }}</p>
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <RouterLink to="/teacher/lessons" class="group block bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div class="flex items-center justify-between mb-2">
          <h2 class="text-lg font-semibold text-slate-800">📚 Manage Lessons</h2>
          <span aria-hidden="true" class="text-indigo-500 transition-transform group-hover:translate-x-1">→</span>
        </div>
        <p class="text-sm text-slate-500">Create, edit, or delete lessons for your students.</p>
      </RouterLink>
      <RouterLink to="/teacher/tests" class="group block bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div class="flex items-center justify-between mb-2">
          <h2 class="text-lg font-semibold text-slate-800">📝 Manage Tests</h2>
          <span aria-hidden="true" class="text-indigo-500 transition-transform group-hover:translate-x-1">→</span>
        </div>
        <p class="text-sm text-slate-500">Build quizzes and manage test questions.</p>
      </RouterLink>
    </div>
  </div>
</template>