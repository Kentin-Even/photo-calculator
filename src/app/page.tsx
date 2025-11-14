import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const calculators = [
  {
    title: "Calculateur d'Angle de Champ",
    description: "Calculez l'angle de champ de votre objectif photo ou vidéo",
    href: "/field-of-view",
    formula: "α = 2 · arctan(d / 2·f)",
  },
  {
    title: "Calculateur de Temps de Pause",
    description: "Calculez le temps de pause optimal pour votre prise de vue",
    href: "/break-time",
    formula: "1/t = Obturateur / (360 × Cadence)",
  },
  {
    title: "Calculateur d'Hyperfocale",
    description:
      "Calculez la distance hyperfocale pour maximiser la profondeur de champ",
    href: "/hyperfocal",
    formula: "Hy = f² / (φ × cdc)",
  },
  {
    title: "Calculateur de Cercle de Confusion",
    description:
      "Calculez le cercle de confusion à partir de la diagonale du capteur",
    href: "/circle-of-confusion",
    formula: "CC = D / 1730 (en mm)",
  },
  {
    title: "Calculateur de Profondeur de Champ",
    description:
      "Calculez le premier plan net, le dernier plan net et la profondeur de champ",
    href: "/depth-of-field",
    formula: "PPN, DPN, PDC",
  },
  {
    title: "Calculateur de Focale Normale",
    description: "Calculez la focale normale à partir de la largeur du capteur",
    href: "/normal-focal",
    formula: "f_N = L / (2 × tan(α/2))",
  },
  {
    title: "Calculateur d'Écart Mired",
    description: "Calculez le décalage de température de couleur en mired",
    href: "/mired-shift",
    formula: "ΔMired = (10⁶ / TC.Voulue) - (10⁶ / TC.Mesurée)",
  },
  {
    title: "Calculateur d'Écart de Diaphragme",
    description:
      "Calculez la perte de diaphragme d'un filtre à partir de sa transmittance",
    href: "/filter-stop",
    formula: "Écart = -log₁₀(transmittance) / log₁₀(2)",
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl dark:bg-indigo-400/15" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl dark:bg-fuchsia-400/15" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      </div>

      <main className="relative max-w-7xl mx-auto px-4 py-10 md:px-8 md:py-16 space-y-10">
        <div className="text-center mb-4 md:mb-8">
          <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground bg-secondary/50">
            Outils gratuits • Photo & Vidéo
          </div>
          <h1 className="mt-4 text-4xl md:text-6xl font-extrabold leading-tight">
            <span className="bg-gradient-to-r from-indigo-600 to-fuchsia-600 dark:from-indigo-400 dark:to-fuchsia-400 bg-clip-text text-transparent">
              Calculateurs Photo & Vidéo
            </span>
          </h1>
          <p className="mt-3 text-muted-foreground">
            Outils de calcul pour la photographie et la vidéographie
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {calculators.map((calculator) => (
            <Link key={calculator.href} href={calculator.href}>
              <Card className="h-full transition-all hover:shadow-lg hover:scale-[1.02] cursor-pointer group">
                <CardHeader>
                  <CardTitle className="text-xl">{calculator.title}</CardTitle>
                  <CardDescription>{calculator.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted rounded-lg p-3">
                    <p className="text-center font-mono text-sm text-muted-foreground">
                      {calculator.formula}
                    </p>
                  </div>
                  <div className="flex items-center justify-end text-primary group-hover:translate-x-1 transition-transform">
                    <span className="text-sm font-medium mr-2">Calculer</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <footer className="pt-4 text-center text-sm text-muted-foreground">
          <p>Calculateurs pour la photographie et la vidéo professionnelle</p>
        </footer>
      </main>
    </div>
  );
}
