<template>
 <div>
    <div v-for="todo in todos" :key="todo.id" class="list">
      <div class="item" :completed="todo.completed">
        <div>
          <div>
            <div :class="{ completed: todo.completed }" class="todo-title">{{ todo.title }}</div>
            <div :class="{ completed: todo.completed }" class="todo-description" style="white-space: pre-line">{{ todo.description }} </div>
          </div>
          <div class="icons">
            <span @click.stop="toggleCompleted(todo)" qa-id="toogle-button">&#x2713;</span>
            <span @click="editModal=true" qa-id="edit-button">&#9998;</span> 
            <span @click.stop="deleteTodo(todo.id)" class="fa" qa-id="delete-button">&#xf014;</span>
          </div>
          <div>
            <div v-if="editModal" class="modal" >
              <div class="modal-content">
                <textarea id="autoresizing" :placeholder="todo.title" v-model="todo.title" qa-id="edit-title"></textarea>
                <textarea id="autoresizing" :placeholder="todo.description" v-model="todo.description" qa-id="edit-description"></textarea>
                <button @click.stop="editTodo(todo)" qa-id="edit-save-button">Save</button>
                <button @click="editModal=false" qa-id="edit-close-button">Close</button>
              </div>
            </div> 
          </div>
        </div>
       
      </div>
    </div>
  </div> 
</template>
 
<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useTodosStore } from '../stores/store';
import { storeToRefs } from 'pinia';
import type { Todo } from '../models/todo';


export default defineComponent({
  name: 'TodoList',

  setup() {
    const todosStore = useTodosStore();
    const { todos } = storeToRefs(todosStore);
    const editModal = ref(false);

    onMounted(async() => {
      await todosStore.fetchTodos();
    });

    function editTodo(todo: Todo) {
      editModal.value = false; 
      todosStore.updateTodo(todo);
    }

    function deleteTodo(id: number) {
      todosStore.deleteTodo(id);
    }

    function toggleCompleted(todo: Todo) {
      todosStore.toogleCompleted(todo);
    }

    return { todos, editModal, editTodo, deleteTodo, toggleCompleted };
  },
});
</script>
<style scoped>
.modal {
  display: block;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0,0,0,0.4);
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 50%;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

span {
  margin: 0 10px;
  cursor: pointer;
}
.list {
  display: flex;
  justify-content: left;
}
.item {
  display: flex;
  font-size: 1.5em;
  justify-content: space-between;
  width: 80vw;
  padding: 5px;
}

.completed {
  text-decoration: line-through;
}

.todo-title {
  font-size: 28px;
  font-weight: bold;
}

.todo-description {
  font-size: 28px;
}

.icons {
  justify-content: left;
  padding: 20px 20px 20px 0px;
}

 #autoresizing {
  display: block;
  overflow: hidden;
  min-width: 99%;
  min-height: 100px;
  margin-bottom: 10px;
}
</style>