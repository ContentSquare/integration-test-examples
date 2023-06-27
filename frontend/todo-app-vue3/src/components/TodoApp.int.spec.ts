import { flushPromises, mount, VueWrapper } from '@vue/test-utils'
import TodoApp from '@/components/TodoApp.vue'
import { createTestingPinia } from '@pinia/testing'
import type { Todo } from '@/models/todo'
import { useTodosStore } from '@/stores/store'
import { getTodos, addTodo } from '@/api/todo-service'

jest.mock('@/api/todo-service');

const todoItems: Todo[] = [
  {
    id: 0,
    title: 'Grocery shopping',
    description: '1. A pack of carrots\n2. Eggs',
    completed: false
  },
  {
    id: 1,
    title: 'Integration Test',
    description: '10 tests',
    completed: false
  },
  {
    id: 2,
    title: 'Pick up kid from school',
    description: '',
    completed: true
  }
];

const newItem: Todo = {
  id: 4,
  title: 'Piano',
  description: 'Practice Fur Elise for 30 minutes',
  completed: false
};

describe('TodoApp.vue', () => {
  let wrapper: VueWrapper<unknown, any>;
  let store: any;

  beforeEach(async () => {
    (getTodos as jest.Mock).mockResolvedValue(todoItems.slice());

    wrapper = mount(TodoApp, {
      global: {
        plugins: [
          createTestingPinia({
            stubActions: false
          })
        ]
      }
    });
    store = useTodosStore();
    flushPromises();
  })

  afterEach(() => {
    jest.clearAllMocks();
  })

  it('should render component without errors', () => {
    expect(wrapper.exists()).toBe(true);
  })

  it('should display Todo list', () => {
    const todoList = wrapper.findComponent({ name: 'TodoList' });
    expect(todoList.exists()).toBe(true);

    const items = wrapper.findAll('.item');
    expect(items.length).toBe(3);

    const completedTodos = items.filter((item) => item.attributes('completed') === 'true');
    expect(completedTodos.length).toBe(1);

    const incompletedTodos = items.filter((item) => item.attributes('completed') === 'false');
    expect(incompletedTodos.length).toBe(2);
  })

  it('should able to add new todo item', async () => {
    let items = wrapper.findAll('.item');
    expect(items.length).toBe(3);
    
    (addTodo as jest.Mock) = jest.fn().mockImplementation(() => {
      return Promise.resolve(newItem);
    });

    const todoForm = wrapper.findComponent({ name: 'TodoForm' });

    await todoForm.find('[qa-id="title"]').setValue(newItem.title);
    await todoForm.find('[qa-id="description"]').setValue(newItem.description);
    await todoForm.find('[qa-id="add-button"]').trigger('submit');

    flushPromises();

    items = wrapper.findAll('.item');
    expect(items.length).toBe(4);
  })

  it('should able to delete a todo item', async () => {
    let items = wrapper.findAll('.item');
    expect(items.length).toBe(3);

    await items[0].find('[qa-id="delete-button"]').trigger('click');
    flushPromises();

    items = wrapper.findAll('.item');
    expect(items.length).toBe(2);
  })

  it('should able to toogle a todo item', async () => {
    let items = wrapper.findAll('.item');
    expect(items.length).toBe(3);

    let completedTodos = items.filter((item) => item.attributes('completed') === 'true');
    expect(completedTodos.length).toBe(1);

    let incompletedTodos = items.filter((item) => item.attributes('completed') === 'false');
    expect(incompletedTodos.length).toBe(2);

    await items[0].find('[qa-id="toogle-button"]').trigger('click');
    flushPromises();

    completedTodos = items.filter((item) => item.attributes('completed') === 'true');
    expect(completedTodos.length).toBe(2);

    incompletedTodos = items.filter((item) => item.attributes('completed') === 'false');
    expect(incompletedTodos.length).toBe(1);
  })

  it('should able to edit a todo item', async () => {
    let firstTodoItem = wrapper.find('.item');
    let title = () => firstTodoItem.find('.todo-title').text();
    expect(title()).toBe(todoItems[0].title);

    await firstTodoItem.find('[qa-id="edit-button"]').trigger('click');
    flushPromises();

    const newTitle = 'New title';
    await wrapper.find('[qa-id="edit-title"]').setValue(newTitle);
    await wrapper.find('[qa-id="edit-save-button"]').trigger('click');
    flushPromises();
    expect(title()).toBe(newTitle);
  })
})
