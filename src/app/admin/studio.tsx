"use client";

import { useEffect, useMemo, useState } from "react";

type ResourceKey =
  | "projects"
  | "experience"
  | "social-links"
  | "tool-badges"
  | "resumes"
  | "profile";

interface ResourceConfig {
  key: ResourceKey;
  label: string;
  listPath: string;
  idField?: string;
  createTemplate: string;
}

const resources: ResourceConfig[] = [
  {
    key: "projects",
    label: "Projects",
    listPath: "/api/admin/projects",
    idField: "id",
    createTemplate: JSON.stringify(
      {
        title: "New Project",
        category: "Programming",
        status: "Production",
        summary: "Describe the project.",
        techStack: ["Next.js", "Supabase"],
        featured: false,
        sortOrder: 100,
      },
      null,
      2,
    ),
  },
  {
    key: "experience",
    label: "Experience",
    listPath: "/api/admin/experience",
    idField: "id",
    createTemplate: JSON.stringify(
      {
        period: "Jan 2026 - Present",
        role: "Role",
        company: "Company",
        summary: "What you did",
        highlights: ["Highlight 1", "Highlight 2"],
        sortOrder: 100,
      },
      null,
      2,
    ),
  },
  {
    key: "social-links",
    label: "Social Links",
    listPath: "/api/admin/social-links",
    idField: "id",
    createTemplate: JSON.stringify(
      {
        label: "GitHub",
        href: "https://github.com/your-handle",
        sortOrder: 100,
      },
      null,
      2,
    ),
  },
  {
    key: "tool-badges",
    label: "Tool Badges",
    listPath: "/api/admin/tool-badges",
    idField: "id",
    createTemplate: JSON.stringify(
      {
        name: "TypeScript",
        sortOrder: 100,
      },
      null,
      2,
    ),
  },
  {
    key: "resumes",
    label: "Resume Assets",
    listPath: "/api/admin/resumes",
    idField: "id",
    createTemplate: JSON.stringify(
      {
        title: "Resume",
        summary: "Primary resume file",
        fileUrl: "https://example.com/resume.pdf",
        fileName: "resume.pdf",
        isActive: true,
        sortOrder: 1,
      },
      null,
      2,
    ),
  },
  {
    key: "profile",
    label: "Profile Settings",
    listPath: "/api/admin/profile",
    createTemplate: JSON.stringify(
      {
        name: "PAULO",
        sidebarFootnote: "Short profile note.",
        dashboardTitle: "Portfolio Dashboard",
        dashboardSubtitle: "Fresh Graduate IT Profile",
        profilePhotoSrc: "/images/mecha-profile-photo.svg",
        overviewHeading: "Fresh Graduate IT Portfolio",
        overviewIntro: "Overview intro.",
        learnerHeading: "Entry-Level IT Focus",
        learnerIntro: "Learner intro.",
        availabilityText: "Open to Junior Roles",
        targetText: "IT Support / Staff",
        workStyleText: "Work style.",
        foundationAreas: ["Area 1", "Area 2"],
        contactHeading: "Let's Connect",
        contactIntro: "Contact intro.",
        contactBio: "Contact bio.",
        contactHighlights: ["Highlight 1", "Highlight 2"],
      },
      null,
      2,
    ),
  },
];

export function ContentStudio() {
  const [resourceKey, setResourceKey] = useState<ResourceKey>("projects");
  const [records, setRecords] = useState<Record<string, unknown>[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [createBody, setCreateBody] = useState("");
  const [editBody, setEditBody] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const resource = useMemo(
    () => resources.find((item) => item.key === resourceKey) ?? resources[0],
    [resourceKey],
  );

  useEffect(() => {
    setCreateBody(resource.createTemplate);
    setSelectedId("");
    setEditBody("");
  }, [resource]);

  async function loadRecords() {
    setLoading(true);
    setStatus("Loading...");

    try {
      const response = await fetch(resource.listPath, { cache: "no-store" });
      const payload = (await response.json()) as {
        data?: Record<string, unknown>[] | Record<string, unknown>;
        error?: string;
      };

      if (!response.ok) {
        setStatus(payload.error ?? "Request failed.");
        setRecords([]);
        return;
      }

      if (resource.key === "profile") {
        const single = (payload.data ?? {}) as Record<string, unknown>;
        setRecords(single && Object.keys(single).length ? [single] : []);
      } else {
        setRecords(Array.isArray(payload.data) ? payload.data : []);
      }

      setStatus("Loaded successfully.");
    } catch {
      setStatus("Failed to load records.");
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadRecords();
  }, [resource]);

  async function createRecord() {
    try {
      const parsed = JSON.parse(createBody) as Record<string, unknown>;
      const method = resource.key === "profile" ? "PUT" : "POST";
      const response = await fetch(resource.listPath, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });

      const payload = (await response.json().catch(() => ({}))) as {
        error?: string;
      };

      if (!response.ok) {
        setStatus(payload.error ?? "Save failed.");
        return;
      }

      setStatus("Saved.");
      await loadRecords();
    } catch {
      setStatus("JSON is invalid.");
    }
  }

  async function updateRecord() {
    if (!selectedId && resource.key !== "profile") {
      setStatus("Select a record first.");
      return;
    }

    try {
      const parsed = JSON.parse(editBody) as Record<string, unknown>;
      const endpoint =
        resource.key === "profile"
          ? resource.listPath
          : `${resource.listPath}/${selectedId}`;
      const method = resource.key === "profile" ? "PUT" : "PATCH";
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });

      const payload = (await response.json().catch(() => ({}))) as {
        error?: string;
      };

      if (!response.ok) {
        setStatus(payload.error ?? "Update failed.");
        return;
      }

      setStatus("Updated.");
      await loadRecords();
    } catch {
      setStatus("JSON is invalid.");
    }
  }

  async function deleteRecord() {
    if (!selectedId || resource.key === "profile") {
      setStatus("Delete is not available for this item.");
      return;
    }

    const response = await fetch(`${resource.listPath}/${selectedId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      setStatus("Delete failed.");
      return;
    }

    setStatus("Deleted.");
    setSelectedId("");
    setEditBody("");
    await loadRecords();
  }

  async function signOut() {
    await fetch("/api/admin/session", { method: "DELETE" });
    window.location.href = "/admin/login";
  }

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-4 pb-4 md:gap-5 md:pb-6">
      <section className="mecha-panel rounded-2xl border border-oak-primary/20 bg-oak-surface/75 p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-oak-muted">
              Owner Only
            </p>
            <h1 className="mt-2 text-2xl font-bold text-oak-text md:text-3xl">
              Content Studio
            </h1>
            <p className="mt-2 text-sm text-oak-muted">
              Private console for managing projects and profile content.
            </p>
          </div>
          <button
            type="button"
            onClick={signOut}
            className="rounded-full border border-oak-primary/30 bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-oak-text"
          >
            Sign Out
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[280px_1fr]">
        <aside className="mecha-panel rounded-2xl border border-oak-primary/20 bg-oak-surface/80 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-oak-muted">
            Resources
          </p>
          <div className="mt-3 grid gap-2">
            {resources.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setResourceKey(item.key)}
                className={`rounded-lg border px-3 py-2 text-left text-sm font-semibold transition ${
                  resourceKey === item.key
                    ? "border-oak-primary bg-white text-oak-text"
                    : "border-oak-primary/20 bg-white/70 text-oak-muted"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </aside>

        <div className="grid gap-4">
          <article className="mecha-panel rounded-2xl border border-oak-primary/20 bg-oak-surface/80 p-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-oak-text">
                {resource.label}
              </h2>
              <button
                type="button"
                onClick={() => void loadRecords()}
                className="rounded-full border border-oak-primary/30 bg-white/80 px-3 py-1.5 text-xs font-semibold"
              >
                Refresh
              </button>
            </div>

            <p className="mt-2 text-xs text-oak-muted">{status}</p>
            {loading ? (
              <p className="mt-2 text-sm text-oak-muted">Loading...</p>
            ) : null}

            <div className="mt-4 max-h-64 overflow-auto rounded-xl border border-oak-primary/20 bg-white/75 p-2">
              {records.length === 0 ? (
                <p className="p-2 text-sm text-oak-muted">No records yet.</p>
              ) : (
                <ul className="space-y-2">
                  {records.map((record) => {
                    const idValue =
                      (record.id as string | undefined) ?? "profile";
                    const title =
                      (record.title as string | undefined) ??
                      (record.name as string | undefined) ??
                      (record.label as string | undefined) ??
                      (record.role as string | undefined) ??
                      (record.file_name as string | undefined) ??
                      "Record";

                    return (
                      <li key={idValue}>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedId(idValue);
                            setEditBody(JSON.stringify(record, null, 2));
                          }}
                          className={`w-full rounded-lg border px-3 py-2 text-left text-sm ${
                            selectedId === idValue
                              ? "border-oak-primary bg-oak-surface"
                              : "border-oak-primary/20 bg-white"
                          }`}
                        >
                          <p className="font-semibold text-oak-text">{title}</p>
                          <p className="mt-1 text-xs text-oak-muted">
                            {idValue}
                          </p>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </article>

          <article className="mecha-panel rounded-2xl border border-oak-primary/20 bg-oak-surface/80 p-4">
            <h3 className="text-base font-bold text-oak-text">
              Create / Replace
            </h3>
            <textarea
              className="mt-3 h-48 w-full rounded-xl border border-oak-primary/25 bg-white/90 p-3 font-mono text-xs text-oak-text outline-none focus:border-oak-primary"
              value={createBody}
              onChange={(event) => setCreateBody(event.target.value)}
            />
            <button
              type="button"
              onClick={() => void createRecord()}
              className="mt-3 rounded-lg bg-oak-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white"
            >
              {resource.key === "profile" ? "Save Profile" : "Create"}
            </button>
          </article>

          <article className="mecha-panel rounded-2xl border border-oak-primary/20 bg-oak-surface/80 p-4">
            <h3 className="text-base font-bold text-oak-text">Edit Selected</h3>
            <textarea
              className="mt-3 h-56 w-full rounded-xl border border-oak-primary/25 bg-white/90 p-3 font-mono text-xs text-oak-text outline-none focus:border-oak-primary"
              value={editBody}
              onChange={(event) => setEditBody(event.target.value)}
              placeholder="Select a record from the list first."
            />
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void updateRecord()}
                className="rounded-lg bg-oak-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white"
              >
                {resource.key === "profile" ? "Save Profile" : "Update"}
              </button>
              <button
                type="button"
                onClick={() => void deleteRecord()}
                disabled={resource.key === "profile"}
                className="rounded-lg border border-red-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-red-700 disabled:opacity-45"
              >
                Delete
              </button>
            </div>
          </article>
        </div>
      </section>
    </section>
  );
}
