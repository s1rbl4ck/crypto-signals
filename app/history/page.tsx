import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PriceChart from "@/components/PriceChart";
import { getHistory } from "@/lib/data";

function biasColor(s: string) {
  if (s.includes("🟢")) return "text-emerald-400";
  if (s.includes("🔴")) return "text-red-400";
  return "text-zinc-400";
}

export default function HistoryPage() {
  const rows = getHistory();
  if (!rows.length) {
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
          <PriceChart data={points} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm uppercase tracking-wide text-zinc-500">Daily bias</CardTitle>
        </CardHeader>
        <CardContent>
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
