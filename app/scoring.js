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
