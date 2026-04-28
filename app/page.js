"use client";

import { useCallback, useEffect, useState } from "react";
import BoardCard from "@/components/BoardCard";
import CreateBoardModal from "@/components/CreateBoardModal";

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
    <div className="max-h-full bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-5">
          <div>
            <h1 className="text-xl font-bold text-zinc-900">TaskBoard Pro</h1>
            <p className="text-sm text-zinc-600">
              Trello-style task boards with Next.js + MySQL
            </p>
          </div>

          <button
            onClick={() => setCreateOpen(true)}
            className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
          >
            + New Board
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {loading ? (
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-zinc-700">
            Loading boards...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
            {error}
            <div className="mt-4">
              <button
                onClick={loadBoards}
                className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
              >
                Retry
              </button>
            </div>
          </div>
        ) : boards.length === 0 ? (
          <div className="rounded-2xl border border-zinc-200 bg-white p-10 text-center">
            <h2 className="text-lg font-semibold text-zinc-900">No boards yet</h2>
            <p className="mt-1 text-sm text-zinc-600">
              Create your first board to start managing tasks.
            </p>
            <button
              onClick={() => setCreateOpen(true)}
              className="mt-5 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
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
