"use client";

import { useState } from "react";
import Link from "next/link";

const links: Array<[string, string]> = [
  ["/", "Today"],
  ["/history", "History"],
  ["/lessons", "Lessons"],
  ["/news", "News"],
];

export default function SiteNav() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative ml-auto">
      <nav className="hidden items-center gap-5 text-sm text-zinc-400 sm:flex">
        {links.map(([h, l]) => (
          <Link key={l} href={h} className="transition hover:text-zinc-100">{l}</Link>
        ))}
      </nav>
      <div className="sm:hidden">
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
          aria-expanded={open}
          className="rounded p-2 text-xl leading-none text-zinc-300 transition hover:bg-zinc-800"
        >
          {open ? "✕" : "☰"}
        </button>
        {open && (
          <div className="absolute right-0 top-12 flex min-w-[160px] flex-col gap-1 rounded-lg border border-zinc-800 bg-zinc-950 p-2 shadow-2xl">
            {links.map(([h, l]) => (
              <Link
                key={l}
                href={h}
                onClick={() => setOpen(false)}
                className="rounded px-3 py-2 text-sm text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100"
              >
                {l}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
