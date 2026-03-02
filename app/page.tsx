"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  CheckCircle2,
  Moon,
  Sun,
  Pencil,
} from "lucide-react";
import { useTheme } from "next-themes";

type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const { theme, setTheme } = useTheme();

  const fetchTodos = async () => {
    const res = await fetch("/api/todos");
    const data = await res.json();
    setTodos(data);
    setLoading(false);
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

  const updateTodo = async (id: string) => {
    await fetch("/api/todos", {
      method: "POST",
      body: JSON.stringify({ id, title: editText }),
    });
    setEditingId(null);
    fetchTodos();
  };

  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-300 dark:from-slate-900 dark:to-slate-800 p-8 transition-all">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {completedCount} of {todos.length} tasks completed
            </p>
          </div>

          <button
            onClick={() =>
              setTheme(theme === "dark" ? "light" : "dark")
            }
            className="p-2 rounded-lg bg-gray-200 dark:bg-slate-700"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        {/* Add Todo */}
        <div className="flex gap-2 mb-6">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add new task..."
            className="flex-1 px-4 py-3 rounded-xl border dark:bg-slate-800"
          />
          <button
            onClick={addTodo}
            className="bg-indigo-600 text-white px-4 py-3 rounded-xl"
          >
            <Plus size={18} />
          </button>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-12 rounded-xl bg-gray-300 dark:bg-slate-700 animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && todos.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 dark:text-gray-400">
              🎉 You’re all caught up!
            </p>
          </div>
        )}

        {/* Todo List */}
        <AnimatePresence>
          {todos.map((todo) => (
            <motion.div
              key={todo.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex justify-between items-center bg-white dark:bg-slate-800 p-4 rounded-xl shadow mb-3"
            >
              <div className="flex items-center gap-3">
                <CheckCircle2
                  size={20}
                  onClick={() =>
                    toggleTodo(todo.id, todo.completed)
                  }
                  className={
                    todo.completed
                      ? "text-green-500 cursor-pointer"
                      : "text-gray-400 cursor-pointer"
                  }
                />

                {editingId === todo.id ? (
                  <input
                    value={editText}
                    onChange={(e) =>
                      setEditText(e.target.value)
                    }
                    onBlur={() => updateTodo(todo.id)}
                    className="border px-2 py-1 rounded"
                  />
                ) : (
                  <span
                    className={
                      todo.completed
                        ? "line-through text-gray-400"
                        : ""
                    }
                  >
                    {todo.title}
                  </span>
                )}
              </div>

              <div className="flex gap-3">
                <Pencil
                  size={18}
                  onClick={() => {
                    setEditingId(todo.id);
                    setEditText(todo.title);
                  }}
                  className="cursor-pointer text-blue-500"
                />
                <Trash2
                  size={18}
                  onClick={() => deleteTodo(todo.id)}
                  className="cursor-pointer text-red-500"
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </main>
  );
}