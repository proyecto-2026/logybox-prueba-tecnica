// ============================================================
//  Formato de entrevista — LOGYBOX
//  Guía estructurada (30 min) + calificación por dimensiones.
//  Se guarda en Firestore: interviews/{correo}
// ============================================================

export const GUIA = [
  {
    id: "s1",
    n: 1,
    titulo: "Bienvenida y presentación de LogyBox",
    minutos: 3,
    tipo: "guion",
    guion: "Queremos que esta sea una conversación para conocerte más allá de tu hoja de vida. Buscamos una persona que pueda crecer con LogyBox y permanecer en el equipo, por eso queremos entender quién eres, qué buscas y cómo te proyectas.",
    puntos: [
      "Qué hace LogyBox.",
      "Cuál sería su función.",
      "Cómo es el ritmo de atención.",
      "Que existen temporadas de alta demanda.",
      "Que deberá aprender diferentes herramientas y procesos.",
    ],
  },
  {
    id: "s2",
    n: 2,
    titulo: "Conocer a la persona desde el ser",
    minutos: 7,
    preguntas: [
      "Cuéntanos quién eres fuera de lo laboral.",
      "¿Qué es importante para ti en este momento de tu vida?",
      "¿Cómo te describirían las personas que han trabajado contigo?",
      "¿Qué valoras más en un equipo de trabajo?",
      "¿Qué situaciones laborales suelen motivarte?",
      "¿Qué situaciones pueden hacer que pierdas el interés en un trabajo?",
      "Cuéntanos sobre un error que hayas cometido y cómo lo solucionaste.",
    ],
    observar: [
      "Honestidad y naturalidad.",
      "Responsabilidad frente a los errores.",
      "Forma de relacionarse con otros.",
      "Madurez y estabilidad emocional.",
      "Coherencia entre lo que dice y los ejemplos que comparte.",
    ],
    dimensiones: [
      { id: "honestidad", label: "Honestidad y naturalidad", refuerzo: "Validar con referencias laborales antes de contratar." },
      { id: "responsabilidad", label: "Responsabilidad frente a errores", refuerzo: "Hacer seguimiento cercano de sus casos el primer mes." },
      { id: "relacionamiento", label: "Forma de relacionarse con otros", refuerzo: "Acompañar su integración al equipo y observar en periodo de prueba." },
      { id: "madurez", label: "Madurez y estabilidad emocional", refuerzo: "Evaluar su reacción bajo presión durante el periodo de prueba." },
      { id: "coherencia", label: "Coherencia entre lo que dice y sus ejemplos", refuerzo: "Contrastar con referencias y pedir ejemplos concretos verificables." },
    ],
  },
  {
    id: "s3",
    n: 3,
    titulo: "Entender su futuro y permanencia",
    minutos: 6,
    preguntas: [
      "¿Qué estás buscando realmente en tu próximo trabajo?",
      "¿Cómo te imaginas profesionalmente en dos o tres años?",
      "¿Qué te gustaría aprender durante el próximo año?",
      "¿Qué tendría que ofrecerte una empresa para que quisieras permanecer en ella?",
      "¿Por qué has terminado tus empleos anteriores?",
      "¿Actualmente estudias, trabajas o tienes algún proyecto paralelo?",
      "¿Cómo imaginas que LogyBox podría aportar a tu futuro?",
    ],
    clave: {
      pregunta: "Si dentro de un año sigues trabajando con nosotros y sientes que fue una buena decisión, ¿qué tendría que haber ocurrido durante ese tiempo?",
      porque: "Permite descubrir qué espera del cargo, qué entiende por crecimiento y qué podría influir en su permanencia.",
    },
    dimensiones: [
      { id: "proyeccion", label: "Claridad en su proyección", refuerzo: "Definir con la persona un plan de crecimiento a 6 meses." },
      { id: "permanencia", label: "Probabilidad de permanencia", refuerzo: "Riesgo de rotación: aclarar expectativas y plan de carrera desde el inicio." },
      { id: "motivacion", label: "Motivación genuina por el cargo", refuerzo: "Reforzar el propósito del cargo durante la inducción." },
    ],
  },
  {
    id: "s4",
    n: 4,
    titulo: "Experiencia en servicio al cliente",
    minutos: 5,
    preguntas: [
      "¿Qué significa para ti brindar un buen servicio?",
      "Cuéntanos una situación en la que hayas atendido a una persona molesta.",
      "¿Cómo respondes cuando el problema no depende directamente de ti?",
      "¿Qué haces cuando no tienes una respuesta inmediata para el cliente?",
      "¿Cómo organizas varios casos y pendientes al mismo tiempo?",
    ],
    caso: {
      enunciado: "Un cliente dice que su paquete llegó hace varios días a Miami, pero todavía no aparece registrado. Está molesto y siente que nadie le da una respuesta clara. Aún no tienes información confirmada. ¿Cómo manejarías el caso?",
      checks: [
        { id: "c1", label: "Reconoce la molestia del cliente" },
        { id: "c2", label: "Solicita los datos necesarios" },
        { id: "c3", label: "Consulta la información antes de responder" },
        { id: "c4", label: "Evita prometer fechas sin confirmación" },
        { id: "c5", label: "Explica qué se hará y da seguimiento" },
      ],
    },
    dimensiones: [
      { id: "servicio", label: "Entendimiento del buen servicio", refuerzo: "Reforzar con capacitación en el protocolo de atención de LogyBox." },
      { id: "manejoDificil", label: "Manejo de clientes molestos", refuerzo: "Acompañarlo/a en casos difíciles las primeras semanas." },
      { id: "organizacion", label: "Organización de varios casos", refuerzo: "Enseñar método de priorización y manejo de la bandeja de casos." },
      { id: "casoPractico", label: "Calidad de respuesta al caso práctico", refuerzo: "Reforzar con simulaciones de casos reales en la inducción." },
    ],
  },
  {
    id: "s5",
    n: 5,
    titulo: "Herramientas y capacidad de aprendizaje",
    minutos: 4,
    preguntas: [
      "¿Qué herramientas digitales has manejado?",
      "¿Has utilizado WhatsApp Business, Excel, Google Sheets, CRM o plataformas de seguimiento?",
      "Cuando no conoces una herramienta, ¿cómo haces para aprenderla?",
      "Cuéntanos sobre una herramienta que hayas tenido que aprender rápidamente.",
      "¿Te consideras una persona organizada con la información? Danos un ejemplo.",
    ],
    nota: "No es indispensable que conozca todas las plataformas. Lo importante es identificar su disposición, autonomía y velocidad para aprender.",
    dimensiones: [
      { id: "herramientas", label: "Nivel actual de herramientas", refuerzo: "Plan de capacitación en Excel y las plataformas del cargo." },
      { id: "aprendizaje", label: "Autonomía y velocidad para aprender", refuerzo: "Entregar material guiado y hacer checkpoints de aprendizaje." },
      { id: "ordenInfo", label: "Orden con la información", refuerzo: "Reforzar con plantillas y formatos de registro estandarizados." },
    ],
  },
  {
    id: "s6",
    n: 6,
    titulo: "Disponibilidad y condiciones",
    minutos: 3,
    nota: "Expliquen primero el horario y las condiciones reales del cargo. Luego pregunten:",
    preguntas: [
      "¿Cuál es tu disponibilidad actualmente?",
      "¿Tienes estudios, otro empleo o responsabilidades que puedan interferir con el horario?",
      "¿Qué disponibilidad tendrías durante temporadas altas como Black Friday o Navidad?",
      "¿Cuentas con los equipos y la conexión necesarios?",
      "¿Cuándo podrías comenzar?",
      "¿Cuál es tu expectativa salarial?",
    ],
    campos: [
      { id: "inicio", label: "¿Cuándo puede empezar?", placeholder: "Ej: inmediato / 15 días" },
      { id: "salario", label: "Expectativa salarial", placeholder: "Ej: $1.800.000" },
      { id: "horario", label: "Disponibilidad de horario", placeholder: "Ej: completa, sin restricciones" },
      { id: "equipos", label: "Equipos y conexión", placeholder: "Ej: computador propio + buena conexión" },
    ],
    dimensiones: [
      { id: "disponibilidad", label: "Ajuste de disponibilidad al cargo", refuerzo: "Confirmar por escrito horario y compromiso en temporadas altas." },
    ],
  },
  {
    id: "s7",
    n: 7,
    titulo: "Cierre",
    minutos: 2,
    preguntas: [
      "Después de conocer el cargo, ¿qué te entusiasma de la oportunidad?",
      "¿Hay algo que te genere dudas o preocupación?",
      "¿Qué te gustaría preguntarnos?",
      "¿Por qué consideras que podrías construir un proceso estable con LogyBox?",
    ],
    dimensiones: [
      { id: "interes", label: "Interés y entusiasmo real", refuerzo: "Resolver sus dudas pendientes antes de hacerle la oferta." },
    ],
  },
];

// Bloques para el analisis del perfil
export const BLOQUES = [
  { id: "ser", nombre: "Perfil personal", icon: "🧍", dims: ["honestidad", "responsabilidad", "relacionamiento", "madurez", "coherencia"] },
  { id: "futuro", nombre: "Proyección y permanencia", icon: "🎯", dims: ["proyeccion", "permanencia", "motivacion"] },
  { id: "servicio", nombre: "Servicio al cliente", icon: "💬", dims: ["servicio", "manejoDificil", "organizacion", "casoPractico"] },
  { id: "tools", nombre: "Herramientas y aprendizaje", icon: "🛠️", dims: ["herramientas", "aprendizaje", "ordenInfo"] },
  { id: "fit", nombre: "Condiciones e interés", icon: "🤝", dims: ["disponibilidad", "interes"] },
];

export const TODAS_DIMENSIONES = GUIA.flatMap((s) => s.dimensiones || []);
export const MINUTOS_TOTAL = GUIA.reduce((s, x) => s + x.minutos, 0);

// Calcula el puntaje de la entrevista (1-5 por dimensión → %)
export function interviewScore(data) {
  const ratings = data?.ratings || {};
  const bloques = BLOQUES.map((b) => {
    const vals = b.dims.map((d) => Number(ratings[d])).filter((v) => v >= 1 && v <= 5);
    const avg = vals.length ? vals.reduce((a, c) => a + c, 0) / vals.length : null;
    return { ...b, avg, pct: avg == null ? null : Math.round((avg / 5) * 100), evaluadas: vals.length, total: b.dims.length };
  });
  const todas = TODAS_DIMENSIONES.map((d) => Number(ratings[d.id])).filter((v) => v >= 1 && v <= 5);
  const avg = todas.length ? todas.reduce((a, c) => a + c, 0) / todas.length : null;
  const pct = avg == null ? null : Math.round((avg / 5) * 100);
  return {
    bloques,
    avg,
    pct,
    evaluadas: todas.length,
    totalDims: TODAS_DIMENSIONES.length,
    completa: todas.length === TODAS_DIMENSIONES.length,
  };
}

// Nivel de cada aspecto calificado (1-5)
export function nivelDim(v) {
  const n = Number(v);
  if (n === 5) return { txt: "Excelente", grupo: "fortaleza", color: "#1c7a3a", icono: "★" };
  if (n === 4) return { txt: "Bueno",     grupo: "fortaleza", color: "#1c7a3a", icono: "✓" };
  if (n === 3) return { txt: "Regular",   grupo: "reforzar",  color: "#c05c00", icono: "⚠️" };
  if (n === 2) return { txt: "Débil",     grupo: "alerta",    color: "#c62a20", icono: "▼" };
  if (n === 1) return { txt: "Muy débil", grupo: "alerta",    color: "#c62a20", icono: "▼" };
  return null;
}

// Lectura automatica de la entrevista: que salio bien, que es regular
// (y como reforzarlo) y que enciende alertas.
export function diagnostico(ratings = {}) {
  const fortalezas = [], reforzar = [], alertas = [], sinCalificar = [];
  for (const d of TODAS_DIMENSIONES) {
    const v = Number(ratings[d.id]);
    const nivel = nivelDim(v);
    if (!nivel) { sinCalificar.push(d); continue; }
    const item = { ...d, valor: v, nivel };
    if (nivel.grupo === "fortaleza") fortalezas.push(item);
    else if (nivel.grupo === "reforzar") reforzar.push(item);
    else alertas.push(item);
  }
  const orden = (a, b) => a.valor - b.valor;
  return {
    fortalezas: fortalezas.sort((a, b) => b.valor - a.valor),
    reforzar: reforzar.sort(orden),
    alertas: alertas.sort(orden),
    sinCalificar,
  };
}

export function sugerencia(pct) {
  if (pct == null) return { texto: "Sin calificar", color: "#6b6893", icono: "○" };
  if (pct >= 80) return { texto: "Contratar", color: "#1c7a3a", icono: "✓" };
  if (pct >= 60) return { texto: "Segunda opción", color: "#c05c00", icono: "≈" };
  return { texto: "No continuar", color: "#c62a20", icono: "✕" };
}

export const VEREDICTOS = [
  { id: "contratar", label: "Contratar", color: "#1c7a3a", icono: "✓" },
  { id: "segunda", label: "Segunda opción", color: "#c05c00", icono: "≈" },
  { id: "no", label: "No continuar", color: "#c62a20", icono: "✕" },
];
