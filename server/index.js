import "dotenv/config";
import express from "express";
import cors from "cors";
import { nanoid } from "nanoid";
import path from "path";
import { fileURLToPath } from "url";
import { initDb, pingDb, query, withTransaction } from "./db.js";

const app = express();
const port = Number(process.env.PORT || process.env.API_PORT || 4000);
const isVercel = process.env.VERCEL === "1";
let dbInitPromise;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function ensureDbInitialized() {
  if (!dbInitPromise) {
    dbInitPromise = initDb().catch((error) => {
      dbInitPromise = undefined;
      throw error;
    });
  }
  return dbInitPromise;
}

app.use(cors());
app.use(express.json());

app.use("/api", async (req, res, next) => {
  if (req.path === "/health") {
    return next();
  }

  try {
    if (isVercel) {
      await ensureDbInitialized();
    }
    await pingDb();
    return next();
  } catch {
    return res.status(503).json({ message: "Database is starting. Please retry in a few seconds." });
  }
});

app.get("/api/health", async (_req, res) => {
  try {
    await pingDb();
    res.json({ ok: true, service: "innersprings-local-api", database: "connected" });
  } catch {
    res.status(503).json({ ok: false, service: "innersprings-local-api", database: "disconnected" });
  }
});

function toCamelClient(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    service: row.service,
    status: row.status,
    joinDate: row.join_date,
    totalSessions: row.total_sessions,
    completedSessions: row.completed_sessions,
    totalCost: row.total_cost,
    amountPaid: row.amount_paid,
  };
}

function toCamelSession(row) {
  return {
    id: row.id,
    clientId: row.client_id,
    title: row.title,
    date: row.date,
    time: row.time,
    status: row.status,
    cost: row.cost,
    notes: row.notes,
    achievements: row.achievements,
    sessionNumber: row.session_number,
    totalSessions: row.total_sessions,
  };
}

function toCamelDocument(row) {
  return {
    id: row.id,
    clientId: row.client_id,
    title: row.title,
    type: row.type,
    sessionRelated: row.session_related,
    dateAdded: row.date_added,
    fileSize: row.file_size,
  };
}

function toCamelNotification(row) {
  return {
    id: row.id,
    clientId: row.client_id,
    title: row.title,
    message: row.message,
    type: row.type,
    date: row.date,
    read: row.read,
  };
}

function toCamelPayment(row) {
  return {
    id: row.id,
    clientId: row.client_id,
    sessionNumber: row.session_number,
    amount: row.amount,
    status: row.status,
    date: row.date,
    method: row.method,
  };
}

function toCamelResource(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    type: row.type,
    category: row.category,
    dateAdded: row.date_added,
  };
}

function toCamelBooking(row) {
  return {
    id: row.id,
    service: row.service,
    date: row.date,
    time: row.time,
    name: row.name,
    email: row.email,
    phone: row.phone,
    notes: row.notes,
    status: row.status,
    createdAt: row.created_at,
    reviewedAt: row.reviewed_at,
    convertedClientId: row.converted_client_id,
  };
}

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body ?? {};
  const userResult = await query(
    `SELECT id, role, name, email, phone, client_id
     FROM users
     WHERE email = $1 AND password = $2 AND role = 'client'`,
    [email, password],
  );
  const user = userResult.rows[0];
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const clientResult = await query("SELECT * FROM clients WHERE id = $1", [user.client_id]);
  const client = clientResult.rows[0] ? toCamelClient(clientResult.rows[0]) : null;

  return res.json({
    token: nanoid(),
    user: {
      id: user.id,
      role: user.role,
      name: user.name,
      email: user.email,
      clientId: user.client_id,
      phone: user.phone,
    },
    client,
  });
});

app.post("/api/auth/admin/login", async (req, res) => {
  const { email, password } = req.body ?? {};
  const userResult = await query(
    `SELECT id, role, name, email
     FROM users
     WHERE email = $1 AND password = $2 AND role = 'admin'`,
    [email, password],
  );
  const user = userResult.rows[0];
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  return res.json({
    token: nanoid(),
    user: { id: user.id, role: user.role, name: user.name, email: user.email },
  });
});

app.get("/api/dashboard/:clientId", async (req, res) => {
  const { clientId } = req.params;
  const clientResult = await query("SELECT * FROM clients WHERE id = $1", [clientId]);
  const clientRow = clientResult.rows[0];
  if (!clientRow) {
    return res.status(404).json({ message: "Client not found" });
  }

  const [sessions, documents, notifications, payments, resources] = await Promise.all([
    query("SELECT * FROM sessions WHERE client_id = $1 ORDER BY session_number", [clientId]),
    query("SELECT * FROM documents WHERE client_id = $1 ORDER BY date_added DESC", [clientId]),
    query("SELECT * FROM notifications WHERE client_id = $1 ORDER BY date DESC", [clientId]),
    query("SELECT * FROM payments WHERE client_id = $1 ORDER BY session_number", [clientId]),
    query("SELECT * FROM resources ORDER BY date_added DESC"),
  ]);

  return res.json({
    client: toCamelClient(clientRow),
    sessions: sessions.rows.map(toCamelSession),
    documents: documents.rows.map(toCamelDocument),
    notifications: notifications.rows.map(toCamelNotification),
    payments: payments.rows.map(toCamelPayment),
    resources: resources.rows.map(toCamelResource),
  });
});

app.get("/api/admin/clients", async (_req, res) => {
  const result = await query("SELECT * FROM clients ORDER BY join_date DESC");
  res.json({ clients: result.rows.map(toCamelClient) });
});

app.get("/api/admin/clients/:clientId", async (req, res) => {
  const { clientId } = req.params;
  const clientResult = await query("SELECT * FROM clients WHERE id = $1", [clientId]);
  const clientRow = clientResult.rows[0];
  if (!clientRow) {
    return res.status(404).json({ message: "Client not found" });
  }

  const [userResult, sessions, documents, notifications, payments, bookingResult] = await Promise.all([
    query("SELECT id, name, email, phone, role FROM users WHERE client_id = $1 LIMIT 1", [clientId]),
    query("SELECT * FROM sessions WHERE client_id = $1 ORDER BY session_number", [clientId]),
    query("SELECT * FROM documents WHERE client_id = $1 ORDER BY date_added DESC", [clientId]),
    query("SELECT * FROM notifications WHERE client_id = $1 ORDER BY date DESC", [clientId]),
    query("SELECT * FROM payments WHERE client_id = $1 ORDER BY session_number", [clientId]),
    query("SELECT * FROM bookings WHERE converted_client_id = $1 ORDER BY reviewed_at DESC LIMIT 1", [clientId]),
  ]);

  return res.json({
    client: toCamelClient(clientRow),
    account: userResult.rows[0] || null,
    sessions: sessions.rows.map(toCamelSession),
    documents: documents.rows.map(toCamelDocument),
    notifications: notifications.rows.map(toCamelNotification),
    payments: payments.rows.map(toCamelPayment),
    sourceBooking: bookingResult.rows[0] ? toCamelBooking(bookingResult.rows[0]) : null,
  });
});

app.get("/api/admin/admins", async (_req, res) => {
  const result = await query("SELECT id, name, email, role FROM users WHERE role = 'admin' ORDER BY name");
  res.json({ admins: result.rows });
});

app.get("/api/admin/bookings", async (req, res) => {
  const status = req.query.status || "pending";
  const result = await query("SELECT * FROM bookings WHERE status = $1 ORDER BY created_at DESC", [status]);
  res.json({ bookings: result.rows.map(toCamelBooking) });
});

app.post("/api/admin/bookings/:bookingId/provision-client", async (req, res) => {
  const { bookingId } = req.params;
  const { password, totalSessions, totalCost } = req.body ?? {};

  const bookingResult = await query("SELECT * FROM bookings WHERE id = $1", [bookingId]);
  const booking = bookingResult.rows[0];
  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }
  if (booking.status !== "pending") {
    return res.status(400).json({ message: "Booking already reviewed" });
  }

  const existingUser = await query("SELECT id FROM users WHERE email = $1", [booking.email]);
  if (existingUser.rowCount > 0) {
    return res.status(409).json({ message: "A user with this email already exists" });
  }

  const defaultSessionMap = {
    coaching: 12,
    "mental-health": 8,
    training: 6,
  };

  const resolvedTotalSessions = Number(totalSessions) || defaultSessionMap[booking.service] || 6;
  const resolvedTotalCost = Number(totalCost) || resolvedTotalSessions * 10000;
  const generatedPassword = password || `inner-${nanoid(8)}`;
  const clientId = `c_${nanoid(10)}`;
  const userId = `u_${nanoid(10)}`;

  await withTransaction(async (tx) => {
    await tx.query(
      `INSERT INTO clients (id, name, email, phone, service, status, join_date, total_sessions, completed_sessions, total_cost, amount_paid)
       VALUES ($1,$2,$3,$4,$5,'active',$6,$7,0,$8,0)`,
      [
        clientId,
        booking.name,
        booking.email,
        booking.phone,
        booking.service,
        new Date().toISOString().slice(0, 10),
        resolvedTotalSessions,
        resolvedTotalCost,
      ],
    );

    await tx.query(
      `INSERT INTO users (id, role, name, email, password, phone, client_id)
       VALUES ($1,'client',$2,$3,$4,$5,$6)`,
      [userId, booking.name, booking.email, generatedPassword, booking.phone, clientId],
    );

    await tx.query(
      `UPDATE bookings
       SET status = 'approved', reviewed_at = NOW(), converted_client_id = $2
       WHERE id = $1`,
      [booking.id, clientId],
    );
  });

  return res.status(201).json({
    credentials: {
      email: booking.email,
      password: generatedPassword,
      clientId,
      name: booking.name,
    },
  });
});

app.post("/api/admin/admins", async (req, res) => {
  const { name, email, role, password } = req.body ?? {};
  if (!name || !email || !role || !password) {
    return res.status(400).json({ message: "Missing required fields: name, email, role, password" });
  }

  const id = nanoid();
  await query(
    "INSERT INTO users (id, role, name, email, password) VALUES ($1, $2, $3, $4, $5)",
    [id, role === "Super Admin" ? "admin" : "admin", name, email, password],
  );
  return res.status(201).json({ admin: { id, name, email, role } });
});

app.delete("/api/admin/admins/:id", async (req, res) => {
  const { id } = req.params;
  const result = await query("DELETE FROM users WHERE id = $1 AND role = 'admin'", [id]);
  if (result.rowCount === 0) {
    return res.status(404).json({ message: "Admin not found" });
  }
  return res.status(204).send();
});

app.post("/api/admin/clients/:clientId/sessions", async (req, res) => {
  const { clientId } = req.params;
  const { title, sessionNumber, date, time, status, cost, notes, achievements } = req.body ?? {};
  if (!title || !sessionNumber || !date || !time || !status || !cost) {
    return res.status(400).json({ message: "Missing required fields for session" });
  }

  const id = nanoid();
  const totalResult = await query("SELECT total_sessions FROM clients WHERE id = $1", [clientId]);
  const totalSessions = totalResult.rows[0]?.total_sessions || Number(sessionNumber);
  await query(
    `INSERT INTO sessions (id, client_id, title, date, time, status, cost, notes, achievements, session_number, total_sessions)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
    [id, clientId, title, date, time, status, Number(cost), notes || "", achievements || "", Number(sessionNumber), totalSessions],
  );
  return res.status(201).json({ id });
});

app.post("/api/admin/clients/:clientId/documents", async (req, res) => {
  const { clientId } = req.params;
  const { title, type, sessionRelated, fileSize } = req.body ?? {};
  if (!title || !type) {
    return res.status(400).json({ message: "Missing required fields for document" });
  }

  const id = nanoid();
  await query(
    `INSERT INTO documents (id, client_id, title, type, session_related, date_added, file_size)
     VALUES ($1,$2,$3,$4,$5,$6,$7)`,
    [id, clientId, title, type, sessionRelated || null, new Date().toISOString().slice(0, 10), fileSize || "N/A"],
  );
  return res.status(201).json({ id });
});

app.post("/api/admin/clients/:clientId/payments", async (req, res) => {
  const { clientId } = req.params;
  const { sessionNumber, amount, method, date } = req.body ?? {};
  if (!sessionNumber || !amount || !method || !date) {
    return res.status(400).json({ message: "Missing required fields for payment" });
  }

  const id = nanoid();
  await query(
    `INSERT INTO payments (id, client_id, session_number, amount, status, date, method)
     VALUES ($1,$2,$3,$4,'paid',$5,$6)`,
    [id, clientId, Number(sessionNumber), Number(amount), date, method],
  );
  return res.status(201).json({ id });
});

app.post("/api/admin/clients/:clientId/notifications", async (req, res) => {
  const { clientId } = req.params;
  const { title, type, message } = req.body ?? {};
  if (!title || !type || !message) {
    return res.status(400).json({ message: "Missing required fields for notification" });
  }

  const id = nanoid();
  await query(
    `INSERT INTO notifications (id, client_id, title, message, type, date, read)
     VALUES ($1,$2,$3,$4,$5,$6,false)`,
    [id, clientId, title, message, type, new Date().toISOString().slice(0, 10)],
  );
  return res.status(201).json({ id });
});

app.post("/api/bookings", async (req, res) => {
  const payload = req.body ?? {};
  const required = ["service", "date", "time", "name", "email", "phone"];
  const missing = required.filter((key) => !payload[key]);
  if (missing.length > 0) {
    return res.status(400).json({ message: `Missing required fields: ${missing.join(", ")}` });
  }

  const booking = {
    id: nanoid(),
    createdAt: new Date().toISOString(),
    status: "pending",
    ...payload,
  };

  await query(
    `INSERT INTO bookings (id, service, date, time, name, email, phone, notes, status, created_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
    [
      booking.id,
      booking.service,
      booking.date,
      booking.time,
      booking.name,
      booking.email,
      booking.phone,
      booking.notes || "",
      booking.status,
      booking.createdAt,
    ],
  );

  return res.status(201).json({ booking });
});

app.post("/api/contact-messages", async (req, res) => {
  const payload = req.body ?? {};
  const required = ["name", "email", "service", "message"];
  const missing = required.filter((key) => !payload[key]);
  if (missing.length > 0) {
    return res.status(400).json({ message: `Missing required fields: ${missing.join(", ")}` });
  }

  const message = {
    id: nanoid(),
    createdAt: new Date().toISOString(),
    ...payload,
  };

  await query(
    `INSERT INTO contact_messages (id, name, email, phone, service, message, created_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7)`,
    [message.id, message.name, message.email, message.phone || null, message.service, message.message, message.createdAt],
  );

  return res.status(201).json({ message });
});

if (!isVercel) {
  const distPath = path.resolve(__dirname, "..", "dist");

  app.use(express.static(distPath));
  app.get(/^\/(?!api).*/, (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

const DB_RETRY_MS = 5000;

async function initDbWithRetry() {
  try {
    await initDb();
    console.log("PostgreSQL initialized and ready.");
  } catch (error) {
    console.error("Failed to initialize PostgreSQL:", error);
    console.error(
      `Retrying in ${DB_RETRY_MS / 1000}s. Start PostgreSQL and verify DATABASE_URL in .env (or run npm run db:start).`,
    );
    setTimeout(initDbWithRetry, DB_RETRY_MS);
  }
}

if (isVercel) {
  void ensureDbInitialized().catch((error) => {
    console.error("Failed to initialize PostgreSQL in Vercel runtime:", error);
  });
} else {
  app.listen(port, () => {
    console.log(`Local API running on http://localhost:${port}`);
    void initDbWithRetry();
  });
}

export default app;
