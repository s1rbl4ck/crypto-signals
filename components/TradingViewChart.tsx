"use client";

// TradingView advanced chart as a plain iframe. Using the widgetembed URL (no
// tv.js global, no widget lifecycle) so the chart mounts/unmounts cleanly in a
// dialog — reopening never leaves stale state or crashes the page.
export default function TradingViewChart({ symbol }: { symbol: string }) {
  const src =
    "https://s.tradingview.com/widgetembed/?" +
    `symbol=${encodeURIComponent(symbol)}` +
    "&interval=240&timezone=Etc%2FUTC&theme=dark&style=1&locale=en" +
    "&hide_side_toolbar=0&allow_symbol_change=0&save_image=0" +
    "&studies=%2Fstudies%2Ftv-basicstudies%2FRsi%2Fv1%2F&studies=%2Fstudies%2Ftv-basicstudies%2FMaCross%2Fv1%2F";
  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-md border border-zinc-800 bg-zinc-900/40">
      <iframe
        src={src}
        title="TradingView chart"
        className="h-full w-full border-0"
        loading="lazy"
        allowFullScreen
      />
    </div>
  );
}
