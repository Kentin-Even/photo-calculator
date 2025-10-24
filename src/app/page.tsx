import FieldOfView from "@/components/FieldOfView";
import { BreakTime } from "@/components/BreakTime";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-950 dark:to-gray-900 p-4 md:p-8">
      <main className="max-w-7xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            Calculateurs Photo & Vidéo
          </h1>
          <p className="text-muted-foreground">
            Outils de calcul pour la photographie et la vidéographie
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-1 gap-8">
          <FieldOfView />
          <BreakTime />
        </div>

        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>Calculateurs pour la photographie et la vidéo professionnelle</p>
        </footer>
      </main>
    </div>
  );
}
