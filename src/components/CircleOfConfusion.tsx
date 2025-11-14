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

export default function CircleOfConfusion() {
  const [sensorDiagonal, setSensorDiagonal] = useState<string>("");
  const [circleOfConfusion, setCircleOfConfusion] = useState<number | null>(
    null
  );
  const { history, saveCalculation, clearHistory } =
    useCalculationHistory("circle-of-confusion");

  const calculateCircleOfConfusion = () => {
    const d = parseFloat(sensorDiagonal);

    if (isNaN(d) || d === 0) {
      setCircleOfConfusion(null);
      return;
    }

    // CC = D / 1730 (en mm)
    const cc = d / 1730;

    setCircleOfConfusion(cc);

    // Sauvegarder dans l'historique
    saveCalculation(
      { "Diagonale (mm)": d },
      cc,
      `${cc.toFixed(3)} mm`
    );
  };

  return (
    <Card className="shadow-xl">
      <CardHeader className="space-y-1">
        <CardTitle className="text-3xl md:text-4xl text-center">
          Calculateur de Cercle de Confusion
        </CardTitle>
        <CardDescription className="text-center">
          Calculez le cercle de confusion à partir de la diagonale du capteur
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <Card className="bg-muted">
          <CardContent>
            <p className="text-center font-mono text-lg">CC = D / 1730 (en mm)</p>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="diagonal">Diagonale du capteur (D) en mm</Label>
            <Input
              id="diagonal"
              type="number"
              step="0.1"
              value={sensorDiagonal}
              onChange={(e) => setSensorDiagonal(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && calculateCircleOfConfusion()
              }
              placeholder="Ex: 43.3 (full-frame)"
            />
          </div>

          <Button
            onClick={calculateCircleOfConfusion}
            className="w-full"
            size="lg"
          >
            Calculer
          </Button>

          {circleOfConfusion !== null && (
            <Card className="border-2 border-green-500 bg-green-50 dark:bg-green-950/20">
              <CardContent className="pt-6">
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Cercle de confusion (CC)
                </p>
                <p className="text-4xl font-bold text-green-700 dark:text-green-400">
                  {circleOfConfusion.toFixed(3)} mm
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <CalculationHistory
          history={history}
          onClear={clearHistory}
          formatEntry={(entry) => ({
            inputs: `D=${entry.inputs["Diagonale (mm)"]}mm`,
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
                  Diagonale: 43.3mm
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  Cercle de confusion: {(43.3 / 1730).toFixed(3)} mm
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
                  Diagonale: 27.7mm
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  Cercle de confusion: {(27.7 / 1730).toFixed(3)} mm
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
                  Diagonale: 21.6mm
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  Cercle de confusion: {(21.6 / 1730).toFixed(3)} mm
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
                  Diagonale: 26.7mm
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  Cercle de confusion: {(26.7 / 1730).toFixed(3)} mm
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

