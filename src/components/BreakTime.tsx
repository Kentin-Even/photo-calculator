"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "./ui/separator";
import { useCalculationHistory } from "@/hooks/use-calculation-history";
import { CalculationHistory } from "@/components/CalculationHistory";

export function BreakTime() {
  const [shutterSpeed, setShutterSpeed] = useState<string>("");
  const [cadence, setCadence] = useState<string>("");
  const [breakTime, setBreakTime] = useState<number | null>(null);
  const { history, saveCalculation, clearHistory } =
    useCalculationHistory("break-time");

  const calculateBreakTime = () => {
    const obturateur = parseFloat(shutterSpeed);
    const fps = parseFloat(cadence);

    if (isNaN(obturateur) || isNaN(fps) || fps === 0 || obturateur === 0) {
      setBreakTime(null);
      return;
    }

    // 1/t = Obturateur / (360 × Cadence)
    // donc t = (360 × Cadence) / Obturateur
    const t = (360 * fps) / obturateur;

    setBreakTime(t);

    // Sauvegarder dans l'historique
    saveCalculation(
      { "Obturateur (°)": obturateur, "Cadence (fps)": fps },
      t,
      formatTime(t)
    );
  };

  const formatTime = (seconds: number): string => {
    if (seconds < 1) {
      return `${(seconds * 1000).toFixed(2)} ms`;
    }
    if (seconds < 60) {
      return `${seconds.toFixed(2)} s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} min ${remainingSeconds.toFixed(2)} s`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calculateur de Temps de Pause</CardTitle>
        <CardDescription>
          Calculez le temps de pause optimal pour votre prise de vue
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <Card className="bg-muted">
          <CardContent>
            <p className="text-center font-mono text-lg">
              1/t = Obturateur / (360 × Cadence)
            </p>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="shutter">Vitesse d'obturateur (en degrés)</Label>
            <Input
              id="shutter"
              type="number"
              step="1"
              value={shutterSpeed}
              onChange={(e) => setShutterSpeed(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && calculateBreakTime()}
              placeholder="Ex: 180"
            />
            <p className="text-xs text-muted-foreground">
              Valeur courante: 180° (angle d'obturateur standard)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cadence">Cadence (fps - images par seconde)</Label>
            <Input
              id="cadence"
              type="number"
              step="0.1"
              value={cadence}
              onChange={(e) => setCadence(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && calculateBreakTime()}
              placeholder="Ex: 24"
            />
          </div>

          <Button onClick={calculateBreakTime} className="w-full" size="lg">
            Calculer
          </Button>

          {breakTime !== null && (
            <Card className="border-2 border-green-500 bg-green-50 dark:bg-green-950/20">
              <CardContent className="pt-6 space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Temps de pause (t)
                </p>
                <p className="text-4xl font-bold text-green-700 dark:text-green-400">
                  {formatTime(breakTime)}
                </p>
                <p className="text-xs text-muted-foreground">
                  ({breakTime.toFixed(4)} secondes)
                </p>
              </CardContent>
            </Card>
          )}
        </div>
        <CalculationHistory
          history={history}
          onClear={clearHistory}
          formatEntry={(entry) => ({
            inputs: `${entry.inputs["Obturateur (°)"]}° @ ${entry.inputs["Cadence (fps)"]}fps`,
            result: entry.formattedResult || formatTime(Number(entry.result)),
          })}
        />
        <Separator />
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Exemples courants</h3>

          <div className="grid gap-3">
            <Card className="bg-muted/50">
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Cinéma standard</p>
                    <p className="text-sm text-muted-foreground">
                      180° à 24 fps
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {formatTime((360 * 24) / 180)}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-muted/50">
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Vidéo PAL</p>
                    <p className="text-sm text-muted-foreground">
                      180° à 25 fps
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {formatTime((360 * 25) / 180)}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-muted/50">
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Vidéo NTSC</p>
                    <p className="text-sm text-muted-foreground">
                      180° à 30 fps
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {formatTime((360 * 30) / 180)}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-muted/50">
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Slow motion</p>
                    <p className="text-sm text-muted-foreground">
                      180° à 120 fps
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {formatTime((360 * 120) / 180)}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
