import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getLessons } from "@/lib/content";
import { getPerformance } from "@/lib/db";

export default function LessonsPage() {
  const lessons = getLessons();
  const perf = getPerformance();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Learning library</h1>
      <p className="text-sm text-zinc-500">
        One topic per day, applied to how we read signals. {lessons.length} lessons so far.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {lessons.map((l) => (
          <Card key={l.date}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-emerald-400">Lesson {l.num}</Badge>
                <span className="text-xs text-zinc-500">{l.date}</span>
              </div>
              <CardTitle className="text-base">{l.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-zinc-400">
              <p className="line-clamp-4 whitespace-pre-wrap">{l.body.slice(0, 600)}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      {perf.trusted && (
        <p className="text-sm text-emerald-400">Signals are flagged trusted (10 confirmed hits).</p>
      )}
    </div>
  );
}
