"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { formatLabel } from "@/lib/analytics";
import { logout, useAuth } from "@/lib/auth";
import { emptyPortfolioData } from "@/lib/empty-data";
import { subscribeToAdminData } from "@/lib/firestore-data";
import type { PortfolioData } from "@/lib/types";
import { Badge } from "@/components/shared/Badge/Badge";
import { AdminShell } from "@/components/admin/AdminShell/AdminShell";
import { Panel } from "@/components/admin/Panel/Panel";
import { ProjectsAdmin } from "@/components/admin/ProjectsAdmin/ProjectsAdmin";
import { BlogAdmin } from "@/components/admin/BlogAdmin/BlogAdmin";
import { ProfileAdmin } from "@/components/admin/ProfileAdmin/ProfileAdmin";
import { LibraryAdmin } from "@/components/admin/LibraryAdmin/LibraryAdmin";

type Tab = "projects" | "blog" | "profile" | "library";

export function AdminDashboard() {
  const { user, loading, isConfigured, isAdmin, adminEmail } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<PortfolioData>(emptyPortfolioData);
  const [tab, setTab] = useState<Tab>("projects");
  const [message, setMessage] = useState("");

  useEffect(() => subscribeToAdminData(setData), []);

  useEffect(() => {
    if (isConfigured && !loading && !user) {
      router.replace("/login");
    }
  }, [isConfigured, loading, router, user]);

  if (!isConfigured) {
    return (
      <AdminShell>
        <Panel title="Firebase setup needed">
          <p className="text-sm leading-6 text-muted">
            Add Firebase values to `.env.local`, enable Firebase Auth, and create Firestore before using the dashboard.
          </p>
        </Panel>
      </AdminShell>
    );
  }

  if (loading) {
    return (
      <AdminShell>
        <Panel title="Checking session">
          <p className="text-sm text-muted">Loading admin access...</p>
        </Panel>
      </AdminShell>
    );
  }

  if (!user) {
    return (
      <AdminShell>
        <Panel title="Redirecting">
          <p className="text-sm leading-6 text-muted">Opening admin login...</p>
        </Panel>
      </AdminShell>
    );
  }

  if (!isAdmin) {
    return (
      <AdminShell>
        <Panel title="Not allowed">
          <p className="text-sm leading-6 text-muted">
            Signed in as {user.email}, but this app only allows {adminEmail || "the configured admin email"} to edit content.
          </p>
          <button onClick={() => logout()} className="mt-4 rounded border border-black/10 bg-white px-4 py-2 text-sm font-semibold">
            Sign out
          </button>
        </Panel>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className="mb-6 flex flex-col justify-between gap-4 rounded-lg border border-black/10 bg-white p-5 sm:flex-row sm:items-center">
        <div>
          <Badge>Admin</Badge>
          <h1 className="mt-3 text-3xl font-bold tracking-[-0.75px] text-ink">Content dashboard</h1>
          <p className="mt-1 text-sm text-muted">Signed in as {user.email}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => logout()} className="inline-flex items-center gap-2 rounded bg-black/[0.05] px-3 py-2 text-sm font-semibold hover:bg-black/[0.08]">
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </div>
      {message ? <div className="mb-4 rounded border border-black/10 bg-white p-3 text-sm text-muted">{message}</div> : null}
      <div className="mb-5 flex flex-wrap gap-2">
        {(["projects", "blog", "profile", "library"] as Tab[]).map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className={`rounded px-3 py-2 text-sm font-semibold ${tab === item ? "bg-[#0075de] text-white" : "border border-black/10 bg-white text-ink"}`}
          >
            {formatLabel(item)}
          </button>
        ))}
      </div>
      {tab === "projects" ? <ProjectsAdmin projects={data.projects} technologies={data.technologies} settings={data.settings} setMessage={setMessage} /> : null}
      {tab === "blog" ? <BlogAdmin posts={data.blogPosts} setMessage={setMessage} /> : null}
      {tab === "profile" ? <ProfileAdmin profile={data.profile} setMessage={setMessage} /> : null}
      {tab === "library" ? <LibraryAdmin technologies={data.technologies} settings={data.settings} setMessage={setMessage} /> : null}
    </AdminShell>
  );
}
