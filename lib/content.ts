import * as fs from "fs";
import * as path from "path";
import type { Lesson, NewsNote } from "./types";

const base = process.cwd();

interface Md {
  date: string;
  title: string;
  file: string;
  body: string;
}

function listMds(sub: string): Md[] {
  const dir = path.join(base, "content", sub);
  if (!fs.existsSync(dir)) return [];
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .sort();
  return files.map((f) => {
    const body = fs.readFileSync(path.join(dir, f), "utf-8");
    const first = (body.split("\n").find((l) => /^\s*#/.test(l)) ?? "").replace(/^#+\s*/, "").trim();
    return { date: f.slice(0, 10), title: first || f.replace(".md", ""), file: f, body };
  });
}

export function getLessons(): Lesson[] {
  return listMds("lessons")
    .reverse()
    .map((m, i) => ({
      date: m.date,
      num: i + 1,
      title: m.title,
      path: `/lessons/${m.file.replace(".md", "")}`,
      body: m.body,
    }));
}

export function getNews(): NewsNote[] {
  return listMds("news")
    .reverse()
    .map((m) => ({
      date: m.date,
      title: m.title,
      path: `/news/${m.file.replace(".md", "")}`,
      body: m.body,
    }));
}

export function getLessonBody(slug: string): Lesson | null {
  const match = listMds("lessons").find((m) => m.file.replace(".md", "") === slug);
  return match
    ? { date: match.date, num: 0, title: match.title, path: `/lessons/${slug}`, body: match.body }
    : null;
}

export function getNewsBody(slug: string): NewsNote | null {
  const match = listMds("news").find((m) => m.file.replace(".md", "") === slug);
  return match
    ? { date: match.date, title: match.title, path: `/news/${slug}`, body: match.body }
    : null;
}
