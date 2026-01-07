import React from 'react';
import { create } from 'zustand';
import { Box, Heading, Text, Card, Flex, Button, TextField } from '@radix-ui/themes';

// 1. Define Store
interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface TodoStore {
  todos: Todo[];
  addTodo: (text: string) => void;
  toggleTodo: (id: number) => void;
  removeTodo: (id: number) => void;
}

const useTodoStore = create<TodoStore>((set) => ({
  todos: [
    { id: 1, text: 'Learn React', completed: true },
    { id: 2, text: 'Learn Zustand', completed: false },
  ],
  addTodo: (text) => set((state) => ({
    todos: [...state.todos, { id: Date.now(), text, completed: false }]
  })),
  toggleTodo: (id) => set((state) => ({
    todos: state.todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
  })),
  removeTodo: (id) => set((state) => ({
    todos: state.todos.filter(t => t.id !== id)
  })),
}));

function TodoList() {
  const { todos, toggleTodo, removeTodo } = useTodoStore();

  return (
    <Flex direction="column" gap="2" mt="4">
      {todos.length === 0 && <Text color="gray">No todos yet.</Text>}
      {todos.map(todo => (
        <Card key={todo.id}>
          <Flex align="center" justify="between">
            <Flex align="center" gap="3">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                style={{ width: 18, height: 18, cursor: 'pointer' }}
              />
              <Text style={{ textDecoration: todo.completed ? 'line-through' : 'none', color: todo.completed ? 'gray' : 'inherit' }}>
                {todo.text}
              </Text>
            </Flex>
            <Button color="red" variant="ghost" onClick={() => removeTodo(todo.id)}>Delete</Button>
          </Flex>
        </Card>
      ))}
    </Flex>
  );
}

function AddTodo() {
  const addTodo = useTodoStore(state => state.addTodo);
  const [text, setText] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      addTodo(text);
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Flex gap="2">
        <TextField.Root
          placeholder="New todo..."
          value={text}
          onChange={e => setText(e.target.value)}
          style={{ flexGrow: 1 }}
        />
        <Button type="submit">Add</Button>
      </Flex>
    </form>
  );
}

function Stats() {
  const todos = useTodoStore(state => state.todos);
  const completed = todos.filter(t => t.completed).length;

  return (
    <Card style={{ backgroundColor: 'var(--accent-3)' }}>
      <Flex gap="4">
        <Box>
          <Text size="1" weight="bold">TOTAL</Text>
          <Heading>{todos.length}</Heading>
        </Box>
        <Box>
          <Text size="1" weight="bold">COMPLETED</Text>
          <Heading>{completed}</Heading>
        </Box>
      </Flex>
    </Card>
  );
}

export default function StateManagementExample() {
  return (
    <Box p="6">
      <Heading mb="4">State Management (Zustand)</Heading>
      <Text as="p" mb="5">
        Zustand is a small, fast, and scalable bearbones state-management solution.
        It uses a simplified flux principle.
      </Text>

      <Flex gap="6" align="start" wrap="wrap">
        <Box width="300px">
          <Heading size="3" mb="3">Todo App</Heading>
          <AddTodo />
          <TodoList />
        </Box>

        <Box width="200px">
          <Heading size="3" mb="3">Global Stats</Heading>
          <Stats />
          <Text size="1" color="gray" mt="2">
            This component subscribes to the same store but is rendered separately.
          </Text>
        </Box>
      </Flex>
    </Box>
  );
}
