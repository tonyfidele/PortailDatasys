"use client";

import Image from "next/image";
import Link from "next/link";
import QRCode from "qrcode";
import { useEffect, useState } from "react";
import type { Platform } from "@/lib/platform";

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

export default function PortalClient({ initialPlatforms }: { initialPlatforms: Platform[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Toutes");
  const [qrPng, setQrPng] = useState("");
  const [qrSvg, setQrSvg] = useState("");
  const [qrTarget, setQrTarget] = useState("");

  useEffect(() => {
    const target = "https://datasys.com/portail";
    setQrTarget(target);
    const options = {
      errorCorrectionLevel: "H" as const,
      margin: 3,
      color: { dark: "#003B70", light: "#FFFFFF" },
    };
    Promise.all([
      QRCode.toDataURL(target, { ...options, width: 720 }),
      QRCode.toString(target, { ...options, type: "svg" }),
    ]).then(([png, svg]) => {
      setQrPng(png);
      setQrSvg(svg);
    }).catch(() => undefined);
  }, []);

  const categories = ["Toutes", ...new Set(initialPlatforms.map((platform) => platform.category))];
  const visiblePlatforms = initialPlatforms.filter((platform) => {
    const matchesCategory = category === "Toutes" || platform.category === category;
    const searchable = `${platform.name} ${platform.category} ${platform.description}`.toLocaleLowerCase("fr");
    return matchesCategory && searchable.includes(query.trim().toLocaleLowerCase("fr"));
  });

  return (
    <>
      <header className="site-header shell">
        <a className="brand" href="#accueil" aria-label="DATASYS CONNECT, accueil">
          <span className="brand-mark">D</span><span className="brand-name">DATASYS<span>CONNECT</span></span>
        </a>
        <nav className="main-nav" aria-label="Navigation principale">
          <a href="#plateformes">Plateformes</a><a href="#contact">Contact</a>
          <Link className="admin-button" href="/admin">Administration</Link>
        </nav>
      </header>

      <main>
        <section className="hero" id="accueil"><div className="shell hero-layout">
          <div className="hero-copy"><p className="eyebrow"><span /> Votre écosystème numérique</p><h1>Un seul accès.<br /><em>Toutes nos solutions.</em></h1><p className="hero-description">Bienvenue sur DATASYS CONNECT. Retrouvez les plateformes numériques proposées par DATASYS et accédez au service qu’il vous faut.</p><a className="hero-cta" href="#plateformes">Explorer les plateformes <span>↓</span></a></div>
          <aside className="hero-qr" aria-label="QR code du portail DATASYS CONNECT"><div className="qr-heading"><span>ACCÈS DIRECT</span><strong>Scannez pour visiter</strong></div>{qrPng ? <Image className="qr-image" src={qrPng} alt="QR code pour ouvrir le portail DATASYS CONNECT" width={720} height={720} unoptimized /> : <div className="qr-placeholder" aria-hidden="true">Génération du QR…</div>}<p className="qr-target">{qrTarget}</p><div className="qr-downloads"><a href={qrPng || undefined} download="datasys-connect.png">PNG</a><a href={qrSvg ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(qrSvg)}` : undefined} download="datasys-connect.svg">SVG</a></div></aside>
        </div><div className="hero-foot shell"><span>Simple d’accès</span><span>Pensé pour mobile</span><span>Un écosystème évolutif</span><span className="hero-location">Bamako · Mali</span></div></section>

        <section className="services shell" id="plateformes"><div className="section-heading"><div><p className="eyebrow">L’écosystème DATASYS</p><h2>Choisissez votre service<span>.</span></h2></div><p className="section-note">Des solutions numériques conçues pour vous accompagner au quotidien.</p></div>
          <div className="catalog-tools"><div className="filters" aria-label="Filtrer par catégorie">{categories.map((item) => <button className="filter-button" aria-pressed={category === item} key={item} onClick={() => setCategory(item)} type="button">{item}</button>)}</div><label className="search-box"><span aria-hidden="true">⌕</span><input aria-label="Rechercher une plateforme" onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher" type="search" /></label></div>
          <div className="platform-grid" aria-live="polite">{visiblePlatforms.length ? visiblePlatforms.map((platform, index) => {
            const link = safeWebUrl(platform.url);
            const logo = safeWebUrl(platform.logo);
            return <article className="platform-card" key={platform.id}><div className="card-topline"><span className="card-number">{String(index + 1).padStart(2, "0")}</span><span className={`service-status ${platform.status === "maintenance" ? "is-maintenance" : ""}`}><i />{platform.status === "maintenance" ? "Maintenance" : "Disponible"}</span></div><div className="service-logo" style={logo ? { backgroundImage: `url("${logo}")` } : undefined}>{logo ? null : initials(platform.name)}</div><p className="service-category">{platform.category}</p><h3>{platform.name}</h3><p className="service-description">{platform.description}</p><div className="card-action">{link && platform.status === "available" ? <a href={link} onClick={() => { void fetch(`/api/catalog/${encodeURIComponent(platform.id)}/visit`, { method: "POST", credentials: "same-origin" }).catch(() => undefined); }} rel="noreferrer" target="_blank">Accéder <span>↗</span></a> : <span className="link-pending">{platform.status === "maintenance" ? "Service indisponible" : "Lien à confirmer"}</span>}<span className="card-arrow" aria-hidden="true">↗</span></div></article>;
          }) : <p className="empty-results">Aucune plateforme ne correspond à votre recherche.</p>}</div>
          <p className="content-note">Plateformes présentées à titre indicatif, sous réserve de validation par DATASYS.</p>
        </section>
        <section className="contact-band" id="contact"><div className="shell contact-layout"><div><p className="eyebrow">Besoin d’orientation ?</p><h2>Parlons de votre projet.</h2><p>Notre équipe vous aide à trouver la solution adaptée.</p></div><a href="mailto:contact@datasys.com">Contacter DATASYS <span>↗</span></a></div></section>
      </main>

      <footer className="site-footer"><div className="shell footer-main"><a className="brand footer-brand" href="#accueil"><span className="brand-mark">D</span><span className="brand-name">DATASYS<span>CONNECT</span></span></a><p>Un point d’entrée vers nos solutions numériques.</p><a href="mailto:contact@datasys.com">contact@datasys.com</a></div><div className="shell footer-bottom"><span>© 2026 DATASYS — Tous droits réservés</span><span>Portail de démonstration · liens et contenus à valider</span></div></footer>
    </>
  );
}
