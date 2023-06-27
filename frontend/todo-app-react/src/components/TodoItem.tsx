import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../store/store';
import { deleteTodoAsync, updateTodoAsync } from '../store/todosSlice';
import { Todo } from '../store/types';

import styles from './TodoItem.module.css';

interface Props {
  todo: Todo;
}

const TodoItem: React.FC<Props> = ({ todo }) => {
  const dispatch: ThunkDispatch<RootState, undefined, AnyAction> = useDispatch();
  const [editedTodo, setEditedTodo] = useState({ title: todo.title, description: todo.description });
  const [saveDisabled, setSaveDisabled] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = () => {
    dispatch(deleteTodoAsync(todo.id));
  };

  const handleCompleteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedTodo = {
      ...todo,
      completed: e.target.checked
    }
    dispatch(updateTodoAsync(updatedTodo));
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTodo({ ...editedTodo, title: e.target.value });
  };
  
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedTodo({ ...editedTodo, description: e.target.value });
  };
  
  useEffect(() => {
    setSaveDisabled(editedTodo.title === todo.title && editedTodo.description === todo.description);
  }, [editedTodo, todo]);

  const handleUpdate = () => {
    const updatedTodo = {
      ...todo,
      title: editedTodo.title,
      description: editedTodo.description
    }
    dispatch(updateTodoAsync(updatedTodo));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTodo({ title: todo.title, description: todo.description });
    setIsEditing(false);
  };
  
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <input type="checkbox" checked={todo.completed} onChange={handleCompleteChange} />
        <span className={styles.titleText} style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>{todo.title}</span>
      </div>
      <div>
        <span className={styles.descriptionText} style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>{todo.description}</span>
      </div>
      <div>
        <button className={styles.editButton} onClick={() => setIsEditing(true)}>Edit</button>
        <button className={styles.deleteButton} onClick={handleDelete}>Delete</button>
      </div>
      {isEditing &&
        <div className={styles.editForm}>
          <div>
            <input  type="text" value={editedTodo.title} onChange={handleTitleChange} />
          </div>
          <div>          
            <textarea  value={editedTodo.description} onChange={handleDescriptionChange}></textarea>
          </div>
          <div>
            <button className={styles.saveButton} onClick={handleUpdate} disabled={saveDisabled}>Save</button>
            <button className={styles.cancelButton} onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      }
    </div>
  );

};

export default TodoItem;
