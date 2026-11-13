"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useEffect, useState, type FormEvent } from "react";
import type { Platform } from "@/lib/platform";

type EditablePlatform = Omit<Platform, "id" | "position" | "accessCount"> & {
  id: string;
  position: number;
  accessCount: number;
};

const blankPlatform: EditablePlatform = {
  id: "",
  name: "",
  category: "",
  description: "",
  url: "",
  logo: "",
  status: "available",
  enabled: true,
  position: 0,
  accessCount: 0,
};

export default function AdminClient({ initialPlatforms }: { initialPlatforms: Platform[] }) {
  const router = useRouter();
  const [platforms, setPlatforms] = useState(initialPlatforms);
  const [editing, setEditing] = useState<EditablePlatform | null>(null);
  const [error, setError] = useState("");

  useEffect(() => setPlatforms(initialPlatforms), [initialPlatforms]);

  async function mutate(url: string, method: string, body?: unknown): Promise<boolean> {
    setError("");
    try {
      const response = await fetch(url, {
        method,
        credentials: "same-origin",
        cache: "no-store",
        headers: body === undefined ? undefined : { "Content-Type": "application/json" },
        body: body === undefined ? undefined : JSON.stringify(body),
      });
      if (!response.ok) {
        const result = await response.json().catch(() => null) as { error?: string } | null;
        throw new Error(result?.error ?? "La modification a échoué.");
      }
      router.refresh();
      return true;
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "La modification a échoué.");
      return false;
    }
  }

  function openEditor(platform?: Platform) {
    setError("");
    setEditing(platform ? { ...platform } : { ...blankPlatform });
  }

  function submitPlatform(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    const values = new FormData(event.currentTarget);
    const input = {
      name: String(values.get("name") ?? ""),
      category: String(values.get("category") ?? ""),
      description: String(values.get("description") ?? ""),
      url: String(values.get("url") ?? ""),
      logo: String(values.get("logo") ?? ""),
      status: values.get("status") === "maintenance" ? "maintenance" : "available",
      enabled: editing.enabled,
    };
    const isEditing = Boolean(editing.id);
    void mutate(
      isEditing ? `/api/admin/platforms/${encodeURIComponent(editing.id)}` : "/api/admin/platforms",
      isEditing ? "PATCH" : "POST",
      input,
    ).then((succeeded) => { if (succeeded) setEditing(null); });
  }

  return (
    <>
      <header className="site-header shell">
        <Link className="brand" href="/portail" aria-label="Retour au portail DATASYS CONNECT">
          <span className="brand-mark">D</span><span className="brand-name">DATASYS<span>CONNECT</span></span>
        </Link>
        <nav className="main-nav" aria-label="Navigation principale">
          <Link href="/portail">Portail public</Link>
          <button className="admin-button" onClick={() => void signOut({ redirectTo: "/portail" })} type="button">Déconnexion</button>
        </nav>
      </header>
      <main className="admin shell">
        <div className="admin-heading"><div><p className="eyebrow">DATASYS CONNECT · gestion</p><h1>Vos plateformes.</h1><p>Gérez le catalogue visible sur le portail.</p></div><button className="primary-button" onClick={() => openEditor()} type="button"><span>＋</span> Ajouter une plateforme</button></div>
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="stat-grid"><div className="stat-card"><span>Plateformes au catalogue</span><strong>{platforms.length}</strong></div><div className="stat-card"><span>Actuellement visibles</span><strong>{platforms.filter((platform) => platform.enabled).length}</strong></div><div className="stat-card"><span>Accès suivis · tous utilisateurs</span><strong>{platforms.reduce((sum, platform) => sum + platform.accessCount, 0)}</strong></div></div>
        <div className="admin-table-wrap"><table><thead><tr><th>Plateforme</th><th>Catégorie</th><th>Statut</th><th>Visibilité</th><th>Ordre</th><th>Actions</th></tr></thead><tbody>{platforms.map((platform, index) => <tr key={platform.id}><td><strong>{platform.name}</strong><small>{platform.url || "Lien à confirmer"}</small></td><td>{platform.category}</td><td><span className={`service-status ${platform.status === "maintenance" ? "is-maintenance" : ""}`}><i />{platform.status === "maintenance" ? "Maintenance" : "Disponible"}</span></td><td>{platform.enabled ? "Visible" : "Masquée"}</td><td className="order-actions"><button aria-label={`Monter ${platform.name}`} disabled={index === 0} onClick={() => void mutate("/api/admin/platforms/reorder", "POST", { id: platform.id, direction: -1 })} type="button">↑</button><button aria-label={`Descendre ${platform.name}`} disabled={index === platforms.length - 1} onClick={() => void mutate("/api/admin/platforms/reorder", "POST", { id: platform.id, direction: 1 })} type="button">↓</button></td><td className="table-actions"><button onClick={() => openEditor(platform)} type="button">Modifier</button><button onClick={() => void mutate(`/api/admin/platforms/${encodeURIComponent(platform.id)}`, "PATCH", { name: platform.name, category: platform.category, description: platform.description, url: platform.url, logo: platform.logo, status: platform.status, enabled: !platform.enabled })} type="button">{platform.enabled ? "Désactiver" : "Activer"}</button><button className="delete-action" onClick={() => { if (window.confirm(`Supprimer « ${platform.name} » du portail ?`)) void mutate(`/api/admin/platforms/${encodeURIComponent(platform.id)}`, "DELETE"); }} type="button">Supprimer</button></td></tr>)}</tbody></table></div>
      </main>
      <footer className="site-footer"><div className="shell footer-bottom"><span>DATASYS CONNECT · Administration protégée</span><Link href="/portail">Retour au portail</Link></div></footer>

      {editing && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setEditing(null); }}><form aria-labelledby="form-title" className="platform-modal" onSubmit={submitPlatform}><div className="modal-heading"><div><p className="eyebrow">Catalogue DATASYS</p><h2 id="form-title">{editing.id ? "Modifier la plateforme" : "Nouvelle plateforme"}</h2></div><button aria-label="Fermer" className="close-button" onClick={() => setEditing(null)} type="button">×</button></div><div className="form-grid"><label>Nom<input autoFocus defaultValue={editing.name} maxLength={60} name="name" required /></label><label>Catégorie<input defaultValue={editing.category} maxLength={50} name="category" required /></label><label className="field-wide">Description<textarea defaultValue={editing.description} maxLength={180} name="description" required rows={3} /></label><label className="field-wide">Lien de la plateforme<input defaultValue={editing.url} maxLength={2048} name="url" placeholder="https://exemple.com" type="url" /></label><label className="field-wide">Adresse du logo<input defaultValue={editing.logo} maxLength={2048} name="logo" placeholder="https://exemple.com/logo.png" type="url" /></label><label className="field-wide">Statut<select defaultValue={editing.status} name="status"><option value="available">Disponible</option><option value="maintenance">En maintenance</option></select></label></div>{error && <p className="form-error" role="alert">{error}</p>}<div className="modal-actions"><button className="secondary-button" onClick={() => setEditing(null)} type="button">Annuler</button><button className="primary-button" type="submit">Enregistrer</button></div></form></div>}
    </>
  );
}
