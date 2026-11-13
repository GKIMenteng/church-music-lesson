<script setup>
import { useMoodleStore } from '@/stores/moodle'
const store = useMoodleStore()
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-slate-800 mb-6">Course Lessons</h1>
    <div class="space-y-4">
      <div v-for="lesson in store.lessons" :key="lesson.id" class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div class="flex justify-between items-start mb-3">
          <h2 class="text-lg font-semibold text-slate-800">{{ lesson.title }}</h2>
          <span class="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">{{ lesson.duration }}</span>
        </div>
        <p class="text-slate-600 leading-relaxed">{{ lesson.content }}</p>
      </div>
    </div>
  </div>
</template>