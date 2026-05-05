"use client";

import * as React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import TaskColumn from "@/components/TaskColumn";
import CreateTaskModal from "@/components/CreateTaskModal";
import EditTaskModal from "@/components/EditTaskModal";
import EditBoardModal from "@/components/EditBoardModal";
import SearchBar from "@/components/SearchBar";
import ThemeToggle from "@/components/ThemeToggle";

function getErrorMessage(err) {
  return err instanceof Error ? err.message : "Something went wrong.";
}

function titleForStatus(status) {
  if (status === "todo") return "To Do";
  if (status === "progress") return "In Progress";
  return "Done";
}

export default function BoardDetailPage({ params }) {
  const { id } = React.use(params);
  const boardId = Number(id);

  const [board, setBoard] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editBoardOpen, setEditBoardOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const loadBoardAndTasks = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const boardRes = await fetch(`/api/boards/${boardId}`, { cache: "no-store" });
      if (!boardRes.ok) throw new Error("Failed to load board.");
      const boardData = await boardRes.json();
      setBoard(boardData.board || null);

      const tasksRes = await fetch(`/api/tasks?boardId=${boardId}`, { cache: "no-store" });
      if (!tasksRes.ok) throw new Error("Failed to load tasks.");
      const tasksData = await tasksRes.json();
      setTasks(tasksData.tasks || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [boardId]);

  useEffect(() => {
    if (!boardId || Number.isNaN(boardId)) {
      setError("Invalid board id.");
      setLoading(false);
      return;
    }

    void loadBoardAndTasks();
  }, [boardId, loadBoardAndTasks]);

  const filteredTasks = useMemo(() => {
    const q = search.trim().toLowerCase();

    return tasks.filter((t) => {
      const matchesSearch = q ? t.title.toLowerCase().includes(q) : true;
      const matchesStatus = statusFilter === "all" ? true : t.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [tasks, search, statusFilter]);

  const tasksByStatus = useMemo(() => {
    const by = { todo: [], progress: [], done: [] };
    for (const t of filteredTasks) by[t.status].push(t);
    return by;
  }, [filteredTasks]);

  async function deleteTask(taskId) {
    if (!confirm("Delete this task?")) return;

    await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
    void loadBoardAndTasks();
  }

  async function moveTask(task, newStatus) {
    await fetch(`/api/tasks/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: task.title,
        description: task.description,
        status: newStatus,
      }),
    });

    void loadBoardAndTasks();
  }

  async function deleteBoard() {
    if (!confirm("Delete this board? (All tasks will be deleted too)")) return;

    const res = await fetch(`/api/boards/${boardId}`, { method: "DELETE" });
    if (res.ok) window.location.href = "/";
  }

  if (loading) {
    return (
      <div className="min-h-full">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="rounded-2xl border border-zinc-200 bg-white/80 p-6 text-zinc-700 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-200">
            Loading board...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-full">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
            {error}
            <div className="mt-4 flex gap-2">
              <Link
                href="/"
                className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-200 dark:hover:bg-zinc-950"
              >
                Back
              </Link>
              <button
                onClick={loadBoardAndTasks}
                className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="min-h-full">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="rounded-2xl border border-zinc-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/40">
            Board not found.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full">
      <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/60">
        <div className="mx-auto max-w-6xl px-4 py-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <Link
                href="/"
                className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
              >
                ← All boards
              </Link>
              <h1 className="mt-1 text-xl font-black tracking-tight">
                <span className="bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-cyan-600 bg-clip-text text-transparent">
                  {board.title}
                </span>
              </h1>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                {board.description || "No description"}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                onClick={() => setCreateOpen(true)}
                className="rounded-xl bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-cyan-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-fuchsia-300 dark:focus:ring-fuchsia-900/40"
              >
                + New Task
              </button>
              <button
                onClick={() => setEditBoardOpen(true)}
                className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-800 shadow-sm transition hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-100 dark:hover:bg-zinc-950"
              >
                Edit board
              </button>
              <button
                onClick={deleteBoard}
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 shadow-sm transition hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-300 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200 dark:hover:bg-red-950/60"
              >
                Delete board
              </button>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
            <SearchBar value={search} onChange={setSearch} />

            <div className="w-full">
              <label className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                Filter by status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-zinc-900 outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-100 dark:focus:border-zinc-600 dark:focus:ring-zinc-800"
              >
                <option value="all">All</option>
                <option value="todo">To Do</option>
                <option value="progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/40">
              <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                Counters
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                {["todo", "progress", "done"].map((s) => (
                  <div
                    key={s}
                    className="rounded-xl bg-zinc-50 p-2 dark:bg-zinc-900/60"
                  >
                    <div className="text-xs text-zinc-600 dark:text-zinc-300">
                      {titleForStatus(s)}
                    </div>
                    <div className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                      {tasksByStatus[s].length}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <TaskColumn
            title="To Do"
            status="todo"
            tasks={tasksByStatus.todo}
            onEdit={(t) => {
              setSelectedTask(t);
              setEditOpen(true);
            }}
            onDelete={deleteTask}
            onMove={moveTask}
          />

          <TaskColumn
            title="In Progress"
            status="progress"
            tasks={tasksByStatus.progress}
            onEdit={(t) => {
              setSelectedTask(t);
              setEditOpen(true);
            }}
            onDelete={deleteTask}
            onMove={moveTask}
          />

          <TaskColumn
            title="Done"
            status="done"
            tasks={tasksByStatus.done}
            onEdit={(t) => {
              setSelectedTask(t);
              setEditOpen(true);
            }}
            onDelete={deleteTask}
            onMove={moveTask}
          />
        </div>
      </main>

      <CreateTaskModal
        open={createOpen}
        boardId={boardId}
        onClose={() => setCreateOpen(false)}
        onCreated={loadBoardAndTasks}
      />

      <EditTaskModal
        open={editOpen}
        task={selectedTask}
        onClose={() => {
          setEditOpen(false);
          setSelectedTask(null);
        }}
        onUpdated={loadBoardAndTasks}
      />

      <EditBoardModal
        open={editBoardOpen}
        board={board}
        onClose={() => setEditBoardOpen(false)}
        onUpdated={loadBoardAndTasks}
      />
    </div>
  );
}
