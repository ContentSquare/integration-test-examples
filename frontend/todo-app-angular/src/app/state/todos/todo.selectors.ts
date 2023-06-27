import { createSelector } from '@ngrx/store';
import { AppState } from '../app-state';
import { TodoState } from './todo.reducer';


export const selectTodos = (state: AppState) => state.todos;
export const selectAllTodos = createSelector(
  selectTodos,
  (state: TodoState) => state.todos
);

export const selectCompletedTodos = createSelector(
    selectTodos,
    (state: TodoState) => state.todos.filter(todo => todo.completed === true)
);

export const selectIncompletedTodos = createSelector(
    selectTodos,
    (state: TodoState) => state.todos.filter(todo => todo.completed === false)
);

export const selectNewTodo = createSelector(
  selectTodos,
  (state: TodoState) => state.newTodo
);