"use client";

function statusLabel(status) {
  if (status === "todo") return "To Do";
  if (status === "progress") return "In Progress";
  return "Done";
}

function statusChipClasses(status) {
  if (status === "todo") {
    return "bg-amber-500/10 text-amber-800 ring-1 ring-amber-500/20 dark:bg-amber-500/15 dark:text-amber-200 dark:ring-amber-500/20";
  }
  if (status === "progress") {
    return "bg-sky-500/10 text-sky-800 ring-1 ring-sky-500/20 dark:bg-sky-500/15 dark:text-sky-200 dark:ring-sky-500/20";
  }
  return "bg-emerald-500/10 text-emerald-800 ring-1 ring-emerald-500/20 dark:bg-emerald-500/15 dark:text-emerald-200 dark:ring-emerald-500/20";
}


export default function TaskCard({ task, onEdit, onDelete, onMove }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:shadow-md hover:ring-2 hover:ring-fuchsia-200/60 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:ring-fuchsia-900/30">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              {task.title}
            </h4>
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusChipClasses(
                task.status
              )}`}
            >
              {statusLabel(task.status)}
            </span>
          </div>
          {task.description ? (
            <p className="mt-1 line-clamp-3 text-sm text-zinc-600 dark:text-zinc-300">
              {task.description}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          onClick={onEdit}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900 dark:focus:ring-zinc-800"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 shadow-sm transition hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-300 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200 dark:hover:bg-red-950/60"
        >
          Delete
        </button>

        {/* Move buttons (simple alternative to drag-and-drop) */}
        <div className="ml-auto flex items-center gap-2">
          {task.status !== "todo" && (
            <button
              onClick={() => onMove("todo")}
              className="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
            >
              Move to To Do
            </button>
          )}
          {task.status !== "progress" && (
            <button
              onClick={() => onMove("progress")}
              className="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
            >
              Move to In Progress
            </button>
          )}
          {task.status !== "done" && (
            <button
              onClick={() => onMove("done")}
              className="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
            >
              Move to Done
            </button>
          )}
        </div>
      </div>

      <div className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
        Created {new Date(task.created_at).toLocaleString()}
      </div>
    </div>
  );
}
