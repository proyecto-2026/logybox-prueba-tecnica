// ============================================================
//  Prueba técnica — Asesor/a de Servicio al Cliente · LOGYBOX
// ============================================================
//  El admin puede editar, agregar o eliminar preguntas desde el
//  panel (pestaña "Editar prueba").
//
//  Tipos de pregunta:
//   · "single" — opción múltiple. Cada opción tiene puntos:
//        3 = respuesta ideal · 2 = buena · 1 = aceptable · 0 = no encaja
//   · "scale"  — autoevaluación de 1 a 5 (puntos = valor elegido)
//   · "text"   — respuesta abierta; la califica el admin (maxPoints)
// ============================================================

export const COMPETENCIAS = [
  { id: "situaciones", nombre: "Manejo de situaciones",    icon: "🧭" },
  { id: "frustracion", nombre: "Manejo de la frustración", icon: "🌡️" },
  { id: "resolutiva",  nombre: "Capacidad resolutiva",     icon: "🧩" },
  { id: "excel",       nombre: "Manejo de Excel",          icon: "📊" },
  { id: "empatia",     nombre: "Empatía con el cliente",   icon: "💙" },
  { id: "pertenencia", nombre: "Sentido de pertenencia",   icon: "🏅" },
];

export const PREGUNTAS = [
  // ══════════════════════════════════════════════════════════
  // 1 · MANEJO DE SITUACIONES — presión, prioridades y criterio
  // ══════════════════════════════════════════════════════════
  {
    id: "sit1",
    competencia: "situaciones",
    tipo: "single",
    enunciado: "Un cliente escribe muy molesto: su envío lleva 3 días de retraso y exige una respuesta inmediata. ¿Qué haces primero?",
    opciones: [
      { texto: "Le explico la política de la empresa sobre los retrasos.", puntos: 1 },
      { texto: "Reconozco su molestia, me disculpo y le confirmo que reviso su caso de inmediato.", puntos: 3 },
      { texto: "Le pido que espere mientras consulto con mi supervisor.", puntos: 2 },
      { texto: "Le aclaro que los retrasos no dependen de mí.", puntos: 0 },
    ],
  },
  {
    id: "sit2",
    competencia: "situaciones",
    tipo: "single",
    enunciado: "Recibes 5 chats al mismo tiempo en hora pico. ¿Cómo los manejas?",
    opciones: [
      { texto: "Los respondo en orden de llegada, sin importar el tipo de caso.", puntos: 1 },
      { texto: "Identifico los urgentes (entregas fallidas, cobros errados), los priorizo y aviso a los demás un tiempo estimado de espera.", puntos: 3 },
      { texto: "Atiendo primero los más fáciles para bajar el volumen rápido.", puntos: 1 },
      { texto: "Dejo de responder hasta que llegue apoyo del equipo.", puntos: 0 },
    ],
  },
  {
    id: "sit3",
    competencia: "situaciones",
    tipo: "single",
    enunciado: "El cliente pregunta algo que no sabes responder y en ese momento nadie de tu equipo está disponible. ¿Qué haces?",
    opciones: [
      { texto: "Improviso una respuesta para no dejarlo esperando.", puntos: 0 },
      { texto: "Le digo que no sé y termino la conversación.", puntos: 0 },
      { texto: "Le digo con honestidad que debo verificar la información, le doy una hora concreta de respuesta y cumplo ese compromiso.", puntos: 3 },
      { texto: "Le pido que escriba de nuevo más tarde.", puntos: 1 },
    ],
  },
  {
    id: "sit4",
    competencia: "situaciones",
    tipo: "single",
    enunciado: "Un cliente exige un reembolso que la política no permite y amenaza con quejarse en redes sociales. ¿Qué haces?",
    opciones: [
      { texto: "Cedo y le doy el reembolso para evitar la queja pública.", puntos: 1 },
      { texto: "Con calma le explico lo que sí puedo ofrecerle según la política y le propongo una alternativa que lo deje satisfecho.", puntos: 3 },
      { texto: "Le digo que está en su derecho, que la política es la política.", puntos: 1 },
      { texto: "Lo ignoro esperando que se calme solo.", puntos: 0 },
    ],
  },
  {
    id: "sit5",
    competencia: "situaciones",
    tipo: "single",
    enunciado: "En un mismo chat, el cliente mezcla tres temas: el rastreo de su envío, una duda de factura y una queja. ¿Cómo organizas la conversación?",
    opciones: [
      { texto: "Respondo todo junto en un solo mensaje largo.", puntos: 1 },
      { texto: "Atiendo un tema a la vez: resuelvo, confirmo con el cliente y paso al siguiente.", puntos: 3 },
      { texto: "Le pido que abra un caso aparte por cada tema.", puntos: 1 },
      { texto: "Respondo solo lo primero que preguntó.", puntos: 0 },
    ],
  },
  {
    id: "sit6",
    competencia: "situaciones",
    tipo: "scale",
    enunciado: "Del 1 al 5, ¿qué tanto te describe esta frase?: “Me siento cómodo/a atendiendo varios casos a la vez sin perder calidad ni calma”.",
  },
  {
    id: "sit7",
    competencia: "situaciones",
    tipo: "text",
    enunciado: "Cuéntanos una situación laboral complicada que te haya tocado manejar (muchos frentes a la vez, o información incompleta). ¿Qué hiciste y cuál fue el resultado?",
    maxPoints: 4,
  },

  // ══════════════════════════════════════════════════════════
  // 2 · MANEJO DE LA FRUSTRACIÓN — autocontrol y recuperación
  // ══════════════════════════════════════════════════════════
  {
    id: "fru1",
    competencia: "frustracion",
    tipo: "single",
    enunciado: "Un cliente te insulta directamente durante la conversación. ¿Cómo reaccionas?",
    opciones: [
      { texto: "Le respondo en el mismo tono, para ponerle límites.", puntos: 0 },
      { texto: "Mantengo la calma, no lo tomo personal y llevo la conversación de vuelta a la solución.", puntos: 3 },
      { texto: "Cierro el chat de inmediato, sin explicación.", puntos: 1 },
      { texto: "Sigo como si nada hubiera pasado, sin reconocer su molestia.", puntos: 1 },
    ],
  },
  {
    id: "fru4",
    competencia: "frustracion",
    tipo: "single",
    enunciado: "Un cliente descarga contigo su enojo por un error que cometió otro asesor antes que tú. ¿Qué haces?",
    opciones: [
      { texto: "Le aclaro que yo no fui quien cometió el error.", puntos: 1 },
      { texto: "Me hago cargo del caso: me disculpo por la mala experiencia y me enfoco en resolverla.", puntos: 3 },
      { texto: "Le pido que lo hable con el asesor anterior.", puntos: 0 },
      { texto: "Le respondo cortante: no es mi culpa.", puntos: 0 },
    ],
  },
  {
    id: "fru5",
    competencia: "frustracion",
    tipo: "single",
    enunciado: "Cometiste un error con un pedido; el cliente lo nota y se molesta. ¿Qué haces?",
    opciones: [
      { texto: "Le resto importancia al error para no quedar mal.", puntos: 0 },
      { texto: "Reconozco el error con honestidad, me disculpo y lo corrijo de inmediato.", puntos: 3 },
      { texto: "Le explico que fue culpa del sistema o de otra área.", puntos: 0 },
      { texto: "Me disculpo, pero no corrijo nada.", puntos: 1 },
    ],
  },
  {
    id: "fru2",
    competencia: "frustracion",
    tipo: "scale",
    enunciado: "Del 1 al 5: “Puedo mantener la calma aunque reciba varias quejas difíciles seguidas”.",
  },
  {
    id: "fru6",
    competencia: "frustracion",
    tipo: "scale",
    enunciado: "Del 1 al 5: “Después de una conversación difícil me recupero rápido y atiendo bien al siguiente cliente”.",
  },
  {
    id: "fru3",
    competencia: "frustracion",
    tipo: "text",
    enunciado: "Cuéntanos una situación real en la que trataste con una persona muy molesta (cliente, compañero o jefe). ¿Cómo manejaste tu propia frustración y qué resultado tuvo?",
    maxPoints: 3,
  },

  // ══════════════════════════════════════════════════════════
  // 3 · CAPACIDAD RESOLUTIVA — investigar, decidir, resolver
  // ══════════════════════════════════════════════════════════
  {
    id: "res1",
    competencia: "resolutiva",
    tipo: "single",
    enunciado: "Un cliente reporta que su paquete se perdió, pero el sistema muestra el estado “Entregado”. ¿Qué haces?",
    opciones: [
      { texto: "Le informo que según el sistema ya fue entregado, y cierro el caso.", puntos: 0 },
      { texto: "Investigo: confirmo la dirección, contacto a la transportadora y le doy seguimiento al cliente con tiempos claros.", puntos: 3 },
      { texto: "Le sugiero preguntar a sus vecinos, y cierro el caso.", puntos: 1 },
      { texto: "Escalo el caso de inmediato, sin recopilar información.", puntos: 1 },
    ],
  },
  {
    id: "res3",
    competencia: "resolutiva",
    tipo: "single",
    enunciado: "Un cliente necesita su pedido para mañana sí o sí, pero el envío estándar tarda 3 días. ¿Qué haces?",
    opciones: [
      { texto: "Le digo que no es posible, y cierro la conversación.", puntos: 0 },
      { texto: "Reviso alternativas reales (cambio a express, punto de recogida, otra bodega) y le propongo la mejor opción disponible.", puntos: 3 },
      { texto: "Le prometo que llegará mañana, sin verificar si se puede.", puntos: 0 },
      { texto: "Le sugiero cancelar el pedido.", puntos: 1 },
    ],
  },
  {
    id: "res4",
    competencia: "resolutiva",
    tipo: "single",
    enunciado: "Te llega un caso con información incompleta. ¿Cuál es el mejor primer paso?",
    opciones: [
      { texto: "Deducir la respuesta para cerrarlo rápido.", puntos: 0 },
      { texto: "Hacer al cliente las preguntas clave que faltan y verificar en el sistema antes de responder.", puntos: 3 },
      { texto: "Escalarlo de inmediato, sin intentar resolverlo.", puntos: 1 },
      { texto: "Responder lo que creo y esperar que funcione.", puntos: 0 },
    ],
  },
  {
    id: "res6",
    competencia: "resolutiva",
    tipo: "single",
    enunciado: "¿Cuándo es correcto escalar un caso a tu líder o a otra área?",
    opciones: [
      { texto: "Siempre que el cliente se molesta.", puntos: 0 },
      { texto: "Cuando ya agoté lo que está en mis manos o el caso supera mi nivel de autorización — y lo entrego con toda la información lista.", puntos: 3 },
      { texto: "Nunca: debo resolver absolutamente todo yo.", puntos: 0 },
      { texto: "Apenas el caso se vea difícil, para no perder tiempo.", puntos: 1 },
    ],
  },
  {
    id: "res2",
    competencia: "resolutiva",
    tipo: "text",
    enunciado: "Un cliente pagó envío EXPRESS, pero el paquete llegó en tiempo estándar y él pide el reembolso total. La política solo permite devolver la diferencia del express, no todo el envío. Escribe la respuesta exacta que le enviarías.",
    maxPoints: 4,
  },
  {
    id: "res5",
    competencia: "resolutiva",
    tipo: "text",
    enunciado: "Un cliente asegura que nunca recibió su pedido, pero la transportadora reporta “entregado, con foto de evidencia”. Explica paso a paso cómo investigarías y resolverías este caso.",
    maxPoints: 4,
  },

  // ══════════════════════════════════════════════════════════
  // 4 · MANEJO DE EXCEL — herramienta operativa del día a día
  // ══════════════════════════════════════════════════════════
  {
    id: "exc1",
    competencia: "excel",
    tipo: "single",
    enunciado: "Tienes dos tablas: una con números de guía y otra con sus estados. Necesitas traer el estado de cada guía a la primera tabla. ¿Qué función usas?",
    opciones: [
      { texto: "SUMA", puntos: 0 },
      { texto: "BUSCARV / VLOOKUP (o BUSCARX / XLOOKUP)", puntos: 3 },
      { texto: "PROMEDIO", puntos: 0 },
      { texto: "CONTAR", puntos: 0 },
    ],
  },
  {
    id: "exc2",
    competencia: "excel",
    tipo: "single",
    enunciado: "Necesitas contar cuántos envíos de una columna están en estado “Entregado”. ¿Qué función usas?",
    opciones: [
      { texto: "CONTAR.SI / COUNTIF", puntos: 3 },
      { texto: "CONTAR / COUNT", puntos: 1 },
      { texto: "SUMA", puntos: 0 },
      { texto: "SI / IF", puntos: 0 },
    ],
  },
  {
    id: "exc3",
    competencia: "excel",
    tipo: "single",
    enunciado: "Tienes 500 números de guía y sospechas que hay repetidos. ¿Cuál es la forma más eficiente de encontrarlos?",
    opciones: [
      { texto: "Revisarlos uno por uno.", puntos: 0 },
      { texto: "Ordenar la columna alfabéticamente, nada más.", puntos: 1 },
      { texto: "Usar Formato condicional → Resaltar duplicados (o la herramienta Quitar duplicados).", puntos: 3 },
      { texto: "Copiar la columna a otra hoja.", puntos: 0 },
    ],
  },
  {
    id: "exc5",
    competencia: "excel",
    tipo: "single",
    enunciado: "Una columna trae “Ciudad - Departamento” en la misma celda (ej. “Bogotá - Cundinamarca”) y necesitas separarla en dos columnas. ¿Qué usas?",
    opciones: [
      { texto: "Lo separo a mano, fila por fila.", puntos: 0 },
      { texto: "Datos → Texto en columnas (o funciones como IZQUIERDA / DERECHA / ENCONTRAR).", puntos: 3 },
      { texto: "BUSCARV.", puntos: 0 },
      { texto: "Copiar y pegar.", puntos: 0 },
    ],
  },
  {
    id: "exc6",
    competencia: "excel",
    tipo: "single",
    enunciado: "Tienes 2.000 filas de envíos y necesitas un resumen: cuántos hay por cada estado (Entregado, En tránsito, Devuelto). ¿Cuál es la forma más eficiente?",
    opciones: [
      { texto: "Filtrar y contar a mano cada estado.", puntos: 1 },
      { texto: "Una tabla dinámica.", puntos: 3 },
      { texto: "Revisar fila por fila.", puntos: 0 },
      { texto: "Solo ordenar por estado.", puntos: 1 },
    ],
  },
  {
    id: "exc9",
    competencia: "excel",
    tipo: "single",
    enunciado: "De un reporte de 1.000 guías necesitas ver únicamente las de Medellín que están en estado “Devuelto”. ¿Qué haces?",
    opciones: [
      { texto: "Activo los filtros (Datos → Filtro) y filtro por ciudad y estado a la vez.", puntos: 3 },
      { texto: "Busco “Medellín” con Ctrl+F, una por una.", puntos: 0 },
      { texto: "Ordeno por ciudad y voy revisando.", puntos: 1 },
      { texto: "Imprimo el reporte y las marco con resaltador.", puntos: 0 },
    ],
  },
  {
    id: "exc7",
    competencia: "excel",
    tipo: "single",
    enunciado: "Copias una fórmula hacia abajo, pero necesitas que una celda de referencia quede fija (que no se mueva). ¿Cómo lo logras?",
    opciones: [
      { texto: "Con referencia absoluta usando $ (ej. $B$2).", puntos: 3 },
      { texto: "Escribiendo el valor a mano en cada fila.", puntos: 1 },
      { texto: "No se puede hacer.", puntos: 0 },
      { texto: "Cambiando el formato de la celda.", puntos: 0 },
    ],
  },
  {
    id: "exc8",
    competencia: "excel",
    tipo: "single",
    enunciado: "Quieres que una celda muestre “URGENTE” si el envío lleva más de 2 días sin moverse, y “OK” si no. ¿Qué función usas?",
    opciones: [
      { texto: "SUMA", puntos: 0 },
      { texto: "SI / IF (con una condición)", puntos: 3 },
      { texto: "CONTAR", puntos: 0 },
      { texto: "PROMEDIO", puntos: 0 },
    ],
  },
  {
    id: "exc4",
    competencia: "excel",
    tipo: "scale",
    enunciado: "Del 1 (básico) al 5 (avanzado): ¿cómo calificas tu nivel real con tablas dinámicas, filtros y fórmulas en Excel? (Lo validaremos en la entrevista).",
  },
  {
    id: "exc10",
    competencia: "excel",
    tipo: "text",
    enunciado: "Con tus palabras: ¿para qué usarías Excel en tu día a día como asesor/a de servicio al cliente en una empresa de envíos? Da 2 ejemplos concretos.",
    maxPoints: 3,
  },

  // ══════════════════════════════════════════════════════════
  // 5 · EMPATÍA CON EL CLIENTE — tono, calidez y lectura emocional
  // ══════════════════════════════════════════════════════════
  {
    id: "emp1",
    competencia: "empatia",
    tipo: "single",
    enunciado: "Un cliente adulto mayor no logra rastrear su pedido y está frustrado. ¿Cómo lo atiendes?",
    opciones: [
      { texto: "Le envío el link de rastreo y doy el caso por resuelto.", puntos: 1 },
      { texto: "Le explico paso a paso, con lenguaje simple, y me ofrezco a hacerlo por él si lo prefiere.", puntos: 3 },
      { texto: "Le digo que es muy fácil y que lo intente otra vez.", puntos: 0 },
      { texto: "Le sugiero pedir ayuda a un familiar más joven.", puntos: 1 },
    ],
  },
  {
    id: "emp3",
    competencia: "empatia",
    tipo: "single",
    enunciado: "El pedido era un regalo de cumpleaños y llegó un día tarde: la sorpresa se arruinó. El cliente te lo cuenta dolido. ¿Cómo respondes?",
    opciones: [
      { texto: "Le explico que los tiempos de envío son estimados.", puntos: 0 },
      { texto: "Valido lo que siente, me disculpo con sinceridad y busco un gesto que lo compense (un cupón, prioridad en su próximo envío).", puntos: 3 },
      { texto: "Le digo que al menos el pedido ya llegó.", puntos: 0 },
      { texto: "Le recomiendo comprar con más anticipación la próxima vez.", puntos: 0 },
    ],
  },
  {
    id: "emp4",
    competencia: "empatia",
    tipo: "scale",
    enunciado: "Del 1 al 5: “Percibo con facilidad cómo se siente un cliente por su forma de escribir, aunque no lo diga directamente”.",
  },
  {
    id: "emp2",
    competencia: "empatia",
    tipo: "text",
    enunciado: "Un cliente acaba de reportar que su pedido llegó roto. Escribe el primer mensaje exacto que le enviarías.",
    maxPoints: 3,
  },
  {
    id: "emp5",
    competencia: "empatia",
    tipo: "text",
    enunciado: "Reescribe este mensaje para que suene humano y empático, sin perder claridad: “Su solicitud fue rechazada. No aplica. Cualquier cosa avise.”",
    maxPoints: 3,
  },

  // ══════════════════════════════════════════════════════════
  // 6 · SENTIDO DE PERTENENCIA — compromiso y marca propia
  // ══════════════════════════════════════════════════════════
  {
    id: "per1",
    competencia: "pertenencia",
    tipo: "single",
    enunciado: "Notas que un proceso interno está generando muchas quejas de clientes. ¿Qué haces?",
    opciones: [
      { texto: "No es mi área: sigo respondiendo las quejas una por una.", puntos: 0 },
      { texto: "Documento el patrón y se lo reporto a mi líder junto con una propuesta de mejora.", puntos: 3 },
      { texto: "Me quejo del proceso con mis compañeros.", puntos: 0 },
      { texto: "Espero a que alguien más lo reporte.", puntos: 1 },
    ],
  },
  {
    id: "per4",
    competencia: "pertenencia",
    tipo: "single",
    enunciado: "Un amigo te pregunta por la empresa donde trabajas. ¿Qué sueles hacer?",
    opciones: [
      { texto: "Si tuve un mal día, hablo mal de ella.", puntos: 0 },
      { texto: "Hablo con orgullo de lo que hacemos bien; si hay algo por mejorar, lo digo con respeto.", puntos: 3 },
      { texto: "Evito el tema.", puntos: 1 },
      { texto: "Digo que es “solo un trabajo más”.", puntos: 0 },
    ],
  },
  {
    id: "per5",
    competencia: "pertenencia",
    tipo: "single",
    enunciado: "Termina tu turno y queda un caso urgente que no alcanzas a cerrar. ¿Qué haces?",
    opciones: [
      { texto: "Me voy: mi turno ya terminó.", puntos: 0 },
      { texto: "Lo dejo documentado y bien entregado al siguiente turno — o lo cierro yo si es rápido.", puntos: 3 },
      { texto: "Lo cierro sin resolver, para que no quede pendiente a mi nombre.", puntos: 0 },
      { texto: "Lo dejo abierto sin avisarle a nadie.", puntos: 0 },
    ],
  },
  {
    id: "per2",
    competencia: "pertenencia",
    tipo: "scale",
    enunciado: "Del 1 al 5: “Cuido la imagen de la marca en cada interacción, como si el negocio fuera mío”.",
  },
  {
    id: "per6",
    competencia: "pertenencia",
    tipo: "scale",
    enunciado: "Del 1 al 5: “Me interesa proponer mejoras y aprender más allá de lo mínimo que exige mi cargo”.",
  },
  {
    id: "per3",
    competencia: "pertenencia",
    tipo: "text",
    enunciado: "¿Qué significa para ti representar bien a una empresa frente a sus clientes? Cuéntanos en pocas líneas.",
    maxPoints: 3,
  },
];

export function buildDefaultTest() {
  return {
    titulo: "Prueba técnica · Asesor/a de Servicio al Cliente",
    descripcion:
      "Queremos conocer cómo piensas, cómo atiendes y cómo resuelves. Son 40 preguntas organizadas en 6 competencias (25–30 minutos). Responde con honestidad: no hay respuestas “trampa” y solo puedes enviar la prueba una vez.",
    competencias: COMPETENCIAS,
    preguntas: PREGUNTAS,
  };
}
