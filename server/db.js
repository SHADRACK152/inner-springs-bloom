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

CREATE TABLE IF NOT EXISTS intake_forms (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL UNIQUE REFERENCES clients(id) ON DELETE CASCADE,
  goals TEXT,
  challenges TEXT,
  history TEXT,
  preferred_style TEXT,
  availability TEXT,
  consent BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'reviewed')),
  coach_review_required BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  coach_reviewed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS coaching_proposals (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  coach_id TEXT,
  objectives TEXT NOT NULL,
  duration_sessions INTEGER NOT NULL,
  frequency TEXT NOT NULL CHECK (frequency IN ('weekly', 'bi-weekly')),
  investment INTEGER NOT NULL,
  expected_outcomes TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'accepted', 'rejected')),
  generated_at TIMESTAMPTZ NOT NULL,
  sent_at TIMESTAMPTZ,
  due_by TIMESTAMPTZ NOT NULL,
  reviewed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS consent_agreements (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  proposal_id TEXT NOT NULL REFERENCES coaching_proposals(id) ON DELETE CASCADE,
  agreement_doc_id TEXT REFERENCES documents(id),
  consented BOOLEAN NOT NULL DEFAULT false,
  consented_at TIMESTAMPTZ,
  signature_requested_at TIMESTAMPTZ,
  signed BOOLEAN NOT NULL DEFAULT false,
  signature_name TEXT,
  signature_value TEXT,
  signed_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'consented', 'signed')),
  updated_at TIMESTAMPTZ NOT NULL
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

CREATE TABLE IF NOT EXISTS generated_documents (
  id TEXT PRIMARY KEY,
  document_id TEXT NOT NULL UNIQUE REFERENCES documents(id) ON DELETE CASCADE,
  client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  content_base64 TEXT NOT NULL,
  file_size_bytes INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS activity_notifications (
  id TEXT PRIMARY KEY,
  audience TEXT NOT NULL CHECK (audience IN ('admin', 'client', 'both')),
  client_id TEXT REFERENCES clients(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('email', 'sms', 'system')),
  action_label TEXT,
  action_path TEXT,
  created_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS activity_notification_reads (
  notification_id TEXT NOT NULL REFERENCES activity_notifications(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'client')),
  client_id TEXT,
  read_at TIMESTAMPTZ NOT NULL,
  PRIMARY KEY (notification_id, role, client_id)
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
    `INSERT INTO intake_forms (
      id, client_id, goals, challenges, history, preferred_style, availability,
      consent, status, coach_review_required, completed_at, coach_reviewed_at, updated_at
    ) VALUES (
      'if1', 'c1',
      'Improve leadership confidence, communication, and strategic planning.',
      'Balancing team demands with personal growth goals.',
      'Has attended short leadership workshops but no prior 1:1 coaching.',
      'Prefers practical frameworks, accountability, and reflection prompts.',
      'Weekdays 9:00-11:00 AM EAT',
      true, 'submitted', true, NOW(), NULL, NOW()
    )`,
  );

  await query(
    `INSERT INTO coaching_proposals (
      id, client_id, coach_id, objectives, duration_sessions, frequency,
      investment, expected_outcomes, status, generated_at, sent_at, due_by, reviewed_at, updated_at
    ) VALUES (
      'cp1', 'c1', 'a1',
      'Strengthen executive communication, increase strategic focus, and improve delegation confidence.',
      12, 'weekly', 120000,
      'Clear leadership communication, improved performance conversations, and stronger execution rhythm.',
      'sent', NOW(), NOW(), NOW() + INTERVAL '48 hours', NULL, NOW()
    )`,
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
    `INSERT INTO activity_notifications (id, audience, client_id, title, message, type, action_label, action_path, created_at)
     VALUES
     ('an1','client','c1','Welcome to InnerSprings','Your portal is ready. Complete your next onboarding step from the documents section.','system','Open Documents','/dashboard/documents',NOW()),
     ('an2','admin','c1','Client Portal Provisioned','A new client account is active and awaiting onboarding review.','system','Open Client','/admin/clients/c1',NOW())`,
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

  await query("ALTER TABLE intake_forms ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft'");
  await query("ALTER TABLE intake_forms ADD COLUMN IF NOT EXISTS coach_review_required BOOLEAN DEFAULT false");
  await query("ALTER TABLE intake_forms ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ");
  await query("ALTER TABLE intake_forms ADD COLUMN IF NOT EXISTS coach_reviewed_at TIMESTAMPTZ");
  await query("ALTER TABLE intake_forms ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW()");
  await query("UPDATE intake_forms SET status = COALESCE(status, 'draft')");
  await query("UPDATE intake_forms SET coach_review_required = COALESCE(coach_review_required, false)");
  await query("UPDATE intake_forms SET updated_at = COALESCE(updated_at, NOW())");
  await query("ALTER TABLE intake_forms ALTER COLUMN status SET NOT NULL");
  await query("ALTER TABLE intake_forms ALTER COLUMN coach_review_required SET NOT NULL");
  await query("ALTER TABLE intake_forms ALTER COLUMN updated_at SET NOT NULL");

  await query("ALTER TABLE coaching_proposals ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft'");
  await query("ALTER TABLE coaching_proposals ADD COLUMN IF NOT EXISTS sent_at TIMESTAMPTZ");
  await query("ALTER TABLE coaching_proposals ADD COLUMN IF NOT EXISTS due_by TIMESTAMPTZ DEFAULT NOW() + INTERVAL '48 hours'");
  await query("ALTER TABLE coaching_proposals ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ");
  await query("ALTER TABLE coaching_proposals ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW()");
  await query("UPDATE coaching_proposals SET status = COALESCE(status, 'draft')");
  await query("UPDATE coaching_proposals SET due_by = COALESCE(due_by, generated_at + INTERVAL '48 hours')");
  await query("UPDATE coaching_proposals SET updated_at = COALESCE(updated_at, NOW())");
  await query("ALTER TABLE coaching_proposals ALTER COLUMN status SET NOT NULL");
  await query("ALTER TABLE coaching_proposals ALTER COLUMN due_by SET NOT NULL");
  await query("ALTER TABLE coaching_proposals ALTER COLUMN updated_at SET NOT NULL");

  await query("ALTER TABLE consent_agreements ADD COLUMN IF NOT EXISTS consented BOOLEAN DEFAULT false");
  await query("ALTER TABLE consent_agreements ADD COLUMN IF NOT EXISTS consented_at TIMESTAMPTZ");
  await query("ALTER TABLE consent_agreements ADD COLUMN IF NOT EXISTS signature_requested_at TIMESTAMPTZ");
  await query("ALTER TABLE consent_agreements ADD COLUMN IF NOT EXISTS signed BOOLEAN DEFAULT false");
  await query("ALTER TABLE consent_agreements ADD COLUMN IF NOT EXISTS signature_name TEXT");
  await query("ALTER TABLE consent_agreements ADD COLUMN IF NOT EXISTS signature_value TEXT");
  await query("ALTER TABLE consent_agreements ADD COLUMN IF NOT EXISTS signed_at TIMESTAMPTZ");
  await query("ALTER TABLE consent_agreements ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending'");
  await query("ALTER TABLE consent_agreements ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW()");
  await query("UPDATE consent_agreements SET consented = COALESCE(consented, false)");
  await query("UPDATE consent_agreements SET signed = COALESCE(signed, false)");
  await query("UPDATE consent_agreements SET status = COALESCE(status, 'pending')");
  await query("UPDATE consent_agreements SET updated_at = COALESCE(updated_at, NOW())");
  await query("ALTER TABLE consent_agreements ALTER COLUMN consented SET NOT NULL");
  await query("ALTER TABLE consent_agreements ALTER COLUMN signed SET NOT NULL");
  await query("ALTER TABLE consent_agreements ALTER COLUMN status SET NOT NULL");
  await query("ALTER TABLE consent_agreements ALTER COLUMN updated_at SET NOT NULL");

  await query("ALTER TABLE activity_notifications ADD COLUMN IF NOT EXISTS action_label TEXT");
  await query("ALTER TABLE activity_notifications ADD COLUMN IF NOT EXISTS action_path TEXT");

  await query("ALTER TABLE generated_documents ADD COLUMN IF NOT EXISTS file_size_bytes INTEGER DEFAULT 0");
  await query("UPDATE generated_documents SET file_size_bytes = COALESCE(file_size_bytes, 0)");
  await query("ALTER TABLE generated_documents ALTER COLUMN file_size_bytes SET NOT NULL");

  await seedIfEmpty();
}
