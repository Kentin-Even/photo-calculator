"use client";

import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCalculationHistory } from "@/hooks/use-calculation-history";
import { CalculationHistory } from "@/components/CalculationHistory";

export default function DepthOfField() {
  const [distance, setDistance] = useState<string>("");
  const [hyperfocal, setHyperfocal] = useState<string>("");
  const [ppn, setPpn] = useState<number | null>(null);
  const [dpn, setDpn] = useState<number | null>(null);
  const [pdc, setPdc] = useState<number | null>(null);
  const { history, saveCalculation, clearHistory } =
    useCalculationHistory("depth-of-field");

  const calculateDepthOfField = () => {
    const d = parseFloat(distance);
    const hy = parseFloat(hyperfocal);

    if (isNaN(d) || isNaN(hy) || hy === 0) {
      setPpn(null);
      setDpn(null);
      setPdc(null);
      return;
    }

    // Vérifier que Hy > d pour éviter la division par zéro dans DPN
    if (hy <= d) {
      setPpn(null);
      setDpn(null);
      setPdc(null);
      return;
    }

    // PPN = (d × Hy) / (Hy + d)
    const ppnValue = (d * hy) / (hy + d);
    setPpn(ppnValue);

    // DPN = (d × Hy) / (Hy - d)
    const dpnValue = (d * hy) / (hy - d);
    setDpn(dpnValue);

    // PDC = (2 × Hy × d²) / (Hy² - d²)
    const dSquared = d * d;
    const hySquared = hy * hy;
    const pdcValue = (2 * hy * dSquared) / (hySquared - dSquared);
    setPdc(pdcValue);

    // Sauvegarder dans l'historique
    saveCalculation(
      { "Distance (m)": d, "Hyperfocale (m)": hy },
      pdcValue,
      `PPN: ${formatDistance(ppnValue)}, DPN: ${formatDistance(dpnValue)}, PDC: ${formatDistance(pdcValue)}`
    );
  };

  const formatDistance = (meters: number): string => {
    if (meters < 1) {
      return `${(meters * 1000).toFixed(2)} mm`;
    }
    if (meters < 1000) {
      return `${meters.toFixed(2)} m`;
    }
    return `${(meters / 1000).toFixed(2)} km`;
  };

  return (
    <Card className="shadow-xl">
      <CardHeader className="space-y-1">
        <CardTitle className="text-3xl md:text-4xl text-center">
          Calculateur de Profondeur de Champ
        </CardTitle>
        <CardDescription className="text-center">
          Calculez le premier plan net, le dernier plan net et la profondeur de
          champ
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <Card className="bg-muted">
          <CardContent className="space-y-3 pt-6">
            <p className="text-center font-mono text-sm md:text-base">
              PPN = (d × Hy) / (Hy + d)
            </p>
            <p className="text-center font-mono text-sm md:text-base">
              DPN = (d × Hy) / (Hy - d)
            </p>
            <p className="text-center font-mono text-sm md:text-base">
              PDC = (2 × Hy × d²) / (Hy² - d²)
            </p>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="distance">Distance (d) en m</Label>
            <Input
              id="distance"
              type="number"
              step="0.1"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && calculateDepthOfField()
              }
              placeholder="Ex: 5"
            />
            <p className="text-xs text-muted-foreground">
              Distance de mise au point en mètres
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hyperfocal">Hyperfocale (Hy) en m</Label>
            <Input
              id="hyperfocal"
              type="number"
              step="0.1"
              value={hyperfocal}
              onChange={(e) => setHyperfocal(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && calculateDepthOfField()
              }
              placeholder="Ex: 10.4"
            />
            <p className="text-xs text-muted-foreground">
              Distance hyperfocale en mètres (doit être supérieure à la
              distance)
            </p>
          </div>

          <Button
            onClick={calculateDepthOfField}
            className="w-full"
            size="lg"
          >
            Calculer
          </Button>

          {(ppn !== null || dpn !== null || pdc !== null) && (
            <div className="space-y-3">
              {ppn !== null && (
                <Card className="border-2 border-blue-500 bg-blue-50 dark:bg-blue-950/20">
                  <CardContent className="pt-6">
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      Premier plan net (PPN)
                    </p>
                    <p className="text-3xl font-bold text-blue-700 dark:text-blue-400">
                      {formatDistance(ppn)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      ({ppn.toFixed(3)} m)
                    </p>
                  </CardContent>
                </Card>
              )}

              {dpn !== null && (
                <Card className="border-2 border-purple-500 bg-purple-50 dark:bg-purple-950/20">
                  <CardContent className="pt-6">
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      Dernier plan net (DPN)
                    </p>
                    <p className="text-3xl font-bold text-purple-700 dark:text-purple-400">
                      {formatDistance(dpn)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      ({dpn.toFixed(3)} m)
                    </p>
                  </CardContent>
                </Card>
              )}

              {pdc !== null && (
                <Card className="border-2 border-green-500 bg-green-50 dark:bg-green-950/20">
                  <CardContent className="pt-6">
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      Profondeur de champ (PDC)
                    </p>
                    <p className="text-3xl font-bold text-green-700 dark:text-green-400">
                      {formatDistance(pdc)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      ({pdc.toFixed(3)} m)
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>

        <CalculationHistory
          history={history}
          onClear={clearHistory}
          formatEntry={(entry) => ({
            inputs: `d=${entry.inputs["Distance (m)"]}m, Hy=${entry.inputs["Hyperfocale (m)"]}m`,
            result: entry.formattedResult || formatDistance(Number(entry.result)),
          })}
        />

        <Separator />

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Exemples courants</h2>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  Paysage - 24mm f/11
                  <Badge className="ml-2" variant="secondary">
                    Hy: 1.75m
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-xs text-muted-foreground">
                  Distance: 1m • Hyperfocale: 1.75m
                </p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <p className="font-medium">PPN:</p>
                    <p className="text-muted-foreground">
                      {formatDistance((1 * 1.75) / (1.75 + 1))}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">DPN:</p>
                    <p className="text-muted-foreground">
                      {formatDistance((1 * 1.75) / (1.75 - 1))}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">PDC:</p>
                    <p className="text-muted-foreground">
                      {formatDistance(
                        (2 * 1.75 * 1) / (1.75 * 1.75 - 1)
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  Portrait - 50mm f/2.8
                  <Badge className="ml-2" variant="secondary">
                    Hy: 10.4m
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-xs text-muted-foreground">
                  Distance: 3m • Hyperfocale: 10.4m
                </p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <p className="font-medium">PPN:</p>
                    <p className="text-muted-foreground">
                      {formatDistance((3 * 10.4) / (10.4 + 3))}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">DPN:</p>
                    <p className="text-muted-foreground">
                      {formatDistance((3 * 10.4) / (10.4 - 3))}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">PDC:</p>
                    <p className="text-muted-foreground">
                      {formatDistance(
                        (2 * 10.4 * 9) / (10.4 * 10.4 - 9)
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  Macro - 100mm f/8
                  <Badge className="ml-2" variant="secondary">
                    Hy: 15.6m
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-xs text-muted-foreground">
                  Distance: 1m • Hyperfocale: 15.6m
                </p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <p className="font-medium">PPN:</p>
                    <p className="text-muted-foreground">
                      {formatDistance((1 * 15.6) / (15.6 + 1))}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">DPN:</p>
                    <p className="text-muted-foreground">
                      {formatDistance((1 * 15.6) / (15.6 - 1))}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">PDC:</p>
                    <p className="text-muted-foreground">
                      {formatDistance(
                        (2 * 15.6 * 1) / (15.6 * 15.6 - 1)
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

