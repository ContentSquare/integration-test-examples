import axios from 'axios';
import { Todo } from '../store/types';

const API_URL = 'http://localhost:3000';

export const getTodos = async () => {
  const response = await axios.get(`${API_URL}/todos`);
  return response.data;
};

export const addTodo = async (todo: Todo) => {
  const response = await axios.post(`${API_URL}/todos`, todo);
  return response.data;
};

export const updateTodo = async (todo: Todo) => {
  const response = await axios.patch(`${API_URL}/todos/${todo.id}`, todo);
  return response.data;
};

export const deleteTodo = async (id: number) => {
  const response = await axios.delete(`${API_URL}/todos/${id}`);
  return response.data;
};
