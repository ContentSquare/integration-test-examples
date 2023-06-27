<template>
  <div id="app">
    <h1>My To-Do List</h1>
    <TodoApp />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TodoApp from './components/TodoApp.vue';

export default defineComponent({
  name: 'App',
  components: {
    TodoApp
  },
});
</script>

<style>
.container {
  max-width: 600px;
  margin: 0 auto;
}
</style>
