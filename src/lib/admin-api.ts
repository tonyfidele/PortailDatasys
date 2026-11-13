import "server-only";
import { isAdmin } from "@/lib/authz";

export class AdminApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

export async function withAdmin(
  request: Request,
  handler: () => Promise<Response>,
) {
  if (request.method !== "GET" && !isSameOrigin(request)) {
    return Response.json({ error: "Requête non autorisée." }, { status: 403, headers: { "Cache-Control": "no-store" } });
  }

  try {
    if (!(await isAdmin())) {
      return Response.json({ error: "Authentification requise." }, { status: 401, headers: { "Cache-Control": "no-store" } });
    }
    return await handler();
  } catch (error) {
    const status = error instanceof AdminApiError ? error.status : 500;
    const message = error instanceof AdminApiError ? error.message : "Une erreur est survenue.";
    return Response.json({ error: message }, { status, headers: { "Cache-Control": "no-store" } });
  }
}

export async function readJsonBody(request: Request): Promise<unknown> {
  const contentType = request.headers.get("content-type")?.split(";")[0].trim().toLowerCase();
  if (contentType !== "application/json") {
    throw new AdminApiError("Le corps doit être au format JSON.", 415);
  }

  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  const maxBytes = 16 * 1024;
  if (declaredLength > maxBytes) {
    throw new AdminApiError("Requête trop volumineuse.", 413);
  }
  if (!request.body) throw new AdminApiError("Corps de requête manquant.", 400);

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maxBytes) {
      await reader.cancel();
      throw new AdminApiError("Requête trop volumineuse.", 413);
    }
    chunks.push(value);
  }

  try {
    const bytes = new Uint8Array(total);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }
    return JSON.parse(new TextDecoder().decode(bytes)) as unknown;
  } catch {
    throw new AdminApiError("JSON invalide.", 400);
  }
}

export function noStoreHeaders() {
  return { "Cache-Control": "no-store, max-age=0" };
}
