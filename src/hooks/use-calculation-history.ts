import { useState, useEffect } from "react";

export interface CalculationEntry {
  id: string;
  timestamp: number;
  inputs: Record<string, string | number>;
  result: string | number;
  formattedResult?: string;
}

const MAX_HISTORY = 10;

export function useCalculationHistory(calculatorKey: string) {
  const [history, setHistory] = useState<CalculationEntry[]>([]);

  useEffect(() => {
    // Charger l'historique depuis le localStorage au montage
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(`calc-history-${calculatorKey}`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setHistory(parsed);
        } catch (error) {
          console.error("Erreur lors du chargement de l'historique:", error);
        }
      }
    }
  }, [calculatorKey]);

  const saveCalculation = (
    inputs: Record<string, string | number>,
    result: string | number,
    formattedResult?: string
  ) => {
    const entry: CalculationEntry = {
      id: `${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
      inputs,
      result,
      formattedResult,
    };

    const newHistory = [entry, ...history].slice(0, MAX_HISTORY);

    setHistory(newHistory);

    // Sauvegarder dans le localStorage
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(
          `calc-history-${calculatorKey}`,
          JSON.stringify(newHistory)
        );
      } catch (error) {
        console.error("Erreur lors de la sauvegarde de l'historique:", error);
      }
    }
  };

  const clearHistory = () => {
    setHistory([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem(`calc-history-${calculatorKey}`);
    }
  };

  return {
    history,
    saveCalculation,
    clearHistory,
  };
}
