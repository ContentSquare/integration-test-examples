<script lang="ts">
  import { Todo } from "./store";
  export let todo: Todo;
</script>
<li>
    <h3>{todo.title}</h3>
    <p>{todo.description}</p>
</li>