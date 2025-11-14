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

export default function NormalFocal() {
  const [sensorWidth, setSensorWidth] = useState<string>("");
  const [normalFocal, setNormalFocal] = useState<number | null>(null);
  const angleOfView = 40; // Angle de champ fixe à 40°
  const { history, saveCalculation, clearHistory } =
    useCalculationHistory("normal-focal");

  const calculateNormalFocal = () => {
    const l = parseFloat(sensorWidth);

    if (isNaN(l) || l === 0) {
      setNormalFocal(null);
      return;
    }

    // f_N = L / (2 × tan(α/2))
    // α = 40° donc α/2 = 20°
    const alphaHalfRadians = (angleOfView / 2) * (Math.PI / 180);
    const denominator = 2 * Math.tan(alphaHalfRadians);
    const fn = l / denominator;

    setNormalFocal(fn);

    // Sauvegarder dans l'historique
    saveCalculation(
      { "Largeur capteur (mm)": l },
      fn,
      `${fn.toFixed(2)} mm`
    );
  };

  return (
    <Card className="shadow-xl">
      <CardHeader className="space-y-1">
        <CardTitle className="text-3xl md:text-4xl text-center">
          Calculateur de Focale Normale
        </CardTitle>
        <CardDescription className="text-center">
          Calculez la focale normale à partir de la largeur du capteur
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <Card className="bg-muted">
          <CardContent>
            <p className="text-center font-mono text-lg">
              f_N = L / (2 × tan(α/2))
            </p>
            <p className="text-center text-sm text-muted-foreground mt-2">
              α = 40° (angle de champ fixe)
            </p>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="width">Largeur du capteur (L) en mm</Label>
            <Input
              id="width"
              type="number"
              step="0.1"
              value={sensorWidth}
              onChange={(e) => setSensorWidth(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && calculateNormalFocal()
              }
              placeholder="Ex: 36 (full-frame)"
            />
          </div>

          <Button
            onClick={calculateNormalFocal}
            className="w-full"
            size="lg"
          >
            Calculer
          </Button>

          {normalFocal !== null && (
            <Card className="border-2 border-green-500 bg-green-50 dark:bg-green-950/20">
              <CardContent className="pt-6">
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Focale normale (f_N)
                </p>
                <p className="text-4xl font-bold text-green-700 dark:text-green-400">
                  {normalFocal.toFixed(2)} mm
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <CalculationHistory
          history={history}
          onClear={clearHistory}
          formatEntry={(entry) => ({
            inputs: `L=${entry.inputs["Largeur capteur (mm)"]}mm`,
            result: entry.formattedResult || `${entry.result} mm`,
          })}
        />

        <Separator />

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Exemples courants</h2>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  Full Frame
                  <Badge className="ml-2" variant="secondary">
                    24×36mm
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  Largeur: 36mm • Angle: 40°
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  Focale normale:{" "}
                  {(
                    36 /
                    (2 *
                      Math.tan(
                        (40 / 2) * (Math.PI / 180)
                      ))
                  ).toFixed(2)}{" "}
                  mm
                </p>
                <p className="text-xs text-muted-foreground">
                  • Largeur: 36mm • Hauteur: 24mm • Diagonale: 43.3mm
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  APS-C
                  <Badge className="ml-2" variant="secondary">
                    15×23mm
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  Largeur: 23mm • Angle: 40°
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  Focale normale:{" "}
                  {(
                    23 /
                    (2 *
                      Math.tan(
                        (40 / 2) * (Math.PI / 180)
                      ))
                  ).toFixed(2)}{" "}
                  mm
                </p>
                <p className="text-xs text-muted-foreground">
                  • Largeur: 23mm • Hauteur: 15mm • Diagonale: 27.7mm
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  Micro 4/3
                  <Badge className="ml-2" variant="secondary">
                    13×17.3mm
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  Largeur: 17.3mm • Angle: 40°
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  Focale normale:{" "}
                  {(
                    17.3 /
                    (2 *
                      Math.tan(
                        (40 / 2) * (Math.PI / 180)
                      ))
                  ).toFixed(2)}{" "}
                  mm
                </p>
                <p className="text-xs text-muted-foreground">
                  • Largeur: 17.3mm • Hauteur: 13mm • Diagonale: 21.6mm
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  APS-C Canon
                  <Badge className="ml-2" variant="secondary">
                    14.8×22.2mm
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  Largeur: 22.2mm • Angle: 40°
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  Focale normale:{" "}
                  {(
                    22.2 /
                    (2 *
                      Math.tan(
                        (40 / 2) * (Math.PI / 180)
                      ))
                  ).toFixed(2)}{" "}
                  mm
                </p>
                <p className="text-xs text-muted-foreground">
                  • Largeur: 22.2mm • Hauteur: 14.8mm • Diagonale: 26.7mm
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

