import type { Todo } from '@/models/todo';
import axios from 'axios';

const API_URL = 'http://localhost:3000/todos';

export async function getTodos(): Promise<Todo[]> {
  const response = await axios.get<Todo[]>(API_URL);
  return response.data;
}

export async function addTodo(todo: Todo): Promise<Todo> {
  const response = await axios.post<Todo>(API_URL, todo);
  return response.data;
}

export async function updateTodo(todo: Todo): Promise<Todo> {
  const response = await axios.patch<Todo>(`${API_URL}/${todo.id}`, todo);
  return response.data;
}

export async function deleteTodo(id: number): Promise<void> {
  await axios.delete(`${API_URL}/${id}`);
}
