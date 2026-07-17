import { logoSVG, el, esc, renderNotConfigured } from "./common.js";
import {
  configured, auth, db, doc, getDoc, setDoc, updateDoc,
  signInAnonymously, signOut, currentUser, emailKey, isValidEmail, niceError,
} from "./firebase.js";

const app = document.getElementById("app");
let TEST = null;
let CAND = null; // { key, email, name }
let answers = {};
let step = 0;

/* ------------------------------- Arranque -------------------------------- */
init();
async function init() {
  if (!configured) return renderNotConfigured(app);
  // Sesion anonima: permite guardar en Firebase sin contraseña, de forma segura.
  let user = await currentUser();
  if (!user) {
    try { user = (await signInAnonymously(auth)).user; }
    catch (e) { return renderMessage("No se pudo iniciar la prueba. " + niceError(e)); }
  }
  renderEmail();
}

/* --------------------------- Paso 1: correo ------------------------------ */
function renderEmail(prefill = "") {
  app.innerHTML = "";
  const view = el(`
    <div class="center">
      <div class="glass pad-lg narrow appear" style="width:100%">
        <div style="margin-bottom:26px">${logoSVG({ height: 40 })}</div>
        <p class="eyebrow">Prueba técnica</p>
        <h1 style="font-size:27px;margin:8px 0 6px">Bienvenido/a</h1>
        <p class="muted" style="font-size:15px;margin-bottom:26px">Ingresa el correo con el que fuiste invitado/a por el equipo de LOGYBOX.</p>
        <div id="err"></div>
        <form id="f">
          <div class="field"><label>Correo electrónico</label>
            <input name="email" type="email" inputmode="email" autocomplete="email" autofocus required value="${esc(prefill)}" placeholder="tucorreo@ejemplo.com" />
          </div>
          <button class="btn btn-primary btn-block" type="submit">Continuar</button>
        </form>
        <p class="tiny muted" style="text-align:center;margin-top:20px">
          ¿Eres del equipo? <a href="admin.html" style="color:var(--orange);font-weight:600;text-decoration:none">Panel de administración</a>
        </p>
      </div>
    </div>`);
  view.querySelector("#f").addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = view.querySelector("button[type=submit]");
    const errBox = view.querySelector("#err");
    errBox.innerHTML = "";
    const email = new FormData(e.target).get("email");
    if (!isValidEmail(email)) {
      errBox.innerHTML = `<div class="alert alert-error">Escribe un correo válido.</div>`;
      return;
    }
    btn.disabled = true; btn.textContent = "Verificando...";
    try {
      const key = emailKey(email);
      const snap = await getDoc(doc(db, "candidates", key));
      if (!snap.exists()) {
        btn.disabled = false; btn.textContent = "Continuar";
        errBox.innerHTML = `<div class="alert alert-error">Este correo no está habilitado para la prueba. Verifica que sea el mismo que te compartió LOGYBOX o escríbenos.</div>`;
        return;
      }
      const data = snap.data();
      if (data.status === "completed") return renderThanks(true);
      CAND = { key, email: key, name: data.name || "" };
      renderName();
    } catch (err) {
      btn.disabled = false; btn.textContent = "Continuar";
      errBox.innerHTML = `<div class="alert alert-error">${esc(niceError(err))}</div>`;
    }
  });
  app.appendChild(view);
}

/* ------------------- Paso 2: nombre + empezar prueba --------------------- */
function renderName() {
  app.innerHTML = "";
  const view = el(`
    <div class="center">
      <div class="glass pad-lg appear" style="width:100%;max-width:640px">
        <div style="margin-bottom:22px">${logoSVG({ height: 34 })}</div>
        <p class="eyebrow">Prueba técnica · Asesor/a de Servicio al Cliente</p>
        <h1 style="font-size:25px;margin:8px 0 8px">¡Casi listo/a!</h1>
        <p class="muted" style="font-size:15px;line-height:1.6;margin-bottom:6px">
          Correo verificado: <b style="color:var(--navy)">${esc(CAND.email)}</b>
        </p>
        <p class="muted" style="font-size:15px;line-height:1.6;margin-bottom:22px">Escribe tu nombre completo para identificar tu prueba. Antes de empezar, ten en cuenta:</p>
        <div class="row wrap" style="gap:8px;margin-bottom:22px">
          <span class="badge" style="background:rgba(255,128,0,.10);color:#c05c00">📝 40 preguntas</span>
          <span class="badge" style="background:rgba(47,16,219,.08);color:var(--blue)">⏱️ 25–30 minutos</span>
          <span class="badge" style="background:rgba(29,22,80,.07);color:var(--navy)">🔒 Un solo envío</span>
        </div>
        <div id="err"></div>
        <form id="f">
          <div class="field"><label>Nombre completo</label>
            <input name="name" autocomplete="name" autofocus required value="${esc(CAND.name)}" placeholder="Ej: María Pérez" />
          </div>
          <button class="btn btn-primary btn-block" type="submit">Empezar prueba →</button>
        </form>
        <p class="tiny muted" style="text-align:center;margin-top:16px">Tus respuestas se guardan solo al final; completa la prueba de una sola vez.</p>
      </div>
    </div>`);
  view.querySelector("#f").addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = view.querySelector("button[type=submit]");
    const name = String(new FormData(e.target).get("name") || "").trim();
    if (name.length < 3) {
      view.querySelector("#err").innerHTML = `<div class="alert alert-error">Escribe tu nombre completo.</div>`;
      return;
    }
    CAND.name = name;
    btn.disabled = true; btn.textContent = "Cargando...";
    try {
      // Guardar el nombre (deja constancia de que inició) y cargar la prueba.
      await updateDoc(doc(db, "candidates", CAND.key), { name }).catch(() => {});
      const snap = await getDoc(doc(db, "config", "testPublic"));
      if (!snap.exists()) {
        btn.disabled = false; btn.textContent = "Empezar prueba →";
        view.querySelector("#err").innerHTML = `<div class="alert alert-error">La prueba aún no está publicada. Avísale al equipo de LOGYBOX.</div>`;
        return;
      }
      TEST = snap.data();
      answers = {};
      step = 0;
      renderStep();
    } catch (err) {
      btn.disabled = false; btn.textContent = "Empezar prueba →";
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
      await setDoc(doc(db, "submissions", CAND.key), {
        answers,
        manualScores: {},
        candidateName: CAND.name || "",
        candidateEmail: CAND.email || "",
        submittedAt: now,
      });
      await updateDoc(doc(db, "candidates", CAND.key), { status: "completed", name: CAND.name, submittedAt: now });
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
        <h1 style="font-size:26px;margin-bottom:12px">${already ? "Esta prueba ya fue enviada" : "¡Gracias! Tu prueba fue enviada"}</h1>
        <p class="muted" style="font-size:15.5px;line-height:1.6">
          ${already
            ? "Con este correo ya registramos una prueba enviada. El equipo de LOGYBOX revisará los resultados."
            : "Recibimos tus respuestas correctamente. El equipo de LOGYBOX las revisará y se pondrá en contacto contigo. ¡Mucho éxito!"}
        </p>
        <button class="btn btn-ghost mt-lg" id="out">Cerrar</button>
      </div>
    </div>`);
  view.querySelector("#out").addEventListener("click", () => location.reload());
  app.appendChild(view);
}

function renderMessage(text) {
  app.innerHTML = "";
  const view = el(`
    <div class="center">
      <div class="glass pad-lg appear" style="max-width:520px;width:100%;text-align:center">
        <div style="margin-bottom:20px;display:flex;justify-content:center">${logoSVG({ height: 30 })}</div>
        <p class="muted" style="font-size:15.5px;line-height:1.6">${esc(text)}</p>
        <button class="btn btn-ghost mt-lg" id="out">Reintentar</button>
      </div>
    </div>`);
  view.querySelector("#out").addEventListener("click", () => location.reload());
  app.appendChild(view);
}
