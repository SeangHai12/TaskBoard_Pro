import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "TaskBoard Pro",
  description: "A Trello-style task management app built with Next.js App Router and MySQL.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-zinc-50 via-zinc-50 to-zinc-100 dark:from-zinc-950 dark:via-zinc-950 dark:to-black">
          {/* Decorative blobs (subtle, modern) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo-500/20 via-fuchsia-500/15 to-cyan-500/15 blur-3xl dark:from-indigo-500/20 dark:via-fuchsia-500/15 dark:to-cyan-500/10"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-56 -left-40 h-[560px] w-[560px] rounded-full bg-gradient-to-tr from-emerald-500/15 via-sky-500/10 to-indigo-500/15 blur-3xl dark:from-emerald-500/10 dark:via-sky-500/10 dark:to-indigo-500/15"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-56 top-40 h-[520px] w-[520px] rounded-full bg-gradient-to-tr from-amber-500/10 via-rose-500/10 to-fuchsia-500/15 blur-3xl dark:from-amber-500/10 dark:via-rose-500/10 dark:to-fuchsia-500/10"
          />

          {children}
        </div>
      </body>
    </html>
  );
}