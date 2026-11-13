import { recordPlatformVisit } from "@/lib/catalog";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const origin = request.headers.get("origin");
  try {
    if (!origin || new URL(origin).origin !== new URL(request.url).origin) {
      return Response.json({ error: "Requête non autorisée." }, { status: 403 });
    }
  } catch {
    return Response.json({ error: "Requête non autorisée." }, { status: 403 });
  }

  const { id } = await context.params;
  if (!/^[A-Za-z0-9_-]{1,80}$/.test(id)) {
    return Response.json({ error: "Plateforme introuvable." }, { status: 404 });
  }
  try {
    await recordPlatformVisit(id);
    return new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Suivi temporairement indisponible." }, { status: 503 });
  }
}
