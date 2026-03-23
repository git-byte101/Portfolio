"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        setError("Access token is invalid.");
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Unable to sign in right now.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto mt-10 max-w-xl rounded-2xl border border-oak-primary/20 bg-oak-surface/85 p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-oak-muted">
        Owner Access
      </p>
      <h1 className="mt-2 text-2xl font-bold text-oak-text">Content Console</h1>
      <p className="mt-3 text-sm text-oak-muted">
        Enter your admin token to open the private content management panel.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <label className="block text-sm font-semibold text-oak-text" htmlFor="admin-token">
          Admin Token
        </label>
        <input
          id="admin-token"
          type="password"
          value={token}
          onChange={(event) => setToken(event.target.value)}
          autoComplete="off"
          className="w-full rounded-lg border border-oak-primary/30 bg-white/80 px-3 py-2 text-sm text-oak-text outline-none focus:border-oak-primary"
          placeholder="Paste ADMIN_API_TOKEN"
          required
        />

        {error ? <p className="text-sm text-red-700">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-oak-primary px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Open Console"}
        </button>
      </form>
    </section>
  );
}
