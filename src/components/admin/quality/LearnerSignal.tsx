import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetchJson, formatPct } from "../dashboardShared";

type SignalRow = {
  id: string;
  sectionId: string;
  sectionName: string | null;
  level: string;
  orderNumber: number;
  completions: number;
  avgCorrectPct: number | null;
};

export const LearnerSignal = ({ apiBase, onOpen }: { apiBase: string; onOpen: (exerciseId: string) => void }) => {
  const [rows, setRows] = useState<SignalRow[] | null>(null);
  const [ascending, setAscending] = useState(true);

  useEffect(() => {
    fetchJson<{ exercises: SignalRow[] }>(`${apiBase}/admin-learner-signal`)
      .then((d) => setRows(d.exercises))
      .catch(() => setRows([]));
  }, [apiBase]);

  const sorted = useMemo(
    () => [...(rows || [])].sort((a, b) => ((a.avgCorrectPct ?? 0) - (b.avgCorrectPct ?? 0)) * (ascending ? 1 : -1)),
    [rows, ascending],
  );

  return (
    <Card className="p-4 md:p-6">
      <h3 className="text-lg font-semibold">Learner signal</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Live exercises with at least 5 completions (excluded accounts left out). Very low average correct may mean an
        ambiguous exercise; very high may mean a trivial one. Informational only.
      </p>
      {!rows ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">No exercise has 5 completions yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-muted-foreground">
                <th className="py-2 pr-3 font-medium">Section</th>
                <th className="py-2 pr-3 font-medium">#</th>
                <th className="py-2 pr-3 font-medium text-right">Completions</th>
                <th className="py-2 pr-3 font-medium text-right">
                  <Button variant="ghost" size="sm" className="h-6 px-1 text-xs gap-1" onClick={() => setAscending(!ascending)}>
                    Avg correct {ascending ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                  </Button>
                </th>
                <th className="py-2" />
              </tr>
            </thead>
            <tbody>
              {sorted.map((r) => (
                <tr key={r.id} className="border-b last:border-0">
                  <td className="py-2 pr-3"><Badge className="mr-1">{r.level}</Badge>{r.sectionName || r.sectionId}</td>
                  <td className="py-2 pr-3 text-muted-foreground">{r.orderNumber}</td>
                  <td className="py-2 pr-3 text-right">{r.completions}</td>
                  <td className="py-2 pr-3 text-right font-medium">{formatPct(r.avgCorrectPct)}</td>
                  <td className="py-2 text-right">
                    <Button variant="outline" size="sm" onClick={() => onOpen(r.id)}>Detail</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};
