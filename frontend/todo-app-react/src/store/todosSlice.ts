import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootState } from './store';
import { Todo } from './types';
import * as api from '../api/api';

interface TodosState {
  todos: Todo[];
  isLoading: boolean;
  error: string | null;
  maxIndex: number;
}

const initialState: TodosState = {
  todos: [],
  isLoading: false,
  error: null,
  maxIndex: 0
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    setTodos(state, action: PayloadAction<Todo[]>) {
      state.todos = action.payload;
    },
    addTodoSuccess(state, action: PayloadAction<Todo>) {
      state.todos.push(action.payload);
    },
    updateTodoSuccess(state, action: PayloadAction<Todo>) {
      const index = state.todos.findIndex((todo) => todo.id === action.payload.id);
      if (index !== -1) {
        state.todos[index] = action.payload;
      }
    },
    deleteTodoSuccess(state, action: PayloadAction<number>) {
      state.todos = state.todos.filter((todo) => todo.id !== action.payload);
    },
    setMaxIndex(state, action: PayloadAction<number>) {
      state.maxIndex = action.payload;
    }
  },
});

export const { setLoading, setError, setTodos, addTodoSuccess, updateTodoSuccess, deleteTodoSuccess, setMaxIndex } = todosSlice.actions;

export const fetchTodos = (): AppThunk => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const todos = await api.getTodos();
    let maxId = 0;
    if(todos.length > 0) {
      const ids: any = todos.map((todo: Todo) => todo['id']);
      maxId = Math.max(...ids);
    }
    dispatch(setMaxIndex(maxId));
    dispatch(setTodos(todos));
  } catch (error: any) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const addTodoAsync = (todo: Todo): AppThunk =>  async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const addedTodo = await api.addTodo(todo);
    dispatch(addTodoSuccess(addedTodo));
  } catch (error: any) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const updateTodoAsync = (todo: Todo): AppThunk => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const updatedTodo = await api.updateTodo(todo);
    dispatch(updateTodoSuccess(updatedTodo));
  } catch (error: any) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const deleteTodoAsync = (id: number): AppThunk => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    await api.deleteTodo(id);
    dispatch(deleteTodoSuccess(id));
  } catch (error: any) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const selectMaxId = (state: RootState) => state.todos.maxIndex;
export default todosSlice.reducer;
