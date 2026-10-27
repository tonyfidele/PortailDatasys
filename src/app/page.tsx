"use client";

import { useEffect, useState, type FormEvent } from "react";

type Platform = {
  id: string;
  name: string;
  category: string;
  description: string;
  url: string;
  logo: string;
  status: "available" | "maintenance";
  enabled: boolean;
};

const starterPlatforms: Platform[] = [
  { id: "batakiplus", name: "BatakiPlus", category: "Communication numérique", description: "Des outils et services pour simplifier vos échanges au quotidien.", url: "", logo: "", status: "available", enabled: true },
  { id: "annoncesmali", name: "AnnoncesMali", category: "Annonces", description: "Une plateforme de publication et de consultation d’annonces.", url: "", logo: "", status: "available", enabled: true },
  { id: "cenou-kibaru", name: "CENOU KIBARU", category: "Éducation", description: "Un espace d’information autour de la gestion des bourses.", url: "", logo: "", status: "available", enabled: true },
  { id: "autres-services", name: "Autres services", category: "Solutions DATASYS", description: "Découvrez les autres solutions numériques de DATASYS.", url: "", logo: "", status: "available", enabled: true },
];

const platformStorageKey = "datasys-connect-platforms-v1";

function safeWebUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : "";
  } catch {
    return "";
  }
}

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0] ?? "").join("").toUpperCase();
}

export default function Home() {
  const [platforms, setPlatforms] = useState(starterPlatforms);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Toutes");
  const [isAdmin, setIsAdmin] = useState(false);
  const [editing, setEditing] = useState<Platform | null>(null);
  const [visits, setVisits] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    let restoredPlatforms = starterPlatforms;
    let restoredVisits = 0;
    try {
      const saved = localStorage.getItem(platformStorageKey);
      const savedVisits = Number(localStorage.getItem("datasys-connect-visits") ?? 0);
      if (saved) restoredPlatforms = JSON.parse(saved) as Platform[];
      restoredVisits = Number.isFinite(savedVisits) ? savedVisits : 0;
    } catch {
      restoredPlatforms = starterPlatforms;
    }
    const frame = window.requestAnimationFrame(() => {
      setPlatforms(restoredPlatforms);
      setVisits(restoredVisits);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const categories = ["Toutes", ...new Set(platforms.map((platform) => platform.category))];
  const visiblePlatforms = platforms.filter((platform) => {
    const matchesCategory = category === "Toutes" || platform.category === category;
    const searchable = `${platform.name} ${platform.category} ${platform.description}`.toLocaleLowerCase("fr");
    return platform.enabled && matchesCategory && searchable.includes(query.trim().toLocaleLowerCase("fr"));
  });

  function persist(nextPlatforms: Platform[]) {
    setPlatforms(nextPlatforms);
    localStorage.setItem(platformStorageKey, JSON.stringify(nextPlatforms));
  }

  function openEditor(platform?: Platform) {
    setError("");
    setEditing(platform ?? { id: "", name: "", category: "", description: "", url: "", logo: "", status: "available", enabled: true });
  }

  function submitPlatform(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    const values = new FormData(event.currentTarget);
    const rawUrl = String(values.get("url") ?? "").trim();
    const rawLogo = String(values.get("logo") ?? "").trim();
    const url = rawUrl ? safeWebUrl(rawUrl) : "";
    const logo = rawLogo ? safeWebUrl(rawLogo) : "";
    if ((rawUrl && !url) || (rawLogo && !logo)) {
      setError("Les adresses doivent commencer par http:// ou https://.");
      return;
    }

    const platform: Platform = {
      ...editing,
      id: editing.id || `service-${Date.now()}`,
      name: String(values.get("name") ?? "").trim(),
      category: String(values.get("category") ?? "").trim(),
      description: String(values.get("description") ?? "").trim(),
      url,
      logo,
      status: values.get("status") === "maintenance" ? "maintenance" : "available",
    };
    const next = editing.id
      ? platforms.map((item) => item.id === editing.id ? platform : item)
      : [...platforms, platform];
    persist(next);
    setEditing(null);
  }

  function movePlatform(index: number, offset: -1 | 1) {
    const target = index + offset;
    if (target < 0 || target >= platforms.length) return;
    const next = [...platforms];
    [next[index], next[target]] = [next[target], next[index]];
    persist(next);
  }

  function countVisit() {
    setVisits((count) => {
      const next = count + 1;
      localStorage.setItem("datasys-connect-visits", String(next));
      return next;
    });
  }

  return (
    <>
      <header className="site-header shell">
        <a className="brand" href="#accueil" aria-label="DATASYS CONNECT, accueil"><span className="brand-mark">D</span><span className="brand-name">DATASYS<span>CONNECT</span></span></a>
        <nav className="main-nav" aria-label="Navigation principale"><a href="#plateformes">Plateformes</a><a href="#contact">Contact</a><button className="admin-button" onClick={() => setIsAdmin(!isAdmin)} type="button">{isAdmin ? "Fermer la gestion" : "Administration · démo"}</button></nav>
      </header>

      <main>
        {!isAdmin ? <>
          <section className="hero" id="accueil"><div className="shell hero-layout">
            <div className="hero-copy"><p className="eyebrow"><span /> Votre écosystème numérique</p><h1>Un seul accès.<br /><em>Toutes nos solutions.</em></h1><p className="hero-description">Bienvenue sur DATASYS CONNECT. Retrouvez les plateformes numériques proposées par DATASYS et accédez au service qu’il vous faut.</p><a className="hero-cta" href="#plateformes">Explorer les plateformes <span>↓</span></a></div>
            <aside className="hero-stamp"><div className="stamp-orbit"><span>D</span><i /><i /><i /></div><div className="stamp-caption"><span>DATASYS</span><strong>Un portail.<br />Vos services.</strong></div><span className="stamp-index">01 / CONNECT</span></aside>
          </div><div className="hero-foot shell"><span>Simple d’accès</span><span>Pensé pour mobile</span><span>Un écosystème évolutif</span><span className="hero-location">Bamako · Mali</span></div></section>

          <section className="services shell" id="plateformes"><div className="section-heading"><div><p className="eyebrow">L’écosystème DATASYS</p><h2>Choisissez votre service<span>.</span></h2></div><p className="section-note">Des solutions numériques conçues pour vous accompagner au quotidien.</p></div>
            <div className="catalog-tools"><div className="filters" aria-label="Filtrer par catégorie">{categories.map((item) => <button className="filter-button" aria-pressed={category === item} key={item} onClick={() => setCategory(item)} type="button">{item}</button>)}</div><label className="search-box"><span aria-hidden="true">⌕</span><input aria-label="Rechercher une plateforme" onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher" type="search" /></label></div>
            <div className="platform-grid" aria-live="polite">{visiblePlatforms.length ? visiblePlatforms.map((platform, index) => {
              const link = safeWebUrl(platform.url);
              const logo = safeWebUrl(platform.logo);
              return <article className="platform-card" key={platform.id}><div className="card-topline"><span className="card-number">{String(index + 1).padStart(2, "0")}</span><span className={`service-status ${platform.status === "maintenance" ? "is-maintenance" : ""}`}><i />{platform.status === "maintenance" ? "Maintenance" : "Disponible"}</span></div><div className="service-logo" style={logo ? { backgroundImage: `url("${logo}")` } : undefined}>{logo ? null : initials(platform.name)}</div><p className="service-category">{platform.category}</p><h3>{platform.name}</h3><p className="service-description">{platform.description}</p><div className="card-action">{link && platform.status === "available" ? <a href={link} onClick={countVisit} rel="noreferrer" target="_blank">Accéder <span>↗</span></a> : <span className="link-pending">{platform.status === "maintenance" ? "Service indisponible" : "Lien à confirmer"}</span>}<span className="card-arrow" aria-hidden="true">↗</span></div></article>;
            }) : <p className="empty-results">Aucune plateforme ne correspond à votre recherche.</p>}</div>
            <p className="content-note">Plateformes présentées à titre indicatif, sous réserve de validation par DATASYS.</p>
          </section>
          <section className="contact-band" id="contact"><div className="shell contact-layout"><div><p className="eyebrow">Besoin d’orientation ?</p><h2>Parlons de votre projet.</h2><p>Notre équipe vous aide à trouver la solution adaptée.</p></div><a href="mailto:contact@datasys.com">Contacter DATASYS <span>↗</span></a></div></section>
        </> : <section className="admin shell"><div className="admin-heading"><div><p className="eyebrow">DATASYS CONNECT · gestion</p><h1>Vos plateformes.</h1><p>Gérez le catalogue visible sur le portail.</p></div><button className="primary-button" onClick={() => openEditor()} type="button"><span>＋</span> Ajouter une plateforme</button></div>
          <div className="stat-grid"><div className="stat-card"><span>Plateformes au catalogue</span><strong>{platforms.length}</strong></div><div className="stat-card"><span>Actuellement visibles</span><strong>{platforms.filter((platform) => platform.enabled).length}</strong></div><div className="stat-card"><span>Accès suivis · cet appareil</span><strong>{visits}</strong></div></div>
          <div className="admin-table-wrap"><table><thead><tr><th>Plateforme</th><th>Catégorie</th><th>Statut</th><th>Visibilité</th><th>Ordre</th><th>Actions</th></tr></thead><tbody>{platforms.map((platform, index) => <tr key={platform.id}><td><strong>{platform.name}</strong><small>{safeWebUrl(platform.url) || "Lien à confirmer"}</small></td><td>{platform.category}</td><td><span className={`service-status ${platform.status === "maintenance" ? "is-maintenance" : ""}`}><i />{platform.status === "maintenance" ? "Maintenance" : "Disponible"}</span></td><td>{platform.enabled ? "Visible" : "Masquée"}</td><td className="order-actions"><button aria-label={`Monter ${platform.name}`} disabled={index === 0} onClick={() => movePlatform(index, -1)} type="button">↑</button><button aria-label={`Descendre ${platform.name}`} disabled={index === platforms.length - 1} onClick={() => movePlatform(index, 1)} type="button">↓</button></td><td className="table-actions"><button onClick={() => openEditor(platform)} type="button">Modifier</button><button onClick={() => persist(platforms.map((item) => item.id === platform.id ? { ...item, enabled: !item.enabled } : item))} type="button">{platform.enabled ? "Désactiver" : "Activer"}</button><button className="delete-action" onClick={() => { if (window.confirm(`Supprimer « ${platform.name} » du portail ?`)) persist(platforms.filter((item) => item.id !== platform.id)); }} type="button">Supprimer</button></td></tr>)}</tbody></table></div>
          <p className="demo-warning"><strong>Démo locale uniquement.</strong> Les données et consultations sont enregistrées dans le navigateur de cet appareil. Cette interface n’a pas d’authentification et ne doit pas être publiée avant l’intégration d’un serveur, de PostgreSQL et d’un contrôle d’accès administrateur.</p>
        </section>}
      </main>

      <footer className="site-footer"><div className="shell footer-main"><a className="brand footer-brand" href="#accueil"><span className="brand-mark">D</span><span className="brand-name">DATASYS<span>CONNECT</span></span></a><p>Un point d’entrée vers nos solutions numériques.</p><a href="mailto:contact@datasys.com">contact@datasys.com</a></div><div className="shell footer-bottom"><span>© 2026 DATASYS — Tous droits réservés</span><span>Portail de démonstration · liens et contenus à valider</span></div></footer>

      {editing && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setEditing(null); }}><form aria-labelledby="form-title" className="platform-modal" onSubmit={submitPlatform}><div className="modal-heading"><div><p className="eyebrow">Catalogue DATASYS</p><h2 id="form-title">{editing.id ? "Modifier la plateforme" : "Nouvelle plateforme"}</h2></div><button aria-label="Fermer" className="close-button" onClick={() => setEditing(null)} type="button">×</button></div><div className="form-grid"><label>Nom<input autoFocus defaultValue={editing.name} maxLength={60} name="name" required /></label><label>Catégorie<input defaultValue={editing.category} maxLength={50} name="category" required /></label><label className="field-wide">Description<textarea defaultValue={editing.description} maxLength={180} name="description" required rows={3} /></label><label className="field-wide">Lien de la plateforme<input defaultValue={editing.url} name="url" placeholder="https://exemple.com" type="url" /></label><label className="field-wide">Adresse du logo<input defaultValue={editing.logo} name="logo" placeholder="https://exemple.com/logo.png" type="url" /></label><label className="field-wide">Statut<select defaultValue={editing.status} name="status"><option value="available">Disponible</option><option value="maintenance">En maintenance</option></select></label></div>{error && <p className="form-error" role="alert">{error}</p>}<div className="modal-actions"><button className="secondary-button" onClick={() => setEditing(null)} type="button">Annuler</button><button className="primary-button" type="submit">Enregistrer</button></div></form></div>}
    </>
  );
}
