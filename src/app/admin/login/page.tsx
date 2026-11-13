import Link from "next/link";
import LoginForm from "@/app/admin/login/login-form";

export default function AdminLoginPage() {
  return (
    <main className="shell admin login-shell">
      <section className="platform-modal login-card" aria-labelledby="login-title">
        <p className="eyebrow">DATASYS CONNECT · accès sécurisé</p>
        <h1 id="login-title">Administration</h1>
        <p>Connectez-vous avec les identifiants de l’administrateur.</p>
        <LoginForm />
        <Link className="login-back" href="/portail">← Retour au portail public</Link>
      </section>
    </main>
  );
}
