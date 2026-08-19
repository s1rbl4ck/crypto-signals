import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getNews } from "@/lib/content";

export default function NewsPage() {
  const news = getNews();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Nightly news</h1>
      <p className="text-sm text-zinc-500">Market-moving stories + lesson implications, one note per night.</p>
      <div className="space-y-4">
        {news.map((n) => (
          <Card key={n.date}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-zinc-400">Daily</Badge>
                <span className="text-xs text-zinc-500">{n.date}</span>
              </div>
              <CardTitle className="text-base">{n.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-zinc-400">
              <p className="line-clamp-4 whitespace-pre-wrap">{n.body.slice(0, 700)}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
