import { DatabaseSync } from "node:sqlite";
import * as path from "path";
import type {
  CoinSnapshot,
  HistoryRow,
  Latest,
  MarketMemory,
  Movers,
  Performance,
  Positioning,
  SignalRecord,
  TrendingItem,
} from "./types";

const DB_PATH = path.join(process.cwd(), "db", "site.db");

let _db: DatabaseSync | null = null;

function db(): DatabaseSync {
  if (!_db) {
    _db = new DatabaseSync(DB_PATH);
  }
  return _db;
}

function kv(key: string): string | null {
  try {
    const r = db().prepare("SELECT value FROM kv WHERE key=?").get(key) as
      | { value: string }
      | undefined;
    return r ? r.value : null;
  } catch {
    return null;
  }
}

function kvJson<T>(key: string, fallback: T): T {
  const v = kv(key);
  if (!v) return fallback;
  try {
    return JSON.parse(v) as T;
  } catch {
    return fallback;
  }
}

export function getLatest(): Latest | null {
  try {
    const date = kv("date");
    if (!date) return null;
    const alts = (
      db().prepare("SELECT * FROM alts ORDER BY is_alt_of_day DESC, coin").all() as any[]
    ).map(
      (r): CoinSnapshot => ({
        symbol: r.coin,
        price: r.price,
        ch24h: r.ch24h,
        ch7d: r.ch7d,
        rsi: r.rsi,
        trend: r.trend,
        support: r.support,
        resistance: r.resistance,
        bias: r.bias,
        isAltOfDay: !!r.is_alt_of_day,
        adx: r.adx,
        stochrsi: r.stochrsi,
        bbp: r.bbp,
        obv: r.obv,
        macd: r.macd,
        grade: r.grade,
      }),
    );
    return {
      date,
      header: kv("header") ?? "",
      market: kvJson("market", {
        cap: "N/A",
        btcDom: 0,
        ethDom: null,
        fearGreed: 0,
        fearLabel: "",
        fundingBtc: "N/A",
        fundingEth: null,
      }),
      btc: { summary: kv("btc_summary") ?? "", signal: kv("btc_signal") ?? "" },
      eth: { summary: kv("eth_summary") ?? "", signal: kv("eth_signal") ?? "" },
      alts,
      news: kvJson<string[]>("news", []),
      lesson: kv("lesson"),
      links: kvJson("links", { tradingview: "", coingecko: "" }),
      positioning: kvJson<Positioning | null>("positioning", null),
      movers: kvJson<Movers>("movers", { gainers: [], losers: [] }),
      trending: kvJson<TrendingItem[]>("trending", []),
      marketMemory: kvJson<MarketMemory | null>("marketMemory", null),
    };
  } catch {
    return null;
  }
}

export function getHistory(): HistoryRow[] {
  try {
    return (
      db()
        .prepare("SELECT date, btc, eth, btc_bias, eth_bias FROM history ORDER BY date")
        .all() as any[]
    ).map((r) => ({
      date: r.date,
      btc: r.btc,
      eth: r.eth,
      btcBias: r.btc_bias,
      ethBias: r.eth_bias,
    }));
  } catch {
    return [];
  }
}

export function getPerformance(): Performance {
  try {
    const signals = (
      db().prepare("SELECT * FROM signals ORDER BY date").all() as any[]
    ).map(
      (r): SignalRecord => ({
        id: r.id,
        date: r.date,
        coin: r.coin,
        bias: r.bias,
        entry: r.entry,
        invalidation: r.invalidation,
        target: r.target,
        status: r.status,
        checkDate: r.check_date,
        note: r.note,
      }),
    );
    const hits = signals.filter((s) => s.status === "hit").length;
    const missed = signals.filter((s) => s.status === "missed").length;
    const pending = signals.filter((s) => s.status === "pending").length;
    return {
      trusted: hits >= 10,
      requiredHits: 10,
      hits,
      missed,
      pending,
      totalSignals: signals.length,
      signals,
    };
  } catch {
    return {
      trusted: false,
      requiredHits: 10,
      hits: 0,
      missed: 0,
      pending: 0,
      totalSignals: 0,
      signals: [],
    };
  }
}
