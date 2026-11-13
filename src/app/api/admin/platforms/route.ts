import { createPlatform, getAdminPlatforms } from "@/lib/catalog";
import { noStoreHeaders, readJsonBody, AdminApiError, withAdmin } from "@/lib/admin-api";
import { platformInputSchema } from "@/lib/platform";

export async function GET(request: Request) {
  return withAdmin(request, async () =>
    Response.json({ platforms: await getAdminPlatforms() }, { headers: noStoreHeaders() }),
  );
}

export async function POST(request: Request) {
  return withAdmin(request, async () => {
    const parsed = platformInputSchema.safeParse(await readJsonBody(request));
    if (!parsed.success) throw new AdminApiError("Vérifiez les champs de la plateforme.", 400);
    const id = await createPlatform(parsed.data);
    return Response.json({ id }, { status: 201, headers: noStoreHeaders() });
  });
}
