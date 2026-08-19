import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Crypto Signals",
  description: "Nightly crypto signals, technical analysis, lessons and news.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">
        <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
          <nav className="mx-auto flex max-w-5xl items-center gap-6 px-4 py-3">
            <Link href="/" className="text-base font-semibold tracking-tight">
              Crypto<span className="text-emerald-400">Signals</span>
            </Link>
            <div className="ml-auto flex gap-5 text-sm text-zinc-400">
              <Link href="/" className="transition hover:text-zinc-100">Today</Link>
              <Link href="/history" className="transition hover:text-zinc-100">History</Link>
              <Link href="/lessons" className="transition hover:text-zinc-100">Lessons</Link>
              <Link href="/news" className="transition hover:text-zinc-100">News</Link>
            </div>
          </nav>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        <footer className="border-t border-zinc-800 py-6 text-center text-xs text-zinc-500">
          Educational only, not financial advice. Updated nightly from live market data.
        </footer>
      </body>
    </html>
  );
}
