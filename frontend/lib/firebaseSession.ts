import type { User } from "firebase/auth";

const SESSION_COOKIE = "__session";
const THIRTY_DAYS = 60 * 60 * 24 * 30;

export async function setFirebaseSession(user: User) {
  const token = await user.getIdToken();
  document.cookie = `${SESSION_COOKIE}=${token}; path=/; max-age=${THIRTY_DAYS}; SameSite=Lax`;
}

export function clearFirebaseSession() {
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}
