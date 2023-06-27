import { writable } from 'svelte/store';
import { Todo } from './todo';
import { getTodos, createTodo, persistTodo, deleteTodo } from './todo-service';

export const todos = writable<Todo[]>([]);
export const maxId = writable<number>();

export async function fetchTodos() {
  try {
    const fetchedTodo = await getTodos();
    if(fetchedTodo.length > 0) {
      const ids: any = fetchedTodo.map(todo => todo['id']);
      maxId.set(Math.max(...ids));
    } 
    todos.set(fetchedTodo);
  }  catch(error: any) {
    console.log('Oops, something wrong happened, cannot fetch todos');
  }
}

export async function addTodo(newTodo: Todo) {
  maxId.subscribe(id => newTodo.id = ++id); 
  try {
    await createTodo(newTodo);
    todos.update((existingTodos: any) => [...existingTodos, newTodo]);
  } catch(error: any) {
    console.log('Oops, something wrong happened, cannot add new Todo');
  }
}

export async function updateTodo(updatedTodo: Todo) {
  try {
    await persistTodo(updatedTodo);
    todos.update((existingTodos: any[]) =>
    existingTodos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo)));  
  } catch(error: any) {
    console.log('Oops, something wrong happened, cannot update Todo');
  }
}

export async function removeTodo(deletedTodo: Todo) {
  console.log('in store delete');
  console.log(deletedTodo)
  try {
    await deleteTodo(deletedTodo.id??0);
    todos.update((existingTodos: any[]) => {
      const deletedTodoIndex = existingTodos.findIndex(todo => todo.id === deletedTodo.id);
      existingTodos.splice(deletedTodoIndex, 1);
      return existingTodos;
    });  
  } catch(error: any) {
      console.log('Oops, something wrong happened, cannot delete Todo');
  }
}

export function toggleTodo(updatedTodo: Todo) {
  updatedTodo.completed = !updatedTodo.completed;
  updateTodo(updatedTodo);
}

export { getTodos };
