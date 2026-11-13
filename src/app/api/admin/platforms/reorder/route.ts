import { movePlatform } from "@/lib/catalog";
import { AdminApiError, noStoreHeaders, readJsonBody, withAdmin } from "@/lib/admin-api";
import { z } from "zod";

const reorderSchema = z.object({
  id: z.string().regex(/^[A-Za-z0-9_-]{1,80}$/),
  direction: z.union([z.literal(-1), z.literal(1)]),
}).strict();

export async function POST(request: Request) {
  return withAdmin(request, async () => {
    const parsed = reorderSchema.safeParse(await readJsonBody(request));
    if (!parsed.success) throw new AdminApiError("Ordre invalide.", 400);
    if (!(await movePlatform(parsed.data.id, parsed.data.direction))) {
      throw new AdminApiError("Aucun déplacement possible.", 409);
    }
    return Response.json({ ok: true }, { headers: noStoreHeaders() });
  });
}
