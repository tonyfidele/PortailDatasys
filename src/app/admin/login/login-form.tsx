"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);
    const values = new FormData(event.currentTarget);
    try {
      const result = await signIn("credentials", {
        email: String(values.get("email") ?? ""),
        password: String(values.get("password") ?? ""),
        redirect: false,
        redirectTo: "/admin",
      });
      if (!result || result.error) {
        setError("Identifiants invalides.");
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Connexion impossible pour le moment.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="login-form" onSubmit={submit}>
      <label>Adresse e-mail<input autoComplete="username" maxLength={254} name="email" required type="email" /></label>
      <label>Mot de passe<input autoComplete="current-password" maxLength={72} minLength={12} name="password" required type="password" /></label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="primary-button" disabled={pending} type="submit">{pending ? "Connexion…" : "Se connecter"}</button>
    </form>
  );
}
