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

export default function Hyperfocal() {
  const [focalLength, setFocalLength] = useState<string>("");
  const [aperture, setAperture] = useState<string>("");
  const [circleOfConfusion, setCircleOfConfusion] = useState<string>("");
  const [hyperfocal, setHyperfocal] = useState<number | null>(null);
  const { history, saveCalculation, clearHistory } =
    useCalculationHistory("hyperfocal");

  const calculateHyperfocal = () => {
    const f = parseFloat(focalLength);
    const phi = parseFloat(aperture);
    const cdc = parseFloat(circleOfConfusion);

    if (isNaN(f) || isNaN(phi) || isNaN(cdc) || phi === 0 || cdc === 0) {
      setHyperfocal(null);
      return;
    }

    // Hy = f² / (φ × cdc)
    const fSquared = f * f;
    const denominator = phi * cdc;
    const hy = fSquared / denominator;

    setHyperfocal(hy);

    // Sauvegarder dans l'historique
    saveCalculation(
      { "Focale (mm)": f, "Ouverture (f/)": phi, "CDC (mm)": cdc },
      hy,
      formatDistance(hy / 1000)
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
          Calculateur d'Hyperfocale
        </CardTitle>
        <CardDescription className="text-center">
          Calculez la distance hyperfocale pour maximiser la profondeur de champ
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <Card className="bg-muted">
          <CardContent>
            <p className="text-center font-mono text-lg">Hy = f² / (φ × cdc)</p>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="focal">Distance focale (f) en mm</Label>
            <Input
              id="focal"
              type="number"
              step="0.1"
              value={focalLength}
              onChange={(e) => setFocalLength(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && calculateHyperfocal()}
              placeholder="Ex: 50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="aperture">Ouverture (φ) en f-number</Label>
            <Input
              id="aperture"
              type="number"
              step="0.1"
              value={aperture}
              onChange={(e) => setAperture(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && calculateHyperfocal()}
              placeholder="Ex: 2.8, 4, 5.6, 8..."
            />
            <p className="text-xs text-muted-foreground">
              Valeurs courantes: 2.8, 4, 5.6, 8, 11, 16, 22
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cdc">Cercle de confusion (cdc) en mm</Label>
            <Input
              id="cdc"
              type="number"
              step="0.001"
              value={circleOfConfusion}
              onChange={(e) => setCircleOfConfusion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && calculateHyperfocal()}
              placeholder="Ex: 0.03 (full-frame)"
            />
            <p className="text-xs text-muted-foreground">
              Valeurs courantes: 0.03mm (full-frame), 0.02mm (APS-C), 0.015mm
              (Micro 4/3)
            </p>
          </div>

          <Button onClick={calculateHyperfocal} className="w-full" size="lg">
            Calculer
          </Button>

          {hyperfocal !== null && (
            <Card className="border-2 border-green-500 bg-green-50 dark:bg-green-950/20">
              <CardContent className="pt-6">
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Distance hyperfocale (Hy)
                </p>
                <p className="text-4xl font-bold text-green-700 dark:text-green-400">
                  {formatDistance(hyperfocal / 1000)}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  ({hyperfocal.toFixed(2)} mm)
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <CalculationHistory
          history={history}
          onClear={clearHistory}
          formatEntry={(entry) => ({
            inputs: `f=${entry.inputs["Focale (mm)"]}mm, f/${entry.inputs["Ouverture (f/)"]}, cdc=${entry.inputs["CDC (mm)"]}mm`,
            result: entry.formattedResult || formatDistance(Number(entry.result) / 1000),
          })}
        />

        <Separator />

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Exemples courants</h2>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  Full Frame - 50mm f/8
                  <Badge className="ml-2" variant="secondary">
                    cdc: 0.03mm
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  Hyperfocale: {formatDistance((50 * 50) / (8 * 0.03) / 1000)}
                </p>
                <p className="text-xs text-muted-foreground">
                  • Focale: 50mm • Ouverture: f/8 • CDC: 0.03mm
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  APS-C - 35mm f/5.6
                  <Badge className="ml-2" variant="secondary">
                    cdc: 0.02mm
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  Hyperfocale: {formatDistance((35 * 35) / (5.6 * 0.02) / 1000)}
                </p>
                <p className="text-xs text-muted-foreground">
                  • Focale: 35mm • Ouverture: f/5.6 • CDC: 0.02mm
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  Paysage - 24mm f/11
                  <Badge className="ml-2" variant="secondary">
                    cdc: 0.03mm
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  Hyperfocale: {formatDistance((24 * 24) / (11 * 0.03) / 1000)}
                </p>
                <p className="text-xs text-muted-foreground">
                  • Focale: 24mm • Ouverture: f/11 • CDC: 0.03mm
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
