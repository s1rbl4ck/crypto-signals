import Dashboard from "@/components/Dashboard";
import MomentumHeatmap from "@/components/MomentumHeatmap";
import { getLatest, getPerformance } from "@/lib/db";

export default function Home() {
  const latest = getLatest();
  const perf = getPerformance();
  if (!latest) {
    return (
      <p className="text-zinc-500">
        No signal data yet. The nightly update will populate this page.
      </p>
    );
  }
  return (
    <div className="space-y-6">
      <Dashboard latest={latest} perf={perf} />
      <MomentumHeatmap alts={latest.alts} />
    </div>
  );
}
