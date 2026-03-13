import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Camera, Upload, Clock, BarChart3, Loader2 } from "lucide-react";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import FallingLeaves from "@/components/FallingLeaves";
import { getScans, getScanStats, ScanRecord } from "@/lib/database";

const Dashboard = () => {
  const [stats, setStats] = useState({ totalScans: 0, uniqueDiseases: 0 });
  const [recentScans, setRecentScans] = useState<ScanRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [statsData, scansData] = await Promise.all([
          getScanStats(),
          getScans(),
        ]);
        setStats(statsData);
        setRecentScans(scansData.slice(0, 3));
      } catch (error) {
        console.error("Dashboard data load error:", error);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const formatRelativeTime = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffDay > 0) return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`;
    if (diffHr > 0) return `${diffHr} hr${diffHr > 1 ? "s" : ""} ago`;
    if (diffMin > 0) return `${diffMin} min${diffMin > 1 ? "s" : ""} ago`;
    return "Just now";
  };

  return (
    <div className="flex min-h-screen flex-col bg-background pb-20 relative">
      <FallingLeaves />
      <TopBar />

      <main className="flex-1 px-4 py-6 relative z-10">
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-2xl font-bold">Diagnostic Lab</h1>
          <p className="mt-1 text-sm text-muted-foreground">Upload or capture a leaf for analysis</p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          className="mb-8 grid grid-cols-2 gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="data-grid-cell rounded-lg">
            <p className="text-xs text-muted-foreground">Total Scans</p>
            <p className="font-mono text-2xl font-semibold mt-1">
              {loading ? "..." : stats.totalScans}
            </p>
          </div>
          <div className="data-grid-cell rounded-lg">
            <p className="text-xs text-muted-foreground">Diseases Found</p>
            <p className="font-mono text-2xl font-semibold mt-1">
              {loading ? "..." : stats.uniqueDiseases}
            </p>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="mb-8 grid grid-cols-2 gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Link
            to="/scan"
            className="flex flex-col items-center gap-3 rounded-lg bg-primary p-6 text-primary-foreground transition-transform active:scale-[0.98]"
          >
            <Camera className="h-8 w-8" />
            <span className="font-display text-sm font-semibold">Capture</span>
          </Link>
          <Link
            to="/scan"
            className="flex flex-col items-center gap-3 rounded-lg border border-border bg-card p-6 transition-transform active:scale-[0.98]"
          >
            <Upload className="h-8 w-8 text-accent" />
            <span className="font-display text-sm font-semibold">Upload</span>
          </Link>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Recent Scans
          </h2>
          <div className="space-y-2">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground bg-card/10 rounded-xl border border-dashed border-border/50">
                <Loader2 className="h-6 w-6 animate-spin mb-2 opacity-30" />
                <p className="text-[10px] uppercase tracking-widest font-bold">Syncing Records...</p>
              </div>
            ) : recentScans.length === 0 ? (
              <div className="text-center py-8 border border-dashed rounded-xl bg-card/20">
                <p className="text-xs text-muted-foreground">No recent activity detected.</p>
              </div>
            ) : (
              recentScans.map((item, i) => (
                <div key={item.id || i} className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded bg-secondary">
                      <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.plant}</p>
                      <p className="text-xs text-muted-foreground">{item.disease}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-sm font-semibold">{item.confidence}%</p>
                    <p className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatRelativeTime(item.created_at)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </main>

      {/* Large scan CTA at bottom */}
      <div className="fixed bottom-16 left-0 right-0 px-4 pb-2 z-10">
        <Link to="/scan">
          <motion.div
            className="capture-zone flex items-center justify-center gap-2 rounded-full border border-primary/20 py-4 text-center"
            whileTap={{ scale: 0.98 }}
          >
            <Camera className="h-5 w-5 text-primary" />
            <span className="font-display text-sm font-semibold text-primary">Scan New Leaf</span>
          </motion.div>
        </Link>
      </div>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
