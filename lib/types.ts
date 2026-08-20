export interface CoinSnapshot {
  symbol: string;
  price: number;
  ch24h: number | null;
  ch7d: number | null;
  rsi: number | null;
  trend?: string;
  support: number | null;
  resistance: number | null;
  bias: string;
  isAltOfDay?: boolean;
  adx?: number | null;
  stochrsi?: number | null;
  bbp?: number | null;
  obv?: number | null;
  macd?: number | null;
  grade?: string;
}

export interface Positioning {
  btcOi?: number;
  longShort?: number;
  topTrader?: number;
  fundingBtc?: string;
  fundingEth?: string;
}

export interface Mover {
  symbol: string;
  ch: number;
}

export interface Movers {
  gainers: Mover[];
  losers: Mover[];
}

export interface TrendingItem {
  symbol: string;
  name: string;
  rank: number | null;
}

export interface MarketMemory {
  span?: string;
  years?: number;
  bestMonth?: { n: string; avg: number };
  worstMonth?: { n: string; avg: number };
  bestYear?: number | null;
  worstYear?: number | null;
  note?: string;
}

export interface Latest {
  date: string;
  header: string;
  market: {
    cap: string;
    btcDom: number;
    ethDom: number | null;
    fearGreed: number;
    fearLabel: string;
    fundingBtc: string;
    fundingEth: string | null;
  };
  btc: { summary: string; signal: string };
  eth: { summary: string; signal: string };
  alts: CoinSnapshot[];
  news: string[];
  lesson: string | null;
  links: { tradingview: string; coingecko: string };
  positioning?: Positioning | null;
  movers?: Movers;
  trending?: TrendingItem[];
  marketMemory?: MarketMemory | null;
}

export interface SignalRecord {
  id: string;
  date: string;
  coin: string;
  bias: "long" | "short" | "neutral";
  entry: number | null;
  invalidation: number | null;
  target: number | null;
  status: "pending" | "hit" | "missed";
  checkDate: string | null;
  note?: string;
}

export interface Performance {
  trusted: boolean;
  requiredHits: number;
  hits: number;
  missed: number;
  pending: number;
  totalSignals: number;
  signals: SignalRecord[];
}

export interface HistoryRow {
  date: string;
  btc: number;
  eth: number;
  btcBias: string;
  ethBias: string;
}

export interface Lesson {
  date: string;
  num: number;
  title: string;
  path: string;
  body: string;
}

export interface NewsNote {
  date: string;
  title: string;
  path: string;
  body: string;
}
