// Contenido por defecto de la prueba tecnica para Asesor de Servicio al Cliente - LOGYBOX
// El admin puede editar / agregar / eliminar preguntas desde el panel.
//
// Tipos de pregunta:
//  - "single" : opcion multiple, una sola respuesta. Cada opcion tiene puntos (graduados 0-3).
//  - "scale"  : autoevaluacion Likert 1-5 (puntos = valor elegido).
//  - "text"   : respuesta abierta. Se puntua manualmente por el admin (maxPoints).
//
// Los puntajes graduados permiten distinguir la MEJOR respuesta (3) de las aceptables (2/1)
// y las que no encajan con el perfil (0), para filtrar candidatos con mayor precision.

export const COMPETENCIAS = [
  { id: "situaciones",  nombre: "Manejo de situaciones",     icon: "🧭" },
  { id: "frustracion",  nombre: "Manejo de la frustracion",  icon: "🌡️" },
  { id: "resolutiva",   nombre: "Capacidad resolutiva",      icon: "🧩" },
  { id: "excel",        nombre: "Manejo de Excel",           icon: "📊" },
  { id: "empatia",      nombre: "Empatia con el cliente",    icon: "💙" },
  { id: "pertenencia",  nombre: "Sentido de pertenencia",    icon: "🏅" },
];

export const PREGUNTAS = [
  // =====================================================================
  // 1. MANEJO DE SITUACIONES
  // =====================================================================
  {
    id: "sit1",
    competencia: "situaciones",
    tipo: "single",
    enunciado: "Un cliente escribe muy molesto porque su envio lleva 3 dias de retraso y exige una respuesta inmediata. ¿Que haces primero?",
    opciones: [
      { texto: "Le explicas la politica de la empresa sobre los retrasos.", puntos: 1 },
      { texto: "Reconoces su molestia, te disculpas y le confirmas que vas a revisar su caso de inmediato.", puntos: 3 },
      { texto: "Le pides que espere mientras consultas con tu supervisor.", puntos: 2 },
      { texto: "Le respondes que los retrasos no dependen de ti.", puntos: 0 },
    ],
  },
  {
    id: "sit2",
    competencia: "situaciones",
    tipo: "single",
    enunciado: "Recibes 5 chats simultaneos en hora pico. ¿Como priorizas?",
    opciones: [
      { texto: "Respondes por orden de llegada sin importar el tipo de caso.", puntos: 1 },
      { texto: "Identificas las urgencias (entregas fallidas, cobros erroneos) y priorizas, avisando a los demas un tiempo estimado de espera.", puntos: 3 },
      { texto: "Atiendes solo los mas faciles para bajar el volumen rapido.", puntos: 1 },
      { texto: "Dejas de responder hasta que llegue ayuda.", puntos: 0 },
    ],
  },
  {
    id: "sit3",
    competencia: "situaciones",
    tipo: "single",
    enunciado: "No sabes la respuesta a lo que pregunta el cliente y nadie de tu equipo esta disponible en ese momento. ¿Que haces?",
    opciones: [
      { texto: "Inventas una respuesta para no dejarlo esperando.", puntos: 0 },
      { texto: "Le dices que no sabes y cierras el chat.", puntos: 0 },
      { texto: "Le informas con honestidad que necesitas verificar, le das un tiempo concreto de respuesta y cumples con el seguimiento.", puntos: 3 },
      { texto: "Le pides que vuelva a escribir mas tarde.", puntos: 1 },
    ],
  },
  {
    id: "sit4",
    competencia: "situaciones",
    tipo: "single",
    enunciado: "Un cliente exige un reembolso que la politica NO permite y amenaza con quejarse en redes sociales. ¿Que haces?",
    opciones: [
      { texto: "Cedes y le das el reembolso para evitar la queja publica.", puntos: 1 },
      { texto: "Le explicas con calma lo que SI puedes ofrecer segun la politica y buscas una alternativa que lo deje satisfecho.", puntos: 3 },
      { texto: "Le dices que haga lo que quiera, la politica es la politica.", puntos: 1 },
      { texto: "Lo ignoras esperando que se calme solo.", puntos: 0 },
    ],
  },
  {
    id: "sit5",
    competencia: "situaciones",
    tipo: "single",
    enunciado: "En medio de un chat, el cliente mezcla tres temas: rastreo, una factura y una queja. ¿Como manejas la conversacion?",
    opciones: [
      { texto: "Respondes todo mezclado en un solo mensaje largo.", puntos: 1 },
      { texto: "Organizas la conversacion: atiendes un punto a la vez, confirmas y pasas al siguiente.", puntos: 3 },
      { texto: "Le pides que abra un caso separado por cada tema.", puntos: 1 },
      { texto: "Solo respondes lo primero que pregunto.", puntos: 0 },
    ],
  },
  {
    id: "sit6",
    competencia: "situaciones",
    tipo: "scale",
    enunciado: "Del 1 al 5: 'Me siento comodo/a atendiendo varios casos a la vez sin perder calidad ni la calma.'",
  },
  {
    id: "sit7",
    competencia: "situaciones",
    tipo: "text",
    enunciado: "Describe una situacion laboral complicada que hayas tenido que manejar (varias cosas al tiempo o con informacion incompleta). ¿Que hiciste y cual fue el resultado?",
    maxPoints: 4,
  },

  // =====================================================================
  // 2. MANEJO DE LA FRUSTRACION
  // =====================================================================
  {
    id: "fru1",
    competencia: "frustracion",
    tipo: "single",
    enunciado: "Un cliente te insulta directamente durante la conversacion. ¿Que haces?",
    opciones: [
      { texto: "Respondes en el mismo tono para ponerle limites.", puntos: 0 },
      { texto: "Mantienes la calma, no lo tomas personal y rediriges la conversacion hacia la solucion.", puntos: 3 },
      { texto: "Cierras el chat de inmediato sin explicacion.", puntos: 1 },
      { texto: "Sigues como si nada, sin reconocer su molestia.", puntos: 1 },
    ],
  },
  {
    id: "fru2",
    competencia: "frustracion",
    tipo: "scale",
    enunciado: "Del 1 (muy en desacuerdo) al 5 (muy de acuerdo): 'Puedo mantener la calma aunque reciba varias quejas dificiles seguidas.'",
  },
  {
    id: "fru4",
    competencia: "frustracion",
    tipo: "single",
    enunciado: "Un cliente descarga contigo su enojo por un error que cometio OTRO asesor antes que tu. ¿Que haces?",
    opciones: [
      { texto: "Le aclaras que tu no fuiste quien cometio el error.", puntos: 1 },
      { texto: "Te haces cargo del caso, te disculpas por la experiencia vivida y te enfocas en resolverlo.", puntos: 3 },
      { texto: "Le pides que hable con el asesor anterior.", puntos: 0 },
      { texto: "Le respondes cortante porque no es tu culpa.", puntos: 0 },
    ],
  },
  {
    id: "fru5",
    competencia: "frustracion",
    tipo: "single",
    enunciado: "Cometiste un error con un pedido y el cliente se da cuenta y se molesta. ¿Que haces?",
    opciones: [
      { texto: "Minimizas el error para no quedar mal.", puntos: 0 },
      { texto: "Reconoces el error con honestidad, te disculpas y lo corriges de inmediato.", puntos: 3 },
      { texto: "Culpas al sistema o a otra area.", puntos: 0 },
      { texto: "Te disculpas pero no corriges nada.", puntos: 1 },
    ],
  },
  {
    id: "fru6",
    competencia: "frustracion",
    tipo: "scale",
    enunciado: "Del 1 al 5: 'Despues de una interaccion dificil, me recupero rapido y atiendo bien al siguiente cliente.'",
  },
  {
    id: "fru3",
    competencia: "frustracion",
    tipo: "text",
    enunciado: "Cuentanos una situacion real en la que trataste con una persona muy molesta (cliente, compañero o jefe). ¿Como manejaste tu propia frustracion y que resultado tuvo?",
    maxPoints: 3,
  },

  // =====================================================================
  // 3. CAPACIDAD RESOLUTIVA
  // =====================================================================
  {
    id: "res1",
    competencia: "resolutiva",
    tipo: "single",
    enunciado: "Un cliente reporta un paquete perdido, pero el sistema muestra el estado 'Entregado'. ¿Que haces?",
    opciones: [
      { texto: "Le dices que segun el sistema ya fue entregado y cierras el caso.", puntos: 0 },
      { texto: "Investigas: confirmas la direccion, contactas al transportador y le das seguimiento con tiempos claros.", puntos: 3 },
      { texto: "Le pides que revise con sus vecinos y cierras el caso.", puntos: 1 },
      { texto: "Escalas de inmediato sin recopilar ninguna informacion.", puntos: 1 },
    ],
  },
  {
    id: "res3",
    competencia: "resolutiva",
    tipo: "single",
    enunciado: "Un cliente necesita su pedido para mañana si o si, pero el envio estandar tarda 3 dias. ¿Que haces?",
    opciones: [
      { texto: "Le dices que no se puede y cierras.", puntos: 0 },
      { texto: "Revisas alternativas (upgrade a express, punto de recogida, otra bodega) y le propones la mejor opcion viable.", puntos: 3 },
      { texto: "Le prometes que llegara mañana sin verificar si es posible.", puntos: 0 },
      { texto: "Le sugieres que mejor cancele el pedido.", puntos: 1 },
    ],
  },
  {
    id: "res4",
    competencia: "resolutiva",
    tipo: "single",
    enunciado: "Tienes informacion incompleta para resolver un caso. ¿Cual es el mejor siguiente paso?",
    opciones: [
      { texto: "Adivinas la respuesta para cerrar rapido.", puntos: 0 },
      { texto: "Haces las preguntas clave que faltan y verificas en el sistema antes de responder.", puntos: 3 },
      { texto: "Escalas de inmediato sin intentar nada.", puntos: 1 },
      { texto: "Respondes lo que crees y esperas que sirva.", puntos: 0 },
    ],
  },
  {
    id: "res6",
    competencia: "resolutiva",
    tipo: "single",
    enunciado: "¿Cuando es correcto escalar un caso a tu lider o a otra area?",
    opciones: [
      { texto: "Siempre que el cliente se moleste.", puntos: 0 },
      { texto: "Cuando ya agotaste lo que esta en tus manos o el caso excede tu nivel de autorizacion, entregandolo con toda la informacion lista.", puntos: 3 },
      { texto: "Nunca; debes resolver absolutamente todo tu solo.", puntos: 0 },
      { texto: "Apenas el caso se ve dificil, para no perder tiempo.", puntos: 1 },
    ],
  },
  {
    id: "res2",
    competencia: "resolutiva",
    tipo: "text",
    enunciado: "Un cliente pago por un envio EXPRESS pero llego en tiempo estandar y pide el reembolso total. La politica solo permite reembolsar el costo adicional del express, no todo el envio. Redacta la respuesta que le darias al cliente.",
    maxPoints: 4,
  },
  {
    id: "res5",
    competencia: "resolutiva",
    tipo: "text",
    enunciado: "Un cliente afirma que NUNCA recibio su pedido, pero el transportador reporta 'entregado con foto'. Explica paso a paso como investigarias y resolverias este caso.",
    maxPoints: 4,
  },

  // =====================================================================
  // 4. MANEJO DE EXCEL
  // =====================================================================
  {
    id: "exc1",
    competencia: "excel",
    tipo: "single",
    enunciado: "Quieres traer el estado de una guia desde otra tabla usando el numero de guia como referencia. ¿Que funcion usas?",
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
    enunciado: "Necesitas contar cuantos envios aparecen como 'Entregado' en una columna. ¿Que funcion usas?",
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
    enunciado: "Tienes una columna con 500 numeros de guia y sospechas que hay duplicados. ¿Cual es la forma mas eficiente de detectarlos?",
    opciones: [
      { texto: "Revisar uno por uno manualmente.", puntos: 0 },
      { texto: "Ordenar la columna alfabeticamente y ya.", puntos: 1 },
      { texto: "Usar Formato condicional > Resaltar duplicados, o la herramienta Quitar duplicados.", puntos: 3 },
      { texto: "Copiar y pegar la columna en otra hoja.", puntos: 0 },
    ],
  },
  {
    id: "exc5",
    competencia: "excel",
    tipo: "single",
    enunciado: "Tienes una columna 'Ciudad - Departamento' (ej. 'Bogota - Cundinamarca') y necesitas separarla en dos columnas. ¿Que usas?",
    opciones: [
      { texto: "Lo haces manualmente fila por fila.", puntos: 0 },
      { texto: "Texto en columnas (Datos > Texto en columnas) o funciones como IZQUIERDA/DERECHA/ENCONTRAR.", puntos: 3 },
      { texto: "BUSCARV.", puntos: 0 },
      { texto: "Solo copiar y pegar.", puntos: 0 },
    ],
  },
  {
    id: "exc6",
    competencia: "excel",
    tipo: "single",
    enunciado: "Quieres un resumen de cuantos envios hay por cada estado (Entregado, En transito, Devuelto) a partir de 2.000 filas. ¿La forma mas eficiente?",
    opciones: [
      { texto: "Filtrar y contar a mano cada estado.", puntos: 1 },
      { texto: "Una tabla dinamica (tabla pivote).", puntos: 3 },
      { texto: "Leer fila por fila.", puntos: 0 },
      { texto: "Solo ordenar por estado.", puntos: 1 },
    ],
  },
  {
    id: "exc7",
    competencia: "excel",
    tipo: "single",
    enunciado: "Copias una formula hacia abajo, pero una celda de referencia debe quedar FIJA (no moverse). ¿Que usas?",
    opciones: [
      { texto: "Referencia absoluta con $ (ej. $B$2).", puntos: 3 },
      { texto: "Escribes el valor a mano en cada fila.", puntos: 1 },
      { texto: "No se puede hacer.", puntos: 0 },
      { texto: "Cambias el formato de la celda.", puntos: 0 },
    ],
  },
  {
    id: "exc8",
    competencia: "excel",
    tipo: "single",
    enunciado: "Necesitas que una celda muestre 'URGENTE' si el envio lleva mas de 2 dias sin moverse, y 'OK' si no. ¿Que funcion usas?",
    opciones: [
      { texto: "SUMA", puntos: 0 },
      { texto: "SI / IF (con una condicion)", puntos: 3 },
      { texto: "CONTAR", puntos: 0 },
      { texto: "PROMEDIO", puntos: 0 },
    ],
  },
  {
    id: "exc4",
    competencia: "excel",
    tipo: "scale",
    enunciado: "Del 1 (basico) al 5 (avanzado): ¿Como calificas tu nivel REAL usando tablas dinamicas, filtros y formulas en Excel?",
  },

  // =====================================================================
  // 5. EMPATIA CON EL CLIENTE
  // =====================================================================
  {
    id: "emp1",
    competencia: "empatia",
    tipo: "single",
    enunciado: "Un cliente adulto mayor no entiende como rastrear su pedido y esta frustrado. ¿Como respondes?",
    opciones: [
      { texto: "Le envias el link de rastreo y das por resuelto el caso.", puntos: 1 },
      { texto: "Le explicas paso a paso con lenguaje simple y le ofreces hacerlo por el si lo prefiere.", puntos: 3 },
      { texto: "Le dices que es muy facil y que lo intente de nuevo.", puntos: 0 },
      { texto: "Le pides que un familiar mas joven lo ayude.", puntos: 1 },
    ],
  },
  {
    id: "emp3",
    competencia: "empatia",
    tipo: "single",
    enunciado: "Un cliente te cuenta que el pedido era un regalo de cumpleaños y llego un dia tarde, arruinando la sorpresa. ¿Como respondes?",
    opciones: [
      { texto: "Le explicas que los tiempos de envio son solo estimados.", puntos: 0 },
      { texto: "Validas su sentir, te disculpas de forma genuina y buscas un gesto que compense (cupon, prioridad futura).", puntos: 3 },
      { texto: "Le dices que al menos ya le llego.", puntos: 0 },
      { texto: "Le pides que la proxima vez ordene con mas tiempo.", puntos: 0 },
    ],
  },
  {
    id: "emp4",
    competencia: "empatia",
    tipo: "scale",
    enunciado: "Del 1 al 5: 'Identifico con facilidad como se siente un cliente por la forma en que escribe, aunque no lo diga directamente.'",
  },
  {
    id: "emp2",
    competencia: "empatia",
    tipo: "text",
    enunciado: "Escribe el mensaje de apertura que le enviarias a un cliente que acaba de reportar que su pedido llego roto. (Solo el primer mensaje).",
    maxPoints: 3,
  },
  {
    id: "emp5",
    competencia: "empatia",
    tipo: "text",
    enunciado: "Reescribe este mensaje para que suene mas humano y empatico, sin dejar de ser claro: 'Su solicitud fue rechazada. No aplica. Cualquier cosa avise.'",
    maxPoints: 3,
  },

  // =====================================================================
  // 6. SENTIDO DE PERTENENCIA
  // =====================================================================
  {
    id: "per1",
    competencia: "pertenencia",
    tipo: "single",
    enunciado: "Notas que un proceso interno esta generando muchas quejas de clientes. ¿Que haces?",
    opciones: [
      { texto: "No es tu area, sigues respondiendo las quejas una por una.", puntos: 0 },
      { texto: "Documentas el patron y lo reportas a tu lider junto con una propuesta de mejora.", puntos: 3 },
      { texto: "Te quejas del proceso con tus compañeros.", puntos: 0 },
      { texto: "Esperas a que alguien mas lo reporte.", puntos: 1 },
    ],
  },
  {
    id: "per4",
    competencia: "pertenencia",
    tipo: "single",
    enunciado: "Un amigo te pregunta por la empresa donde trabajas. ¿Que sueles hacer?",
    opciones: [
      { texto: "Hablas mal de ella si tuviste un mal dia.", puntos: 0 },
      { texto: "Hablas con orgullo de lo que hacen bien y, si hay algo por mejorar, lo dices con respeto.", puntos: 3 },
      { texto: "Evitas el tema.", puntos: 1 },
      { texto: "Dices que es 'solo un trabajo mas'.", puntos: 0 },
    ],
  },
  {
    id: "per5",
    competencia: "pertenencia",
    tipo: "single",
    enunciado: "Es fin de tu turno y queda un caso urgente sin resolver que no alcanzas a cerrar. ¿Que haces?",
    opciones: [
      { texto: "Te vas; tu turno ya termino.", puntos: 0 },
      { texto: "Lo dejas documentado y bien entregado al siguiente turno, o lo cierras si es algo rapido.", puntos: 3 },
      { texto: "Lo cierras sin resolver para que no quede pendiente a tu nombre.", puntos: 0 },
      { texto: "Lo dejas abierto sin avisar a nadie.", puntos: 0 },
    ],
  },
  {
    id: "per2",
    competencia: "pertenencia",
    tipo: "scale",
    enunciado: "Del 1 al 5: 'Cuido la imagen de la marca en cada interaccion, como si el negocio fuera mio.'",
  },
  {
    id: "per6",
    competencia: "pertenencia",
    tipo: "scale",
    enunciado: "Del 1 al 5: 'Me interesa proponer mejoras y aprender mas alla del minimo que exige mi cargo.'",
  },
  {
    id: "per3",
    competencia: "pertenencia",
    tipo: "text",
    enunciado: "¿Que significa para ti representar bien a una empresa frente a sus clientes? Cuentanos brevemente.",
    maxPoints: 3,
  },
];

export function buildDefaultTest() {
  return {
    titulo: "Prueba Tecnica - Asesor de Servicio al Cliente",
    descripcion: "Esta prueba evalua a fondo tus habilidades para atender y resolver casos de clientes en LOGYBOX. Responde con honestidad; no hay respuestas 'trampa'. Consta de 38 preguntas en 6 competencias. Tiempo estimado: 25-30 minutos.",
    competencias: COMPETENCIAS,
    preguntas: PREGUNTAS,
  };
}
