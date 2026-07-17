// ============================================================
//  Prueba técnica — Asesor/a de Servicio al Cliente · LOGYBOX
// ============================================================
//  El admin puede editar, agregar o eliminar preguntas desde el
//  panel (pestaña "Editar prueba").
//
//  Tipos de pregunta:
//   · "single" — opción múltiple. Cada opción tiene puntos:
//        3 = respuesta ideal · 2 = buena · 1 = parcial · 0 = no encaja
//     Las opciones están diseñadas para NO ser obvias: varias suenan
//     profesionales y el puntaje distingue el criterio real del cargo.
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
      { texto: "Le pido los datos del envío y le informo que voy a revisar qué ocurrió.", puntos: 2 },
      { texto: "Reconozco su molestia, me disculpo por la experiencia y le confirmo que reviso su caso de inmediato.", puntos: 3 },
      { texto: "Le comparto el estado actual del envío según el sistema, que es la información disponible.", puntos: 1 },
      { texto: "Traslado el caso a la transportadora, ya que el retraso ocurrió en su operación.", puntos: 0 },
    ],
  },
  {
    id: "sit2",
    competencia: "situaciones",
    tipo: "single",
    enunciado: "Recibes 5 chats al mismo tiempo en hora pico. ¿Cómo los manejas?",
    opciones: [
      { texto: "Los atiendo estrictamente en orden de llegada, para ser justo con todos.", puntos: 1 },
      { texto: "Reviso rápido los cinco, priorizo los críticos y a los demás les doy un tiempo estimado de respuesta.", puntos: 3 },
      { texto: "Los abro todos a la vez y voy respondiendo según van contestando los clientes.", puntos: 1 },
      { texto: "Le informo a mi líder que hay sobrecarga y espero indicaciones antes de responder.", puntos: 0 },
    ],
  },
  {
    id: "sit3",
    competencia: "situaciones",
    tipo: "single",
    enunciado: "El cliente pregunta algo que no sabes responder y en ese momento nadie de tu equipo está disponible. ¿Qué haces?",
    opciones: [
      { texto: "Le comparto lo que entiendo del tema, aclarándole que es información preliminar.", puntos: 1 },
      { texto: "Le digo que debo verificarlo, me comprometo con una hora concreta de respuesta y cumplo.", puntos: 3 },
      { texto: "Le indico qué área maneja ese tema para que consulte directamente allá.", puntos: 1 },
      { texto: "Espero a que un compañero se conecte para confirmar antes de responderle.", puntos: 0 },
    ],
  },
  {
    id: "sit4",
    competencia: "situaciones",
    tipo: "single",
    enunciado: "Un cliente exige un reembolso que la política no permite y amenaza con quejarse en redes sociales. ¿Qué haces?",
    opciones: [
      { texto: "Le explico con respeto que las políticas no me permiten hacer excepciones.", puntos: 1 },
      { texto: "Le detallo lo que sí puedo ofrecerle y le propongo una alternativa concreta que compense lo ocurrido.", puntos: 3 },
      { texto: "Escalo de inmediato a mi líder: una queja en redes puede volverse un problema de reputación.", puntos: 2 },
      { texto: "Proceso el reembolso como excepción: retener al cliente vale más que el costo del envío.", puntos: 1 },
    ],
  },
  {
    id: "sit5",
    competencia: "situaciones",
    tipo: "single",
    enunciado: "En un mismo chat, el cliente mezcla tres temas: el rastreo de su envío, una duda de factura y una queja. ¿Cómo organizas la conversación?",
    opciones: [
      { texto: "Le pregunto cuál de los tres temas es el más urgente para él y empiezo por ese.", puntos: 2 },
      { texto: "Confirmo los tres temas, los resuelvo uno por uno y verifico con él antes de cerrar.", puntos: 3 },
      { texto: "Atiendo primero la queja, que es lo más delicado, y le pido abrir casos aparte para el resto.", puntos: 1 },
      { texto: "Preparo una sola respuesta completa con los tres temas para no alargar la conversación.", puntos: 1 },
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
      { texto: "Le pido respeto con firmeza y le aclaro que no podré continuar si mantiene ese tono.", puntos: 2 },
      { texto: "Ignoro el comentario y continúo la atención con total normalidad.", puntos: 1 },
      { texto: "Respiro, no lo tomo personal y redirijo: “entiendo su molestia, enfoquémonos en resolverlo”.", puntos: 3 },
      { texto: "Transfiero el caso a un compañero para evitar que el conflicto crezca.", puntos: 0 },
    ],
  },
  {
    id: "fru4",
    competencia: "frustracion",
    tipo: "single",
    enunciado: "Un cliente descarga contigo su enojo por un error que cometió otro asesor antes que tú. ¿Qué haces?",
    opciones: [
      { texto: "Le aclaro que fue un error de una gestión anterior y que haré lo posible por corregirlo.", puntos: 1 },
      { texto: "Me disculpo a nombre de la empresa y me hago cargo del caso hasta resolverlo.", puntos: 3 },
      { texto: "Reviso el historial para identificar al responsable y reportarlo antes de responder.", puntos: 0 },
      { texto: "Le ofrezco de entrada una compensación para calmar su molestia.", puntos: 1 },
    ],
  },
  {
    id: "fru5",
    competencia: "frustracion",
    tipo: "single",
    enunciado: "Le diste a un cliente una información equivocada (por ejemplo, una fecha de entrega errada). El cliente vuelve molesto porque confió en lo que le dijiste. ¿Qué haces?",
    opciones: [
      { texto: "Le explico que la información pudo haber cambiado en el sistema después de nuestra conversación.", puntos: 0 },
      { texto: "Reconozco el error, me disculpo y le doy de inmediato la información correcta ya verificada, con seguimiento.", puntos: 3 },
      { texto: "Me disculpo y escalo el caso a mi líder para que le entregue la información oficial.", puntos: 1 },
      { texto: "Le doy la información correcta sin mencionar el error, para no perder su confianza.", puntos: 1 },
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
      { texto: "Le comparto la evidencia de entrega del sistema y le sugiero confirmar con las personas de su dirección.", puntos: 1 },
      { texto: "Abro una investigación: verifico dirección y evidencia con la transportadora, y me comprometo a un plazo de respuesta.", puntos: 3 },
      { texto: "Escalo de inmediato a la transportadora: la entrega es responsabilidad de su operación.", puntos: 1 },
      { texto: "Le ofrezco la reposición inmediata del producto para no hacerle perder más tiempo.", puntos: 0 },
    ],
  },
  {
    id: "res3",
    competencia: "resolutiva",
    tipo: "single",
    enunciado: "Un cliente necesita su pedido para mañana sí o sí, pero el envío estándar tarda 3 días. ¿Qué haces?",
    opciones: [
      { texto: "Le explico los tiempos reales del envío estándar para no crearle falsas expectativas.", puntos: 1 },
      { texto: "Verifico en el sistema si existe una opción real (mejora de servicio, punto de recogida) antes de responderle.", puntos: 3 },
      { texto: "Le recomiendo cancelar y hacer un nuevo pedido con un servicio más rápido.", puntos: 1 },
      { texto: "Me comprometo a marcar su envío como prioritario para que llegue antes.", puntos: 0 },
    ],
  },
  {
    id: "res4",
    competencia: "resolutiva",
    tipo: "single",
    enunciado: "Te llega un caso con información incompleta. ¿Cuál es el mejor primer paso?",
    opciones: [
      { texto: "Escalarlo: sin información completa no debo arriesgarme a responder mal.", puntos: 1 },
      { texto: "Hacer al cliente las preguntas clave que faltan y verificar en el sistema antes de responder.", puntos: 3 },
      { texto: "Responder con la información disponible, aclarando que está sujeta a confirmación.", puntos: 1 },
      { texto: "Aplicar la solución de un caso parecido que ya haya visto antes.", puntos: 0 },
    ],
  },
  {
    id: "res6",
    competencia: "resolutiva",
    tipo: "single",
    enunciado: "¿Cuándo es correcto escalar un caso a tu líder o a otra área?",
    opciones: [
      { texto: "Cuando el cliente lo solicita expresamente.", puntos: 1 },
      { texto: "Cuando agoté mis herramientas o el caso supera mi autorización — y lo entrego documentado.", puntos: 3 },
      { texto: "Cuando el caso puede convertirse en una queja formal o afectar la reputación de la empresa.", puntos: 2 },
      { texto: "Lo ideal es no escalar: cada asesor debe cerrar sus propios casos.", puntos: 0 },
    ],
  },
  {
    id: "res2",
    competencia: "resolutiva",
    tipo: "text",
    enunciado: "Un paquete fue devuelto porque la dirección registrada estaba incompleta (el cliente la diligenció mal). El cliente exige que el reenvío sea gratis, pero la política indica que ese nuevo flete lo asume él. Escribe la respuesta exacta que le enviarías.",
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
      { texto: "CONTAR.SI", puntos: 0 },
      { texto: "BUSCARV o BUSCARX", puntos: 3 },
      { texto: "BUSCARH", puntos: 1 },
      { texto: "SUMAR.SI", puntos: 0 },
    ],
  },
  {
    id: "exc2",
    competencia: "excel",
    tipo: "single",
    enunciado: "Necesitas contar cuántos envíos de una columna están en estado “Entregado”. ¿Qué función usas?",
    opciones: [
      { texto: "CONTARA", puntos: 1 },
      { texto: "CONTAR.SI", puntos: 3 },
      { texto: "SUMAR.SI", puntos: 1 },
      { texto: "BUSCARV", puntos: 0 },
    ],
  },
  {
    id: "exc3",
    competencia: "excel",
    tipo: "single",
    enunciado: "Tienes 500 números de guía y sospechas que hay repetidos. ¿Cuál es la forma más eficiente de encontrarlos?",
    opciones: [
      { texto: "Usar COINCIDIR para comparar la columna contra sí misma.", puntos: 1 },
      { texto: "Formato condicional → Resaltar valores duplicados.", puntos: 3 },
      { texto: "Ordenar la columna y revisar visualmente los valores contiguos.", puntos: 1 },
      { texto: "Usar CONTAR para verificar si el total de filas coincide.", puntos: 0 },
    ],
  },
  {
    id: "exc5",
    competencia: "excel",
    tipo: "single",
    enunciado: "Una columna trae “Ciudad - Departamento” en la misma celda (ej. “Bogotá - Cundinamarca”) y necesitas separarla en dos columnas. ¿Qué usas?",
    opciones: [
      { texto: "Datos → Texto en columnas, usando el guion como separador.", puntos: 3 },
      { texto: "Formato de celdas → Personalizado, definiendo dos secciones.", puntos: 0 },
      { texto: "Funciones de texto como IZQUIERDA + ENCONTRAR (o DIVIDIRTEXTO).", puntos: 2 },
      { texto: "Una tabla dinámica con ambos campos.", puntos: 0 },
    ],
  },
  {
    id: "exc6",
    competencia: "excel",
    tipo: "single",
    enunciado: "Tienes 2.000 filas de envíos y necesitas un resumen: cuántos hay por cada estado (Entregado, En tránsito, Devuelto). ¿Cuál es la forma más eficiente?",
    opciones: [
      { texto: "Filtrar cada estado y anotar el conteo que muestra la barra inferior.", puntos: 1 },
      { texto: "Una tabla dinámica con el estado en filas y el conteo como valor.", puntos: 3 },
      { texto: "Una celda con CONTAR.SI por cada estado.", puntos: 2 },
      { texto: "Ordenar por estado y usar subtotales.", puntos: 1 },
    ],
  },
  {
    id: "exc9",
    competencia: "excel",
    tipo: "single",
    enunciado: "De un reporte de 1.000 guías necesitas ver únicamente las de Medellín que están en estado “Devuelto”. ¿Qué haces?",
    opciones: [
      { texto: "Filtro por ciudad, copio el resultado a otra hoja y allí filtro por estado.", puntos: 1 },
      { texto: "Activo los filtros y aplico los dos criterios a la vez, cada uno en su columna.", puntos: 3 },
      { texto: "Uso CONTAR.SI.CONJUNTO con los dos criterios.", puntos: 1 },
      { texto: "Ordeno por ciudad y luego por estado, para que queden juntas.", puntos: 1 },
    ],
  },
  {
    id: "exc7",
    competencia: "excel",
    tipo: "single",
    enunciado: "Copias una fórmula hacia abajo, pero necesitas que una celda de referencia quede fija (que no se mueva). ¿Cómo lo logras?",
    opciones: [
      { texto: "Con el signo $ en la referencia (ej. $B$2).", puntos: 3 },
      { texto: "Con la función FIJAR sobre esa celda.", puntos: 0 },
      { texto: "Bloqueando la celda desde Revisar → Proteger hoja.", puntos: 0 },
      { texto: "Asignándole un nombre a la celda y usando ese nombre en la fórmula.", puntos: 2 },
    ],
  },
  {
    id: "exc8",
    competencia: "excel",
    tipo: "single",
    enunciado: "Quieres que una celda muestre el texto “URGENTE” si el envío lleva más de 2 días sin moverse, y “OK” si no. ¿Qué usas?",
    opciones: [
      { texto: "La función SI con esa condición.", puntos: 3 },
      { texto: "La función SI.ERROR.", puntos: 1 },
      { texto: "Formato condicional con una regla de 2 días.", puntos: 1 },
      { texto: "BUSCARV contra una tabla de estados.", puntos: 0 },
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
    enunciado: "Un cliente difícil no logra rastrear su pedido, dice que “la página no sirve” y descarga su frustración contigo. ¿Cómo lo atiendes?",
    opciones: [
      { texto: "Le explico paso a paso cómo usar el rastreo, para que pueda hacerlo solo la próxima vez.", puntos: 2 },
      { texto: "Rastreo el pedido yo mismo, le doy el estado de una vez y después le comparto el paso a paso por si lo quiere.", puntos: 3 },
      { texto: "Le comparto el enlace directo de rastreo con las instrucciones oficiales.", puntos: 1 },
      { texto: "Le pido capturas de pantalla del error para reportarlo al área técnica.", puntos: 1 },
    ],
  },
  {
    id: "emp3",
    competencia: "empatia",
    tipo: "single",
    enunciado: "El pedido era un regalo de cumpleaños y llegó un día tarde: la sorpresa se arruinó. El cliente te lo cuenta dolido. ¿Cómo respondes?",
    opciones: [
      { texto: "Le aclaro que los tiempos de entrega son estimados y no garantizados, como se acepta al comprar.", puntos: 0 },
      { texto: "Valido lo que siente, me disculpo con sinceridad y gestiono un gesto que lo compense.", puntos: 3 },
      { texto: "Me disculpo brevemente y le confirmo que el pedido ya fue entregado completo.", puntos: 1 },
      { texto: "Le explico la causa exacta del retraso para que vea que no fue negligencia.", puntos: 1 },
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
      { texto: "Sigo el conducto regular: mi función es resolver las quejas, no modificar los procesos.", puntos: 0 },
      { texto: "Documento el patrón con casos concretos y lo llevo a mi líder junto con una propuesta.", puntos: 3 },
      { texto: "Lo planteo en la reunión de equipo para validar si a los demás les pasa lo mismo.", puntos: 2 },
      { texto: "Se lo comento verbalmente a mi líder para que esté enterado.", puntos: 1 },
    ],
  },
  {
    id: "per4",
    competencia: "pertenencia",
    tipo: "single",
    enunciado: "Un amigo te pregunta por la empresa donde trabajas. ¿Qué sueles hacer?",
    opciones: [
      { texto: "Soy totalmente neutral: cuento lo bueno y lo malo tal cual, sin filtro.", puntos: 1 },
      { texto: "Hablo con orgullo de lo que hacemos bien; si hay cosas por mejorar, las menciono con respeto.", puntos: 3 },
      { texto: "Prefiero no mezclar el trabajo con mi vida personal y cambio de tema.", puntos: 1 },
      { texto: "Depende del día que haya tenido en el trabajo.", puntos: 0 },
    ],
  },
  {
    id: "per5",
    competencia: "pertenencia",
    tipo: "single",
    enunciado: "Termina tu turno y queda un caso urgente que no alcanzas a cerrar. ¿Qué haces?",
    opciones: [
      { texto: "Le aviso a mi líder que quedó pendiente y me retiro: el descanso también importa.", puntos: 1 },
      { texto: "Lo dejo documentado y entregado formalmente al siguiente turno — o lo cierro yo si es breve.", puntos: 3 },
      { texto: "Me quedo el tiempo que sea necesario hasta cerrarlo yo mismo.", puntos: 2 },
      { texto: "Lo dejo en la cola: el sistema lo asignará automáticamente a otro asesor.", puntos: 0 },
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
