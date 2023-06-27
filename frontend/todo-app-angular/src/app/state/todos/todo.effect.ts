import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TodosActions, TodosApiActions } from './todo.actions';
import { of, from } from 'rxjs';
import { switchMap, map, catchError, withLatestFrom, concatMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { TodoService } from '../../services/todo.service';
import { AppState } from '../app-state';
import { selectNewTodo } from './todo.selectors';


@Injectable()
export class TodoEffects {
  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private todoService: TodoService
  ) {}

  loadTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodosApiActions.loadTodoList),
      switchMap(() => 
        from(this.todoService.getTodos())
            .pipe(
              // Take the returned value and return a new success action containing the todos
              map((todos) => TodosApiActions.loadTodoListSuccess({ todos: todos })),
              // The catchError operator is used to catch any errors that occur while executing the getTodos method. If an error occurs, a new loadTodoListFailure action is dispatched containing the error message.
              catchError((error: string) => of(TodosApiActions.loadTodoListFailure({ error })))
            )
      )
    )
  );

  addTodos$ = createEffect(() =>
      this.actions$.pipe(
        ofType(TodosActions.addTodo),
        withLatestFrom(this.store.select(selectNewTodo)),
        concatMap(([action, todo]) => {
          return from(this.todoService.addTodo(todo))
        })
      ),
    { dispatch: false }
  );

  removeTodos$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(TodosActions.removeTodo),
        concatMap((action) => {
          return from(this.todoService.deleteTodo(action.id))
        })
      ),
    { dispatch: false }
  );

  updateTodos$ = createEffect(() =>
      this.actions$.pipe(
        ofType(TodosActions.updateTodo, TodosActions.toggleTodo),
        concatMap((action) => {
          return from(this.todoService.updateTodo(action.todo))
        })
      ),
    // Most effects dispatch another action, when an effect doesn't dispatch an action, we should indicate that
    { dispatch: false }
  );
}