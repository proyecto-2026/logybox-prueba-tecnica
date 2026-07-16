import express from "express";
import session from "express-session";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildDefaultTest } from "./seed.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "data");
const DB_FILE = path.join(DATA_DIR, "db.json");
const PORT = process.env.PORT || 3000;

/* ----------------------------- Almacenamiento ----------------------------- */

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return { salt, hash };
}
function verifyPassword(password, salt, hash) {
  const check = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(check, "hex"), Buffer.from(hash, "hex"));
}

function seedDB() {
  const { salt, hash } = hashPassword("LBX2026");
  return {
    admins: [{ username: "logybox_admin", salt, hash }],
    candidates: [],
    test: buildDefaultTest(),
    submissions: [],
  };
}

let db;
function loadDB() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DB_FILE)) {
    db = seedDB();
    saveDB();
  } else {
    db = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
  }
}
function saveDB() {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}
loadDB();

const uid = () => crypto.randomBytes(9).toString("hex");

/* ------------------------------- Puntuacion ------------------------------- */

function maxForQuestion(q) {
  if (q.tipo === "single") return Math.max(0, ...q.opciones.map((o) => o.puntos));
  if (q.tipo === "scale") return 5;
  if (q.tipo === "text") return q.maxPoints || 0;
  return 0;
}

function computeScores(test, submission) {
  const byComp = {};
  for (const c of test.competencias) byComp[c.id] = { id: c.id, nombre: c.nombre, icon: c.icon, points: 0, max: 0 };

  let hasPendingManual = false;

  for (const q of test.preguntas) {
    const comp = byComp[q.competencia];
    if (!comp) continue;
    const max = maxForQuestion(q);
    comp.max += max;

    if (q.tipo === "single") {
      const ans = submission.answers[q.id];
      const opt = typeof ans === "number" ? q.opciones[ans] : null;
      if (opt) comp.points += opt.puntos;
    } else if (q.tipo === "scale") {
      const v = Number(submission.answers[q.id]);
      if (!Number.isNaN(v)) comp.points += Math.max(0, Math.min(5, v));
    } else if (q.tipo === "text") {
      const manual = submission.manualScores?.[q.id];
      if (typeof manual === "number") comp.points += manual;
      else if (max > 0) hasPendingManual = true;
    }
  }

  const comps = Object.values(byComp).map((c) => ({
    ...c,
    pct: c.max > 0 ? Math.round((c.points / c.max) * 100) : 0,
  }));
  const totalPoints = comps.reduce((s, c) => s + c.points, 0);
  const totalMax = comps.reduce((s, c) => s + c.max, 0);
  return {
    competencias: comps,
    totalPoints,
    totalMax,
    totalPct: totalMax > 0 ? Math.round((totalPoints / totalMax) * 100) : 0,
    hasPendingManual,
  };
}

// Prueba sin las respuestas correctas (para el candidato)
function sanitizeTestForCandidate(test) {
  return {
    titulo: test.titulo,
    descripcion: test.descripcion,
    competencias: test.competencias,
    preguntas: test.preguntas.map((q) => ({
      id: q.id,
      competencia: q.competencia,
      tipo: q.tipo,
      enunciado: q.enunciado,
      opciones: q.tipo === "single" ? q.opciones.map((o) => ({ texto: o.texto })) : undefined,
    })),
  };
}

/* --------------------------------- App ------------------------------------ */

const app = express();
app.use(express.json({ limit: "1mb" }));
app.use(
  session({
    secret: crypto.randomBytes(32).toString("hex"),
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: "lax", maxAge: 1000 * 60 * 60 * 8 },
  })
);

const requireAdmin = (req, res, next) =>
  req.session.admin ? next() : res.status(401).json({ error: "No autorizado" });
const requireCandidate = (req, res, next) =>
  req.session.candidateId ? next() : res.status(401).json({ error: "No autorizado" });

/* ------------------------------ Auth / sesion ----------------------------- */

app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body || {};
  const admin = db.admins.find((a) => a.username === (username || "").toLowerCase().trim());
  if (!admin || !verifyPassword(password || "", admin.salt, admin.hash))
    return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
  req.session.admin = true;
  req.session.adminUser = admin.username;
  res.json({ ok: true });
});

app.post("/api/candidate/login", (req, res) => {
  const { username, password } = req.body || {};
  const cand = db.candidates.find((c) => c.username === (username || "").toLowerCase().trim());
  if (!cand || !verifyPassword(password || "", cand.salt, cand.hash))
    return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
  req.session.candidateId = cand.id;
  res.json({ ok: true, name: cand.name, completed: cand.status === "completed" });
});

app.post("/api/logout", (req, res) => req.session.destroy(() => res.json({ ok: true })));

app.get("/api/me", (req, res) => {
  if (req.session.admin) return res.json({ role: "admin", user: req.session.adminUser });
  if (req.session.candidateId) {
    const cand = db.candidates.find((c) => c.id === req.session.candidateId);
    if (cand) return res.json({ role: "candidate", name: cand.name, completed: cand.status === "completed" });
  }
  res.json({ role: null });
});

/* ------------------------------ Admin: usuarios --------------------------- */

app.get("/api/admin/candidates", requireAdmin, (req, res) => {
  res.json(
    db.candidates.map((c) => ({
      id: c.id,
      name: c.name,
      username: c.username,
      status: c.status,
      createdAt: c.createdAt,
    }))
  );
});

app.post("/api/admin/candidates", requireAdmin, (req, res) => {
  const name = (req.body?.name || "").trim();
  const username = (req.body?.username || "").toLowerCase().trim();
  const password = req.body?.password || "";
  if (!name || !username || !password)
    return res.status(400).json({ error: "Nombre, usuario y contraseña son obligatorios" });
  if (db.candidates.some((c) => c.username === username) || db.admins.some((a) => a.username === username))
    return res.status(400).json({ error: "Ese usuario ya existe" });
  const { salt, hash } = hashPassword(password);
  const cand = { id: uid(), name, username, salt, hash, status: "pending", createdAt: new Date().toISOString() };
  db.candidates.push(cand);
  saveDB();
  res.json({ ok: true, id: cand.id });
});

app.post("/api/admin/candidates/:id/reset", requireAdmin, (req, res) => {
  const cand = db.candidates.find((c) => c.id === req.params.id);
  if (!cand) return res.status(404).json({ error: "No existe" });
  const password = req.body?.password || "";
  if (!password) return res.status(400).json({ error: "Contraseña requerida" });
  Object.assign(cand, hashPassword(password));
  saveDB();
  res.json({ ok: true });
});

app.delete("/api/admin/candidates/:id", requireAdmin, (req, res) => {
  db.candidates = db.candidates.filter((c) => c.id !== req.params.id);
  db.submissions = db.submissions.filter((s) => s.candidateId !== req.params.id);
  saveDB();
  res.json({ ok: true });
});

/* -------------------------- Admin: editar la prueba ----------------------- */

app.get("/api/admin/test", requireAdmin, (req, res) => res.json(db.test));

app.put("/api/admin/test", requireAdmin, (req, res) => {
  const t = req.body;
  if (!t || !Array.isArray(t.competencias) || !Array.isArray(t.preguntas))
    return res.status(400).json({ error: "Formato de prueba invalido" });
  db.test = {
    titulo: t.titulo || "Prueba Tecnica",
    descripcion: t.descripcion || "",
    competencias: t.competencias,
    preguntas: t.preguntas,
  };
  saveDB();
  res.json({ ok: true });
});

/* ------------------------------ Admin: resultados ------------------------- */

app.get("/api/admin/results", requireAdmin, (req, res) => {
  const rows = db.submissions.map((s) => {
    const cand = db.candidates.find((c) => c.id === s.candidateId);
    const score = computeScores(db.test, s);
    return {
      id: s.id,
      candidateName: cand?.name || "(eliminado)",
      candidateUser: cand?.username || "-",
      submittedAt: s.submittedAt,
      totalPct: score.totalPct,
      totalPoints: score.totalPoints,
      totalMax: score.totalMax,
      hasPendingManual: score.hasPendingManual,
      competencias: score.competencias,
    };
  });
  rows.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
  res.json(rows);
});

app.get("/api/admin/results/:id", requireAdmin, (req, res) => {
  const s = db.submissions.find((x) => x.id === req.params.id);
  if (!s) return res.status(404).json({ error: "No existe" });
  const cand = db.candidates.find((c) => c.id === s.candidateId);
  const score = computeScores(db.test, s);
  const detail = db.test.preguntas.map((q) => {
    const ans = s.answers[q.id];
    let respuesta = null,
      correcta = null,
      puntos = null;
    const max = maxForQuestion(q);
    if (q.tipo === "single") {
      respuesta = typeof ans === "number" ? q.opciones[ans]?.texto : "(sin responder)";
      puntos = typeof ans === "number" ? q.opciones[ans]?.puntos ?? 0 : 0;
    } else if (q.tipo === "scale") {
      respuesta = ans != null ? String(ans) : "(sin responder)";
      puntos = Number(ans) || 0;
    } else if (q.tipo === "text") {
      respuesta = ans || "(sin responder)";
      puntos = s.manualScores?.[q.id] ?? null;
    }
    return {
      id: q.id,
      competencia: q.competencia,
      tipo: q.tipo,
      enunciado: q.enunciado,
      respuesta,
      puntos,
      max,
    };
  });
  res.json({
    id: s.id,
    candidate: { name: cand?.name || "(eliminado)", username: cand?.username || "-" },
    submittedAt: s.submittedAt,
    score,
    detalle: detail,
  });
});

app.post("/api/admin/results/:id/manual", requireAdmin, (req, res) => {
  const s = db.submissions.find((x) => x.id === req.params.id);
  if (!s) return res.status(404).json({ error: "No existe" });
  s.manualScores = s.manualScores || {};
  for (const [qid, val] of Object.entries(req.body?.manualScores || {})) {
    const q = db.test.preguntas.find((p) => p.id === qid && p.tipo === "text");
    if (!q) continue;
    const max = maxForQuestion(q);
    s.manualScores[qid] = Math.max(0, Math.min(max, Number(val) || 0));
  }
  saveDB();
  res.json({ ok: true, score: computeScores(db.test, s) });
});

/* ------------------------------ Candidato: prueba ------------------------- */

app.get("/api/candidate/test", requireCandidate, (req, res) => {
  const cand = db.candidates.find((c) => c.id === req.session.candidateId);
  if (cand?.status === "completed") return res.json({ completed: true });
  res.json({ completed: false, test: sanitizeTestForCandidate(db.test) });
});

app.post("/api/candidate/submit", requireCandidate, (req, res) => {
  const cand = db.candidates.find((c) => c.id === req.session.candidateId);
  if (!cand) return res.status(404).json({ error: "No existe" });
  if (cand.status === "completed")
    return res.status(400).json({ error: "Ya enviaste tu prueba" });

  const answers = req.body?.answers || {};
  const submission = {
    id: uid(),
    candidateId: cand.id,
    answers,
    manualScores: {},
    submittedAt: new Date().toISOString(),
  };
  db.submissions.push(submission);
  cand.status = "completed";
  saveDB();
  res.json({ ok: true });
});

/* --------------------------------- Estatico ------------------------------- */

app.get("/admin", (req, res) => res.sendFile(path.join(__dirname, "public", "admin.html")));
app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
  console.log("\n  LOGYBOX - Prueba Tecnica");
  console.log("  ────────────────────────────────────");
  console.log(`  Servidor:  http://localhost:${PORT}`);
  console.log(`  Admin:     http://localhost:${PORT}/admin`);
  console.log("  Usuario admin:  LOGYBOX_ADMIN");
  console.log("  Contraseña admin:  LBX2026");
  console.log("  ────────────────────────────────────\n");
});
