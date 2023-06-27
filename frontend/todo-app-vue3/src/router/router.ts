import { createRouter, createWebHistory } from 'vue-router';
import TodoList  from '@/components/TodoList.vue';
import TodoForm from '@/components/TodoForm.vue';

const routes = [
  { path: '/', component: TodoList },
  { path: '/add', component: TodoForm },
  { path: '/edit/:id', component: TodoForm, props: true },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
