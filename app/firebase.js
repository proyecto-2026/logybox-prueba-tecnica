// Capa de datos: Firebase Auth + Firestore (SDK por CDN, sin build).
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from "../firebase-config.js";

export const configured =
  firebaseConfig &&
  firebaseConfig.apiKey &&
  !String(firebaseConfig.apiKey).includes("PEGA_AQUI");

let app = null, auth = null, db = null;
if (configured) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
}

export {
  app, auth, db,
  doc, getDoc, setDoc, updateDoc, deleteDoc, collection, getDocs,
  signInWithEmailAndPassword, signInAnonymously, signOut,
};

// Normaliza un correo para usarlo como ID de documento (clave del candidato).
export function emailKey(email) {
  return String(email || "").trim().toLowerCase();
}
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

// Espera a que Firebase resuelva la sesion actual (o null).
export function currentUser() {
  return new Promise((resolve) => {
    const off = onAuthStateChanged(auth, (user) => { off(); resolve(user); });
  });
}

// ¿El usuario autenticado es admin? (existe /admins/{uid})
export async function isAdmin(user) {
  if (!user) return false;
  try {
    const snap = await getDoc(doc(db, "admins", user.uid));
    return snap.exists();
  } catch {
    return false;
  }
}

// Mensajes de error de Firebase en español simple.
export function niceError(err) {
  const code = err?.code || "";
  if (code.includes("invalid-credential") || code.includes("wrong-password") || code.includes("user-not-found"))
    return "Usuario o contraseña incorrectos";
  if (code.includes("operation-not-allowed") || code.includes("admin-restricted-operation"))
    return "El acceso anónimo no está habilitado en Firebase (Authentication → Sign-in method → Anónimo).";
  if (code.includes("too-many-requests"))
    return "Demasiados intentos. Espera unos minutos e intenta de nuevo.";
  if (code.includes("network-request-failed"))
    return "Sin conexión. Revisa tu internet.";
  if (code.includes("permission") || code.includes("insufficient"))
    return "No tienes permisos para esta acción (revisa las reglas de Firestore).";
  return err?.message || "Error inesperado";
}
