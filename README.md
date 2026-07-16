# LOGYBOX · Prueba Técnica (versión web)

Plataforma para aplicar la prueba técnica de **Asesor de Servicio al Cliente** de LOGYBOX.

- **Hosting:** GitHub Pages (gratis, sin servidor)
- **Datos:** Firebase — Authentication (usuarios/contraseñas) + Firestore (prueba y resultados). Plan gratuito (Spark) es suficiente.
- **Diseño:** liquid glass, Poppins, colores de marca sobre fondo blanco.

**Qué incluye:** panel admin (crear candidatos, editar la prueba, ver y calificar resultados) + portal del candidato (38 preguntas en 6 competencias, pantalla final "Gracias, tu prueba fue enviada").

---

## 🔥 PARTE A — Configurar Firebase (una sola vez, ~10 min)

### A1. Crear el proyecto
1. Entra a **https://console.firebase.google.com** con tu cuenta de Google.
2. **Crear proyecto** → nombre: `logybox-prueba-tecnica` (Google Analytics: opcional, puedes desactivarlo).

### A2. Registrar la app web y copiar las claves
1. En la pantalla principal del proyecto, clic en el ícono **`</>`** (App web).
2. Apodo: `logybox-web` → **Registrar app** (no marques hosting).
3. Te mostrará un bloque `const firebaseConfig = { ... }`. **Copia esos valores.**
4. Abre el archivo **`firebase-config.js`** de esta carpeta y reemplaza los `PEGA_AQUI` con tus valores reales.

### A3. Activar el inicio de sesión
1. Menú izquierdo: **Compilación → Authentication → Comenzar**.
2. Pestaña **Sign-in method** → habilita **Correo electrónico/contraseña** → Guardar.

### A4. Crear tu usuario administrador
1. En **Authentication → Users → Agregar usuario**:
   - Correo: `logybox_admin@logybox-pruebas.com`  *(no necesita existir, es interno)*
   - Contraseña: `LBX2026`
2. Al crearlo, **copia su UID** (columna "UID de usuario", es un código largo).

### A5. Crear la base de datos
1. Menú izquierdo: **Compilación → Firestore Database → Crear base de datos**.
2. Ubicación: la más cercana (ej. `southamerica-east1`) → modo **producción** → Crear.

### A6. Pegar las reglas de seguridad
1. En Firestore, pestaña **Reglas**.
2. Borra lo que hay y pega TODO el contenido del archivo **`firestore.rules`** de esta carpeta → **Publicar**.

### A7. Registrarte como admin en la base
1. En Firestore, pestaña **Datos** → **Iniciar colección**.
2. ID de colección: `admins`
3. ID del documento: **pega el UID que copiaste en A4**.
4. Agrega un campo: `role` (string) = `admin` → Guardar.

> Con esto, quien inicie sesión como `LOGYBOX_ADMIN` / `LBX2026` tendrá acceso al panel.

---

## 🐙 PARTE B — Subirlo a GitHub Pages (~5 min)

### B1. Crear el repositorio y subir el código
1. Entra a **github.com** → **New repository** → nombre: `logybox-prueba-tecnica` → **Public** → Create.
2. En la terminal, dentro de esta carpeta:
   ```bash
   git init
   git add .
   git commit -m "LOGYBOX prueba tecnica"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/logybox-prueba-tecnica.git
   git push -u origin main
   ```

### B2. Activar GitHub Pages
1. En el repo: **Settings → Pages**.
2. En *Build and deployment*: Source = **Deploy from a branch**, Branch = **main** / **(root)** → Save.
3. En 1-2 minutos tu web queda en:
   `https://TU_USUARIO.github.io/logybox-prueba-tecnica/`

### B3. Autorizar el dominio en Firebase (¡importante!)
1. Firebase Console → **Authentication → Settings → Dominios autorizados → Agregar dominio**.
2. Agrega: `TU_USUARIO.github.io`

> Sin este paso, el login dará error en la web publicada.

---

## ▶️ PARTE C — Primer uso

1. Abre `https://TU_USUARIO.github.io/logybox-prueba-tecnica/admin.html`
2. Inicia sesión: **LOGYBOX_ADMIN** / **LBX2026**
3. Pestaña **Editar prueba** → botón **"Cargar prueba por defecto"** (sube las 38 preguntas a Firebase; puedes editarlas después).
4. Pestaña **Candidatos** → crea usuario y contraseña para cada persona y entrégaselos.
5. El candidato entra a `https://TU_USUARIO.github.io/logybox-prueba-tecnica/` y presenta la prueba.
6. Tú ves todo en **Resultados** (y calificas las respuestas abiertas ahí mismo).

---

## 💻 Probar en tu computador (opcional)

```bash
node serve.js     # abre http://localhost:3000
```
*(Usa el mismo Firebase de producción. Para que el login funcione en local, `localhost` ya viene autorizado por defecto en Firebase).* 

En `version-local/` quedó guardada la versión anterior que funcionaba sin Firebase (servidor Node + archivo local), por si algún día la necesitas sin internet.

## 📌 Notas

- **Actualizar la web:** edita los archivos, luego `git add . && git commit -m "cambios" && git push`. Pages se actualiza solo.
- **Cambiar contraseña de un candidato:** por seguridad no se puede desde el panel; elimínalo y créalo de nuevo con otro usuario (ej. `maria.perez2`), o cámbiala tú en Firebase Console → Authentication → Users → ⋮ → Restablecer contraseña.
- **Los candidatos nunca ven los puntajes** de las opciones: leen una versión de la prueba sin puntos (`config/testPublic`); la completa (`config/test`) solo la puede leer el admin (regla de Firestore).
- **Costo:** $0. El plan gratuito de Firebase soporta de sobra este uso (50k lecturas/día).
- Las claves de `firebase-config.js` son públicas por diseño; la seguridad está en las reglas.

## Estructura

```
index.html          Portal del candidato
admin.html          Panel de administración
styles.css          Estilos (liquid glass + marca)
firebase-config.js  ⚠️ Aquí pegas tus claves de Firebase
firestore.rules     Reglas de seguridad (se pegan en Firebase Console)
app/
  candidate.js      Lógica del candidato
  admin.js          Lógica del admin
  firebase.js       Conexión con Firebase
  scoring.js        Cálculo de puntajes
  seed.js           Prueba por defecto (38 preguntas)
  common.js         Logo + utilidades
logo-light.png      Logo versión clara (fondos claros)
logo-dark.png       Logo versión oscura (fondos oscuros)
serve.js            Mini servidor para probar en local
version-local/      Versión anterior sin Firebase (opcional)
```
