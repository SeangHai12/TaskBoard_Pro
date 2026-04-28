"use client";

function statusLabel(status) {
  if (status === "todo") return "To Do";
  if (status === "progress") return "In Progress";
  return "Done";
}

/**
 * TaskCard
 * One task card with edit/delete and move buttons.
 */
export default function TaskCard({ task, onEdit, onDelete, onMove }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="truncate text-sm font-semibold text-zinc-900">
              {task.title}
            </h4>
            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-700">
              {statusLabel(task.status)}
            </span>
          </div>
          {task.description ? (
            <p className="mt-1 line-clamp-3 text-sm text-zinc-600">
              {task.description}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          onClick={onEdit}
          className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100"
        >
          Delete
        </button>

        {/* Move buttons (simple alternative to drag-and-drop) */}
        <div className="ml-auto flex items-center gap-2">
          {task.status !== "todo" && (
            <button
              onClick={() => onMove("todo")}
              className="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-zinc-800"
            >
              Move to To Do
            </button>
          )}
          {task.status !== "progress" && (
            <button
              onClick={() => onMove("progress")}
              className="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-zinc-800"
            >
              Move to In Progress
            </button>
          )}
          {task.status !== "done" && (
            <button
              onClick={() => onMove("done")}
              className="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-zinc-800"
            >
              Move to Done
            </button>
          )}
        </div>
      </div>

      <div className="mt-3 text-xs text-zinc-500">
        Created {new Date(task.created_at).toLocaleString()}
      </div>
    </div>
  );
}
