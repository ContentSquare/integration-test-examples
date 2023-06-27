import axios from 'axios';
import { Todo } from './todo';

const API_URL = 'http://localhost:3000/todos';

export const getTodos = async (): Promise<Todo[]> => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const createTodo = async (todo: Todo): Promise<Todo> => {
    const response = await axios.post(API_URL, todo);
    return response.data;
};

export const persistTodo = async (todo: Todo): Promise<Todo> => {
    const response = await axios.put(`${API_URL}/${todo.id}`, todo);
    return response.data;
};

export const deleteTodo = async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
};
