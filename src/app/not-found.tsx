import Link from "next/link";
import { RushOvercrowded } from "@/assets/icons/rush-overcrowded";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-3 p-6 text-center">
      <RushOvercrowded className="size-16 lg:size-20" />
      <span className="text-2xl font-bold sm:text-3xl lg:text-4xl">
        Pagina niet gevonden
      </span>
      <p className="text-sm text-white/70 sm:text-base lg:text-lg">
        Deze pagina bestaat niet of is verplaatst.
      </p>
      <Link
        href="/"
        className="mt-4 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-ns-blue transition-colors hover:bg-primary-hover sm:text-base"
      >
        Terug naar de tijdlijn
      </Link>
    </main>
  );
}
