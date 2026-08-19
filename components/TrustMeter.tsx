import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Performance } from "@/lib/types";

export default function TrustMeter({ perf }: { perf: Performance }) {
  const pct = Math.min(100, (perf.hits / Math.max(perf.requiredHits, 1)) * 100);
  const remaining = Math.max(0, perf.requiredHits - perf.hits);
  return (
    <Card className={perf.trusted ? "border-emerald-700/60" : ""}>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm uppercase tracking-wide text-zinc-500">
          Signal trust
        </CardTitle>
        <Badge
          variant={perf.trusted ? "default" : "outline"}
          className={perf.trusted ? "bg-emerald-600 text-white" : "text-zinc-400"}
        >
          {perf.trusted ? "✓ Trusted" : "Building trust"}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="text-zinc-300">
              {perf.hits} / {perf.requiredHits} confirmed target hits
            </span>
            <span className="text-zinc-500">{Math.round(pct)}%</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-zinc-300">{perf.hits} hit</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-red-400" />
            <span className="text-zinc-300">{perf.missed} missed</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-zinc-500" />
            <span className="text-zinc-300">{perf.pending} pending</span>
          </span>
        </div>
        {!perf.trusted && (
          <p className="text-xs text-zinc-500">
            {remaining} more confirmed hits until signals are marked trusted. Each signal&apos;s
            entry, stop and target are checked automatically against what the market actually did.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
