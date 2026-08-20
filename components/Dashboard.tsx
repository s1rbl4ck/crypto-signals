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
import type { CoinSnapshot, Latest, Performance } from "@/lib/types";
import CoinDialog, { type Indicator, type Plan } from "./CoinDialog";
import TrustMeter from "./TrustMeter";

const fmt = (v: number | null) =>
  v === null ? "N/A" : v < 1 ? `$${v.toFixed(4)}` : `$${v.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

function positionLabel(bias: string) {
  if (bias.includes("🟢")) return "Long 🟢";
  if (bias.includes("🔴")) return "Short 🔴";
  return "Neutral ⚪";
}

function indicatorsFor(c: CoinSnapshot): Indicator[] {
  const tone = (v: number | null | undefined, good: (x: number) => boolean) =>
    v == null ? "neutral" : good(v) ? "good" : "bad";
  const out: Indicator[] = [];
  if (c.rsi != null)
    out.push({ k: "RSI", v: String(Math.round(c.rsi)), tone: tone(c.rsi, (x) => 45 <= x && x <= 65) });
  if (c.adx != null)
    out.push({ k: "ADX", v: String(c.adx), tone: tone(c.adx, (x) => x >= 22) });
  if (c.stochrsi != null)
    out.push({ k: "StochRSI", v: String(Math.round(c.stochrsi)), tone: tone(c.stochrsi, (x) => 20 <= x && x <= 80) });
  if (c.bbp != null)
    out.push({ k: "Boll %B", v: `${Math.round(c.bbp)}%`, tone: tone(c.bbp, (x) => 25 <= x && x <= 75) });
  if (c.obv != null)
    out.push({ k: "OBV", v: `${c.obv >= 0 ? "+" : ""}${c.obv}%`, tone: tone(c.obv, (x) => x > 0) });
  if (c.macd != null)
    out.push({ k: "MACD", v: c.macd >= 0 ? "bullish" : "bearish", tone: tone(c.macd, (x) => x > 0) });
  return out;
}

function buildPlan(c: CoinSnapshot, note?: string): Plan {
  const long = c.bias.includes("🟢");
  const short = c.bias.includes("🔴");
  const s = c.support, r = c.resistance;
  let zone = "N/A";
  let invalidation = "None (range)";
  let target = "Watch both sides";
  let whatToDo = "No clear setup. Wait for a close beyond the levels before trading this one.";

  if (long && s !== null) {
    zone = `Buy near ${fmt(s)}`;
    invalidation = `Stop below ${fmt(s * 0.97)}`;
    target = r !== null ? `Target ${fmt(r)}` : "Trail above";
    whatToDo = `Buy on a dip toward support ${fmt(s)}, stop just under it (${fmt(s * 0.97)}), and take profit toward resistance ${r !== null ? fmt(r) : "the recent high"}. If support breaks, the plan is off.`;
  } else if (short && r !== null) {
    zone = `Sell into ${fmt(r)}`;
    invalidation = `Stop above ${fmt(r * 1.03)}`;
    target = s !== null ? `Target ${fmt(s)}` : "Trail below";
    whatToDo = `Short or take profit into resistance ${fmt(r)} with a stop above ${fmt(r * 1.03)}, targeting ${s !== null ? fmt(s) : "the next support"}. If resistance breaks, the plan is off.`;
  } else if (s !== null && r !== null) {
    zone = `Range ${fmt(s)} - ${fmt(r)}`;
    invalidation = `Break of ${fmt(s)} or ${fmt(r)}`;
    target = "Follow the breakout";
    whatToDo = `This one is ranging between ${fmt(s)} and ${fmt(r)}. Wait for a close above ${fmt(r)} to buy, or below ${fmt(s)} to sell. No trade inside the range.`;
  } else if (c.price > 0) {
    whatToDo = `Keep an eye on ${c.price.toLocaleString()}. No clear bias yet, so no trade until a level confirms.`;
  }

  return {
    name: c.symbol,
    symbol: c.symbol,
    price: c.price,
    position: positionLabel(c.bias),
    zone,
    invalidation,
    target,
    whatToDo,
    note,
    grade: c.grade,
    indicators: indicatorsFor(c),
  };
}

const biasColor = (s: string) =>
  s.includes("🟢") ? "text-emerald-400" : s.includes("🔴") ? "text-red-400" : "text-zinc-400";
const gradeColor = (g?: string) =>
  g === "A" ? "bg-emerald-600 text-white" : g === "B" ? "bg-sky-600 text-white" : "bg-zinc-700 text-zinc-200";
const cellBtn = "inline-flex cursor-pointer items-center rounded-md px-2 py-1 font-medium transition hover:bg-zinc-800";
const chTone = (v: number | null | undefined) =>
  v != null && v >= 0 ? "text-emerald-400" : "text-red-400";

export default function Dashboard({ latest, perf }: { latest: Latest; perf: Performance }) {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [open, setOpen] = useState(false);
  const openCoin = (p: Plan) => { setPlan(p); setOpen(true); };

  const fgClass =
    latest.market.fearGreed >= 60 ? "text-emerald-400" : latest.market.fearGreed <= 40 ? "text-red-400" : "text-zinc-200";
  const btcSnap = latest.alts.find((a) => a.symbol === "BTC");
  const ethSnap = latest.alts.find((a) => a.symbol === "ETH");
  const pos = latest.positioning;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold">{latest.header}</h1>
        <Badge variant="outline" className="text-zinc-400">{latest.date}</Badge>
      </div>

      <TrustMeter perf={perf} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-sm uppercase tracking-wide text-zinc-500">Market</CardTitle></CardHeader>
          <CardContent className="grid gap-1.5 text-sm sm:grid-cols-2">
            <div>Cap: <span className="text-zinc-200">{latest.market.cap}</span></div>
            <div>BTC domination: <span className="text-zinc-200">{latest.market.btcDom}%</span></div>
            <div>Fear &amp; Greed: <span className={fgClass}>{latest.market.fearGreed} {latest.market.fearLabel}</span></div>
            <div>Funding (8h): <span className="text-zinc-200">{latest.market.fundingBtc}{latest.market.fundingEth ? `, ETH ${latest.market.fundingEth}` : ""}</span></div>
          </CardContent>
        </Card>

        {pos && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm uppercase tracking-wide text-zinc-500">Whales &amp; the invisible side</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-1.5 text-sm sm:grid-cols-2">
              <div>Open interest (BTC): <span className="text-zinc-200">{pos.btcOi?.toLocaleString()} BTC</span></div>
              <div>Funding: <span className="text-zinc-200">{pos.fundingBtc}</span></div>
              <div>Accounts long/short: <span className="text-zinc-200">{pos.longShort}</span></div>
              <div>Top traders long/short: <span className="text-zinc-200">{pos.topTrader}</span></div>
              <div className="col-span-2 text-xs text-zinc-500">
                Positions of leveraged traders (futures). &gt;1 = longs dominate. Free feeds don&apos;t expose true on-chain whale wallets, so this is the visible proxy for whale lean.
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {(!!latest.movers?.gainers.length || !!latest.trending?.length) && (
        <div className="flex flex-wrap gap-3">
          {!!latest.movers?.gainers.length && (
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="text-xs uppercase tracking-wide text-zinc-500">Hot today</span>
              {latest.movers.gainers.map((g) => (
                <span key={g.symbol} className="rounded-full border border-zinc-800 bg-zinc-900/60 px-2.5 py-1 text-zinc-300">
                  {g.symbol} <span className={chTone(g.ch)}>{g.ch >= 0 ? "+" : ""}{g.ch}%</span>
                </span>
              ))}
            </div>
          )}
          {!!latest.trending?.length && (
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="text-xs uppercase tracking-wide text-zinc-500">Trending</span>
              {latest.trending.slice(0, 4).map((t) => (
                <button
                  key={t.symbol}
                  onClick={() => {
                    const c = latest.alts.find((a) => a.symbol === t.symbol);
                    if (c) openCoin(buildPlan(c));
                  }}
                  className="rounded-full border border-amber-900/50 bg-amber-950/20 px-2.5 py-1 text-amber-300 transition hover:bg-amber-950/40"
                >
                  {t.symbol}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {latest.marketMemory && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm uppercase tracking-wide text-zinc-500">
              Market memory <span className="normal-case text-zinc-600">· {latest.marketMemory.span} ({latest.marketMemory.years}y, BTC seasonality)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-1.5 text-sm sm:grid-cols-2">
            <div>Best month on average: <span className="text-emerald-400">{latest.marketMemory.bestMonth?.n ?? ""} {(latest.marketMemory.bestMonth?.avg ?? 0) > 0 ? "+" : ""}{latest.marketMemory.bestMonth?.avg ?? 0}%</span></div>
            <div>Worst month: <span className="text-red-400">{latest.marketMemory.worstMonth?.n} {latest.marketMemory.worstMonth?.avg}%</span></div>
            <div>Best year: <span className="text-zinc-200">{latest.marketMemory.bestYear}</span></div>
            <div>Worst year: <span className="text-zinc-200">{latest.marketMemory.worstYear}</span></div>
            <div className="col-span-2 text-xs text-zinc-500">{latest.marketMemory.note}</div>
          </CardContent>
        </Card>
      )}

      {(btcSnap || ethSnap) && (
        <div className="grid gap-4 sm:grid-cols-2">
          {btcSnap && (
            <button key="BTC" onClick={() => openCoin(buildPlan(btcSnap, latest.btc.summary))} className="text-left">
              <Card className="h-full transition hover:border-zinc-600">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-wide text-zinc-500">
                    BTC <span className="text-zinc-600">· click for chart</span>
                    {btcSnap.grade && <span className={`ml-auto rounded px-1.5 text-xs ${gradeColor(btcSnap.grade)}`}>G{btcSnap.grade}</span>}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p className="text-zinc-300">{latest.btc.summary}</p>
                  <p className={`font-medium ${biasColor(latest.btc.signal)}`}>{latest.btc.signal}</p>
                </CardContent>
              </Card>
            </button>
          )}
          {ethSnap && (
            <button key="ETH" onClick={() => openCoin(buildPlan(ethSnap, latest.eth.summary))} className="text-left">
              <Card className="h-full transition hover:border-zinc-600">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-wide text-zinc-500">
                    ETH <span className="text-zinc-600">· click for chart</span>
                    {ethSnap.grade && <span className={`ml-auto rounded px-1.5 text-xs ${gradeColor(ethSnap.grade)}`}>G{ethSnap.grade}</span>}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p className="text-zinc-300">{latest.eth.summary}</p>
                  <p className={`font-medium ${biasColor(latest.eth.signal)}`}>{latest.eth.signal}</p>
                </CardContent>
              </Card>
            </button>
          )}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-sm uppercase tracking-wide text-zinc-500">
            Market list <span className="normal-case text-zinc-600">· click a coin for chart + trade plan</span>
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
                <TableHead>Grade</TableHead>
                <TableHead>Support / Res</TableHead>
                <TableHead>Bias</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {latest.alts.map((a) => (
                <TableRow key={a.symbol} className="group">
                  <TableCell>
                    <button className={cellBtn} onClick={() => openCoin(buildPlan(a))}>
                      {a.symbol}
                      {a.isAltOfDay ? <span className="ml-1 text-[10px] text-amber-400">● today</span> : null}
                    </button>
                  </TableCell>
                  <TableCell>${a.price.toLocaleString()}</TableCell>
                  <TableCell className={a.ch24h !== null && a.ch24h >= 0 ? "text-emerald-400" : "text-red-400"}>
                    {a.ch24h !== null ? `${a.ch24h >= 0 ? "+" : ""}${a.ch24h}%` : "N/A"}
                  </TableCell>
                  <TableCell>{a.rsi ?? "N/A"}</TableCell>
                  <TableCell><span className={`rounded px-1.5 text-xs ${gradeColor(a.grade)}`}>{a.grade ?? "-"}</span></TableCell>
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
        <CardHeader><CardTitle className="text-sm uppercase tracking-wide text-zinc-500">Overnight news</CardTitle></CardHeader>
        <CardContent className="space-y-1.5 text-sm">
          {latest.news.length
            ? latest.news.map((n, i) => <p key={i} className="text-zinc-300">• {n}</p>)
            : <p className="text-zinc-500">No news note.</p>}
        </CardContent>
      </Card>

      {latest.lesson && (
        <Card>
          <CardHeader><CardTitle className="text-sm uppercase tracking-wide text-zinc-500">Lesson</CardTitle></CardHeader>
          <CardContent><p className="text-sm text-zinc-300">{latest.lesson}</p></CardContent>
        </Card>
      )}

      <div className="flex flex-wrap gap-3 text-sm">
        <Link href="/history" className="text-emerald-400 hover:underline">History &amp; trust ledger →</Link>
        <Link href="/lessons" className="text-zinc-400 hover:underline">Lessons →</Link>
        <Link href="/news" className="text-zinc-400 hover:underline">News →</Link>
        <Link href={latest.links.tradingview} target="_blank" rel="noreferrer" className="text-zinc-400 hover:underline">TradingView ↗</Link>
      </div>

      <CoinDialog plan={plan} open={open} onOpenChange={setOpen} />
    </div>
  );
}
