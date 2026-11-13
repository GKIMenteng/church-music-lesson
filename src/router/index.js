import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import TeacherDashboard from '@/views/TeacherDashboard.vue'
import TeacherLessonView from '@/views/TeacherLessonView.vue'
import TeacherTestView from '@/views/TeacherTestView.vue'
import StudentDashboard from '@/views/StudentDashboard.vue'
import StudentLessonView from '@/views/StudentLessonView.vue'
import StudentTestView from '@/views/StudentTestView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'login', component: LoginView },
    { path: '/teacher', name: 'teacher-dashboard', component: TeacherDashboard, meta: { role: 'teacher' } },
    { path: '/teacher/lessons', name: 'teacher-lessons', component: TeacherLessonView, meta: { role: 'teacher' } },
    { path: '/teacher/tests', name: 'teacher-tests', component: TeacherTestView, meta: { role: 'teacher' } },
    { path: '/student', name: 'student-dashboard', component: StudentDashboard, meta: { role: 'student' } },
    { path: '/student/lessons', name: 'student-lessons', component: StudentLessonView, meta: { role: 'student' } },
    { path: '/student/tests', name: 'student-tests', component: StudentTestView, meta: { role: 'student' } },
  ],
})

router.beforeEach(async to => {
  const auth = useAuthStore()
  await auth.initialize()
  const requiredRole = to.meta.role

  if (requiredRole && !auth.user) return { name: 'login' }
  if (requiredRole && auth.role !== requiredRole) {
    return auth.role === 'teacher' ? { name: 'teacher-dashboard' } : { name: 'student-dashboard' }
  }

  if (to.name === 'login' && auth.user) {
    return auth.role === 'teacher' ? { name: 'teacher-dashboard' } : { name: 'student-dashboard' }
  }

  return true
})
export default router