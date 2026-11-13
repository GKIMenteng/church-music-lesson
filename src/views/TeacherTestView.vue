<script setup>
import { ref } from 'vue'
import { useMoodleStore } from '@/stores/moodle'
const store = useMoodleStore()
const showForm = ref(false)
const editing = ref(null)
const form = ref({ title: '', lessonId: null, questions: [] })

function openAdd() {
  editing.value = null
  form.value = { title: '', lessonId: store.lessons[0]?.id || null, questions: [] }
  showForm.value = true
}
function addQuestion() {
  form.value.questions.push({ id: Date.now(), text: '', options: ['', '', '', ''], correct: 0 })
}
function save() {
  if (!form.value.title.trim()) return
  if (editing.value) store.updateTest(editing.value, form.value)
  else store.addTest(form.value)
  showForm.value = false
}
function remove(id) {
  if (confirm('Delete this test?')) store.deleteTest(id)
}
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-slate-800">Manage Tests</h1>
      <button @click="openAdd" class="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700 transition-colors">+ Add Test</button>
    </div>
    <div v-if="showForm" class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-6 space-y-4">
      <input v-model="form.title" placeholder="Test Title" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
      <select v-model="form.lessonId" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none">
        <option :value="null" disabled>Select Lesson</option>
        <option v-for="l in store.lessons" :key="l.id" :value="l.id">{{ l.title }}</option>
      </select>
      <div v-for="(q, qi) in form.questions" :key="q.id" class="bg-slate-50 rounded-xl p-4 space-y-2">
        <input v-model="q.text" placeholder="Question text" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
        <div class="grid grid-cols-2 gap-2">
          <input v-for="(opt, oi) in q.options" :key="oi" v-model="q.options[oi]" :placeholder="`Option ${oi + 1}`" class="px-3 py-2 border border-slate-200 rounded-lg text-sm" />
        </div>
        <select v-model="q.correct" class="px-3 py-2 border border-slate-200 rounded-lg text-sm">
          <option v-for="(opt, oi) in q.options" :key="oi" :value="oi">Correct: Option {{ oi + 1 }}</option>
        </select>
      </div>
      <button @click="addQuestion" class="text-sm text-emerald-600 font-medium">+ Add Question</button>
      <div class="flex gap-3 pt-2">
        <button @click="save" class="px-6 py-2.5 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700">Save Test</button>
        <button @click="showForm = false" class="px-6 py-2.5 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200">Cancel</button>
      </div>
    </div>
    <div class="space-y-3">
      <div v-for="test in store.teacherTests" :key="test.id" class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex justify-between items-center">
        <div>
          <h3 class="font-semibold text-slate-800">{{ test.title }}</h3>
          <p class="text-sm text-slate-500">{{ test.questions.length }} questions</p>
        </div>
        <button @click="remove(test.id)" class="px-3 py-1.5 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100">Delete</button>
      </div>
    </div>
  </div>
</template>