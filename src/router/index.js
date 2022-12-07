import { createRouter, createWebHistory } from 'vue-router'
import About from '../views/About'
import Tasks from '../views/Tasks'

const routes = [
  {
    path: '/tasks',
    name: 'tasks',
    component: Tasks
  },
  {
    path: '/about',
    name: 'about',
    component: About
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/tasks'
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  linkActiveClass: 'active',
  routes
})

export default router
