import "server-only";
import { database } from "@/lib/db";
import type { Platform, PlatformInput } from "@/lib/platform";
import { requireAdmin } from "@/lib/authz";

type PlatformRow = {
  id: string;
  name: string;
  category: string;
  description: string;
  url: string;
  logo: string;
  status: "available" | "maintenance";
  enabled: boolean;
  position: number;
  accessCount: number | string;
};

function mapPlatform(row: PlatformRow): Platform {
  return { ...row, position: Number(row.position), accessCount: Number(row.accessCount) };
}

export async function getPublicPlatforms(): Promise<Platform[]> {
  const sql = database();
  const rows = (await sql`
    SELECT id, name, category, description, url, logo, status, enabled,
           position, access_count AS "accessCount"
    FROM platforms
    WHERE enabled = true
    ORDER BY position ASC, id ASC
  `) as unknown as PlatformRow[];
  return rows.map(mapPlatform);
}

export async function getAdminPlatforms(): Promise<Platform[]> {
  await requireAdmin();
  const sql = database();
  const rows = (await sql`
    SELECT id, name, category, description, url, logo, status, enabled,
           position, access_count AS "accessCount"
    FROM platforms
    ORDER BY position ASC, id ASC
  `) as unknown as PlatformRow[];
  return rows.map(mapPlatform);
}

export async function createPlatform(input: PlatformInput): Promise<string> {
  await requireAdmin();
  const sql = database();
  const id = crypto.randomUUID();
  await sql`
    INSERT INTO platforms (id, name, category, description, url, logo, status, enabled, position)
    SELECT ${id}, ${input.name}, ${input.category}, ${input.description}, ${input.url},
           ${input.logo}, ${input.status}, ${input.enabled}, COALESCE(MAX(position) + 1, 0)
    FROM platforms
  `;
  return id;
}

export async function updatePlatform(id: string, input: PlatformInput): Promise<boolean> {
  await requireAdmin();
  const sql = database();
  const rows = await sql`
    UPDATE platforms
    SET name = ${input.name}, category = ${input.category}, description = ${input.description},
        url = ${input.url}, logo = ${input.logo}, status = ${input.status}, enabled = ${input.enabled},
        updated_at = now()
    WHERE id = ${id}
    RETURNING id
  `;
  return rows.length > 0;
}

export async function deletePlatform(id: string): Promise<boolean> {
  await requireAdmin();
  const sql = database();
  const rows = await sql`DELETE FROM platforms WHERE id = ${id} RETURNING id`;
  return rows.length > 0;
}

export async function movePlatform(id: string, direction: -1 | 1): Promise<boolean> {
  await requireAdmin();
  const sql = database();
  const rows = (await sql`
    SELECT id, position FROM platforms ORDER BY position ASC, id ASC
  `) as unknown as { id: string; position: number }[];
  const index = rows.findIndex((row) => row.id === id);
  const adjacent = rows[index + direction];
  if (index < 0 || !adjacent) return false;

  const current = rows[index];
  await sql`
    UPDATE platforms
    SET position = CASE
      WHEN id = ${current.id} THEN ${adjacent.position}
      ELSE ${current.position}
    END, updated_at = now()
    WHERE id IN (${current.id}, ${adjacent.id})
  `;
  return true;
}

export async function recordPlatformVisit(id: string) {
  const sql = database();
  await sql`
    UPDATE platforms SET access_count = access_count + 1, updated_at = now()
    WHERE id = ${id} AND enabled = true AND status = 'available'
  `;
}
