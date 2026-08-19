export interface CoinSnapshot {
  symbol: string;
  price: number;
  ch24h: number | null;
  ch7d: number | null;
  rsi: number | null;
  trend?: string;
  support: number | null;
  resistance: number | null;
  bias?: string;
}

export interface Latest {
  date: string; // YYYY-MM-DD
  header: string; // "Crypto Daily, Wed 19 Aug"
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
  news?: string[];
  lesson?: string;
  links: { tradingview: string; coingecko: string };
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
}

export interface NewsNote {
  date: string;
  title: string;
}
