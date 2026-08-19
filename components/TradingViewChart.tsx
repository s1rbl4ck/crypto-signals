"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    TradingView?: any;
  }
}

export default function TradingViewChart({ symbol }: { symbol: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let widget: any = null;
    let cancelled = false;

    const init = () => {
      if (cancelled || !ref.current || !window.TradingView) return;
      widget = new window.TradingView.widget({
        autosize: true,
        symbol,
        interval: "240",
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        backgroundColor: "#09090b",
        gridColor: "#18181b",
        hide_side_toolbar: false,
        allow_symbol_change: false,
        save_image: false,
        studies: ["RSI@tv-basicstudies", "MACD@tv-basicstudies"],
      });
    };

    if (window.TradingView) {
      init();
    } else {
      const s = document.createElement("script");
      s.src = "https://s3.tradingview.com/tv.js";
      s.async = true;
      s.onload = init;
      document.body.appendChild(s);
    }
    return () => {
      cancelled = true;
    };
  }, [symbol]);

  return <div ref={ref} className="h-[420px] w-full" />;
}
