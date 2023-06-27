<script lang="ts">
    import { onMount } from 'svelte';
    import { todos, fetchTodos, getTodos, addTodo, updateTodo, removeTodo, toggleTodo } from './store';
    import type { Todo } from './Todo';
  
    let newTodo: Todo = {
      title: '', 
      description: '',
      completed: false
    };

    let selectedTodo: Todo = {
      title: '', 
      description: '',
      completed: false
    };
  
    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        if (selectedTodo.id) {
            selectedTodo = {
                ...selectedTodo,
                title: newTodo.title,
                description: newTodo.description
            };
            await updateTodo(selectedTodo);
        } else {
            await addTodo(newTodo);
        }
        resetInputs();
    };
    
    const resetInputs = () => {
        newTodo = { 
                title: '', 
                description: '',
                completed: false
        };

        selectedTodo = { 
                title: '', 
                description: '',
                completed: false
        };
    };

    const handleCancel = async (event: { preventDefault: () => void; }) => {
        resetInputs();
    };

    onMount(fetchTodos);

</script>

<!-- <style>
    .completed {
        text-decoration: line-through;
    }
</style> -->

<div>
    <h1>Todos</h1>
    <ul>
        {#each $todos as todo (todo.id)}
        <li style="white-space: pre-line">
            <h3 style={ todo.completed? 'text-decoration: line-through': '' }>{todo.title}</h3>
            <p style={ todo.completed? 'text-decoration: line-through': '' } class={ todo.completed? 'completed': '' } >{todo.description}</p>
            <button on:click={() => selectedTodo = todo}>Edit</button>
            <button on:click={() => removeTodo(todo)}>Delete</button>
            <button on:click={() => toggleTodo(todo)}>Toogle</button>
        </li>
        {/each}
    </ul>

    <h2>Add New Todo</h2>
    <form on:submit|preventDefault={handleSubmit}>
        <p>
            <textarea bind:value={newTodo.title} required placeholder="{ selectedTodo.id ? selectedTodo.title : "Title" }"></textarea>
        </p>
        <p>        
            <textarea bind:value={newTodo.description} required placeholder="{ selectedTodo.id ? selectedTodo.description : "Description" }"></textarea>
        </p>
        <p>
            <button type="submit">{!selectedTodo.id ? 'Add' : 'Update'}</button>
            {#if selectedTodo.id}
                <button type="button" on:click={handleCancel}>Cancel</button>
            {/if}
        </p>
    </form>
</div>
