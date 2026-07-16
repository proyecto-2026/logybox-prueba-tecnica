// Calculo de puntajes (se ejecuta en el panel admin, que es el unico
// que puede leer la prueba CON los puntos de cada opcion).

export function maxForQuestion(q) {
  if (q.tipo === "single") return Math.max(0, ...q.opciones.map((o) => o.puntos));
  if (q.tipo === "scale") return 5;
  if (q.tipo === "text") return q.maxPoints || 0;
  return 0;
}

export function computeScores(test, submission) {
  const byComp = {};
  for (const c of test.competencias)
    byComp[c.id] = { id: c.id, nombre: c.nombre, icon: c.icon, points: 0, max: 0 };

  let hasPendingManual = false;

  for (const q of test.preguntas) {
    const comp = byComp[q.competencia];
    if (!comp) continue;
    const max = maxForQuestion(q);
    comp.max += max;

    if (q.tipo === "single") {
      const ans = submission.answers?.[q.id];
      const opt = typeof ans === "number" ? q.opciones[ans] : null;
      if (opt) comp.points += opt.puntos;
    } else if (q.tipo === "scale") {
      const v = Number(submission.answers?.[q.id]);
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

// ---------------------------------------------------------------
// Veredicto automático: interpreta el resultado para el admin.
// Umbrales: ≥85 sobresaliente · 70–84 recomendado · 55–69 con
// reservas · <55 no recomendado. Excel <60% genera alerta operativa.
// ---------------------------------------------------------------
export function getVerdict(score) {
  const pct = score.totalPct;
  let nivel, color, icono, resumen;
  if (pct >= 85) {
    nivel = "Perfil sobresaliente"; color = "#1c7a3a"; icono = "🌟";
    resumen = "Supera ampliamente el estándar del cargo. Avanzar a entrevista con prioridad.";
  } else if (pct >= 70) {
    nivel = "Perfil recomendado"; color = "#1c7a3a"; icono = "✓";
    resumen = "Cumple el estándar del cargo. Recomendado para pasar a entrevista.";
  } else if (pct >= 55) {
    nivel = "Perfil con reservas"; color = "#c05c00"; icono = "⚠️";
    resumen = "Cumple parcialmente. Si avanza, profundizar en la entrevista sobre sus competencias débiles.";
  } else {
    nivel = "Perfil no recomendado"; color = "#c62a20"; icono = "✕";
    resumen = "Está por debajo del estándar que exige el cargo.";
  }

  const fuertes = score.competencias.filter((c) => c.pct >= 75);
  const debiles = score.competencias.filter((c) => c.pct < 50);
  const excel = score.competencias.find((c) => c.id === "excel");
  const alertaExcel = !!excel && excel.pct < 60;

  return {
    nivel, color, icono, resumen,
    fuertes, debiles,
    alertaExcel,
    excelPct: excel ? excel.pct : null,
    parcial: score.hasPendingManual, // aún hay respuestas abiertas sin calificar
  };
}

// Version de la prueba SIN puntos, que es la que leen los candidatos.
export function sanitizeTest(test) {
  return {
    titulo: test.titulo,
    descripcion: test.descripcion,
    competencias: test.competencias,
    preguntas: test.preguntas.map((q) => ({
      id: q.id,
      competencia: q.competencia,
      tipo: q.tipo,
      enunciado: q.enunciado,
      ...(q.tipo === "single" ? { opciones: q.opciones.map((o) => ({ texto: o.texto })) } : {}),
    })),
  };
}
