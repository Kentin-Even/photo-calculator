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

export default function FilterStop() {
  const [transmittance, setTransmittance] = useState<string>("");
  const [stopLoss, setStopLoss] = useState<number | null>(null);
  const { history, saveCalculation, clearHistory } =
    useCalculationHistory("filter-stop");

  const calculateStopLoss = () => {
    const t = parseFloat(transmittance);

    if (isNaN(t) || t <= 0 || t > 100) {
      setStopLoss(null);
      return;
    }

    // Convertir le pourcentage en fraction (0-1)
    const transmittanceFraction = t / 100;

    // Écart de diaphragme = (log₁₀(1) - log₁₀(transmittance)) / log₁₀(2)
    // Simplifié: -log₁₀(transmittance) / log₁₀(2)
    const log10Transmittance = Math.log10(transmittanceFraction);
    const log10Two = Math.log10(2);
    const stop = -log10Transmittance / log10Two;

    setStopLoss(stop);

    // Sauvegarder dans l'historique
    saveCalculation(
      { "Transmittance (%)": t },
      stop,
      `${stop.toFixed(2)} IL`
    );
  };

  return (
    <Card className="shadow-xl">
      <CardHeader className="space-y-1">
        <CardTitle className="text-3xl md:text-4xl text-center">
          Calculateur d'Écart de Diaphragme
        </CardTitle>
        <CardDescription className="text-center">
          Calculez la perte de diaphragme d'un filtre à partir de sa transmittance
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <Card className="bg-muted">
          <CardContent>
            <p className="text-center font-mono text-sm md:text-base">
              Écart = (log₁₀(1) - log₁₀(transmittance)) / log₁₀(2)
            </p>
            <p className="text-center text-xs text-muted-foreground mt-2">
              Simplifié: -log₁₀(transmittance) / log₁₀(2)
            </p>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="transmittance">
              Transmittance du filtre (%)
            </Label>
            <Input
              id="transmittance"
              type="number"
              step="0.1"
              min="0.1"
              max="100"
              value={transmittance}
              onChange={(e) => setTransmittance(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && calculateStopLoss()
              }
              placeholder="Ex: 50 (pour 50%)"
            />
            <p className="text-xs text-muted-foreground">
              Valeur entre 0.1% et 100% (100% = pas de perte)
            </p>
          </div>

          <Button
            onClick={calculateStopLoss}
            className="w-full"
            size="lg"
          >
            Calculer
          </Button>

          {stopLoss !== null && (
            <Card className="border-2 border-green-500 bg-green-50 dark:bg-green-950/20">
              <CardContent className="pt-6">
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Écart de diaphragme
                </p>
                <p className="text-4xl font-bold text-green-700 dark:text-green-400">
                  {stopLoss.toFixed(2)} IL
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  (Intervalles de lumière ou "stops")
                </p>
                {stopLoss > 0 && (
                  <p className="text-sm text-muted-foreground mt-3">
                    Le filtre réduit l'exposition de {stopLoss.toFixed(2)} diaphragme{stopLoss >= 2 ? "s" : ""}
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <CalculationHistory
          history={history}
          onClear={clearHistory}
          formatEntry={(entry) => ({
            inputs: `${entry.inputs["Transmittance (%)"]}%`,
            result: entry.formattedResult || `${entry.result} IL`,
          })}
        />

        <Separator />

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Exemples courants</h2>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  Filtre ND 0.3 (1 stop)
                  <Badge className="ml-2" variant="secondary">
                    50% transmittance
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  Transmittance: 50%
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  Écart: {(-Math.log10(0.5) / Math.log10(2)).toFixed(2)} IL
                </p>
                <p className="text-xs text-muted-foreground">
                  • Réduit l'exposition de 1 diaphragme
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  Filtre ND 0.6 (2 stops)
                  <Badge className="ml-2" variant="secondary">
                    25% transmittance
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  Transmittance: 25%
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  Écart: {(-Math.log10(0.25) / Math.log10(2)).toFixed(2)} IL
                </p>
                <p className="text-xs text-muted-foreground">
                  • Réduit l'exposition de 2 diaphragmes
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  Filtre ND 0.9 (3 stops)
                  <Badge className="ml-2" variant="secondary">
                    12.5% transmittance
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  Transmittance: 12.5%
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  Écart: {(-Math.log10(0.125) / Math.log10(2)).toFixed(2)} IL
                </p>
                <p className="text-xs text-muted-foreground">
                  • Réduit l'exposition de 3 diaphragmes
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  Filtre ND 1.2 (4 stops)
                  <Badge className="ml-2" variant="secondary">
                    6.25% transmittance
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  Transmittance: 6.25%
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  Écart: {(-Math.log10(0.0625) / Math.log10(2)).toFixed(2)} IL
                </p>
                <p className="text-xs text-muted-foreground">
                  • Réduit l'exposition de 4 diaphragmes
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Référence</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• ND 0.3 = 1 stop = 50% transmittance</li>
                  <li>• ND 0.6 = 2 stops = 25% transmittance</li>
                  <li>• ND 0.9 = 3 stops = 12.5% transmittance</li>
                  <li>• ND 1.2 = 4 stops = 6.25% transmittance</li>
                  <li>• ND 1.5 = 5 stops = 3.125% transmittance</li>
                  <li>• ND 1.8 = 6 stops = 1.5625% transmittance</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

