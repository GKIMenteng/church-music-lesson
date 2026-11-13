<script setup>
import { ref } from 'vue'
import { useMoodleStore } from '@/stores/moodle'
const store = useMoodleStore()
const activeTest = ref(null)
const answers = ref([])
const result = ref(null)

function startTest(test) {
  activeTest.value = test
  answers.value = new Array(test.questions.length).fill(-1)
  result.value = null
}
function submit() {
  result.value = store.submitTestResult(activeTest.value.id, answers.value)
}
function close() {
  activeTest.value = null
  result.value = null
}
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-slate-800 mb-6">Available Tests</h1>
    <div v-if="!activeTest" class="space-y-3">
      <div v-for="test in store.tests" :key="test.id" class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h3 class="font-semibold text-slate-800">{{ test.title }}</h3>
          <p class="text-sm text-slate-500">{{ test.questions.length }} questions</p>
        </div>
        <button @click="startTest(test)" class="px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700">Start</button>
      </div>
    </div>
    <div v-else-if="!result" class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <h2 class="text-lg font-bold text-slate-800 mb-6">{{ activeTest.title }}</h2>
      <div v-for="(q, qi) in activeTest.questions" :key="q.id" class="mb-6 pb-6 border-b border-slate-100 last:border-0">
        <p class="font-medium text-slate-800 mb-3">{{ qi + 1 }}. {{ q.text }}</p>
        <div class="space-y-2">
          <label v-for="(opt, oi) in q.options" :key="oi" class="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors" :class="answers[qi] === oi ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:bg-slate-50'">
            <input type="radio" :name="`q-${qi}`" :value="oi" v-model="answers[qi]" class="accent-indigo-600" />
            <span class="text-sm text-slate-700">{{ opt }}</span>
          </label>
        </div>
      </div>
      <button @click="submit" class="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700">Submit Answers</button>
    </div>
    <div v-else class="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 text-center">
      <div class="text-5xl mb-4">{{ result.score / result.total >= 0.7 ? '🎉' : '📚' }}</div>
      <h2 class="text-2xl font-bold text-slate-800 mb-2">Test Complete!</h2>
      <p class="text-slate-500 mb-1">Your score:</p>
      <p class="text-4xl font-bold text-indigo-600 mb-6">{{ result.score }} / {{ result.total }}</p>
      <button @click="close" class="px-6 py-2.5 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200">Back to Tests</button>
    </div>
  </div>
</template>