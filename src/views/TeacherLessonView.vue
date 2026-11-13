<script setup>
import { ref } from 'vue'
import { useMoodleStore } from '@/stores/moodle'
const store = useMoodleStore()
const editing = ref(null)
const showForm = ref(false)
const form = ref({ title: '', content: '', duration: '' })

function openAdd() {
  editing.value = null
  form.value = { title: '', content: '', duration: '' }
  showForm.value = true
}
function openEdit(lesson) {
  editing.value = lesson.id
  form.value = { ...lesson }
  showForm.value = true
}
function save() {
  if (!form.value.title.trim()) return
  if (editing.value) {
    store.updateLesson(editing.value, form.value)
  } else {
    store.addLesson(form.value)
  }
  showForm.value = false
}
function remove(id) {
  if (confirm('Delete this lesson?')) store.deleteLesson(id)
}
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-slate-800">Manage Lessons</h1>
      <button @click="openAdd" class="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-sm">+ Add Lesson</button>
    </div>
    <div v-if="showForm" class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-6">
      <h2 class="text-lg font-semibold mb-4">{{ editing ? 'Edit Lesson' : 'New Lesson' }}</h2>
      <div class="space-y-4">
        <input v-model="form.title" placeholder="Lesson Title" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
        <textarea v-model="form.content" placeholder="Content" rows="3" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"></textarea>
        <input v-model="form.duration" placeholder="Duration (e.g., 15 min)" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
        <div class="flex gap-3">
          <button @click="save" class="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors">Save</button>
          <button @click="showForm = false" class="px-6 py-2.5 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors">Cancel</button>
        </div>
      </div>
    </div>
    <div class="space-y-3">
      <div v-for="lesson in store.teacherLessons" :key="lesson.id" class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h3 class="font-semibold text-slate-800">{{ lesson.title }}</h3>
          <p class="text-sm text-slate-500 mt-1 line-clamp-2">{{ lesson.content }}</p>
          <span class="inline-block mt-2 text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">{{ lesson.duration }}</span>
        </div>
        <div class="flex gap-2 sm:ml-4 shrink-0">
          <button @click="openEdit(lesson)" class="px-3 py-1.5 text-sm text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">Edit</button>
          <button @click="remove(lesson.id)" class="px-3 py-1.5 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>