import type { CoinSnapshot } from "@/lib/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// RSI (Relative Strength Index) is a momentum gauge from 0 to 100.
// Below 30 = the coin has sold off hard (oversold). Above 70 = it has
// risen fast (overbought). The heatmap colors each coin by where its RSI
// sits today so you can see momentum across the board at a glance.

function rsiZone(rsi: number): { label: string; cls: string } {
  if (rsi < 30)
    return {
      label: "Oversold",
      cls: "border-emerald-600/40 bg-emerald-600/25 text-emerald-300",
    };
  if (rsi < 40)
    return {
      label: "Weak",
      cls: "border-sky-600/40 bg-sky-600/25 text-sky-300",
    };
  if (rsi < 60)
    return {
      label: "Neutral",
      cls: "border-zinc-700 bg-zinc-800 text-zinc-200",
    };
  if (rsi < 70)
    return {
      label: "Strong",
      cls: "border-amber-600/40 bg-amber-600/25 text-amber-300",
    };
  if (rsi < 80)
    return {
      label: "Overbought",
      cls: "border-orange-600/40 bg-orange-600/25 text-orange-300",
    };
  return {
    label: "Very overbought",
    cls: "border-red-600/50 bg-red-600/30 text-red-300",
  };
}

const LEGEND = [
  { label: "Oversold", cls: "bg-emerald-600/60" },
  { label: "Weak", cls: "bg-sky-600/60" },
  { label: "Neutral", cls: "bg-zinc-600" },
  { label: "Strong", cls: "bg-amber-600/60" },
  { label: "Overbought", cls: "bg-orange-600/60" },
  { label: "Very overbought", cls: "bg-red-600/70" },
];

export default function MomentumHeatmap({ alts }: { alts: CoinSnapshot[] }) {
  const withRsi = alts.filter((a) => a.rsi != null);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm uppercase tracking-wide text-zinc-500">
          RSI momentum heatmap{" "}
          <span className="normal-case text-zinc-600">
            · how hot or cold each tracked coin is right now
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {withRsi.length === 0 ? (
          <p className="text-sm text-zinc-500">No RSI data yet.</p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {withRsi.map((a) => {
                const zone = rsiZone(a.rsi as number);
                return (
                  <div
                    key={a.symbol}
                    className={`flex items-center justify-between rounded-lg border px-3 py-2 ${zone.cls}`}
                  >
                    <div>
                      <div className="text-sm font-semibold">{a.symbol}</div>
                      <div className="text-[11px] opacity-80">{zone.label}</div>
                    </div>
                    <div className="text-lg font-bold">{Math.round(a.rsi as number)}</div>
                  </div>
                );
              })}
            </div>
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-zinc-400">
              {LEGEND.map((l) => (
                <span key={l.label} className="inline-flex items-center gap-1">
                  <span className={`inline-block h-2.5 w-2.5 rounded-sm ${l.cls}`} />
                  {l.label}
                </span>
              ))}
            </div>
            <p className="text-xs leading-relaxed text-zinc-500">
              What this does: RSI (Relative Strength Index) shows momentum from 0 to 100, and the
              heatmap lets you scan all your coins at once. What to do: red coins have rallied hard
              (overbought), so chasing them is risky and a pullback toward support is safer; green
              coins have sold off (oversold) and may be setting up for a bounce. Always pair this
              with the support/resistance and bias in the table above and click a coin for a full
              plan.
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
