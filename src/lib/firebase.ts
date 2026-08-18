import type { User } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBnaPcbfW6dQyokn1JZ60w16JbNX3Qh9_s",
  authDomain: "aster-e017d.firebaseapp.com",
  projectId: "aster-e017d",
  storageBucket: "aster-e017d.firebasestorage.app",
  messagingSenderId: "850838654797",
  appId: "1:850838654797:web:1b55973cb7cda6638eb104",
};

export const firebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

/* ------------------------------------------------------------------ *
 * Firebase is code-split: the SDK chunks load on first actual use
 * (sign-in, reservation, checkout) instead of on page load.
 * ------------------------------------------------------------------ */

interface FirebaseApi {
  db: import("firebase/firestore").Firestore | null;
  auth: import("firebase/auth").Auth | null;
}

let apiPromise: Promise<FirebaseApi> | null = null;

function ensureFirebase(): Promise<FirebaseApi> {
  if (!apiPromise) {
    apiPromise = (async () => {
      try {
        const appMod = await import("firebase/app");
        const app =
          appMod.getApps().length > 0
            ? appMod.getApps()[0]
            : appMod.initializeApp(firebaseConfig);
        const [fsMod, authMod] = await Promise.all([
          import("firebase/firestore"),
          import("firebase/auth"),
        ]);
        return { db: fsMod.getFirestore(app), auth: authMod.getAuth(app) };
      } catch (err) {
        console.warn("Firebase could not be initialised", err);
        apiPromise = null; // allow retry on next use
        return { db: null, auth: null };
      }
    })();
  }
  return apiPromise;
}

/* ------------------------------ authentication ------------------------------ */

/** Opens the Google sign-in popup. Rejects with Error("firebase-not-configured") if auth is unavailable. */
export async function signInWithGoogle() {
  const { auth } = await ensureFirebase();
  if (!auth) throw new Error("firebase-not-configured");
  const { GoogleAuthProvider, signInWithPopup } = await import("firebase/auth");
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  return signInWithPopup(auth, provider);
}

/** Subscribes to auth state. Returns an unsubscribe function. */
export function watchAuth(callback: (user: User | null) => void): () => void {
  let unsubscribe: (() => void) | undefined;
  let disposed = false;
  void ensureFirebase().then(async ({ auth }) => {
    if (!auth || disposed) return;
    const { onAuthStateChanged } = await import("firebase/auth");
    if (disposed) return;
    unsubscribe = onAuthStateChanged(auth, callback);
  });
  return () => {
    disposed = true;
    unsubscribe?.();
  };
}

export async function signOutUser(): Promise<void> {
  const { auth } = await ensureFirebase();
  if (!auth) return;
  try {
    const { signOut } = await import("firebase/auth");
    await signOut(auth);
  } catch (err) {
    console.warn("Sign out failed", err);
  }
}

/* -------------------------------- firestore -------------------------------- */

export interface ReservationRecord {
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
  note: string | null;
}

export interface OrderItemRecord {
  id: string;
  name: string;
  qty: number;
  price: number;
}

export interface OrderRecord {
  orderId: string;
  method: string;
  items: OrderItemRecord[];
  subtotal: number;
  gst: number;
  total: number;
  itemCount: number;
  customer?: string | null;
}

/** Saves a table reservation. Returns true on success, false on failure (UI keeps working either way). */
export async function saveReservation(data: ReservationRecord): Promise<boolean> {
  const { db } = await ensureFirebase();
  if (!db) return false;
  try {
    const { collection, addDoc, serverTimestamp } = await import("firebase/firestore");
    await addDoc(collection(db, "reservations"), {
      ...data,
      status: "pending",
      source: "website",
      createdAt: serverTimestamp(),
    });
    return true;
  } catch (err) {
    console.warn("Could not save reservation to Firebase", err);
    return false;
  }
}

/** Saves a checkout order. Returns true on success, false on failure. */
export async function saveOrder(data: OrderRecord): Promise<boolean> {
  const { db } = await ensureFirebase();
  if (!db) return false;
  try {
    const { collection, addDoc, serverTimestamp } = await import("firebase/firestore");
    await addDoc(collection(db, "orders"), {
      ...data,
      status: "placed",
      source: "website",
      createdAt: serverTimestamp(),
    });
    return true;
  } catch (err) {
    console.warn("Could not save order to Firebase", err);
    return false;
  }
}
