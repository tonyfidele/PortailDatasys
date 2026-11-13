import { deletePlatform, updatePlatform } from "@/lib/catalog";
import { AdminApiError, noStoreHeaders, readJsonBody, withAdmin } from "@/lib/admin-api";
import { platformInputSchema } from "@/lib/platform";

type RouteContext = { params: Promise<{ id: string }> };

function validId(id: string) {
  return /^[A-Za-z0-9_-]{1,80}$/.test(id);
}

export async function PATCH(request: Request, context: RouteContext) {
  return withAdmin(request, async () => {
    const { id } = await context.params;
    if (!validId(id)) throw new AdminApiError("Plateforme introuvable.", 404);
    const parsed = platformInputSchema.safeParse(await readJsonBody(request));
    if (!parsed.success) throw new AdminApiError("Vérifiez les champs de la plateforme.", 400);
    if (!(await updatePlatform(id, parsed.data))) throw new AdminApiError("Plateforme introuvable.", 404);
    return Response.json({ ok: true }, { headers: noStoreHeaders() });
  });
}

export async function DELETE(request: Request, context: RouteContext) {
  return withAdmin(request, async () => {
    const { id } = await context.params;
    if (!validId(id)) throw new AdminApiError("Plateforme introuvable.", 404);
    if (!(await deletePlatform(id))) throw new AdminApiError("Plateforme introuvable.", 404);
    return Response.json({ ok: true }, { headers: noStoreHeaders() });
  });
}
