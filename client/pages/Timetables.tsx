import { Button } from "@/components/ui/button";
import { TimetableGrid } from "@/features/timetable/TimetableGrid";
import ConflictHighlighter from "@/features/timetable/ConflictHighlighter";
import { useGetTimetableByIdQuery, useListTimetablesQuery } from "@/store/api";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Bot, Plus } from "lucide-react";
import { NewGenerationButton } from "@/components/creator/NewGenerationButton";

export default function TimetablesPage() {
  const { data: timetablesRaw, isLoading } = useListTimetablesQuery({});
  const timetables = Array.isArray(timetablesRaw) ? timetablesRaw : (timetablesRaw && typeof timetablesRaw === 'object' && 'results' in timetablesRaw ? (timetablesRaw as any).results : timetablesRaw && typeof timetablesRaw === 'object' && 'data' in timetablesRaw ? (timetablesRaw as any).data : []);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { data: detailRaw } = useGetTimetableByIdQuery(selectedId!, { skip: !selectedId });
  const detail = detailRaw ?? undefined;
  const detailClasses = Array.isArray((detail as any)?.classes) ? (detail as any).classes : [];

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Timetables</h1>
        <div className="flex gap-2">
          <Button asChild className="gradient-primary">
            <Link to="/timetables/create">
              <Bot className="h-4 w-4 mr-2" />
              Create New Timetable
            </Link>
          </Button>
          <NewGenerationButton />
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-4">
        <div className="md:col-span-1 rounded-xl border p-4">
          <div className="text-sm font-semibold mb-2">All Timetables</div>
          <div className="space-y-2">
            {isLoading ? (
              <div className="text-sm text-muted-foreground">Loading...</div>
            ) : timetables.length === 0 ? (
              <div className="text-sm text-muted-foreground">None yet</div>
            ) : (
              timetables.map((t: any) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedId(t.id)}
                  className={`w-full text-left rounded-md border p-3 transition-colors ${selectedId === t.id ? "bg-secondary" : "hover:bg-accent"}`}
                >
                  <div className="font-medium">{t.name}</div>
                  <div className="text-xs text-muted-foreground flex gap-3 mt-1">
                    <span>{t.status}</span>
                    <span>QS: {t.quality_score?.toFixed?.(2) ?? "-"}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="md:col-span-3 space-y-4">
          {!selectedId ? (
            <div className="rounded-xl border p-6 text-sm text-muted-foreground">Select a timetable to view the grid.</div>
          ) : !detail ? (
            <div className="rounded-xl border p-6 text-sm text-muted-foreground">Loading timetable...</div>
          ) : (
            <>
              <ConflictHighlighter classes={detailClasses as any} />
              <div className="rounded-xl border p-4">
                <TimetableGrid classes={detailClasses as any} highlightConflicts />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
