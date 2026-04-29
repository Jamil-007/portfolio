"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import { loginWithEmail, loginWithGoogle, useAuth } from "@/lib/auth";

export function LoginPage() {
  const { isConfigured, isAdmin, user, adminEmail } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState(adminEmail);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (isConfigured && user && isAdmin) {
      router.replace("/admin");
    }
  }, [isAdmin, isConfigured, router, user]);

  async function handleEmailLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      await loginWithEmail(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogleLogin() {
    setBusy(true);
    setError("");

    try {
      await loginWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google login failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main>
      <section className="section-pad bg-paper">
        <div className="container max-w-md">
          <div className="whisper-card p-6">
            <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded bg-[#f2f9ff] text-[#097fe8]">
              <LockKeyhole size={18} />
            </div>
            <h1 className="text-3xl font-bold tracking-[-0.75px] text-ink">Admin login</h1>
            <p className="mt-2 text-sm leading-6 text-muted">
              Sign in with the Firebase account allowed by `NEXT_PUBLIC_ADMIN_EMAIL`.
            </p>
            {!isConfigured ? (
              <div className="mt-5 rounded border border-[#dd5b00]/30 bg-[#fff4eb] p-4 text-sm leading-6 text-[#8a3900]">
                Firebase env vars are missing. Add `.env.local` values before using admin login.
              </div>
            ) : user && isAdmin ? (
              <div className="mt-5 rounded border border-[#1aae39]/25 bg-[#effaf1] p-4 text-sm leading-6 text-[#166b2c]">
                Opening admin dashboard...
              </div>
            ) : (
              <>
                <form onSubmit={handleEmailLogin} className="mt-6 grid gap-3">
                  <label className="grid gap-1 text-sm font-semibold text-ink">
                    Email
                    <input
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="rounded border border-black/10 bg-white px-3 py-2 font-normal"
                      type="email"
                      required
                    />
                  </label>
                  <label className="grid gap-1 text-sm font-semibold text-ink">
                    Password
                    <input
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      className="rounded border border-black/10 bg-white px-3 py-2 font-normal"
                      type="password"
                      required
                    />
                    <span className="text-xs font-normal leading-5 text-muted">
                      Only needed if you created an Email/Password user in Firebase Auth.
                    </span>
                  </label>
                  <button
                    disabled={busy}
                    className="rounded bg-[#0075de] px-4 py-2 text-[15px] font-semibold text-white hover:bg-[#005bab] disabled:opacity-60"
                  >
                    {busy ? "Signing in..." : "Sign in"}
                  </button>
                </form>
                <button
                  disabled={busy}
                  onClick={handleGoogleLogin}
                  className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded border border-black/10 bg-white px-4 py-2 text-[15px] font-semibold text-ink hover:bg-black/[0.03] disabled:opacity-60"
                >
                  <GoogleLogo /> Continue with Google
                </button>
                {error ? <p className="mt-4 text-sm text-[#b64700]">{error}</p> : null}
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function GoogleLogo() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}
