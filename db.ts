import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!, { max: 5 });

export async function initDb(): Promise<void> {
  await sql`
    CREATE TABLE IF NOT EXISTS applications (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      revenue TEXT NOT NULL,
      fix_first TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ
    )
  `;
}

export interface Application {
  name: string;
  email: string;
  revenue: string;
  fix_first: string;
}

export interface UpsertResult {
  isNew: boolean;
}

export async function upsertApplication(app: Application): Promise<UpsertResult> {
  const result = await sql`
    INSERT INTO applications (name, email, revenue, fix_first)
    VALUES (${app.name}, ${app.email}, ${app.revenue}, ${app.fix_first})
    ON CONFLICT (email) DO UPDATE SET
      name = EXCLUDED.name,
      revenue = EXCLUDED.revenue,
      fix_first = EXCLUDED.fix_first,
      updated_at = now()
    RETURNING (xmax = 0) AS is_new
  `;
  return { isNew: result[0].is_new };
}
