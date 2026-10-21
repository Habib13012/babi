import Link from "next/link";
import { Logo } from "@/components/brand/Logo";

export default function NotFound() {
  return (
    <div className="container-page grid min-h-[60vh] place-items-center py-20 text-center">
      <div>
        <Logo variant="mark" className="mx-auto h-16 w-16 -rotate-12" title="" />
        <h1 className="mt-8 text-5xl md:text-6xl">Page introuvable</h1>
        <p className="mt-5 text-graphite/85">Cette page n&apos;existe pas ou a été déplacée.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/" className="btn btn-primary">Accueil</Link>
          <Link href="/produit/socle-01" className="btn btn-ghost">Voir Socle 01</Link>
        </div>
      </div>
    </div>
  );
}
