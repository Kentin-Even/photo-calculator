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

export default function FieldOfView() {
  const [sensorDimension, setSensorDimension] = useState<string>("");
  const [focalLength, setFocalLength] = useState<string>("");
  const [fieldOfView, setFieldOfView] = useState<number | null>(null);
  const { history, saveCalculation, clearHistory } =
    useCalculationHistory("field-of-view");

  const calculateFieldOfView = () => {
    const d = parseFloat(sensorDimension);
    const f = parseFloat(focalLength);

    if (isNaN(d) || isNaN(f) || f === 0) {
      setFieldOfView(null);
      return;
    }

    // α = 2 · arctan(d / 2·f)
    const angleRadians = 2 * Math.atan(d / (2 * f));
    const angleDegrees = (angleRadians * 180) / Math.PI;

    setFieldOfView(angleDegrees);

    // Sauvegarder dans l'historique
    saveCalculation(
      { "Dimension capteur (mm)": d, "Focale (mm)": f },
      angleDegrees,
      `${angleDegrees.toFixed(2)}°`
    );
  };
  return (
    <Card className="shadow-xl">
      <CardHeader className="space-y-1">
        <CardTitle className="text-3xl md:text-4xl text-center">
          Calculateur d'Angle de Champ
        </CardTitle>
        <CardDescription className="text-center">
          Calculez l'angle de champ de votre objectif photo ou vidéo
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <Card className="bg-muted">
          <CardContent>
            <p className="text-center font-mono text-lg">
              α = 2 · arctan(d / 2·f)
            </p>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sensor">Dimension du capteur (d) en mm</Label>
            <Input
              id="sensor"
              type="number"
              step="0.1"
              value={sensorDimension}
              onChange={(e) => setSensorDimension(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && calculateFieldOfView()}
              placeholder="Ex: 36 (largeur full-frame)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="focal">Distance focale (f) en mm</Label>
            <Input
              id="focal"
              type="number"
              step="0.1"
              value={focalLength}
              onChange={(e) => setFocalLength(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && calculateFieldOfView()}
              placeholder="Ex: 50"
            />
          </div>

          <Button onClick={calculateFieldOfView} className="w-full" size="lg">
            Calculer
          </Button>

          {fieldOfView !== null && (
            <Card className="border-2 border-green-500 bg-green-50 dark:bg-green-950/20">
              <CardContent className="pt-1">
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Angle de champ (α)
                </p>
                <p className="text-4xl font-bold text-green-700 dark:text-green-400">
                  {fieldOfView.toFixed(2)}°
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <CalculationHistory
          history={history}
          onClear={clearHistory}
          formatEntry={(entry) => ({
            inputs: `d=${entry.inputs["Dimension capteur (mm)"]}mm, f=${entry.inputs["Focale (mm)"]}mm`,
            result: entry.formattedResult || `${entry.result}°`,
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
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Largeur: 36mm</li>
                  <li>• Hauteur: 24mm</li>
                  <li>• Diagonale: 43.3mm</li>
                </ul>
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
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Largeur: 23mm</li>
                  <li>• Hauteur: 15mm</li>
                  <li>• Diagonale: 27.7mm</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
