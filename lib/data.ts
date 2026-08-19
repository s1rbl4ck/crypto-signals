import fs from "fs";
import path from "path";
import type { HistoryRow, Latest, Lesson, NewsNote } from "./types";

const dir = path.join(process.cwd(), "data");

function readJson<T>(file: string): T | null {
  try {
    const raw = fs.readFileSync(path.join(dir, file), "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function getLatest(): Latest | null {
  return readJson<Latest>("latest.json");
}

export function getHistory(): HistoryRow[] {
  return readJson<HistoryRow[]>("history.json") ?? [];
}

export function getLessons(): Lesson[] {
  return readJson<Lesson[]>("lessons.json") ?? [];
}

export function getNews(): NewsNote[] {
  return readJson<NewsNote[]>("news.json") ?? [];
}
