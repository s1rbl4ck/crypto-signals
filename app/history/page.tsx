import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PriceChart from "@/components/PriceChart";
import { getHistory, getPerformance } from "@/lib/db";
import type { SignalRecord } from "@/lib/types";

function biasColor(s: string) {
  if (s.includes("🟢")) return "text-emerald-400";
  if (s.includes("🔴")) return "text-red-400";
  return "text-zinc-400";
}

function statusBadge(s: SignalRecord) {
  if (s.status === "hit") return <Badge variant="outline" className="bg-emerald-950/40 text-emerald-400">hit ✓</Badge>;
  if (s.status === "missed") return <Badge variant="outline" className="bg-red-950/40 text-red-400">missed</Badge>;
  return <Badge variant="outline" className="text-zinc-400">pending</Badge>;
}

export default function HistoryPage() {
  const rows = getHistory();
  const perf = getPerformance();
  if (!rows.length && !perf.signals.length) {
    return <p className="text-zinc-500">History will appear here as nightly signals accumulate.</p>;
  }
  const points = rows.map((r) => ({ date: r.date, btc: r.btc, eth: r.eth }));
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Signal history</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm uppercase tracking-wide text-zinc-500">BTC vs ETH (closing)</CardTitle>
        </CardHeader>
        <CardContent>
          {points.length ? <PriceChart data={points} /> : <p className="text-zinc-500">No price rows yet.</p>}
        </CardContent>
      </Card>

      {perf.signals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm uppercase tracking-wide text-zinc-500">
              Signal performance pipeline
            </CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="text-zinc-500">
                  <TableHead>Date</TableHead>
                  <TableHead>Coin</TableHead>
                  <TableHead>Side</TableHead>
                  <TableHead>Entry</TableHead>
                  <TableHead>Stop</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Result</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {perf.signals.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="text-zinc-400">{s.date}</TableCell>
                    <TableCell className="font-medium">{s.coin}</TableCell>
                    <TableCell className={biasColor(s.bias === "long" ? "🟢" : s.bias === "short" ? "🔴" : "⚪")}>
                      {s.bias}
                    </TableCell>
                    <TableCell>{s.entry !== null ? `$${s.entry.toLocaleString()}` : "-"}</TableCell>
                    <TableCell className="text-red-400">{s.invalidation !== null ? `$${s.invalidation.toLocaleString()}` : "-"}</TableCell>
                    <TableCell className="text-sky-400">{s.target !== null ? `$${s.target.toLocaleString()}` : "-"}</TableCell>
                    <TableCell>{statusBadge(s)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-sm uppercase tracking-wide text-zinc-500">Daily bias</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="text-zinc-500">
                <TableHead>Date</TableHead>
                <TableHead>BTC</TableHead>
                <TableHead>BTC bias</TableHead>
                <TableHead>ETH</TableHead>
                <TableHead>ETH bias</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.date}>
                  <TableCell className="text-zinc-400">{r.date}</TableCell>
                  <TableCell>${r.btc.toLocaleString()}</TableCell>
                  <TableCell className={biasColor(r.btcBias)}>{r.btcBias}</TableCell>
                  <TableCell>${r.eth.toLocaleString()}</TableCell>
                  <TableCell className={biasColor(r.ethBias)}>{r.ethBias}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
