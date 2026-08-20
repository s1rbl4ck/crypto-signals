"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    TradingView?: any;
  }
}

export interface ChartLine {
  title: string;
  value: number;
  color: string;
}

let tvPromise: Promise<void> | null = null;

function loadTV(): Promise<void> {
  if (window.TradingView) return Promise.resolve();
  if (!tvPromise) {
    tvPromise = new Promise((resolve) => {
      const s = document.createElement("script");
      s.src = "https://s3.tradingview.com/tv.js";
      s.async = true;
      s.onload = () => resolve();
      document.body.appendChild(s);
    });
  }
  return tvPromise;
}

export default function TradingViewChart({
  symbol,
  lines = [],
}: {
  symbol: string;
  lines?: ChartLine[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const linesKey = JSON.stringify(lines);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    const id = `tv_${Math.random().toString(36).slice(2, 10)}`;
    container.innerHTML = `<div id="${id}" style="width:100%;height:100%"></div>`;
    let cancelled = false;
    let widget: any = null;

    loadTV().then(() => {
      if (cancelled || !window.TradingView || !document.getElementById(id)) return;
      try {
        widget = new window.TradingView.widget({
          container_id: id,
          symbol,
          interval: "240",
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1",
          locale: "en",
          toolbar_bg: "#0a0a0b",
          backgroundColor: "#09090b",
          gridColor: "#18181b",
          hide_side_toolbar: false,
          allow_symbol_change: false,
          save_image: false,
          height: 420,
          width: "100%",
          studies: ["RSI@tv-basicstudies", "MACD@tv-basicstudies"],
          lines: lines.map((l) => ({
            title: l.title,
            color: l.color,
            width: 2,
            style: 2, // dashed for levels
            value: l.value,
          })),
        });
      } catch (e) {
        console.error("TradingView init failed", e);
      }
    });

    return () => {
      cancelled = true;
      if (widget && typeof widget.remove === "function") {
        try {
          widget.remove();
        } catch {
          /* ignore */
        }
      }
      container.innerHTML = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbol, linesKey]);

  return <div ref={ref} className="h-[420px] w-full" />;
}
