"use client";

import { useCallback, useEffect, useState } from "react";
import BoardCard from "@/components/BoardCard";
import CreateBoardModal from "@/components/CreateBoardModal";
import ThemeToggle from "@/components/ThemeToggle";

function getErrorMessage(err) {
  return err instanceof Error ? err.message : "Something went wrong.";
}

export default function HomePage() {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);

  const loadBoards = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/boards", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load boards.");

      const data = await res.json();
      setBoards(data.boards || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadBoards();
  }, [loadBoards]);

  return (
    <div className="max-h-full">
      <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-5">
          <div>
            <h1 className="text-xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-cyan-600 bg-clip-text text-transparent">
                TaskBoard Pro
              </span>
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-300">
              Trello-style task boards with Next.js + MySQL
            </p>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setCreateOpen(true)}
              className="rounded-xl bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-cyan-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-fuchsia-300 dark:focus:ring-fuchsia-900/40"
            >
              + New Board
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {loading ? (
          <div className="rounded-2xl border border-zinc-200 bg-white/80 p-6 text-zinc-700 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-200">
            Loading boards...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
            {error}
            <div className="mt-4">
              <button
                onClick={loadBoards}
                className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
              >
                Retry
              </button>
            </div>
          </div>
        ) : boards.length === 0 ? (
          <div className="rounded-2xl border border-zinc-200 bg-white/80 p-10 text-center shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/40">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              No boards yet
            </h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
              Create your first board to start managing tasks.
            </p>
            <button
              onClick={() => setCreateOpen(true)}
              className="mt-5 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
            >
              Create a board
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {boards.map((b) => (
              <BoardCard key={b.id} board={b} />
            ))}
          </div>
        )}
      </main>

      <CreateBoardModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={loadBoards}
      />
    </div>
  );
}
