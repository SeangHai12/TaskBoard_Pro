"use client";

/**
 * SearchBar
 * Simple input for real-time searching.
 */
export default function SearchBar({ value, onChange }) {
  return (
    <div className="w-full">
      <label className="text-sm font-medium text-zinc-800">Search tasks</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 outline-none focus:border-zinc-400"
        placeholder="Type to search by title..."
      />
    </div>
  );
}
