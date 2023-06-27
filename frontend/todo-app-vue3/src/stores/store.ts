import type { Todo } from '@/models/todo';
import { defineStore } from 'pinia';
import { getTodos, addTodo, updateTodo, deleteTodo } from '../api/todo-service';

interface TodosState {
  todos: Todo[];
  id: number;
}

export const useTodosStore = defineStore('todos', {
  state: (): TodosState => ({
    todos: [],
    id: 0
  }),
  getters: {
    completedTodos(state) {
      return state.todos.filter((todo: Todo) => todo.completed);
    },
    incompletedTodos(state) {
      return state.todos.filter((todo: Todo) => !todo.completed);
    },
  },
  actions: {
    async fetchTodos() {
      this.todos = await getTodos();
      if(this.todos.length > 0) {
        const ids: any = this.todos.map((todo: Todo) => todo['id']);
        this.id = Math.max(...ids);
      } 
    },
    async addTodo(todo: Todo) {
      this.id++;
      todo.id = this.id;
      await addTodo(todo);
      this.todos.push(todo);
    },
    async updateTodo(todo: Todo) {
      await updateTodo(todo);
    },
    async deleteTodo(id: number) {
      await deleteTodo(id);
      const index = this.todos.findIndex((todo: Todo) => todo.id === id);
      if (~index) {
        this.todos.splice(index, 1);
      }
    },
    async toogleCompleted(todo: Todo) {
      todo.completed = !todo.completed;
      await updateTodo(todo);
    }
  },
});
