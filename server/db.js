import pg from "pg";

const { Pool } = pg;

const connectionString =
  process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/innersprings";

const pool = new Pool({ connectionString });

pool.on("error", (error) => {
  console.error("Unexpected PostgreSQL pool error:", error);
});

const schemaSql = `
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  role TEXT NOT NULL CHECK (role IN ('client', 'admin')),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  phone TEXT,
  client_id TEXT
);

CREATE TABLE IF NOT EXISTS clients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  service TEXT NOT NULL CHECK (service IN ('coaching', 'mental-health', 'training')),
  status TEXT NOT NULL CHECK (status IN ('active', 'completed', 'on-hold')),
  join_date DATE NOT NULL,
  total_sessions INTEGER NOT NULL,
  completed_sessions INTEGER NOT NULL,
  total_cost INTEGER NOT NULL,
  amount_paid INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('completed', 'pending', 'cancelled')),
  cost INTEGER NOT NULL,
  notes TEXT NOT NULL,
  achievements TEXT NOT NULL,
  session_number INTEGER NOT NULL,
  total_sessions INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('report', 'agreement', 'certificate', 'assessment')),
  session_related INTEGER,
  date_added DATE NOT NULL,
  file_size TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS resources (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('article', 'video', 'worksheet', 'guide')),
  category TEXT NOT NULL,
  date_added DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('email', 'sms', 'system')),
  date DATE NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  session_number INTEGER NOT NULL,
  amount INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('paid', 'pending')),
  date DATE NOT NULL,
  method TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  service TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'website',
  assessment_type TEXT NOT NULL DEFAULT 'pre-coaching-assessment',
  duration_minutes INTEGER NOT NULL DEFAULT 45,
  cost INTEGER NOT NULL DEFAULT 0,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  notes TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  service TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS email_dispatches (
  id TEXT PRIMARY KEY,
  recipient_email TEXT NOT NULL,
  template TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('logged', 'sent', 'failed')),
  created_at TIMESTAMPTZ NOT NULL,
  meta JSONB NOT NULL DEFAULT '{}'::jsonb
);
`;

export async function query(text, params = []) {
  return pool.query(text, params);
}

export async function withTransaction(callback) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function pingDb() {
  await query("SELECT 1");
  return true;
}

async function seedIfEmpty() {
  const userCount = await query("SELECT COUNT(*)::int AS count FROM users");
  if (userCount.rows[0].count > 0) return;

  await query(
    `INSERT INTO clients (id, name, email, phone, service, status, join_date, total_sessions, completed_sessions, total_cost, amount_paid)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
    ["c1", "Sarah Wanjiku", "sarah.w@email.com", "+254712345678", "coaching", "active", "2025-11-15", 12, 7, 120000, 70000],
  );

  await query(
    `INSERT INTO users (id, role, name, email, password, phone, client_id) VALUES
     ($1,$2,$3,$4,$5,$6,$7),
     ($8,$9,$10,$11,$12,$13,$14)`,
    [
      "u1",
      "client",
      "Sarah Wanjiku",
      "sarah.w@email.com",
      "password123",
      "+254712345678",
      "c1",
      "a1",
      "admin",
      "Admin",
      "admin@innersprings.africa",
      "admin123",
      null,
      null,
    ],
  );

  const sessions = [
    ["s1", "Discovery & Goal Setting", "2025-11-20", "10:00 AM", "completed", 10000, "Identified core goals and values", "Established coaching agreement and 3 primary goals", 1],
    ["s2", "Values Alignment", "2025-12-04", "10:00 AM", "completed", 10000, "Deep dive into personal values", "Created personal values hierarchy", 2],
    ["s3", "Strengths Assessment", "2025-12-18", "10:00 AM", "completed", 10000, "StrengthsFinder assessment review", "Identified top 5 strengths and application plan", 3],
    ["s4", "Leadership Development", "2026-01-08", "10:00 AM", "completed", 10000, "Leadership style exploration", "Developed situational leadership framework", 4],
    ["s5", "Communication Mastery", "2026-01-22", "10:00 AM", "completed", 10000, "Active listening and feedback skills", "Practiced difficult conversation framework", 5],
    ["s6", "Emotional Intelligence", "2026-02-05", "10:00 AM", "completed", 10000, "EQ assessment and development", "Improved self-awareness score by 20%", 6],
    ["s7", "Strategic Planning", "2026-02-19", "10:00 AM", "completed", 10000, "Personal strategic plan creation", "Completed 90-day action plan", 7],
    ["s8", "Resilience Building", "2026-03-25", "10:00 AM", "pending", 10000, "", "", 8],
  ];

  for (const s of sessions) {
    await query(
      `INSERT INTO sessions (id, client_id, title, date, time, status, cost, notes, achievements, session_number, total_sessions)
       VALUES ($1,'c1',$2,$3,$4,$5,$6,$7,$8,$9,12)`,
      s,
    );
  }

  await query(
    `INSERT INTO documents (id, client_id, title, type, session_related, date_added, file_size) VALUES
     ('d1','c1','Coaching Agreement','agreement',NULL,'2025-11-15','245 KB'),
     ('d2','c1','ICF Code of Ethics','agreement',NULL,'2025-11-15','180 KB')`,
  );

  await query(
    `INSERT INTO resources (id, title, description, type, category, date_added) VALUES
     ('r1','Building Emotional Resilience','A comprehensive guide to developing emotional strength in challenging times.','guide','Mental Health','2025-10-01'),
     ('r2','Goal Setting Framework','SMART goals template and planning workbook for coaching clients.','worksheet','Coaching','2025-09-15')`,
  );

  await query(
    `INSERT INTO notifications (id, client_id, title, message, type, date, read) VALUES
     ('n1','c1','Session Reminder','Your coaching session is scheduled for March 25, 2026 at 10:00 AM.','email','2026-03-24',false)`,
  );

  await query(
    `INSERT INTO payments (id, client_id, session_number, amount, status, date, method) VALUES
     ('p1','c1',1,10000,'paid','2025-11-20','M-Pesa'),
     ('p2','c1',2,10000,'paid','2025-12-04','M-Pesa'),
     ('p3','c1',3,10000,'paid','2025-12-18','M-Pesa'),
     ('p4','c1',4,10000,'paid','2026-01-08','Bank Transfer'),
     ('p5','c1',5,10000,'paid','2026-01-22','M-Pesa'),
     ('p6','c1',6,10000,'paid','2026-02-05','M-Pesa'),
     ('p7','c1',7,10000,'paid','2026-02-19','M-Pesa'),
     ('p8','c1',8,10000,'pending','2026-03-25','')`,
  );
}

export async function initDb() {
  await query(schemaSql);
  await query("ALTER TABLE bookings ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ");
  await query("ALTER TABLE bookings ADD COLUMN IF NOT EXISTS converted_client_id TEXT");
  await query("ALTER TABLE bookings ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'website'");
  await query("ALTER TABLE bookings ADD COLUMN IF NOT EXISTS assessment_type TEXT DEFAULT 'pre-coaching-assessment'");
  await query("ALTER TABLE bookings ADD COLUMN IF NOT EXISTS duration_minutes INTEGER DEFAULT 45");
  await query("ALTER TABLE bookings ADD COLUMN IF NOT EXISTS cost INTEGER DEFAULT 0");

  await query("UPDATE bookings SET source = COALESCE(source, 'website')");
  await query("UPDATE bookings SET assessment_type = COALESCE(assessment_type, 'pre-coaching-assessment')");
  await query("UPDATE bookings SET duration_minutes = COALESCE(duration_minutes, 45)");
  await query("UPDATE bookings SET cost = COALESCE(cost, 0)");

  await query("ALTER TABLE bookings ALTER COLUMN source SET NOT NULL");
  await query("ALTER TABLE bookings ALTER COLUMN assessment_type SET NOT NULL");
  await query("ALTER TABLE bookings ALTER COLUMN duration_minutes SET NOT NULL");
  await query("ALTER TABLE bookings ALTER COLUMN cost SET NOT NULL");
  await seedIfEmpty();
}
