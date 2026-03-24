import { Database } from "bun:sqlite";

const DB_PATH = process.env.DB_PATH ?? "./principl.db";

let db: Database;

export function initDb(): void {
  db = new Database(DB_PATH);
  db.run("PRAGMA journal_mode = WAL");
  db.run(`
    CREATE TABLE IF NOT EXISTS applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      revenue TEXT NOT NULL,
      fix_first TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT
    )
  `);
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

export function upsertApplication(app: Application): UpsertResult {
  const existing = db
    .query("SELECT id FROM applications WHERE email = ?")
    .get(app.email);

  if (existing) {
    db.run(
      `UPDATE applications SET name = ?, revenue = ?, fix_first = ?, updated_at = datetime('now') WHERE email = ?`,
      [app.name, app.revenue, app.fix_first, app.email]
    );
    return { isNew: false };
  }

  db.run(
    `INSERT INTO applications (name, email, revenue, fix_first) VALUES (?, ?, ?, ?)`,
    [app.name, app.email, app.revenue, app.fix_first]
  );
  return { isNew: true };
}
