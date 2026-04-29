"use client";

import Link from "next/link";


export default function BoardCard({ board }) {
  return (
    <Link
      href={`/boards/${board.id}`}
      className="group block rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold text-zinc-900 group-hover:text-zinc-950">
            {board.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-zinc-600">
            {board.description || "No description"}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
          Open
        </span>
      </div>

      <div className="mt-4 text-xs text-zinc-500">
        Created {new Date(board.created_at).toLocaleString()}
      </div>
    </Link>
  );
}
