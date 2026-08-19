"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import TradingViewChart from "./TradingViewChart";

export interface Plan {
  name: string;
  symbol: string;
  price: number;
  position: string;
  zone: string;
  invalidation: string;
  target: string;
  whatToDo: string;
  note?: string;
}

const positionColor = (p: string) =>
  p.includes("Long")
    ? "text-emerald-400"
    : p.includes("Short")
      ? "text-red-400"
      : "text-zinc-300";

function Row({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-zinc-800/60 py-2 text-sm last:border-0">
      <span className="shrink-0 text-zinc-500">{label}</span>
      <span className={`text-right font-medium ${className ?? "text-zinc-200"}`}>{value}</span>
    </div>
  );
}

export default function CoinDialog({
  plan,
  open,
  onOpenChange,
}: {
  plan: Plan | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] w-[95vw] gap-3 overflow-y-auto border-zinc-800 bg-zinc-950 text-zinc-100 sm:max-w-[680px]">
        {plan && (
          <>
            <DialogHeader className="flex-row items-center justify-between space-y-0">
              <DialogTitle className="flex items-center gap-2 text-xl">
                {plan.name}
                <span className="text-sm font-normal text-zinc-500">
                  ${plan.price.toLocaleString()}
                </span>
              </DialogTitle>
              <Badge variant="outline" className={positionColor(plan.position)}>
                {plan.position}
              </Badge>
            </DialogHeader>

            <TradingViewChart symbol={`BINANCE:${plan.symbol}USDT`} />

            <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 px-4 py-1">
              <Row label="Position" value={plan.position} className={positionColor(plan.position)} />
              <Row label="Buy / Sell zone" value={plan.zone} className="text-emerald-400" />
              <Row label="Invalidation / stop" value={plan.invalidation} className="text-red-400" />
              <Row label="Target" value={plan.target} className="text-sky-400" />
            </div>

            <div className="rounded-lg border border-emerald-900/50 bg-emerald-950/20 px-4 py-3 text-sm text-zinc-200">
              <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-emerald-400">
                What to do
              </div>
              {plan.whatToDo}
            </div>

            {plan.note && (
              <p className="rounded-lg border border-zinc-800 bg-zinc-900/40 px-4 py-2 text-sm text-zinc-400">
                {plan.note}
              </p>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
