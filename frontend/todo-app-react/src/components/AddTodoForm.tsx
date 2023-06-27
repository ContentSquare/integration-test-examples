import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../store/store';
import { addTodoAsync, selectMaxId } from '../store/todosSlice';
import { Todo } from '../store/types';

import styles from './AddTodoForm.module.css';


const AddTodoForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const maxId = useSelector(selectMaxId);
  const dispatch: ThunkDispatch<RootState, undefined, AnyAction> = useDispatch();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (title.trim() !== '') {
      try {
        const newTodo: Todo = {
          id: maxId+1,
          title: title.trim(),
          description: description.trim(),
          completed: false
        }
      
        dispatch(addTodoAsync(newTodo));
        setTitle('');
        setDescription('');
      } catch (err) {
        console.error('Failed to add todo:', err);
      }
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form} >
      <div>
        <input className={styles.input} type="text" placeholder="Title" value={title} onChange={handleTitleChange} />
      </div>
      <div>
        <textarea className={styles.textarea} rows={4} placeholder="Description" value={description} onChange={handleDescriptionChange} />
      </div>
      <button type="submit">Add Todo</button>
    </form>
  );
};


export default AddTodoForm;
