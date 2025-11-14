import FieldOfView from "@/components/FieldOfView";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function FieldOfViewPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl dark:bg-indigo-400/15" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl dark:bg-fuchsia-400/15" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      </div>

      <main className="relative max-w-4xl mx-auto px-4 py-10 md:px-8 md:py-16">
        <div className="mb-6">
          <Link href="/">
            <Button
              variant="ghost"
              className="gap-2 group hover:bg-accent/80 transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-200" />
              Retour à l'accueil
            </Button>
          </Link>
        </div>
        <FieldOfView />
      </main>
    </div>
  );
}
