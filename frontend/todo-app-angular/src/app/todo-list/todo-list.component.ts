import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Todo } from '../models/todo';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';import { TodoDialogComponent } from '../todo-dialog/todo-dialog.component';

import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../state/app-state';
import { selectCompletedTodos, selectIncompletedTodos } from '../state/todos/todo.selectors';
import { TodosActions } from '../state/todos/todo.actions';


@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {

  @Input()
  completed!: boolean;

  // @Output()
  // todoEdited = new EventEmitter();

  // @Output()
  // todoDeleted = new EventEmitter();

  // @Output() 
  // toggleCompleted = new EventEmitter();

  todos$!: Observable<readonly Todo[]>

  constructor(private dialog: MatDialog, private store: Store<AppState>) {}

  ngOnInit(): void {
    this.todos$ = this.completed === true? this.store.select(selectCompletedTodos) : this.store.select(selectIncompletedTodos)
  }

  editTodo(todo: Todo) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = todo;
    this.dialog.open(TodoDialogComponent, dialogConfig);
  }

  removeTodo(todo: Todo) {
    this.store.dispatch(TodosActions.removeTodo({ id: todo.id || 0 }));
  }

  toggleTodo(todo: Todo) {
    const toggledTodo = {
      ...todo,
      completed: !todo.completed
    };
    this.store.dispatch(TodosActions.toggleTodo({ todo: toggledTodo }));
  }
}
    
