import { state } from '@angular/animations';
import { createReducer, on } from '@ngrx/store';
import { Todo } from '../../models/todo';
import { TodosActions, TodosApiActions } from './todo.actions';

export interface TodoState {
  todos: ReadonlyArray<Todo>;
  error: string;
  status: 'pending' | 'loading' | 'error' | 'success';
  newTodo: Todo
}

export const initialState: TodoState = {
  todos: [],
  error: '',
  status: 'pending',
  newTodo: {
    id: 0,
    title: '',
    description: '',
    completed: false
  }
};

export const todosReducer = createReducer(
  initialState,
  on(TodosApiActions.loadTodoList, (state) => ({
    ...state,
    status: 'loading'
  })),
  on(TodosApiActions.loadTodoListSuccess, (state, { todos }) => ({
    ...state,
    todos,
    status: 'success'
  })),
  on(TodosApiActions.loadTodoListFailure, (state, { error }) => ({
    ...state,
    error,
    status: 'error'
  })),
  on(TodosActions.addTodo, (state, { todo }) => {
    let maxId = 0;
    if(state.todos.length > 0) {
      const ids: any = state.todos.map(todo => todo['id']);
      maxId = Math.max(...ids);
    }
    maxId++;
    const todoWithId = {
      ...todo,
      id: maxId
    }
    return ({
      ...state,
      todos: [...state.todos, todoWithId],
      newTodo: todoWithId
    })
  }),
  on(TodosActions.updateTodo, (state, { todo }) => {
    let updatedTodos = [...state.todos];
    const index = updatedTodos.findIndex(item => item.id === todo.id);
    if(~index) {
      updatedTodos[index] = todo;
    }
    return {
      ...state,
      todos: [...updatedTodos],
    }
  }),
  on(TodosActions.toggleTodo, (state, { todo }) => {
    // let draftTodo = {...todo};
    // draftTodo.completed = !draftTodo.completed;
    let updatedTodos = [...state.todos];

    const index = updatedTodos.findIndex(item => item.id === todo.id);
    if(~index) {
      updatedTodos[index] = todo;
    }
    return {
      ...state,
      todos: [...updatedTodos],
    }
  }),
  on(TodosActions.removeTodo, (state, { id }) => ({
      ...state,
      todos: state.todos.filter((todo) => todo.id !== id),
  })),
);