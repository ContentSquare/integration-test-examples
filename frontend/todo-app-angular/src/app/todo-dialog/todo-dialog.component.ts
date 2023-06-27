import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Todo } from '../models/todo';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Store } from '@ngrx/store';
import { TodosActions } from '../state/todos/todo.actions';


@Component({
  selector: 'app-todo-dialog',
  templateUrl: './todo-dialog.component.html',
  styleUrls: ['./todo-dialog.component.css']
})
export class TodoDialogComponent {
  todo: Todo;
  originalTodo: Todo;
  form: FormGroup;

  constructor(
      private fb: FormBuilder,
      private dialogRef: MatDialogRef<TodoDialogComponent>,
      @Inject(MAT_DIALOG_DATA) todo: Todo,
      private store: Store
  ) {
      this.todo = todo;
      this.originalTodo = todo;
      this.form = fb.group({
          title: [todo.title, Validators.required],
          description: [todo.description, Validators.required],
          completed: [todo.completed, Validators.required]
      });
  }

  isChanged(): boolean {
    return JSON.stringify(this.todo) !== JSON.stringify(this.originalTodo);
  }

  save() {
    this.dialogRef.beforeClosed().subscribe(result => {
      this.todo = {
        ...this.todo,
        ...this.form.value
      }

      if (this.isChanged()) {
        this.store.dispatch(TodosActions.updateTodo({ todo: this.todo }))
      }
    });
    this.dialogRef.close(this.form.value);
  }

  add() {
    this.dialogRef.beforeClosed().subscribe(result => {
      this.todo = {
        ...this.todo,
        ...this.form.value
      }

      if (this.isChanged()) {
        this.store.dispatch(TodosActions.addTodo({ todo: this.todo }))
      }
    });
    this.dialogRef.close(this.form.value);
  }

  close() {
      this.dialogRef.close();
  }
}
