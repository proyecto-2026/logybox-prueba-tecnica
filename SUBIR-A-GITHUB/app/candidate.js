import { logoSVG, el, esc, renderNotConfigured } from "./common.js";
import {
  configured, auth, db, doc, getDoc, setDoc, updateDoc,
  signInWithEmailAndPassword, signOut, currentUser, toEmail, niceError,
} from "./firebase.js";

const app = document.getElementById("app");
let TEST = null;
let CAND = null; // { uid, name, username, status }
let answers = {};
let step = 0;

/* ------------------------------- Arranque -------------------------------- */
init();
async function init() {
  if (!configured) return renderNotConfigured(app);
  const user = await currentUser();
  if (user) {
    const ok = await loadCandidate(user);
    if (ok) return afterLogin();
    await signOut(auth); // sesion de un no-candidato (ej. admin): fuera
  }
  renderLogin();
}

async function loadCandidate(user) {
  try {
    const snap = await getDoc(doc(db, "candidates", user.uid));
    if (!snap.exists()) return false;
    CAND = { uid: user.uid, ...snap.data() };
    return true;
  } catch {
    return false;
  }
}

async function afterLogin() {
  if (CAND.status === "completed") return renderThanks(true);
  try {
    const snap = await getDoc(doc(db, "config", "testPublic"));
    if (!snap.exists()) return renderMessage("La prueba aún no está configurada. Avísale al equipo de LOGYBOX.");
    TEST = snap.data();
  } catch (e) {
    return renderMessage(niceError(e));
  }
  answers = {};
  step = -1;
  renderIntro();
}

/* -------------------------------- Login ---------------------------------- */
function renderLogin() {
  app.innerHTML = "";
  const view = el(`
    <div class="center">
      <div class="glass pad-lg narrow appear" style="width:100%">
        <div style="margin-bottom:26px">${logoSVG({ height: 40 })}</div>
        <p class="eyebrow">Prueba técnica</p>
        <h1 style="font-size:27px;margin:8px 0 6px">Bienvenido/a</h1>
        <p class="muted" style="font-size:15px;margin-bottom:26px">Ingresa con el usuario y la contraseña que te entregó el equipo de LOGYBOX.</p>
        <div id="err"></div>
        <form id="f">
          <div class="field"><label>Usuario</label><input name="username" autocomplete="username" autofocus required /></div>
          <div class="field"><label>Contraseña</label><input name="password" type="password" autocomplete="current-password" required /></div>
          <button class="btn btn-primary btn-block" type="submit">Entrar</button>
        </form>
        <p class="tiny muted" style="text-align:center;margin-top:20px">
          ¿Eres del equipo? <a href="admin.html" style="color:var(--orange);font-weight:600;text-decoration:none">Panel de administración</a>
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
      const ok = await loadCandidate(cred.user);
      if (!ok) {
        await signOut(auth);
        throw { code: "invalid-credential" };
      }
      afterLogin();
    } catch (err) {
      btn.disabled = false; btn.textContent = "Entrar";
      view.querySelector("#err").innerHTML = `<div class="alert alert-error">${esc(niceError(err))}</div>`;
    }
  });
  app.appendChild(view);
}

/* --------------------------------- Test ---------------------------------- */
function questionsOf(compId) {
  return TEST.preguntas.filter((q) => q.competencia === compId);
}
function answeredCount() {
  return TEST.preguntas.filter((q) => {
    const a = answers[q.id];
    return a !== undefined && a !== null && a !== "";
  }).length;
}
function updateCount() {
  const c = document.getElementById("ansCount");
  if (c) c.textContent = answeredCount();
}

function renderIntro() {
  app.innerHTML = "";
  const comps = TEST.competencias
    .map((c) => `<div class="glass" style="padding:14px 16px;display:flex;gap:11px;align-items:center">
        <span style="font-size:22px">${c.icon || "•"}</span>
        <span style="font-weight:500;font-size:14.5px">${esc(c.nombre)}</span>
      </div>`).join("");
  const view = el(`
    <div class="center">
      <div class="glass pad-lg appear" style="width:100%;max-width:720px">
        <div style="margin-bottom:22px">${logoSVG({ height: 34 })}</div>
        <p class="eyebrow">Prueba técnica</p>
        <h1 style="font-size:28px;margin:8px 0 10px">${esc(TEST.titulo)}</h1>
        <p class="muted" style="font-size:15px;line-height:1.6;margin-bottom:18px">${esc(TEST.descripcion)}</p>
        <div class="row wrap" style="gap:8px;margin-bottom:24px">
          <span class="badge" style="background:rgba(255,128,0,.10);color:#c05c00">📝 ${TEST.preguntas.length} preguntas</span>
          <span class="badge" style="background:rgba(47,16,219,.08);color:var(--blue)">⏱️ 25–30 minutos</span>
          <span class="badge" style="background:rgba(29,22,80,.07);color:var(--navy)">🔒 Un solo envío</span>
        </div>
        <p style="font-weight:600;font-size:13px;margin-bottom:12px">Vas a ser evaluado/a en:</p>
        <div class="grid grid-2" style="margin-bottom:28px">${comps}</div>
        <button class="btn btn-primary" id="start">Comenzar la prueba →</button>
        <p class="tiny muted" style="margin-top:14px">Puedes moverte entre secciones con “Atrás” y “Siguiente”; tus respuestas se conservan hasta que envíes.</p>
      </div>
    </div>`);
  view.querySelector("#start").addEventListener("click", () => { step = 0; renderStep(); });
  app.appendChild(view);
}

function renderStep() {
  const comp = TEST.competencias[step];
  const qs = questionsOf(comp.id);
  const total = TEST.competencias.length;
  const pct = Math.round((step / total) * 100);

  app.innerHTML = "";
  const view = el(`
    <div class="wrap" style="max-width:760px">
      <div class="row between" style="margin-bottom:16px">
        ${logoSVG({ height: 26 })}
        <span class="tiny muted"><b id="ansCount">${answeredCount()}</b> / ${TEST.preguntas.length} respondidas</span>
      </div>
      <div class="meter" style="margin-bottom:26px"><i style="width:${pct}%"></i></div>

      <div class="glass pad-lg appear">
        <div class="row" style="align-items:center;gap:12px;margin-bottom:6px">
          <span style="font-size:26px">${comp.icon || ""}</span>
          <div>
            <p class="eyebrow">Competencia ${step + 1} de ${total}</p>
            <h2 style="font-size:22px">${esc(comp.nombre)}</h2>
          </div>
        </div>
        <div id="qs" class="stack" style="margin-top:22px"></div>
      </div>

      <div class="row between mt-lg">
        <button class="btn btn-ghost" id="prev" ${step === 0 ? "disabled" : ""}>← Atrás</button>
        <button class="btn ${step === total - 1 ? "btn-navy" : "btn-primary"}" id="next">
          ${step === total - 1 ? "Enviar prueba ✓" : "Siguiente →"}
        </button>
      </div>
    </div>`);

  const qbox = view.querySelector("#qs");
  qs.forEach((q, i) => qbox.appendChild(renderQuestion(q, i + 1)));

  view.querySelector("#prev").addEventListener("click", () => { if (step > 0) { step--; renderStep(); window.scrollTo(0, 0); } });
  view.querySelector("#next").addEventListener("click", () => {
    if (step === total - 1) return confirmSubmit();
    step++; renderStep(); window.scrollTo(0, 0);
  });
  app.appendChild(view);
  window.scrollTo(0, 0);
}

function renderQuestion(q, num) {
  const wrap = el(`<div class="glass" style="padding:20px 22px;background:rgba(255,255,255,0.4)">
      <p style="font-weight:500;font-size:15.5px;line-height:1.5;margin-bottom:16px">
        <span style="color:var(--orange);font-weight:700">${num}.</span> ${esc(q.enunciado)}
      </p>
      <div class="body"></div>
    </div>`);
  const body = wrap.querySelector(".body");

  if (q.tipo === "single") {
    q.opciones.forEach((o, idx) => {
      const opt = el(`<label class="opt" style="display:flex;gap:12px;align-items:flex-start;padding:13px 15px;border:1px solid var(--line);border-radius:14px;cursor:pointer;margin-bottom:9px;transition:all .18s;background:rgba(255,255,255,.5)">
          <input type="radio" name="${q.id}" value="${idx}" style="width:18px;height:18px;margin-top:1px;accent-color:var(--orange);flex:none" />
          <span style="font-size:14.5px;line-height:1.45">${esc(o.texto)}</span>
        </label>`);
      const input = opt.querySelector("input");
      if (answers[q.id] === idx) { input.checked = true; markOpt(opt, true); }
      input.addEventListener("change", () => {
        answers[q.id] = idx;
        body.querySelectorAll(".opt").forEach((el2) => markOpt(el2, false));
        markOpt(opt, true);
        updateCount();
      });
      body.appendChild(opt);
    });
  } else if (q.tipo === "scale") {
    const scale = el(`<div><div class="row" style="gap:10px;justify-content:space-between;max-width:360px"></div>
      <div class="row between tiny muted" style="max-width:360px;margin-top:8px"><span>1 · Bajo</span><span>5 · Alto</span></div></div>`);
    const rowc = scale.querySelector(".row");
    for (let n = 1; n <= 5; n++) {
      const b = el(`<button type="button" style="flex:1;aspect-ratio:1;border-radius:14px;border:1px solid var(--line);background:rgba(255,255,255,.6);font-family:inherit;font-weight:600;font-size:17px;cursor:pointer;color:var(--navy);transition:all .18s">${n}</button>`);
      if (Number(answers[q.id]) === n) selScale(b, true);
      b.addEventListener("click", () => {
        answers[q.id] = n;
        rowc.querySelectorAll("button").forEach((x) => selScale(x, false));
        selScale(b, true);
        updateCount();
      });
      rowc.appendChild(b);
    }
    body.appendChild(scale);
  } else if (q.tipo === "text") {
    const ta = el(`<textarea placeholder="Escribe tu respuesta aquí...">${esc(answers[q.id] || "")}</textarea>`);
    ta.addEventListener("input", () => { answers[q.id] = ta.value; updateCount(); });
    body.appendChild(ta);
  }
  return wrap;
}
function markOpt(node, on) {
  node.style.borderColor = on ? "var(--orange)" : "var(--line)";
  node.style.background = on ? "rgba(255,128,0,.10)" : "rgba(255,255,255,.5)";
  node.style.boxShadow = on ? "0 0 0 3px rgba(255,128,0,.12)" : "none";
}
function selScale(node, on) {
  node.style.background = on ? "linear-gradient(135deg,var(--orange),#ff9e33)" : "rgba(255,255,255,.6)";
  node.style.color = on ? "#fff" : "var(--navy)";
  node.style.borderColor = on ? "transparent" : "var(--line)";
  node.style.transform = on ? "translateY(-2px)" : "none";
}

/* ------------------------------- Enviar ---------------------------------- */
function confirmSubmit() {
  const missing = TEST.preguntas.length - answeredCount();
  const msg = missing > 0
    ? `Te quedan <b>${missing}</b> preguntas sin responder. Puedes enviar de todos modos, pero no podrás editar después.`
    : `Respondiste todas las preguntas. Una vez enviada no podrás editarla.`;
  const modal = el(`
    <div style="position:fixed;inset:0;z-index:50;display:grid;place-items:center;padding:24px;background:rgba(29,22,80,.35);backdrop-filter:blur(6px)">
      <div class="glass pad-lg appear" style="max-width:440px;width:100%">
        <h2 style="font-size:21px;margin-bottom:10px">¿Enviar tu prueba?</h2>
        <p class="muted" style="font-size:14.5px;line-height:1.6;margin-bottom:24px">${msg}</p>
        <div class="row" style="justify-content:flex-end">
          <button class="btn btn-ghost" id="cancel">Revisar</button>
          <button class="btn btn-navy" id="send">Sí, enviar</button>
        </div>
      </div>
    </div>`);
  modal.querySelector("#cancel").addEventListener("click", () => modal.remove());
  modal.querySelector("#send").addEventListener("click", async () => {
    const btn = modal.querySelector("#send");
    btn.disabled = true; btn.textContent = "Enviando...";
    try {
      const now = new Date().toISOString();
      await setDoc(doc(db, "submissions", CAND.uid), {
        answers,
        manualScores: {},
        candidateName: CAND.name || "",
        candidateUser: CAND.username || "",
        submittedAt: now,
      });
      await updateDoc(doc(db, "candidates", CAND.uid), { status: "completed", submittedAt: now });
      modal.remove();
      renderThanks(false);
    } catch (err) {
      btn.disabled = false; btn.textContent = "Sí, enviar";
      alert(niceError(err));
    }
  });
  app.appendChild(modal);
}

/* ------------------------------- Gracias --------------------------------- */
function renderThanks(already) {
  app.innerHTML = "";
  const view = el(`
    <div class="center">
      <div class="glass pad-lg appear" style="max-width:520px;width:100%;text-align:center">
        <div style="width:82px;height:82px;margin:0 auto 24px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(135deg,var(--orange),#ff9e33);box-shadow:0 16px 34px -12px rgba(255,128,0,.5)">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><path d="M4 12.5l5 5L20 6.5" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <div style="margin-bottom:20px;display:flex;justify-content:center">${logoSVG({ height: 30 })}</div>
        <h1 style="font-size:26px;margin-bottom:12px">${already ? "Tu prueba ya fue enviada" : "¡Gracias! Tu prueba fue enviada"}</h1>
        <p class="muted" style="font-size:15.5px;line-height:1.6">
          ${already
            ? "Ya registramos tus respuestas. El equipo de LOGYBOX revisará tus resultados."
            : "Recibimos tus respuestas correctamente. El equipo de LOGYBOX las revisará y se pondrá en contacto contigo. ¡Mucho éxito!"}
        </p>
        <button class="btn btn-ghost mt-lg" id="out">Cerrar sesión</button>
      </div>
    </div>`);
  view.querySelector("#out").addEventListener("click", async () => { await signOut(auth); location.reload(); });
  app.appendChild(view);
}

function renderMessage(text) {
  app.innerHTML = "";
  const view = el(`
    <div class="center">
      <div class="glass pad-lg appear" style="max-width:520px;width:100%;text-align:center">
        <div style="margin-bottom:20px;display:flex;justify-content:center">${logoSVG({ height: 30 })}</div>
        <p class="muted" style="font-size:15.5px;line-height:1.6">${esc(text)}</p>
        <button class="btn btn-ghost mt-lg" id="out">Cerrar sesión</button>
      </div>
    </div>`);
  view.querySelector("#out").addEventListener("click", async () => { await signOut(auth); location.reload(); });
  app.appendChild(view);
}
