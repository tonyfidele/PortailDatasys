import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { isAdminSession } from "@/lib/authz";
import { getAdminPlatforms } from "@/lib/catalog";
import AdminClient from "@/app/admin/admin-client";

export default function AdminPage() {
  return (
    <Suspense fallback={<main className="shell catalog-loading">Vérification de la session…</main>}>
      <ProtectedAdmin />
    </Suspense>
  );
}

async function ProtectedAdmin() {
  const session = await auth();
  if (!isAdminSession(session)) redirect("/admin/login");

  try {
    const platforms = await getAdminPlatforms();
    return <AdminClient initialPlatforms={platforms} />;
  } catch {
    return <main className="shell catalog-loading" role="status">L’administration est momentanément indisponible.</main>;
  }
}
