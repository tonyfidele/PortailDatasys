import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DATASYS CONNECT — Toutes nos solutions, un seul accès",
  description:
    "Retrouvez les plateformes numériques proposées par DATASYS depuis un portail unique.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
