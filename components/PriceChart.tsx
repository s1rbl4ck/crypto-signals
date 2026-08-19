"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Point {
  date: string;
  btc: number;
  eth: number;
}

function fmt(v: number) {
  if (v >= 1000) return `$${(v / 1000).toFixed(1)}k`;
  return `$${v.toFixed(2)}`;
}

export default function PriceChart({ data }: { data: Point[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid stroke="#27272a" strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fill: "#71717a", fontSize: 11 }} />
          <YAxis
            yAxisId="btc"
            tickFormatter={fmt}
            tick={{ fill: "#71717a", fontSize: 11 }}
            domain={["auto", "auto"]}
            width={52}
          />
          <YAxis yAxisId="eth" orientation="right" hide />
          <Tooltip
            contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 8 }}
            labelStyle={{ color: "#a1a1aa" }}
          />
          <Line yAxisId="btc" type="monotone" dataKey="btc" stroke="#22c55e" strokeWidth={2} dot={false} name="BTC" />
          <Line yAxisId="eth" type="monotone" dataKey="eth" stroke="#3b82f6" strokeWidth={2} dot={false} name="ETH" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
