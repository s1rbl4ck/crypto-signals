"use client";

import { useState } from "react";
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
import type { Latest, Performance } from "@/lib/types";
import CoinDialog, { type Plan } from "./CoinDialog";
import TrustMeter from "./TrustMeter";

const fmt = (v: number | null) =>
  v === null ? "N/A" : v < 1 ? `$${v.toFixed(4)}` : `$${v.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

function positionLabel(bias: string) {
  if (bias.includes("🟢")) return "Long 🟢";
  if (bias.includes("🔴")) return "Short 🔴";
  return "Neutral ⚪";
}

function buildPlan(name: string, symbol: string, price: number, support: number | null, resistance: number | null, bias: string, note?: string): Plan {
  const long = bias.includes("🟢");
  const short = bias.includes("🔴");
  const neutral = !long && !short;
  const s = support;
  const r = resistance;
  let zone = "N/A";
  let invalidation = "None (range)";
  let target = "Watch both sides";
  let whatToDo = "No clear setup. Wait for a close beyond the levels before trading this one.";

  if (long && s !== null) {
    zone = `Buy near ${fmt(s)}`;
    invalidation = `Stop below ${fmt(s * 0.97)}`;
    target = r !== null ? `Target ${fmt(r)}` : `Trail above ${fmt(s * 1.05)}`;
    whatToDo = `Buy on a dip toward support ${fmt(s)}, stop just under it (${fmt(s * 0.97)}), and take profit toward resistance ${r !== null ? fmt(r) : "the recent high"}. If support breaks, the plan is off.`;
  } else if (short && r !== null) {
    zone = `Sell into ${fmt(r)}`;
    invalidation = `Stop above ${fmt(r * 1.03)}`;
    target = s !== null ? `Target ${fmt(s)}` : "Trail below";
    whatToDo = `Short/pull profit into resistance ${fmt(r)} with a stop above ${fmt(r * 1.03)}, targeting ${s !== null ? fmt(s) : "the next support"}. If resistance breaks, the plan is off.`;
  } else if (neutral && s !== null && r !== null) {
    zone = `Range ${fmt(s)} - ${fmt(r)}`;
    invalidation = `Break of ${fmt(s)} or ${fmt(r)}`;
    target = "Follow the breakout";
    whatToDo = `This one is ranging between ${fmt(s)} and ${fmt(r)}. Wait for a close above ${fmt(r)} to buy, or below ${fmt(s)} to sell. No trade inside the range.`;
  } else if (price > 0) {
    whatToDo = `Keep an eye on ${price.toLocaleString()}. No clear bias yet, so no trade until a level confirms.`;
  }

  return {
    name,
    symbol,
    price,
    position: positionLabel(bias),
    zone,
    invalidation,
    target,
    whatToDo,
    note,
  };
}

const biasColor = (s: string) =>
  s.includes("🟢") ? "text-emerald-400" : s.includes("🔴") ? "text-red-400" : "text-zinc-400";

const cellBtn =
  "inline-flex cursor-pointer items-center rounded-md px-2 py-1 font-medium transition hover:bg-zinc-800";

export default function Dashboard({ latest, perf }: { latest: Latest; perf: Performance }) {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [open, setOpen] = useState(false);

  const fgClass =
    latest.market.fearGreed >= 60
      ? "text-emerald-400"
      : latest.market.fearGreed <= 40
        ? "text-red-400"
        : "text-zinc-200";

  const openCoin = (p: Plan) => {
    setPlan(p);
    setOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold">{latest.header}</h1>
        <Badge variant="outline" className="text-zinc-400">{latest.date}</Badge>
      </div>

      <TrustMeter perf={perf} />

      <Card>
        <CardHeader>
          <CardTitle className="text-sm uppercase tracking-wide text-zinc-500">Market</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-1.5 text-sm sm:grid-cols-2">
          <div>Cap: <span className="text-zinc-200">{latest.market.cap}</span></div>
          <div>BTC domination: <span className="text-zinc-200">{latest.market.btcDom}%</span></div>
          <div>Fear &amp; Greed: <span className={fgClass}>{latest.market.fearGreed} {latest.market.fearLabel}</span></div>
          <div>Funding (8h): <span className="text-zinc-200">{latest.market.fundingBtc}{latest.market.fundingEth ? `, ETH ${latest.market.fundingEth}` : ""}</span></div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        {(["BTC", "ETH"] as const).map((sym) => {
          const seg = latest[sym === "BTC" ? "btc" : "eth"];
          return (
            <button
              key={sym}
              onClick={() =>
                openCoin(
                  buildPlan(sym, sym, 0, null, null, sym === "BTC" ? latest.btc.signal : latest.eth.signal, seg.summary),
                )
              }
              className="text-left"
            >
              <Card className="h-full transition hover:border-zinc-600">
                <CardHeader>
                  <CardTitle className="text-sm uppercase tracking-wide text-zinc-500">
                    {sym} <span className="text-zinc-600">· click for chart</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p className="text-zinc-300">{seg.summary}</p>
                  <p className={`font-medium ${biasColor(seg.signal)}`}>{seg.signal}</p>
                </CardContent>
              </Card>
            </button>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm uppercase tracking-wide text-zinc-500">
            Alts <span className="normal-case text-zinc-600">· click a coin for chart + trade plan</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
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
            <TableBody>
              {latest.alts.map((a) => (
                <TableRow key={a.symbol} className="group">
                  <TableCell>
                    <button
                      className={cellBtn}
                      onClick={() =>
                        openCoin(
                          buildPlan(a.symbol, a.symbol, a.price, a.support, a.resistance, a.bias),
                        )
                      }
                    >
                      {a.symbol}
                      {a.isAltOfDay ? <span className="ml-1 text-[10px] text-amber-400">● of day</span> : null}
                    </button>
                  </TableCell>
                  <TableCell>${a.price.toLocaleString()}</TableCell>
                  <TableCell className={a.ch24h !== null && a.ch24h >= 0 ? "text-emerald-400" : "text-red-400"}>
                    {a.ch24h !== null ? `${a.ch24h >= 0 ? "+" : ""}${a.ch24h}%` : "N/A"}
                  </TableCell>
                  <TableCell>{a.rsi ?? "N/A"}</TableCell>
                  <TableCell className="text-zinc-400">{a.trend ?? "N/A"}</TableCell>
                  <TableCell className="text-zinc-400">
                    {a.support !== null ? `$${a.support}` : "-"} / {a.resistance !== null ? `$${a.resistance}` : "-"}
                  </TableCell>
                  <TableCell className={biasColor(a.bias)}>{a.bias}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm uppercase tracking-wide text-zinc-500">Overnight news</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1.5 text-sm">
          {latest.news.length
            ? latest.news.map((n, i) => <p key={i} className="text-zinc-300">• {n}</p>)
            : <p className="text-zinc-500">No news note.</p>}
        </CardContent>
      </Card>

      {latest.lesson && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm uppercase tracking-wide text-zinc-500">Lesson</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-300">{latest.lesson}</p>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-wrap gap-3 text-sm">
        <Link href="/history" className="text-emerald-400 hover:underline">View history &amp; chart →</Link>
        <Link href="/lessons" className="text-zinc-400 hover:underline">Lessons library →</Link>
        <Link href="/news" className="text-zinc-400 hover:underline">News →</Link>
        <Link href={latest.links.tradingview} target="_blank" rel="noreferrer" className="text-zinc-400 hover:underline">TradingView ↗</Link>
      </div>

      <CoinDialog plan={plan} open={open} onOpenChange={setOpen} />
    </div>
  );
}
