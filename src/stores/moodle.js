import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useMoodleStore = defineStore('moodle', () => {
  const lessons = ref([
    { id: 1, title: 'Introduction to Vue 3', content: 'Vue 3 uses the Composition API for better logic reuse and TypeScript support.', duration: '15 min' },
    { id: 2, title: 'Pinia State Management', content: 'Pinia is the official store library for Vue, replacing Vuex with a simpler API.', duration: '20 min' },
  ])

  const tests = ref([
    {
      id: 1,
      title: 'Vue Basics Quiz',
      lessonId: 1,
      questions: [
        { id: 1, text: 'Which API does Vue 3 recommend?', options: ['Options API', 'Composition API', 'Class API', 'Decorator API'], correct: 1 },
        { id: 2, text: 'What is the official state library?', options: ['Vuex', 'Redux', 'Pinia', 'MobX'], correct: 2 },
      ],
    },
  ])

  const studentResults = ref([])

  const teacherLessons = computed(() => lessons.value)
  const teacherTests = computed(() => tests.value)

  function addLesson(lesson) {
    lessons.value.push({ ...lesson, id: Date.now() })
  }

  function updateLesson(id, updated) {
    const idx = lessons.value.findIndex(l => l.id === id)
    if (idx !== -1) lessons.value[idx] = { ...lessons.value[idx], ...updated }
  }

  function deleteLesson(id) {
    lessons.value = lessons.value.filter(l => l.id !== id)
    tests.value = tests.value.filter(t => t.lessonId !== id)
  }

  function addTest(test) {
    tests.value.push({ ...test, id: Date.now() })
  }

  function updateTest(id, updated) {
    const idx = tests.value.findIndex(t => t.id === id)
    if (idx !== -1) tests.value[idx] = { ...tests.value[idx], ...updated }
  }

  function deleteTest(id) {
    tests.value = tests.value.filter(t => t.id !== id)
  }

  function submitTestResult(testId, answers) {
    const test = tests.value.find(t => t.id === testId)
    if (!test) return null
    const score = test.questions.reduce((acc, q, i) => {
      return acc + (answers[i] === q.correct ? 1 : 0)
    }, 0)
    const result = {
      id: Date.now(),
      testId,
      testTitle: test.title,
      score,
      total: test.questions.length,
      date: new Date().toLocaleDateString(),
    }
    studentResults.value.push(result)
    return result
  }

  return {
    lessons, tests, studentResults,
    teacherLessons, teacherTests,
    addLesson, updateLesson, deleteLesson,
    addTest, updateTest, deleteTest,
    submitTestResult,
  }
})