import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { filter, map, Observable, tap } from 'rxjs';
import { Todo } from '../models/todo';
import { TodoService } from '../services/todo.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TodoDialogComponent } from '../todo-dialog/todo-dialog.component';
import { Store } from '@ngrx/store';
import { selectAllTodos, selectCompletedTodos, selectIncompletedTodos } from '../state/todos/todo.selectors';
import { AppState } from '../state/app-state';
import { TodosApiActions } from '../state/todos/todo.actions';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],

})
export class HomeComponent implements OnInit {
  incompletedTodos$: Observable<readonly Todo[]> = this.store.select(selectIncompletedTodos);
  completedTodos$: Observable<readonly Todo[]> = this.store.select(selectCompletedTodos);
  allTodos$: Observable<readonly Todo[]> = this.store.select(selectAllTodos);

  newTodo: Todo = {
    title: '',
    description: '',
    completed: false
  };

  constructor(private dialog: MatDialog, private store: Store<AppState>) { }

  ngOnInit() {
    this.store.dispatch(TodosApiActions.loadTodoList());
  }
  
  addTodo() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = this.newTodo;
    const dialogRef = this.dialog.open(TodoDialogComponent, dialogConfig);

    dialogRef.afterClosed()
                .subscribe();
  }
}