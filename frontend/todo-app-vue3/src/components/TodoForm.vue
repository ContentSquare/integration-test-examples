<template>
  <div>
   <div>
    <form @submit.prevent="addTodoAndClear()">
      <div>
        <input v-model="todo.title" type="text" placeholder="Title" qa-id="title"/> 
        <input v-model="todo.description" type="text" placeholder="Desription" qa-id="description"/>
      </div>
      <div>
        <button qa-id="add-button">Add</button>
      </div>
    </form>
  </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useTodosStore } from '../stores/store';
import { ref } from 'vue';
import type { Todo } from '../models/todo';


export default defineComponent({
  name: 'TodoForm',

  setup() {
    const todosStore = useTodosStore();
    const todo = ref<Todo>();
    todo.value = {
      title: '',
      description: '',
      completed: false
    }

    async function addTodoAndClear() {
      await todosStore.addTodo(todo.value);
      todo.value = {
        title: '', 
        description: '',
        completed: false
      }
    }

    return { todo, addTodoAndClear };
  },
});
</script>
<style scoped>
form {
  margin-bottom: 15px;
}
input {
  margin-top: 25px;
  margin-bottom: 15px;
  height: 20px;
  width: 50%;
}
button {
  background-color: #2f6089;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  font-weight: 800;
  color: white;
  width: 15%;
}
.alert-div {
  min-height: 25px;
}
.alert {
  color: #d1495b;
  font-size: 1em;
  font-weight: 600;
}
</style>