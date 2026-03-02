"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, CheckCircle2 } from "lucide-react";

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
    if (!title.trim()) return;

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
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-8">
        
        <h1 className="text-3xl font-bold text-white mb-6 tracking-tight">
          Premium Todo
        </h1>

        {/* Input */}
        <div className="flex gap-2 mb-6">
          <input
            className="flex-1 bg-white/10 border border-white/20 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
          />
          <button
            onClick={addTodo}
            className="bg-indigo-600 hover:bg-indigo-700 transition text-white px-4 py-3 rounded-xl flex items-center justify-center"
          >
            <Plus size={18} />
          </button>
        </div>

        {/* Todo List */}
        <div className="space-y-3">
          {todos.length === 0 && (
            <p className="text-gray-400 text-sm text-center">
              No tasks yet. Add your first task.
            </p>
          )}

          {todos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center justify-between bg-white/10 border border-white/10 px-4 py-3 rounded-xl hover:bg-white/20 transition"
            >
              <div
                onClick={() => toggleTodo(todo.id, todo.completed)}
                className="flex items-center gap-3 cursor-pointer"
              >
                <CheckCircle2
                  size={20}
                  className={`${
                    todo.completed
                      ? "text-green-400"
                      : "text-gray-400"
                  }`}
                />
                <span
                  className={`text-white ${
                    todo.completed
                      ? "line-through text-gray-400"
                      : ""
                  }`}
                >
                  {todo.title}
                </span>
              </div>

              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-red-400 hover:text-red-500 transition"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}