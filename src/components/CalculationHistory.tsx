"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Trash2, Clock } from "lucide-react";
import type { CalculationEntry } from "@/hooks/use-calculation-history";

interface CalculationHistoryProps {
  history: CalculationEntry[];
  onClear: () => void;
  formatEntry: (entry: CalculationEntry) => {
    inputs: string;
    result: string;
  };
}

export function CalculationHistory({
  history,
  onClear,
  formatEntry,
}: CalculationHistoryProps) {
  if (history.length === 0) {
    return null;
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "À l'instant";
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffMins < 1440) return `Il y a ${Math.floor(diffMins / 60)} h`;
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <Separator />
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Historique ({history.length})
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={onClear}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Effacer
          </Button>
        </div>

        <div className="space-y-1">
          {history.map((entry) => {
            const formatted = formatEntry(entry);
            return (
              <Card key={entry.id} className="bg-muted/50">
                <CardContent className="pt-1">
                  <div className="flex">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-1 flex-wrap">
                        <Badge variant="secondary" className="text-xs">
                          {formatted.inputs}
                        </Badge>
                        <span className="text-muted-foreground text-xs">→</span>
                        <span className="font-semibold text-sm">
                          {formatted.result}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(entry.timestamp)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
}
