// Utilidades compartidas + logo de LOGYBOX
// Rutas RELATIVAS (sin "/" inicial) para funcionar en GitHub Pages (usuario.github.io/repo/).

export function logoSVG({ height = 34, variant = "light" } = {}) {
  const src = variant === "dark" ? "logo-dark.png" : "logo-light.png";
  return `<img src="${src}" alt="LOGYBOX" style="display:block;height:${height}px;width:auto" />`;
}

export function el(html) {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

export function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}

export function fmtDate(iso) {
  if (!iso) return "-";
  return new Date(iso).toLocaleString("es-CO", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export function scoreColor(pct) {
  if (pct >= 75) return "#1c7a3a";
  if (pct >= 50) return "#c05c00";
  return "#c62a20";
}

// Pantalla que se muestra cuando firebase-config.js aun no tiene las claves reales.
export function renderNotConfigured(app) {
  app.innerHTML = "";
  app.appendChild(el(`
    <div class="center">
      <div class="glass pad-lg appear" style="max-width:640px;width:100%">
        <div style="margin-bottom:22px">${logoSVG({ height: 34 })}</div>
        <p class="eyebrow">Configuración pendiente</p>
        <h1 style="font-size:24px;margin:8px 0 12px">Falta conectar Firebase</h1>
        <p class="muted" style="font-size:15px;line-height:1.7">
          Esta app guarda usuarios y resultados en Firebase, pero aún no tiene las claves del proyecto.
        </p>
        <ol class="muted" style="font-size:14.5px;line-height:1.9;margin:16px 0 6px 20px">
          <li>Entra a <b>console.firebase.google.com</b> y crea un proyecto.</li>
          <li>Agrega una <b>App Web</b> (ícono <b>&lt;/&gt;</b>) y copia el objeto <code>firebaseConfig</code>.</li>
          <li>Pégalo en el archivo <b>firebase-config.js</b> de este sitio.</li>
          <li>Sigue los pasos completos del <b>README.md</b> (Auth, Firestore y reglas).</li>
        </ol>
      </div>
    </div>`));
}
