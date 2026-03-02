"use client";

import { useEffect, useState } from "react";

type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");

  const fetchTodos = async () => {
    const res = await fetch("/api/todos");
    const data = await res.json();
    setTodos(data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async () => {
    if (!title) return;

    await fetch("/api/todos", {
      method: "POST",
      body: JSON.stringify({ title }),
    });

    setTitle("");
    fetchTodos();
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    await fetch("/api/todos", {
      method: "PUT",
      body: JSON.stringify({ id, completed: !completed }),
    });

    fetchTodos();
  };

  const deleteTodo = async (id: string) => {
    await fetch("/api/todos", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });

    fetchTodos();
  };

  return (
    <main className="min-h-screen flex flex-col items-center p-10">
      <h1 className="text-3xl font-bold mb-6">Todo App</h1>

      <div className="flex gap-2 mb-6">
        <input
          className="border px-3 py-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter todo..."
        />
        <button
          onClick={addTodo}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      <div className="w-full max-w-md">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className="flex justify-between items-center border p-3 mb-2 rounded"
          >
            <span
              onClick={() => toggleTodo(todo.id, todo.completed)}
              className={`cursor-pointer ${
                todo.completed ? "line-through text-gray-500" : ""
              }`}
            >
              {todo.title}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="text-red-500"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}