<template>
  <div class="todo-app">
    <todo-form />
    <todo-list />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TodoForm from './TodoForm.vue';
import TodoList from './TodoList.vue';

export default defineComponent({
    name: 'TodoApp',
    components: {
        TodoList,
        TodoForm
    },
});
</script>

<style scoped>
.todo-app {
  padding: 5vh;
  min-height: 100vh;
  width: 100vw;
  background-color: #f7f9fc;
}
</style>