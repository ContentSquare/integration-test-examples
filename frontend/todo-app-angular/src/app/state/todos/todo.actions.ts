import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Todo } from '../../models/todo';

export const TodosActions = createActionGroup({
  source: 'Todos',
  events: {
    'Add Todo': props<{ todo: Todo }>(),
    'Update Todo': props<{ todo: Todo }>(),
    'Remove Todo': props<{ id: number }>(),
    'Toggle Todo': props<{ todo: Todo }>()
  },
});

export const TodosApiActions = createActionGroup({
  source: 'Todos API',
  events: {
    'Load Todo List': emptyProps(),
    'Load Todo List Success': props<{ todos: ReadonlyArray<Todo> }>(),
    // we can define an event with payload using the props factory
    'Load Todo List Failure':  props<{ error: string }>(),
  }
});