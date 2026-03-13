import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, BarChart3, Loader2 } from "lucide-react";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import { getScans, ScanRecord } from "@/lib/database";

const HistoryPage = () => {
  const [history, setHistory] = useState<ScanRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getScans()
      .then(setHistory)
      .catch((err) => console.error("Failed to fetch history:", err))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };
  return (
    <div className="flex min-h-screen flex-col bg-background pb-20">
      <TopBar />
      <main className="flex-1 px-4 py-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="font-display text-2xl font-bold mb-1">Scan History</h1>
          <p className="text-sm text-muted-foreground mb-6">Previous diagnostic results</p>

          <div className="space-y-2">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin mb-4 opacity-50" />
                <p className="text-sm">Loading scan history...</p>
              </div>
            ) : history.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 border border-dashed rounded-xl bg-card/30">
                <BarChart3 className="h-8 w-8 text-muted-foreground mb-3 opacity-20" />
                <p className="text-sm text-muted-foreground">No scans found yet.</p>
              </div>
            ) : (
              history.map((item, i) => (
                <motion.div
                  key={item.id || i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3"
                >
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
                      {formatDate(item.created_at)}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </main>
      <BottomNav />
    </div>
  );
};

export default HistoryPage;
