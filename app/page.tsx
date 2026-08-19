import Link from "next/link";
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
import { getLatest } from "@/lib/data";
import type { CoinSnapshot } from "@/lib/types";

function biasColor(signal: string) {
  if (signal.includes("🟢")) return "text-emerald-400";
  if (signal.includes("🔴")) return "text-red-400";
  return "text-zinc-400";
}

export default function Home() {
  const l = getLatest();
  if (!l) {
    return (
      <p className="text-zinc-500">
        No signal data yet. The nightly update will populate this page.
      </p>
    );
  }
  const fgClass =
    l.market.fearGreed >= 60
      ? "text-emerald-400"
      : l.market.fearGreed <= 40
        ? "text-red-400"
        : "text-zinc-200";

  const altRow = (a: CoinSnapshot) => (
    <TableRow key={a.symbol}>
      <TableCell className="font-medium">{a.symbol}</TableCell>
      <TableCell>${a.price.toLocaleString()}</TableCell>
      <TableCell className={a.ch24h !== null && a.ch24h >= 0 ? "text-emerald-400" : "text-red-400"}>
        {a.ch24h !== null ? `${a.ch24h >= 0 ? "+" : ""}${a.ch24h}%` : "N/A"}
      </TableCell>
      <TableCell>{a.rsi ?? "N/A"}</TableCell>
      <TableCell className="text-zinc-400">{a.trend ?? "N/A"}</TableCell>
      <TableCell className="text-zinc-400">
        {a.support !== null ? `$${a.support}` : "-"} /{" "}
        {a.resistance !== null ? `$${a.resistance}` : "-"}
      </TableCell>
      <TableCell className={biasColor(a.bias ?? "")}>{a.bias ?? "-"}</TableCell>
    </TableRow>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold">{l.header}</h1>
        <Badge variant="outline" className="text-zinc-400">{l.date}</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm uppercase tracking-wide text-zinc-500">
            Market
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-1.5 text-sm sm:grid-cols-2">
          <div>Cap: <span className="text-zinc-200">{l.market.cap}</span></div>
          <div>BTC domination: <span className="text-zinc-200">{l.market.btcDom}%</span></div>
          <div>Fear &amp; Greed: <span className={fgClass}>{l.market.fearGreed} {l.market.fearLabel}</span></div>
          <div>Funding (8h): <span className="text-zinc-200">{l.market.fundingBtc}{l.market.fundingEth ? `, ETH ${l.market.fundingEth}` : ""}</span></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm uppercase tracking-wide text-zinc-500">BTC</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p className="text-zinc-300">{l.btc.summary}</p>
          <p className={`font-medium ${biasColor(l.btc.signal)}`}>{l.btc.signal}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm uppercase tracking-wide text-zinc-500">ETH</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p className="text-zinc-300">{l.eth.summary}</p>
          <p className={`font-medium ${biasColor(l.eth.signal)}`}>{l.eth.signal}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm uppercase tracking-wide text-zinc-500">Alts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="text-zinc-500">
                <TableHead>Coin</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>24h</TableHead>
                <TableHead>RSI</TableHead>
                <TableHead>Trend</TableHead>
                <TableHead>Support / Res</TableHead>
                <TableHead>Bias</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{l.alts.map(altRow)}</TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm uppercase tracking-wide text-zinc-500">Overnight news</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1.5 text-sm">
          {l.news && l.news.length
            ? l.news.map((n, i) => <p key={i} className="text-zinc-300">• {n}</p>)
            : <p className="text-zinc-500">No news note.</p>}
        </CardContent>
      </Card>

      {l.lesson && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm uppercase tracking-wide text-zinc-500">Lesson</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-300">{l.lesson}</p>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-wrap gap-3 text-sm">
        <Link href="/history" className="text-emerald-400 hover:underline">View history &amp; chart →</Link>
        <Link href="/lessons" className="text-zinc-400 hover:underline">Lessons library →</Link>
        <Link href={l.links.tradingview} target="_blank" rel="noreferrer" className="text-zinc-400 hover:underline">
          TradingView ↗
        </Link>
        <Link href={l.links.coingecko} target="_blank" rel="noreferrer" className="text-zinc-400 hover:underline">
          CoinGecko ↗
        </Link>
      </div>
    </div>
  );
}
