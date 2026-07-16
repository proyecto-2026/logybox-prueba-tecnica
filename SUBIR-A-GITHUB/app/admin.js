import { logoSVG, el, esc, fmtDate, scoreColor, renderNotConfigured } from "./common.js";
import { computeScores, maxForQuestion, sanitizeTest, getVerdict } from "./scoring.js";
import { buildDefaultTest } from "./seed.js";
import {
  configured, auth, db, doc, getDoc, setDoc, updateDoc, deleteDoc, collection, getDocs,
  signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut,
  currentUser, isAdmin, toEmail, niceError,
} from "./firebase.js";

const app = document.getElementById("app");
let tab = "candidatos";

init();
async function init() {
  if (!configured) return renderNotConfigured(app);
  const user = await currentUser();
  if (user && (await isAdmin(user))) return renderShell();
  if (user) await signOut(auth);
  renderLogin();
}

/* -------------------------------- Login ---------------------------------- */
function renderLogin() {
  app.innerHTML = "";
  const view = el(`
    <div class="center">
      <div class="glass pad-lg narrow appear" style="width:100%">
        <div style="margin-bottom:24px">${logoSVG({ height: 38 })}</div>
        <p class="eyebrow">Panel de administración</p>
        <h1 style="font-size:26px;margin:8px 0 22px">Iniciar sesión</h1>
        <div id="err"></div>
        <form id="f">
          <div class="field"><label>Usuario</label><input name="username" autofocus required /></div>
          <div class="field"><label>Contraseña</label><input name="password" type="password" required /></div>
          <button class="btn btn-navy btn-block" type="submit">Entrar</button>
        </form>
        <p class="tiny muted" style="text-align:center;margin-top:20px">
          <a href="index.html" style="color:var(--muted);text-decoration:none">← Volver al portal del candidato</a>
        </p>
      </div>
    </div>`);
  view.querySelector("#f").addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = view.querySelector("button[type=submit]");
    btn.disabled = true; btn.textContent = "Entrando...";
    const fd = new FormData(e.target);
    try {
      const cred = await signInWithEmailAndPassword(auth, toEmail(fd.get("username")), fd.get("password"));
      if (!(await isAdmin(cred.user))) {
        await signOut(auth);
        throw { code: "permission" };
      }
      renderShell();
    } catch (err) {
      btn.disabled = false; btn.textContent = "Entrar";
      view.querySelector("#err").innerHTML = `<div class="alert alert-error">${esc(niceError(err))}</div>`;
    }
  });
  app.appendChild(view);
}

/* -------------------------------- Shell ---------------------------------- */
function renderShell() {
  app.innerHTML = "";
  const view = el(`
    <div class="wrap">
      <div class="row between wrap" style="margin-bottom:26px;gap:16px">
        ${logoSVG({ height: 30 })}
        <div class="row" style="align-items:center;gap:16px">
          <div class="tabs">
            <button class="tab" data-t="candidatos">Candidatos</button>
            <button class="tab" data-t="resultados">Resultados</button>
            <button class="tab" data-t="prueba">Editar prueba</button>
          </div>
          <button class="btn btn-ghost btn-sm" id="out">Salir</button>
        </div>
      </div>
      <div id="content"></div>
    </div>`);
  view.querySelectorAll(".tab").forEach((b) =>
    b.addEventListener("click", () => { tab = b.dataset.t; paintTabs(view); route(); })
  );
  view.querySelector("#out").addEventListener("click", async () => { await signOut(auth); location.reload(); });
  app.appendChild(view);
  paintTabs(view);
  route();
}
function paintTabs(view) {
  view.querySelectorAll(".tab").forEach((b) => b.classList.toggle("active", b.dataset.t === tab));
}
function content() { return document.getElementById("content"); }
function route() {
  if (tab === "candidatos") return viewCandidates();
  if (tab === "resultados") return viewResults();
  if (tab === "prueba") return viewTestEditor();
}

/* --------------------------- Datos: helpers ------------------------------ */
async function fetchCandidates() {
  const snap = await getDocs(collection(db, "candidates"));
  const list = [];
  snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
  list.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
  return list;
}
async function fetchSubmissions() {
  const snap = await getDocs(collection(db, "submissions"));
  const list = [];
  snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
  list.sort((a, b) => (b.submittedAt || "").localeCompare(a.submittedAt || ""));
  return list;
}
async function fetchTest() {
  const snap = await getDoc(doc(db, "config", "test"));
  return snap.exists() ? snap.data() : null;
}
async function saveTest(test) {
  await setDoc(doc(db, "config", "test"), test);
  await setDoc(doc(db, "config", "testPublic"), sanitizeTest(test));
}

// Crea el usuario en Firebase Auth usando una app secundaria para
// NO cerrar la sesion del admin actual.
import { firebaseConfig } from "../firebase-config.js";
import { initializeApp as initApp, getApps } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth as getAuth2, signOut as signOut2 } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
async function createCandidateAuth(username, password) {
  const name = "secondary";
  const sec = getApps().find((a) => a.name === name) || initApp(firebaseConfig, name);
  const secAuth = getAuth2(sec);
  const cred = await createUserWithEmailAndPassword(secAuth, toEmail(username), password);
  await signOut2(secAuth);
  return cred.user.uid;
}

/* ------------------------------ Candidatos ------------------------------- */
async function viewCandidates() {
  const c = content();
  c.innerHTML = `<p class="muted">Cargando...</p>`;
  let list;
  try { list = await fetchCandidates(); }
  catch (e) { c.innerHTML = `<div class="alert alert-error">${esc(niceError(e))}</div>`; return; }
  c.innerHTML = "";
  const view = el(`
    <div class="grid" style="grid-template-columns:minmax(0,1fr) 320px;align-items:start;gap:20px">
      <div class="glass pad appear">
        <div class="row between" style="margin-bottom:16px">
          <h2 style="font-size:19px">Candidatos <span class="muted" style="font-weight:400">(${list.length})</span></h2>
        </div>
        <div style="overflow-x:auto">
          <table>
            <thead><tr><th>Nombre</th><th>Usuario</th><th>Estado</th><th class="hide-sm">Creado</th><th></th></tr></thead>
            <tbody id="rows"></tbody>
          </table>
        </div>
        ${list.length === 0 ? `<p class="muted" style="padding:24px 4px">Aún no has creado candidatos. Usa el formulario de la derecha →</p>` : ""}
      </div>

      <div class="glass pad appear">
        <h2 style="font-size:18px;margin-bottom:4px">Nuevo candidato</h2>
        <p class="tiny muted" style="margin-bottom:18px">Crea un usuario y contraseña para quien va a presentar la prueba (mínimo 6 caracteres).</p>
        <div id="err"></div>
        <form id="f">
          <div class="field"><label>Nombre completo</label><input name="name" required /></div>
          <div class="field"><label>Usuario</label><input name="username" placeholder="ej: maria.perez" required /></div>
          <div class="field"><label>Contraseña</label>
            <div class="row" style="gap:8px">
              <input name="password" minlength="6" required />
              <button type="button" class="btn btn-ghost btn-sm" id="gen">Generar</button>
            </div>
          </div>
          <button class="btn btn-primary btn-block" type="submit">Crear candidato</button>
        </form>
      </div>
    </div>`);

  const rows = view.querySelector("#rows");
  list.forEach((cd) => rows.appendChild(candidateRow(cd)));

  view.querySelector("#gen").addEventListener("click", () => {
    view.querySelector('[name=password]').value = genPass();
  });
  view.querySelector("#f").addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = view.querySelector("button[type=submit]");
    btn.disabled = true; btn.textContent = "Creando...";
    const fd = new FormData(e.target);
    const name = String(fd.get("name")).trim();
    const username = String(fd.get("username")).toLowerCase().trim().replace(/\s+/g, ".");
    const password = String(fd.get("password"));
    try {
      const uid = await createCandidateAuth(username, password);
      await setDoc(doc(db, "candidates", uid), {
        name, username, status: "pending", createdAt: new Date().toISOString(),
      });
      viewCandidates();
    } catch (err) {
      btn.disabled = false; btn.textContent = "Crear candidato";
      view.querySelector("#err").innerHTML = `<div class="alert alert-error">${esc(niceError(err))}</div>`;
    }
  });
  c.appendChild(view);
}

function candidateRow(cd) {
  const badge = cd.status === "completed"
    ? `<span class="badge badge-done">✓ Completó</span>`
    : `<span class="badge badge-pending">● Pendiente</span>`;
  const tr = el(`<tr>
      <td style="font-weight:500">${esc(cd.name)}</td>
      <td class="muted">${esc(cd.username)}</td>
      <td>${badge}</td>
      <td class="muted tiny hide-sm">${fmtDate(cd.createdAt)}</td>
      <td><div class="row" style="gap:6px;justify-content:flex-end">
        <button class="btn btn-danger btn-sm" data-act="del">Eliminar</button>
      </div></td>
    </tr>`);
  tr.querySelector('[data-act=del]').addEventListener("click", async () => {
    if (!confirm(`¿Eliminar a ${cd.name}? Se borrarán también sus resultados.\n\nNota: el usuario "${cd.username}" no podrá reutilizarse (crea uno nuevo, ej. ${cd.username}2).`)) return;
    try {
      await deleteDoc(doc(db, "submissions", cd.id)).catch(() => {});
      await deleteDoc(doc(db, "candidates", cd.id));
      viewCandidates();
    } catch (e) { alert(niceError(e)); }
  });
  return tr;
}
function genPass() {
  const chars = "abcdefghijkmnpqrstuvwxyz23456789";
  return "lb-" + Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

/* ------------------------------- Resultados ------------------------------ */
async function viewResults() {
  const c = content();
  c.innerHTML = `<p class="muted">Cargando...</p>`;
  let subs, TEST;
  try {
    [subs, TEST] = await Promise.all([fetchSubmissions(), fetchTest()]);
  } catch (e) { c.innerHTML = `<div class="alert alert-error">${esc(niceError(e))}</div>`; return; }
  c.innerHTML = "";
  if (!TEST) {
    c.appendChild(el(`<div class="glass pad-lg appear" style="text-align:center">
      <h2 style="font-size:20px;margin-bottom:6px">La prueba aún no está cargada</h2>
      <p class="muted">Ve a "Editar prueba" y carga la prueba por defecto.</p></div>`));
    return;
  }
  if (subs.length === 0) {
    c.appendChild(el(`<div class="glass pad-lg appear" style="text-align:center">
      <p style="font-size:44px;margin-bottom:8px">📭</p>
      <h2 style="font-size:20px;margin-bottom:6px">Aún no hay resultados</h2>
      <p class="muted">Cuando un candidato envíe su prueba, aparecerá aquí.</p></div>`));
    return;
  }
  const view = el(`
    <div class="glass pad appear">
      <h2 style="font-size:19px;margin-bottom:16px">Resultados <span class="muted" style="font-weight:400">(${subs.length})</span></h2>
      <div style="overflow-x:auto">
        <table>
          <thead><tr><th>Candidato</th><th>Enviado</th><th style="width:170px">Puntaje total</th><th>Veredicto</th><th class="hide-sm">Competencias</th><th></th></tr></thead>
          <tbody id="rows"></tbody>
        </table>
      </div>
    </div>`);
  const tb = view.querySelector("#rows");
  subs.forEach((s) => {
    const score = computeScores(TEST, s);
    const v = getVerdict(score);
    const mini = score.competencias.map((cp) =>
      `<span title="${esc(cp.nombre)}: ${cp.pct}%" style="display:inline-block;width:26px;height:8px;border-radius:4px;margin-right:3px;background:linear-gradient(90deg,${scoreColor(cp.pct)} ${cp.pct}%, rgba(29,22,80,.12) ${cp.pct}%)"></span>`
    ).join("");
    const tr = el(`<tr class="row-click">
        <td style="font-weight:500">${esc(s.candidateName || "(sin nombre)")}<div class="tiny muted">${esc(s.candidateUser || "-")}</div></td>
        <td class="muted tiny">${fmtDate(s.submittedAt)}</td>
        <td>
          <div class="row between" style="margin-bottom:5px"><b style="color:${scoreColor(score.totalPct)}">${score.totalPct}%</b>
            <span class="tiny muted">${score.totalPoints}/${score.totalMax}</span></div>
          <div class="meter"><i style="width:${score.totalPct}%"></i></div>
        </td>
        <td>
          <span class="badge" style="background:${v.color}18;color:${v.color}">${v.icono} ${v.nivel.replace("Perfil ", "")}</span>
          ${v.parcial ? `<div class="tiny muted" style="margin-top:4px">⏳ parcial: faltan abiertas</div>` : ""}
          ${v.alertaExcel ? `<div class="tiny" style="color:#c62a20;margin-top:4px">📊 Excel bajo (${v.excelPct}%)</div>` : ""}
        </td>
        <td class="hide-sm">${mini}</td>
        <td><button class="btn btn-ghost btn-sm">Ver →</button></td>
      </tr>`);
    tr.addEventListener("click", () => openResult(s, TEST));
    tb.appendChild(tr);
  });
  c.appendChild(view);
}

function openResult(s, TEST) {
  const score = computeScores(TEST, s);
  const v = getVerdict(score);
  const compName = {};
  score.competencias.forEach((cp) => (compName[cp.id] = cp));

  const overlay = el(`<div style="position:fixed;inset:0;z-index:60;background:rgba(29,22,80,.4);backdrop-filter:blur(6px);overflow:auto;padding:28px 16px">
      <div class="glass pad-lg appear" style="max-width:800px;margin:0 auto"></div></div>`);
  const box = overlay.querySelector(".glass");

  const comps = score.competencias.map((cp) => `
    <div class="glass" style="padding:14px 16px;background:rgba(255,255,255,.5)">
      <div class="row between" style="margin-bottom:8px">
        <span style="font-weight:500;font-size:14px">${cp.icon || ""} ${esc(cp.nombre)}</span>
        <b style="color:${scoreColor(cp.pct)}">${cp.pct}%</b>
      </div>
      <div class="meter"><i style="width:${cp.pct}%"></i></div>
      <div class="tiny muted" style="margin-top:6px">${cp.points}/${cp.max} pts</div>
    </div>`).join("");

  const answers = TEST.preguntas.map((q) => {
    const ans = s.answers?.[q.id];
    const max = maxForQuestion(q);
    let inner;
    if (q.tipo === "text") {
      const manual = s.manualScores?.[q.id];
      inner = `<div style="background:rgba(255,255,255,.6);border:1px solid var(--line);border-radius:12px;padding:12px 14px;font-size:14px;line-height:1.55;white-space:pre-wrap">${esc(ans || "(sin responder)")}</div>
        <div class="row" style="align-items:center;gap:10px;margin-top:10px">
          <span class="tiny muted">Puntaje manual (0–${max}):</span>
          <input type="number" min="0" max="${max}" value="${manual ?? ""}" data-qid="${q.id}" class="manual" style="width:90px;padding:8px 10px" />
        </div>`;
    } else {
      let respuesta = "(sin responder)", puntos = 0;
      if (q.tipo === "single" && typeof ans === "number") {
        respuesta = q.opciones[ans]?.texto ?? "(sin responder)";
        puntos = q.opciones[ans]?.puntos ?? 0;
      } else if (q.tipo === "scale" && ans != null) {
        respuesta = String(ans);
        puntos = Number(ans) || 0;
      }
      const col = puntos >= max ? "#1c7a3a" : puntos > 0 ? "#c05c00" : "#c62a20";
      inner = `<div class="row between" style="align-items:center">
          <span style="font-size:14px">${esc(respuesta)}</span>
          <b style="color:${col};flex:none;margin-left:12px">${puntos}/${max}</b>
        </div>`;
    }
    return `<div style="padding:16px 0;border-top:1px solid var(--line)">
        <p class="tiny" style="color:var(--orange);font-weight:600;margin-bottom:4px">${esc(compName[q.competencia]?.nombre || "")}</p>
        <p style="font-weight:500;font-size:14.5px;line-height:1.5;margin-bottom:10px">${esc(q.enunciado)}</p>
        ${inner}
      </div>`;
  }).join("");

  box.innerHTML = `
    <div class="row between" style="margin-bottom:18px">
      <div>
        <p class="eyebrow">Resultado</p>
        <h2 style="font-size:23px">${esc(s.candidateName || "(sin nombre)")}</h2>
        <p class="tiny muted">${esc(s.candidateUser || "-")} · ${fmtDate(s.submittedAt)}</p>
      </div>
      <button class="btn btn-ghost btn-sm" id="close">Cerrar ✕</button>
    </div>

    <div class="glass" style="padding:20px;background:linear-gradient(135deg,rgba(255,128,0,.10),rgba(47,16,219,.08));margin-bottom:20px">
      <div class="row between">
        <div><p class="tiny muted">Puntaje total</p><p style="font-size:34px;font-weight:700;color:${scoreColor(score.totalPct)};line-height:1">${score.totalPct}%</p></div>
        <div style="text-align:right"><p class="tiny muted">Puntos</p><p style="font-size:20px;font-weight:600">${score.totalPoints} / ${score.totalMax}</p></div>
      </div>
      ${score.hasPendingManual ? `<p class="tiny" style="color:#c05c00;margin-top:10px">⏳ Hay respuestas abiertas sin calificar. Asígnales puntaje abajo y guarda — el veredicto se actualizará.</p>` : ""}
    </div>

    <div class="glass" style="padding:20px 22px;margin-bottom:20px;border-left:4px solid ${v.color}">
      <div class="row" style="align-items:center;gap:10px;margin-bottom:8px">
        <span class="badge" style="background:${v.color}18;color:${v.color};font-size:13.5px;padding:7px 14px">${v.icono} ${esc(v.nivel)}${v.parcial ? " · parcial" : ""}</span>
      </div>
      <p style="font-size:14.5px;line-height:1.6;margin-bottom:10px">${esc(v.resumen)}</p>
      <div class="stack" style="--gap:6px">
        ${v.fuertes.length ? `<p class="tiny" style="line-height:1.7"><b style="color:#1c7a3a">Fortalezas:</b> ${v.fuertes.map((c) => esc(c.nombre) + " (" + c.pct + "%)").join(" · ")}</p>` : ""}
        ${v.debiles.length ? `<p class="tiny" style="line-height:1.7"><b style="color:#c62a20">A profundizar en entrevista:</b> ${v.debiles.map((c) => esc(c.nombre) + " (" + c.pct + "%)").join(" · ")}</p>` : `<p class="tiny muted">Sin competencias críticas (&lt;50%).</p>`}
        ${v.alertaExcel ? `<p class="tiny" style="color:#c62a20;line-height:1.7"><b>📊 Alerta operativa:</b> Excel en ${v.excelPct}%, por debajo del mínimo (60%) para asesorar con datos. Validar con ejercicio práctico antes de contratar.</p>` : ""}
        ${v.parcial ? `<p class="tiny" style="color:#c05c00;line-height:1.7">Este veredicto es parcial: califica las respuestas abiertas para el resultado definitivo.</p>` : ""}
      </div>
    </div>

    <div class="grid grid-3" style="margin-bottom:8px">${comps}</div>

    <h2 style="font-size:17px;margin:26px 0 4px">Respuestas</h2>
    <div id="ans">${answers}</div>

    <div class="row between mt-lg" style="position:sticky;bottom:0;background:linear-gradient(transparent,var(--glass-strong) 40%);padding-top:14px">
      <span class="tiny muted" id="savemsg"></span>
      <button class="btn btn-primary" id="save">Guardar calificación</button>
    </div>`;

  box.querySelector("#close").addEventListener("click", () => overlay.remove());
  overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.remove(); });
  box.querySelector("#save").addEventListener("click", async () => {
    const manualScores = { ...(s.manualScores || {}) };
    box.querySelectorAll(".manual").forEach((inp) => {
      if (inp.value !== "") {
        const max = Number(inp.max) || 0;
        manualScores[inp.dataset.qid] = Math.max(0, Math.min(max, Number(inp.value) || 0));
      }
    });
    const btn = box.querySelector("#save");
    btn.disabled = true; btn.textContent = "Guardando...";
    try {
      await updateDoc(doc(db, "submissions", s.id), { manualScores });
      overlay.remove();
      viewResults();
    } catch (err) {
      btn.disabled = false; btn.textContent = "Guardar calificación";
      box.querySelector("#savemsg").innerHTML = `<span style="color:#c62a20">${esc(niceError(err))}</span>`;
    }
  });
  app.appendChild(overlay);
}

/* ----------------------------- Editor prueba ----------------------------- */
let TEST = null;
async function viewTestEditor() {
  const c = content();
  c.innerHTML = `<p class="muted">Cargando...</p>`;
  try { TEST = await fetchTest(); }
  catch (e) { c.innerHTML = `<div class="alert alert-error">${esc(niceError(e))}</div>`; return; }

  if (!TEST) {
    c.innerHTML = "";
    const empty = el(`<div class="glass pad-lg appear" style="text-align:center;max-width:560px;margin:0 auto">
        <div style="margin-bottom:18px;display:flex;justify-content:center">${logoSVG({ height: 30 })}</div>
        <h2 style="font-size:20px;margin-bottom:8px">La prueba aún no está en Firebase</h2>
        <p class="muted" style="margin-bottom:22px">Carga la prueba por defecto (38 preguntas, 6 competencias) y luego edítala a tu gusto.</p>
        <button class="btn btn-primary" id="seed">Cargar prueba por defecto</button>
      </div>`);
    empty.querySelector("#seed").addEventListener("click", async () => {
      const btn = empty.querySelector("#seed");
      btn.disabled = true; btn.textContent = "Cargando...";
      try {
        await saveTest(buildDefaultTest());
        viewTestEditor();
      } catch (e) {
        btn.disabled = false; btn.textContent = "Cargar prueba por defecto";
        alert(niceError(e));
      }
    });
    c.appendChild(empty);
    return;
  }
  renderEditor();
}

function renderEditor() {
  const c = content();
  c.innerHTML = "";
  const compOptions = TEST.competencias.map((cp) => `<option value="${cp.id}">${esc(cp.nombre)}</option>`).join("");

  const view = el(`
    <div class="stack">
      <div class="glass pad appear">
        <div class="row between" style="margin-bottom:16px">
          <h2 style="font-size:19px">Editar prueba</h2>
          <div class="row" style="gap:8px">
            <span class="tiny muted" id="savemsg" style="align-self:center"></span>
            <button class="btn btn-primary btn-sm" id="save">Guardar cambios</button>
          </div>
        </div>
        <div class="field"><label>Título</label><input id="titulo" value="${esc(TEST.titulo)}" /></div>
        <div class="field"><label>Descripción / instrucciones</label><textarea id="descripcion">${esc(TEST.descripcion)}</textarea></div>
      </div>

      <div id="comps"></div>

      <div class="row" style="justify-content:center;padding:8px">
        <button class="btn btn-ghost" id="addQ">+ Agregar pregunta</button>
      </div>
    </div>`);

  const compsBox = view.querySelector("#comps");
  TEST.competencias.forEach((cp) => {
    const qs = TEST.preguntas.filter((q) => q.competencia === cp.id);
    const block = el(`<div class="glass pad appear" style="margin-bottom:16px">
        <h2 style="font-size:16px;margin-bottom:4px">${cp.icon || ""} ${esc(cp.nombre)}
          <span class="tiny muted" style="font-weight:400">· ${qs.length} preguntas</span></h2>
        <div class="qs stack" style="margin-top:14px"></div>
      </div>`);
    const qbox = block.querySelector(".qs");
    qs.forEach((q) => qbox.appendChild(questionEditor(q, compOptions)));
    compsBox.appendChild(block);
  });

  view.querySelector("#addQ").addEventListener("click", () => {
    TEST.preguntas.push({ id: "q" + Date.now().toString(36), competencia: TEST.competencias[0].id, tipo: "single", enunciado: "", opciones: [{ texto: "", puntos: 0 }] });
    readFormInto(view); renderEditor();
  });
  view.querySelector("#save").addEventListener("click", async () => {
    readFormInto(view);
    const btn = view.querySelector("#save");
    btn.disabled = true; btn.textContent = "Guardando...";
    try {
      await saveTest(TEST);
      view.querySelector("#savemsg").innerHTML = `<span style="color:#1c7a3a">✓ Guardado</span>`;
    } catch (err) {
      view.querySelector("#savemsg").innerHTML = `<span style="color:#c62a20">${esc(niceError(err))}</span>`;
    }
    btn.disabled = false; btn.textContent = "Guardar cambios";
    setTimeout(() => { const m = view.querySelector("#savemsg"); if (m) m.textContent = ""; }, 2500);
  });
  c.appendChild(view);
}

function questionEditor(q, compOptions) {
  const wrap = el(`<div class="glass" data-qid="${q.id}" style="padding:16px 18px;background:rgba(255,255,255,.45)">
      <div class="field"><textarea class="q-enun" style="min-height:56px" placeholder="Escribe el enunciado...">${esc(q.enunciado)}</textarea></div>
      <div class="row wrap" style="gap:10px;align-items:flex-end;margin-bottom:12px">
        <div style="flex:1;min-width:160px"><label class="tiny">Competencia</label>
          <select class="q-comp">${compOptions}</select></div>
        <div style="flex:1;min-width:140px"><label class="tiny">Tipo</label>
          <select class="q-tipo">
            <option value="single">Opción múltiple</option>
            <option value="scale">Escala 1–5</option>
            <option value="text">Respuesta abierta</option>
          </select></div>
        <button class="btn btn-danger btn-sm q-del">Eliminar</button>
      </div>
      <div class="q-extra"></div>
    </div>`);
  wrap.querySelector(".q-comp").value = q.competencia;
  wrap.querySelector(".q-tipo").value = q.tipo;

  const extra = wrap.querySelector(".q-extra");
  function paintExtra() {
    const tipo = wrap.querySelector(".q-tipo").value;
    extra.innerHTML = "";
    if (tipo === "single") {
      const opts = el(`<div><label class="tiny">Opciones (puntos por opción)</label><div class="opts stack"></div>
        <button type="button" class="btn btn-ghost btn-sm add-opt" style="margin-top:8px">+ Opción</button></div>`);
      const ob = opts.querySelector(".opts");
      (q.opciones || []).forEach((o) => ob.appendChild(optRow(o)));
      opts.querySelector(".add-opt").addEventListener("click", () => ob.appendChild(optRow({ texto: "", puntos: 0 })));
      extra.appendChild(opts);
    } else if (tipo === "text") {
      extra.appendChild(el(`<div class="row" style="align-items:center;gap:10px">
        <label class="tiny" style="margin:0">Puntaje máximo (calificación manual):</label>
        <input type="number" class="q-max" min="0" value="${q.maxPoints ?? 3}" style="width:90px;padding:8px 10px" /></div>`));
    } else {
      extra.appendChild(el(`<p class="tiny muted">Escala de autoevaluación de 1 a 5. El puntaje es el valor que elija el candidato.</p>`));
    }
  }
  function optRow(o) {
    const row = el(`<div class="row opt-row" style="gap:8px">
        <input class="o-text" placeholder="Texto de la opción" value="${esc(o.texto)}" />
        <input class="o-pts" type="number" title="Puntos" value="${o.puntos ?? 0}" style="width:80px" />
        <button type="button" class="btn btn-danger btn-sm o-del">✕</button>
      </div>`);
    row.querySelector(".o-del").addEventListener("click", () => row.remove());
    return row;
  }
  paintExtra();
  wrap.querySelector(".q-tipo").addEventListener("change", paintExtra);
  wrap.querySelector(".q-del").addEventListener("click", () => {
    if (!confirm("¿Eliminar esta pregunta?")) return;
    TEST.preguntas = TEST.preguntas.filter((p) => p.id !== q.id);
    readFormInto(document.getElementById("content").firstElementChild);
    renderEditor();
  });
  return wrap;
}

function readFormInto(view) {
  const titulo = view.querySelector("#titulo");
  const desc = view.querySelector("#descripcion");
  if (titulo) TEST.titulo = titulo.value;
  if (desc) TEST.descripcion = desc.value;
  const nodes = view.querySelectorAll("[data-qid]");
  nodes.forEach((node) => {
    const q = TEST.preguntas.find((p) => p.id === node.dataset.qid);
    if (!q) return;
    q.enunciado = node.querySelector(".q-enun").value;
    q.competencia = node.querySelector(".q-comp").value;
    q.tipo = node.querySelector(".q-tipo").value;
    if (q.tipo === "single") {
      q.opciones = Array.from(node.querySelectorAll(".opt-row")).map((r) => ({
        texto: r.querySelector(".o-text").value,
        puntos: Number(r.querySelector(".o-pts").value) || 0,
      }));
      delete q.maxPoints;
    } else if (q.tipo === "text") {
      q.maxPoints = Number(node.querySelector(".q-max")?.value) || 0;
      delete q.opciones;
    } else {
      delete q.opciones; delete q.maxPoints;
    }
  });
}
