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
const welcomeEmailWebhookUrl = process.env.WELCOME_EMAIL_WEBHOOK_URL || "";
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
    source: row.source,
    assessmentType: row.assessment_type,
    durationMinutes: row.duration_minutes,
    cost: row.cost,
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

function toCamelIntakeForm(row) {
  if (!row) return null;
  return {
    id: row.id,
    clientId: row.client_id,
    goals: row.goals || "",
    challenges: row.challenges || "",
    history: row.history || "",
    preferredStyle: row.preferred_style || "",
    availability: row.availability || "",
    consent: Boolean(row.consent),
    status: row.status,
    coachReviewRequired: Boolean(row.coach_review_required),
    completedAt: row.completed_at,
    coachReviewedAt: row.coach_reviewed_at,
    updatedAt: row.updated_at,
  };
}

function toCamelProposal(row) {
  if (!row) return null;
  return {
    id: row.id,
    clientId: row.client_id,
    coachId: row.coach_id,
    objectives: row.objectives,
    durationSessions: row.duration_sessions,
    frequency: row.frequency,
    investment: row.investment,
    expectedOutcomes: row.expected_outcomes,
    status: row.status,
    generatedAt: row.generated_at,
    sentAt: row.sent_at,
    dueBy: row.due_by,
    reviewedAt: row.reviewed_at,
    updatedAt: row.updated_at,
  };
}

function toCamelConsentAgreement(row) {
  if (!row) return null;
  return {
    id: row.id,
    clientId: row.client_id,
    proposalId: row.proposal_id,
    agreementDocId: row.agreement_doc_id,
    consented: Boolean(row.consented),
    consentedAt: row.consented_at,
    signatureRequestedAt: row.signature_requested_at,
    signed: Boolean(row.signed),
    signatureName: row.signature_name,
    signedAt: row.signed_at,
    status: row.status,
    updatedAt: row.updated_at,
  };
}

function buildWelcomeEmail({ name, email, password, clientId, service }) {
  const portalUrl = process.env.CLIENT_PORTAL_URL || "https://inner-springs-bloom-production.up.railway.app/login";
  const subject = "Welcome to InnerSprings Client Portal";
  const body = [
    `Hello ${name},`,
    "",
    "Welcome to InnerSprings Africa.",
    "Your coaching profile has been created after your free pre-coaching assessment.",
    "",
    "Login credentials:",
    `Portal: ${portalUrl}`,
    `Email: ${email}`,
    `Password: ${password}`,
    `Client ID: ${clientId}`,
    `Service: ${service}`,
    "",
    "Please log in and change your password after first sign-in.",
    "",
    "InnerSprings Africa",
  ].join("\n");

  return { subject, body };
}

async function dispatchWelcomeEmail({ name, email, password, clientId, service }) {
  const { subject, body } = buildWelcomeEmail({ name, email, password, clientId, service });
  const dispatchId = `mail_${nanoid(10)}`;
  const createdAt = new Date().toISOString();

  let status = "logged";
  let providerResponse = "Webhook not configured";

  if (welcomeEmailWebhookUrl) {
    try {
      const response = await fetch(welcomeEmailWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: email,
          subject,
          text: body,
          template: "client-welcome",
          metadata: { clientId, service },
        }),
      });

      providerResponse = await response.text();
      status = response.ok ? "sent" : "failed";
    } catch (error) {
      status = "failed";
      providerResponse = error instanceof Error ? error.message : "Unknown webhook error";
    }
  }

  await query(
    `INSERT INTO email_dispatches (id, recipient_email, template, subject, body, status, created_at, meta)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8::jsonb)`,
    [
      dispatchId,
      email,
      "client-welcome",
      subject,
      body,
      status,
      createdAt,
      JSON.stringify({ clientId, service, providerResponse }),
    ],
  );

  return { status, subject };
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

  const [sessions, documents, notifications, payments, resources, intakeForm, proposalResult, consentAgreementResult] = await Promise.all([
    query("SELECT * FROM sessions WHERE client_id = $1 ORDER BY session_number", [clientId]),
    query("SELECT * FROM documents WHERE client_id = $1 ORDER BY date_added DESC", [clientId]),
    query("SELECT * FROM notifications WHERE client_id = $1 ORDER BY date DESC", [clientId]),
    query("SELECT * FROM payments WHERE client_id = $1 ORDER BY session_number", [clientId]),
    query("SELECT * FROM resources ORDER BY date_added DESC"),
    query("SELECT * FROM intake_forms WHERE client_id = $1 LIMIT 1", [clientId]),
    query("SELECT * FROM coaching_proposals WHERE client_id = $1 ORDER BY updated_at DESC LIMIT 1", [clientId]),
    query("SELECT * FROM consent_agreements WHERE client_id = $1 ORDER BY updated_at DESC LIMIT 1", [clientId]),
  ]);

  const icfEthicsAvailable = documents.rows.some((doc) => doc.title?.toLowerCase().includes("icf code of ethics"));

  const latestProposal = proposalResult.rows[0] || null;
  const latestAgreement = consentAgreementResult.rows[0] || null;

  return res.json({
    client: toCamelClient(clientRow),
    sessions: sessions.rows.map(toCamelSession),
    documents: documents.rows.map(toCamelDocument),
    notifications: notifications.rows.map(toCamelNotification),
    payments: payments.rows.map(toCamelPayment),
    resources: resources.rows.map(toCamelResource),
    intakeForm: toCamelIntakeForm(intakeForm.rows[0] || null),
    onboarding: {
      portalAccess: true,
      icfCodeOfEthicsAvailable: icfEthicsAvailable,
      intakeCompleted: intakeForm.rows[0]?.status === "submitted" || intakeForm.rows[0]?.status === "reviewed",
      coachReviewRequired: Boolean(intakeForm.rows[0]?.coach_review_required),
      proposalAvailable: Boolean(latestProposal?.status === "sent" || latestProposal?.status === "accepted"),
      consentCompleted: Boolean(latestAgreement?.consented),
      agreementSigned: Boolean(latestAgreement?.signed),
    },
    proposal: toCamelProposal(latestProposal),
    consentAgreement: toCamelConsentAgreement(latestAgreement),
  });
});

app.post("/api/dashboard/:clientId/intake-form", async (req, res) => {
  const { clientId } = req.params;
  const { goals, challenges, history, preferredStyle, availability, consent } = req.body ?? {};

  if (!goals || !challenges || !preferredStyle || !availability || consent !== true) {
    return res.status(400).json({
      message: "Missing required fields: goals, challenges, preferredStyle, availability, and consent=true",
    });
  }

  const existing = await query("SELECT id FROM intake_forms WHERE client_id = $1 LIMIT 1", [clientId]);
  const now = new Date().toISOString();

  if (existing.rowCount > 0) {
    await query(
      `UPDATE intake_forms
       SET goals = $2,
           challenges = $3,
           history = $4,
           preferred_style = $5,
           availability = $6,
           consent = true,
           status = 'submitted',
           coach_review_required = true,
           completed_at = COALESCE(completed_at, $7),
           coach_reviewed_at = NULL,
           updated_at = $7
       WHERE client_id = $1`,
      [clientId, goals, challenges, history || "", preferredStyle, availability, now],
    );
  } else {
    await query(
      `INSERT INTO intake_forms (
        id, client_id, goals, challenges, history, preferred_style, availability,
        consent, status, coach_review_required, completed_at, updated_at
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,true,'submitted',true,$8,$8)`,
      [`if_${nanoid(10)}`, clientId, goals, challenges, history || "", preferredStyle, availability, now],
    );
  }

  await query(
    `INSERT INTO notifications (id, client_id, title, message, type, date, read)
     VALUES ($1,$2,$3,$4,$5,$6,false)`,
    [
      `n_${nanoid(10)}`,
      clientId,
      "Intake Form Submitted",
      "Your intake form has been submitted successfully and flagged for coach review.",
      "system",
      now.slice(0, 10),
    ],
  );

  return res.status(201).json({ ok: true, coachReviewRequired: true });
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

  const [userResult, sessions, documents, notifications, payments, bookingResult, intakeFormResult, proposalResult, consentAgreementResult] = await Promise.all([
    query("SELECT id, name, email, phone, role FROM users WHERE client_id = $1 LIMIT 1", [clientId]),
    query("SELECT * FROM sessions WHERE client_id = $1 ORDER BY session_number", [clientId]),
    query("SELECT * FROM documents WHERE client_id = $1 ORDER BY date_added DESC", [clientId]),
    query("SELECT * FROM notifications WHERE client_id = $1 ORDER BY date DESC", [clientId]),
    query("SELECT * FROM payments WHERE client_id = $1 ORDER BY session_number", [clientId]),
    query("SELECT * FROM bookings WHERE converted_client_id = $1 ORDER BY reviewed_at DESC LIMIT 1", [clientId]),
    query("SELECT * FROM intake_forms WHERE client_id = $1 LIMIT 1", [clientId]),
    query("SELECT * FROM coaching_proposals WHERE client_id = $1 ORDER BY updated_at DESC LIMIT 1", [clientId]),
    query("SELECT * FROM consent_agreements WHERE client_id = $1 ORDER BY updated_at DESC LIMIT 1", [clientId]),
  ]);

  return res.json({
    client: toCamelClient(clientRow),
    account: userResult.rows[0] || null,
    sessions: sessions.rows.map(toCamelSession),
    documents: documents.rows.map(toCamelDocument),
    notifications: notifications.rows.map(toCamelNotification),
    payments: payments.rows.map(toCamelPayment),
    sourceBooking: bookingResult.rows[0] ? toCamelBooking(bookingResult.rows[0]) : null,
    intakeForm: toCamelIntakeForm(intakeFormResult.rows[0] || null),
    proposal: toCamelProposal(proposalResult.rows[0] || null),
    consentAgreement: toCamelConsentAgreement(consentAgreementResult.rows[0] || null),
  });
});

app.post("/api/admin/clients/:clientId/intake-form/review", async (req, res) => {
  const { clientId } = req.params;
  const now = new Date().toISOString();

  const result = await query(
    `UPDATE intake_forms
     SET status = 'reviewed',
         coach_review_required = false,
         coach_reviewed_at = $2,
         updated_at = $2
     WHERE client_id = $1`,
    [clientId, now],
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ message: "Intake form not found" });
  }

  await query(
    `INSERT INTO notifications (id, client_id, title, message, type, date, read)
     VALUES ($1,$2,$3,$4,$5,$6,false)`,
    [
      `n_${nanoid(10)}`,
      clientId,
      "Intake Form Reviewed",
      "Your coach has reviewed your intake form and your onboarding is complete.",
      "system",
      now.slice(0, 10),
    ],
  );

  return res.json({ ok: true, coachReviewRequired: false, reviewedAt: now });
});

app.post("/api/admin/clients/:clientId/proposal", async (req, res) => {
  const { clientId } = req.params;
  const { objectives, durationSessions, frequency, investment, expectedOutcomes } = req.body ?? {};

  if (!objectives || !durationSessions || !frequency || !investment || !expectedOutcomes) {
    return res.status(400).json({
      message: "Missing required fields: objectives, durationSessions, frequency, investment, expectedOutcomes",
    });
  }

  if (!["weekly", "bi-weekly"].includes(frequency)) {
    return res.status(400).json({ message: "frequency must be weekly or bi-weekly" });
  }

  const now = new Date();
  const dueBy = new Date(now.getTime() + 48 * 60 * 60 * 1000).toISOString();
  const generatedAt = now.toISOString();
  const proposalId = `cp_${nanoid(10)}`;

  await query(
    `INSERT INTO coaching_proposals (
      id, client_id, coach_id, objectives, duration_sessions, frequency,
      investment, expected_outcomes, status, generated_at, sent_at, due_by, reviewed_at, updated_at
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'sent',$9,$9,$10,$9,$9)`,
    [
      proposalId,
      clientId,
      null,
      objectives,
      Number(durationSessions),
      frequency,
      Number(investment),
      expectedOutcomes,
      generatedAt,
      dueBy,
    ],
  );

  await query(
    `INSERT INTO notifications (id, client_id, title, message, type, date, read)
     VALUES ($1,$2,$3,$4,$5,$6,false)`,
    [
      `n_${nanoid(10)}`,
      clientId,
      "Coaching Proposal Available",
      "Your customized coaching proposal has been uploaded to your client portal for review.",
      "system",
      generatedAt.slice(0, 10),
    ],
  );

  return res.status(201).json({
    proposal: {
      id: proposalId,
      clientId,
      objectives,
      durationSessions: Number(durationSessions),
      frequency,
      investment: Number(investment),
      expectedOutcomes,
      status: "sent",
      generatedAt,
      dueBy,
    },
  });
});

app.post("/api/dashboard/:clientId/proposals/:proposalId/consent", async (req, res) => {
  const { clientId, proposalId } = req.params;
  const now = new Date().toISOString();

  const proposalResult = await query(
    "SELECT * FROM coaching_proposals WHERE id = $1 AND client_id = $2 LIMIT 1",
    [proposalId, clientId],
  );
  const proposal = proposalResult.rows[0];
  if (!proposal) {
    return res.status(404).json({ message: "Proposal not found" });
  }

  const agreementDocId = `d_${nanoid(10)}`;

  const existingAgreementResult = await query(
    "SELECT id FROM consent_agreements WHERE proposal_id = $1 AND client_id = $2 LIMIT 1",
    [proposalId, clientId],
  );
  const agreementId = existingAgreementResult.rows[0]?.id || `ca_${nanoid(10)}`;

  await withTransaction(async (tx) => {
    await tx.query(
      "UPDATE coaching_proposals SET status = 'accepted', reviewed_at = $3, updated_at = $3 WHERE id = $1 AND client_id = $2",
      [proposalId, clientId, now],
    );

    await tx.query(
      `INSERT INTO documents (id, client_id, title, type, session_related, date_added, file_size)
       VALUES ($1,$2,$3,'agreement',NULL,$4,$5)`,
      [agreementDocId, clientId, "Coaching Agreement", now.slice(0, 10), "210 KB"],
    );

    if (existingAgreementResult.rowCount > 0) {
      await tx.query(
        `UPDATE consent_agreements
         SET agreement_doc_id = $4,
             consented = true,
             consented_at = $5,
             signature_requested_at = $5,
             signed = false,
             signature_name = NULL,
             signature_value = NULL,
             signed_at = NULL,
             status = 'consented',
             updated_at = $5
         WHERE id = $1 AND client_id = $2 AND proposal_id = $3`,
        [agreementId, clientId, proposalId, agreementDocId, now],
      );
    } else {
      await tx.query(
        `INSERT INTO consent_agreements (
          id, client_id, proposal_id, agreement_doc_id, consented, consented_at,
          signature_requested_at, signed, status, updated_at
        ) VALUES ($1,$2,$3,$4,true,$5,$5,false,'consented',$5)`,
        [agreementId, clientId, proposalId, agreementDocId, now],
      );
    }

    await tx.query(
      `INSERT INTO notifications (id, client_id, title, message, type, date, read)
       VALUES ($1,$2,$3,$4,$5,$6,false)`,
      [
        `n_${nanoid(10)}`,
        clientId,
        "Digital Signature Requested",
        "Your coaching agreement is ready. Please sign electronically in the portal.",
        "system",
        now.slice(0, 10),
      ],
    );
  });

  return res.status(201).json({
    ok: true,
    agreement: {
      id: agreementId,
      status: "consented",
      agreementDocId,
      signatureRequestedAt: now,
    },
  });
});

app.post("/api/dashboard/:clientId/agreements/:agreementId/sign", async (req, res) => {
  const { clientId, agreementId } = req.params;
  const { signatureName } = req.body ?? {};
  if (!signatureName) {
    return res.status(400).json({ message: "Missing required field: signatureName" });
  }

  const now = new Date().toISOString();
  const signatureValue = `signed:${signatureName}:${now}`;

  const result = await query(
    `UPDATE consent_agreements
     SET signed = true,
         status = 'signed',
         signature_name = $3,
         signature_value = $4,
         signed_at = $5,
         updated_at = $5
     WHERE id = $1 AND client_id = $2`,
    [agreementId, clientId, signatureName, signatureValue, now],
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ message: "Agreement not found" });
  }

  await query(
    `INSERT INTO notifications (id, client_id, title, message, type, date, read)
     VALUES ($1,$2,$3,$4,$5,$6,false)`,
    [
      `n_${nanoid(10)}`,
      clientId,
      "Agreement Signed",
      "Your coaching agreement has been signed and stored in your portal.",
      "system",
      now.slice(0, 10),
    ],
  );

  return res.json({ ok: true, signedAt: now, signatureName });
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
  const today = new Date().toISOString().slice(0, 10);

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
        today,
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

    await tx.query(
      `INSERT INTO notifications (id, client_id, title, message, type, date, read)
       VALUES ($1,$2,$3,$4,$5,$6,false)`,
      [
        `n_${nanoid(10)}`,
        clientId,
        "Welcome to InnerSprings",
        "Your client profile is now active. Your portal login credentials have been sent to your email.",
        "email",
        today,
      ],
    );

    await tx.query(
      `INSERT INTO documents (id, client_id, title, type, session_related, date_added, file_size)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       ON CONFLICT (id) DO NOTHING`,
      [`d_${nanoid(10)}`, clientId, "ICF Code of Ethics", "agreement", null, today, "180 KB"],
    );

    await tx.query(
      `INSERT INTO intake_forms (
        id, client_id, consent, status, coach_review_required, updated_at
      ) VALUES ($1,$2,false,'draft',false,NOW())
      ON CONFLICT (client_id) DO NOTHING`,
      [`if_${nanoid(10)}`, clientId],
    );
  });

  const welcomeEmail = await dispatchWelcomeEmail({
    name: booking.name,
    email: booking.email,
    password: generatedPassword,
    clientId,
    service: booking.service,
  });

  return res.status(201).json({
    credentials: {
      email: booking.email,
      password: generatedPassword,
      clientId,
      name: booking.name,
    },
    welcomeEmail,
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
    ...payload,
    id: nanoid(),
    createdAt: new Date().toISOString(),
    status: "pending",
    source: payload.source || "website",
    assessmentType: payload.assessmentType || "pre-coaching-assessment",
    durationMinutes: Number(payload.durationMinutes) || 45,
    cost: Number(payload.cost) || 0,
  };

  await query(
    `INSERT INTO bookings (id, service, source, assessment_type, duration_minutes, cost, date, time, name, email, phone, notes, status, created_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
    [
      booking.id,
      booking.service,
      booking.source,
      booking.assessmentType,
      booking.durationMinutes,
      booking.cost,
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
