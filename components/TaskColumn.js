"use client";

import TaskCard from "@/components/TaskCard";


export default function TaskColumn({
  title,
  status,
  tasks,
  onEdit,
  onDelete,
  onMove,
}) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-zinc-200 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/40">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{title}</h3>
        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
          {tasks.length}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 overflow-auto pr-1">
        {tasks.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-200 p-4 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
            No tasks
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={() => onEdit(task)}
              onDelete={() => onDelete(task.id)}
              onMove={(newStatus) => onMove(task, newStatus)}
            />
          ))
        )}
      </div>

      {/* small hint for beginners */}
      <div className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
        Status: <span className="font-medium">{status}</span>
      </div>
    </div>
  );
}
