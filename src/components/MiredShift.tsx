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

export default function MiredShift() {
  const [desiredTemp, setDesiredTemp] = useState<string>("");
  const [measuredTemp, setMeasuredTemp] = useState<string>("");
  const [miredShift, setMiredShift] = useState<number | null>(null);
  const { history, saveCalculation, clearHistory } =
    useCalculationHistory("mired-shift");

  const calculateMiredShift = () => {
    const tcVoulue = parseFloat(desiredTemp);
    const tcMesuree = parseFloat(measuredTemp);

    if (isNaN(tcVoulue) || isNaN(tcMesuree) || tcVoulue === 0 || tcMesuree === 0) {
      setMiredShift(null);
      return;
    }

    // ΔMired = (10^6 / TC.Voulue) - (10^6 / TC.Mesuree)
    const firstTerm = 1000000 / tcVoulue;
    const secondTerm = 1000000 / tcMesuree;
    const deltaMired = firstTerm - secondTerm;

    setMiredShift(deltaMired);

    // Sauvegarder dans l'historique
    saveCalculation(
      { "TC.Voulue (K)": tcVoulue, "TC.Mesurée (K)": tcMesuree },
      deltaMired,
      `${deltaMired > 0 ? "+" : ""}${deltaMired.toFixed(2)} mired`
    );
  };

  const getShiftColor = (value: number) => {
    if (value > 0) {
      return {
        border: "border-orange-500",
        bg: "bg-orange-50 dark:bg-orange-950/20",
        text: "text-orange-700 dark:text-orange-400",
        label: "Décalage orangé (chaud)",
      };
    } else if (value < 0) {
      return {
        border: "border-blue-500",
        bg: "bg-blue-50 dark:bg-blue-950/20",
        text: "text-blue-700 dark:text-blue-400",
        label: "Décalage bleuté (froid)",
      };
    } else {
      return {
        border: "border-green-500",
        bg: "bg-green-50 dark:bg-green-950/20",
        text: "text-green-700 dark:text-green-400",
        label: "Aucun décalage",
      };
    }
  };

  return (
    <Card className="shadow-xl">
      <CardHeader className="space-y-1">
        <CardTitle className="text-3xl md:text-4xl text-center">
          Calculateur d'Écart Mired
        </CardTitle>
        <CardDescription className="text-center">
          Calculez le décalage de température de couleur en mired
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <Card className="bg-muted">
          <CardContent>
            <p className="text-center font-mono text-sm md:text-base">
              ΔMired = (10⁶ / TC.Voulue) - (10⁶ / TC.Mesurée)
            </p>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="desired">
              Température de couleur voulue (TC.Voulue) en K
            </Label>
            <Input
              id="desired"
              type="number"
              step="100"
              value={desiredTemp}
              onChange={(e) => setDesiredTemp(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && calculateMiredShift()
              }
              placeholder="Ex: 5600 (lumière du jour)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="measured">
              Température de couleur mesurée (TC.Mesurée) en K
            </Label>
            <Input
              id="measured"
              type="number"
              step="100"
              value={measuredTemp}
              onChange={(e) => setMeasuredTemp(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && calculateMiredShift()
              }
              placeholder="Ex: 3200 (tungstène)"
            />
          </div>

          <Button
            onClick={calculateMiredShift}
            className="w-full"
            size="lg"
          >
            Calculer
          </Button>

          {miredShift !== null && (
            <Card
              className={`border-2 ${
                getShiftColor(miredShift).border
              } ${getShiftColor(miredShift).bg}`}
            >
              <CardContent className="pt-6">
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Écart Mired (ΔMired)
                </p>
                <p
                  className={`text-4xl font-bold ${getShiftColor(miredShift).text}`}
                >
                  {miredShift > 0 ? "+" : ""}
                  {miredShift.toFixed(2)} mired
                </p>
                <p className="text-sm font-medium mt-3">
                  {getShiftColor(miredShift).label}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <CalculationHistory
          history={history}
          onClear={clearHistory}
          formatEntry={(entry) => ({
            inputs: `${entry.inputs["TC.Voulue (K)"]}K → ${entry.inputs["TC.Mesurée (K)"]}K`,
            result: entry.formattedResult || `${entry.result} mired`,
          })}
        />

        <Separator />

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Exemples courants</h2>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  Lumière du jour → Tungstène
                  <Badge className="ml-2" variant="secondary">
                    5600K → 3200K
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  TC.Voulue: 5600K • TC.Mesurée: 3200K
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  ΔMired:{" "}
                  {(
                    (1000000 / 5600 - 1000000 / 3200).toFixed(2)
                  )}{" "}
                  mired
                </p>
                <p className="text-xs text-muted-foreground">
                  • Résultat négatif = décalage bleuté (filtre bleu nécessaire)
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  Tungstène → Lumière du jour
                  <Badge className="ml-2" variant="secondary">
                    3200K → 5600K
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  TC.Voulue: 3200K • TC.Mesurée: 5600K
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  ΔMired:{" "}
                  {(
                    (1000000 / 3200 - 1000000 / 5600).toFixed(2)
                  )}{" "}
                  mired
                </p>
                <p className="text-xs text-muted-foreground">
                  • Résultat positif = décalage orangé (filtre orange nécessaire)
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  Lumière du jour → Fluorescente
                  <Badge className="ml-2" variant="secondary">
                    5600K → 4000K
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  TC.Voulue: 5600K • TC.Mesurée: 4000K
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  ΔMired:{" "}
                  {(
                    (1000000 / 5600 - 1000000 / 4000).toFixed(2)
                  )}{" "}
                  mired
                </p>
                <p className="text-xs text-muted-foreground">
                  • Résultat négatif = décalage bleuté
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  Températures courantes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Bougie: ~1900K</li>
                  <li>• Tungstène: ~3200K</li>
                  <li>• Fluorescente chaude: ~4000K</li>
                  <li>• Lumière du jour: ~5600K</li>
                  <li>• Ciel nuageux: ~6500K</li>
                  <li>• Ombre: ~7500K</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

