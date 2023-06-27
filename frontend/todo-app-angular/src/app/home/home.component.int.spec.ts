import { TestBed, ComponentFixture, waitForAsync, tick, fakeAsync, flush } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Store, StoreModule } from '@ngrx/store';
import { HomeComponent } from './home.component';
import { TodoListComponent } from '../todo-list/todo-list.component';
import { TodoDialogComponent } from '../todo-dialog/todo-dialog.component';
import { todosReducer } from '../state/todos/todo.reducer';
import { TodoService } from '../services/todo.service';
import { EffectsModule } from '@ngrx/effects';
import { TodoEffects } from '../state/todos/todo.effect';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { MatTabsModule } from '@angular/material/tabs';
import { Todo } from '../models/todo';
import { MatCardModule } from '@angular/material/card';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormBuilder } from '@angular/forms';

const todoItems: Todo[] = [
  {
    "id": 0,
    "title": "Grocery shopping",
    "description": "1. A pack of carrots\n2. Eggs",
    "completed": false
  },
  {
    "id": 1,
    "title": "Integration Test",
    "description": "10 tests",
    "completed": false
  },
  {
    "id": 2,
    "title": "Pick up kid from school",
    "description": "",
    "completed": true
  }
];

describe('AppComponent Integration Test', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let todosService: TodoService;
  let store: Store;

  let todosServiceStub: Partial<TodoService> = {
    getTodos: jest.fn().mockReturnValue(of(todoItems)),
    addTodo: jest.fn(),
    updateTodo: jest.fn().mockImplementation((todo: Todo) => {
      const updatedTodos = todoItems.slice();
      const index = updatedTodos.findIndex(item => item.id === todo.id);
      if(~index) {
        updatedTodos[index] = todo;
      }
      return of(updatedTodos);
    }),
    deleteTodo: jest.fn().mockImplementation((id: number) => {
      return of(todoItems.filter((todo) => todo.id !== id));
    })
  };

  const matDialogRefStub: Partial<MatDialogRef<any>> = {
    close: () => {},
  };

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [
        HomeComponent,
        TodoListComponent,
        TodoDialogComponent,
      ],
      imports: [
        StoreModule.forRoot({
          todos: todosReducer,
        }),
        EffectsModule.forRoot([
          TodoEffects
        ]),
        MatDialogModule,
        MatTabsModule,
        MatCardModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: TodoService, useValue: todosServiceStub },
        { provide: MatDialog, useClass: MatDialog },
        { provide: MatDialogRef, useValue: matDialogRefStub },
        { provide: FormBuilder, useClass: FormBuilder }
      ],
    }).compileComponents();

    todosService = TestBed.inject(TodoService);
    // TestBed.overrideProvider(TodoService, { useValue: { getTodos: () => of(todoItems) } });
    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
    TestBed.resetTestingModule();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display incomplete To-do list', () => {
    todosService.getTodos = jest.fn().mockReturnValue(of(todoItems))
    const incompletedTodoItems = fixture.debugElement.queryAll(By.css('mat-card'));
    expect(incompletedTodoItems.length).toBe(2);
  });

  it('should display complete To-do list', fakeAsync(() => {
    const completedTab = fixture.debugElement.queryAll(By.css('.mdc-tab'))[1];
    completedTab.nativeElement.click();
    fixture.detectChanges();
    setTimeout(() => {}, 0);
    flush();
    const completedTodoItems = fixture.debugElement.queryAll(By.css('mat-card'));
    const titleElement = completedTodoItems[2].query(By.css('mat-card-title'));
    expect(titleElement.nativeElement.textContent).toBe('Pick up kid from school');
  }));

  it('should be able complete an incompleted todo item', fakeAsync(() => {
    let firstIncompletedTodoItem = fixture.debugElement.query(By.css('mat-card'));
    expect(firstIncompletedTodoItem.nativeElement.textContent).toContain(todoItems[0].title);

    const completeButton = firstIncompletedTodoItem
                        .query(By.css('mat-card-actions'))
                        .queryAll(By.css('button'))[2];
    completeButton.nativeElement.click();
    fixture.detectChanges();
    firstIncompletedTodoItem = fixture.debugElement.query(By.css('mat-card'));
    expect(firstIncompletedTodoItem.nativeElement.textContent).not.toContain(todoItems[0].title);

    // Verify the item has been moved to Completed Tab
    const completedTab = fixture.debugElement.queryAll(By.css('.mdc-tab'))[1];
    completedTab.nativeElement.click();
    fixture.detectChanges();
    setTimeout(() => {}, 0);
    flush();
    const firstCompletedTodoItem = fixture.debugElement.queryAll(By.css('mat-card'))[1];
    expect(firstCompletedTodoItem.nativeElement.textContent).toContain(todoItems[0].title);
  }));

  it('should be able delete a todo item', () => {
    let incompletedTodoItems = fixture.debugElement.queryAll(By.css('mat-card'));
    expect(incompletedTodoItems.length).toBe(2);

    const deleteButton = incompletedTodoItems[0]
      .query(By.css('mat-card-actions'))
      .queryAll(By.css('button'))[0];
    deleteButton.nativeElement.click();
    fixture.detectChanges();

    incompletedTodoItems = fixture.debugElement.queryAll(By.css('mat-card'));
    expect(incompletedTodoItems.length).toBe(1);
  });
});


