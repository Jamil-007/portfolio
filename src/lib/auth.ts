"use client";

import { useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { getAdminEmail, getAdminEmails, getFirebaseServices } from "./firebase";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const services = getFirebaseServices();
  const adminEmail = getAdminEmail();
  const adminEmails = getAdminEmails();

  useEffect(() => {
    if (!services) {
      setLoading(false);
      return;
    }

    return onAuthStateChanged(services.auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });
  }, [services]);

  return {
    user,
    loading,
    isConfigured: Boolean(services),
    isAdmin: Boolean(user?.email && adminEmails.includes(user.email.toLowerCase())),
    adminEmail,
    adminEmails,
  };
}

export async function loginWithEmail(email: string, password: string) {
  const services = getFirebaseServices();
  if (!services) throw new Error("Firebase is not configured.");
  return signInWithEmailAndPassword(services.auth, email, password);
}

export async function loginWithGoogle() {
  const services = getFirebaseServices();
  if (!services) throw new Error("Firebase is not configured.");
  return signInWithPopup(services.auth, new GoogleAuthProvider());
}

export async function logout() {
  const services = getFirebaseServices();
  if (!services) throw new Error("Firebase is not configured.");
  return signOut(services.auth);
}
