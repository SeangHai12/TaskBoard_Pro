"use client";

import Link from "next/link";


export default function BoardCard({ board }) {
  return (
    <Link
      href={`/boards/${board.id}`}
      className="group block rounded-2xl border border-zinc-200 bg-white/80 p-5 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md hover:ring-2 hover:ring-fuchsia-200/70 dark:border-zinc-800 dark:bg-zinc-950/40 dark:hover:ring-fuchsia-900/30"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold text-zinc-900 group-hover:text-zinc-950 dark:text-zinc-50 dark:group-hover:text-white">
            {board.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-300">
            {board.description || "No description"}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-gradient-to-r from-indigo-500/15 via-fuchsia-500/15 to-cyan-500/15 px-3 py-1 text-xs font-semibold text-zinc-800 ring-1 ring-zinc-200 dark:from-indigo-500/20 dark:via-fuchsia-500/20 dark:to-cyan-500/15 dark:text-zinc-100 dark:ring-zinc-800">
          Open
        </span>
      </div>

      <div className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">
        Created {new Date(board.created_at).toLocaleString()}
      </div>
    </Link>
  );
}
