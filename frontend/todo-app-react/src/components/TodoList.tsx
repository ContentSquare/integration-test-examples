import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction } from '@reduxjs/toolkit';
import { ThunkDispatch } from 'redux-thunk';
import { fetchTodos } from '../store/todosSlice';
import { RootState } from '../store/store';
import AddTodoForm from './AddTodoForm';
import TodoItem from './TodoItem';

const TodoList: React.FC = () => {
  const dispatch: ThunkDispatch<RootState, undefined, AnyAction> = useDispatch();
  const { todos, isLoading, error } = useSelector((state: RootState) => state.todos);
  const [isDataFetched, setIsDataFetched] = useState(false);

  const fetchData = () => {
    try {
      dispatch(fetchTodos());
      setIsDataFetched(true);
    } catch (error) {
      console.error(error);
      setIsDataFetched(true);
    }
  }
  
  useEffect(() => {
    fetchData();
  }, []);

  if (!isDataFetched) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <AddTodoForm />
      {todos && todos.length > 0 ? (
        <ul>
          {todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </ul>
      ) : (
        <div>No todos found.</div>
      )}
    </div>
  );
};

export default TodoList;
