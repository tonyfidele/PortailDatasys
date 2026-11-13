import "server-only";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 },
  pages: { signIn: "/admin/login" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Adresse e-mail", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        const configuredEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
        const passwordHash = process.env.ADMIN_PASSWORD_HASH;
        const email = typeof credentials.email === "string" ? credentials.email.trim().toLowerCase() : "";
        const password = typeof credentials.password === "string" ? credentials.password : "";

        if (!configuredEmail || !passwordHash || !/^\$2[aby]\$\d\d\$[./A-Za-z0-9]{53}$/.test(passwordHash)) {
          return null;
        }

        const cost = Number(passwordHash.slice(4, 6));
        const passwordBytes = new TextEncoder().encode(password).byteLength;
        if (cost < 12 || cost > 15 || email.length > 254 || password.length < 12 || passwordBytes > 72) return null;

        const validPassword = await bcrypt.compare(password, passwordHash);
        if (!validPassword || email !== configuredEmail) return null;
        return { id: configuredEmail, email: configuredEmail, name: "Administrateur" };
      },
    }),
  ],
});
