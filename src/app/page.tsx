import { Suspense } from "react";
import { getPublicPlatforms } from "@/lib/catalog";
import type { Platform } from "@/lib/platform";
import PortalClient from "@/app/portal-client";

export default function Home() {
  return (
    <Suspense fallback={<main className="shell catalog-loading">Chargement du catalogue DATASYS…</main>}>
      <PublicPortal />
    </Suspense>
  );
}

async function PublicPortal() {
  let platforms: Platform[];
  try {
    platforms = await getPublicPlatforms();
  } catch {
    return (
      <main className="shell catalog-loading" role="status">
        Le catalogue est momentanément indisponible. Réessayez plus tard.
      </main>
    );
  }
  return <PortalClient initialPlatforms={platforms} />;
}
