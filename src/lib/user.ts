/** Canonical signed-in user shape used across the app. */
export interface NiketaUser {
  name: string;
  email?: string | null;
  phone?: string | null;
  photoURL?: string | null;
  guest?: boolean;
}
