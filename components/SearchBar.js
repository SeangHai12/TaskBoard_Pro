"use client";


export default function SearchBar({ value, onChange }) {
  return (
    <div className="w-full">
      <label className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
        Search tasks
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600 dark:focus:ring-zinc-800"
        placeholder='Type to search by title (example: "API")...'
      />
    </div>
  );
}
