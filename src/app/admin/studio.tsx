"use client";

import { useEffect, useMemo, useState } from "react";

type PanelKey =
  | "projects"
  | "experience"
  | "social"
  | "tools"
  | "resumes"
  | "profile";

type ProjectStatus = "Production" | "Scaling" | "R&D";
type ProjectCategory = "Programming" | "AI Automation" | "NoSQL";
type ToastTone = "success" | "error" | "info";

interface ToastState {
  id: number;
  tone: ToastTone;
  message: string;
  visible: boolean;
}

interface ProjectItem {
  id: string;
  title: string;
  category: ProjectCategory;
  status: ProjectStatus;
  summary: string;
  tech_stack: string[];
  slug: string | null;
  version: string;
  thumbnail_src: string;
  repo_url: string | null;
  live_url: string | null;
  featured: boolean;
  sort_order: number | null;
}

interface ExperienceItem {
  id: string;
  period: string;
  role: string;
  company: string;
  summary: string;
  highlights: string[];
  sort_order: number;
}

interface SocialItem {
  id: string;
  label: string;
  href: string;
  sort_order: number;
}

interface ToolItem {
  id: string;
  name: string;
  sort_order: number;
}

interface ResumeItem {
  id: string;
  title: string;
  summary: string;
  file_url: string;
  file_name: string;
  is_active: boolean;
  sort_order: number;
}

interface ProfileSettings {
  id: string;
  name: string;
  sidebar_footnote: string;
  dashboard_title: string;
  dashboard_subtitle: string;
  profile_photo_src: string;
  overview_heading: string;
  overview_intro: string;
  learner_heading: string;
  learner_intro: string;
  availability_text: string;
  target_text: string;
  work_style_text: string;
  foundation_areas: string[];
  contact_heading: string;
  contact_intro: string;
  contact_bio: string;
  contact_highlights: string[];
}

const sectionTabs: Array<{ key: PanelKey; label: string }> = [
  { key: "projects", label: "Projects" },
  { key: "experience", label: "Experience" },
  { key: "social", label: "Social Links" },
  { key: "tools", label: "Tool Badges" },
  { key: "resumes", label: "Resumes" },
  { key: "profile", label: "Profile Settings" },
];

const blankProject = {
  id: "",
  title: "",
  category: "Programming" as ProjectCategory,
  status: "Production" as ProjectStatus,
  summary: "",
  techStack: "",
  slug: "",
  version: "v1.0.0",
  thumbnailSrc: "/images/project-placeholder.svg",
  repoUrl: "",
  liveUrl: "",
  featured: false,
  sortOrder: "100",
};

const blankExperience = {
  id: "",
  period: "",
  role: "",
  company: "",
  summary: "",
  highlightsText: "",
  sortOrder: "100",
};

const blankSocial = {
  id: "",
  label: "",
  href: "",
  sortOrder: "100",
};

const blankTool = {
  id: "",
  name: "",
  sortOrder: "100",
};

const blankResume = {
  id: "",
  title: "",
  summary: "",
  fileUrl: "",
  fileName: "",
  isActive: false,
  sortOrder: "100",
};

const blankProfile = {
  name: "",
  sidebarFootnote: "",
  dashboardTitle: "",
  dashboardSubtitle: "",
  profilePhotoSrc: "",
  overviewHeading: "",
  overviewIntro: "",
  learnerHeading: "",
  learnerIntro: "",
  availabilityText: "",
  targetText: "",
  workStyleText: "",
  foundationAreasText: "",
  contactHeading: "",
  contactIntro: "",
  contactBio: "",
  contactHighlightsText: "",
};

function toLines(values: string[]): string {
  return values.join("\n");
}

function fromLines(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function toCsv(values: string[]): string {
  return values.join(", ");
}

function fromCsv(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function toNumber(value: string, fallback = 100): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

async function parseResponse<T>(response: Response): Promise<T> {
  const payload = (await response.json().catch(() => ({}))) as T;
  return payload;
}

export function ContentStudio() {
  const [activePanel, setActivePanel] = useState<PanelKey>("projects");
  const [status, setStatus] = useState("Ready");
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [panelPulse, setPanelPulse] = useState(false);

  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [projectForm, setProjectForm] = useState(blankProject);

  const [experienceItems, setExperienceItems] = useState<ExperienceItem[]>([]);
  const [experienceForm, setExperienceForm] = useState(blankExperience);

  const [socialItems, setSocialItems] = useState<SocialItem[]>([]);
  const [socialForm, setSocialForm] = useState(blankSocial);

  const [toolItems, setToolItems] = useState<ToolItem[]>([]);
  const [toolForm, setToolForm] = useState(blankTool);

  const [resumeItems, setResumeItems] = useState<ResumeItem[]>([]);
  const [resumeForm, setResumeForm] = useState(blankResume);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const [profileForm, setProfileForm] = useState(blankProfile);

  const activeLabel = useMemo(
    () => sectionTabs.find((tab) => tab.key === activePanel)?.label ?? "",
    [activePanel],
  );

  function pushToast(message: string, tone: ToastTone): void {
    setToast({
      id: Date.now(),
      tone,
      message,
      visible: true,
    });
  }

  function announce(
    message: string,
    tone: ToastTone = "info",
    showAsToast = false,
  ): void {
    setStatus(message);
    if (showAsToast) {
      pushToast(message, tone);
    }
  }

  async function runBusyTask(task: () => Promise<void>): Promise<void> {
    setBusy(true);
    try {
      await task();
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    if (!toast || !toast.visible) {
      return;
    }

    const hideTimer = window.setTimeout(() => {
      setToast((current) =>
        current ? { ...current, visible: false } : current,
      );
    }, 2600);

    const clearTimer = window.setTimeout(() => {
      setToast(null);
    }, 3000);

    return () => {
      window.clearTimeout(hideTimer);
      window.clearTimeout(clearTimer);
    };
  }, [toast]);

  useEffect(() => {
    setPanelPulse(true);
    const timer = window.setTimeout(() => {
      setPanelPulse(false);
    }, 220);

    return () => {
      window.clearTimeout(timer);
    };
  }, [activePanel]);

  async function refreshProjects() {
    const response = await fetch("/api/admin/projects", { cache: "no-store" });
    const payload = await parseResponse<{
      data?: ProjectItem[];
      error?: string;
    }>(response);
    if (!response.ok) {
      throw new Error(payload.error ?? "Unable to load projects.");
    }
    setProjects(payload.data ?? []);
  }

  async function refreshExperience() {
    const response = await fetch("/api/admin/experience", {
      cache: "no-store",
    });
    const payload = await parseResponse<{
      data?: ExperienceItem[];
      error?: string;
    }>(response);
    if (!response.ok) {
      throw new Error(payload.error ?? "Unable to load experience.");
    }
    setExperienceItems(payload.data ?? []);
  }

  async function refreshSocial() {
    const response = await fetch("/api/admin/social-links", {
      cache: "no-store",
    });
    const payload = await parseResponse<{
      data?: SocialItem[];
      error?: string;
    }>(response);
    if (!response.ok) {
      throw new Error(payload.error ?? "Unable to load social links.");
    }
    setSocialItems(payload.data ?? []);
  }

  async function refreshTools() {
    const response = await fetch("/api/admin/tool-badges", {
      cache: "no-store",
    });
    const payload = await parseResponse<{ data?: ToolItem[]; error?: string }>(
      response,
    );
    if (!response.ok) {
      throw new Error(payload.error ?? "Unable to load tool badges.");
    }
    setToolItems(payload.data ?? []);
  }

  async function refreshResumes() {
    const response = await fetch("/api/admin/resumes", { cache: "no-store" });
    const payload = await parseResponse<{
      data?: ResumeItem[];
      error?: string;
    }>(response);
    if (!response.ok) {
      throw new Error(payload.error ?? "Unable to load resumes.");
    }
    setResumeItems(payload.data ?? []);
  }

  async function refreshProfile() {
    const response = await fetch("/api/admin/profile", { cache: "no-store" });
    const payload = await parseResponse<{
      data?: ProfileSettings;
      error?: string;
    }>(response);
    if (!response.ok) {
      throw new Error(payload.error ?? "Unable to load profile settings.");
    }

    if (!payload.data) {
      setProfileForm(blankProfile);
      return;
    }

    setProfileForm({
      name: payload.data.name,
      sidebarFootnote: payload.data.sidebar_footnote,
      dashboardTitle: payload.data.dashboard_title,
      dashboardSubtitle: payload.data.dashboard_subtitle,
      profilePhotoSrc: payload.data.profile_photo_src,
      overviewHeading: payload.data.overview_heading,
      overviewIntro: payload.data.overview_intro,
      learnerHeading: payload.data.learner_heading,
      learnerIntro: payload.data.learner_intro,
      availabilityText: payload.data.availability_text,
      targetText: payload.data.target_text,
      workStyleText: payload.data.work_style_text,
      foundationAreasText: toLines(payload.data.foundation_areas ?? []),
      contactHeading: payload.data.contact_heading,
      contactIntro: payload.data.contact_intro,
      contactBio: payload.data.contact_bio,
      contactHighlightsText: toLines(payload.data.contact_highlights ?? []),
    });
  }

  async function refreshAll() {
    await runBusyTask(async () => {
      announce("Refreshing data...");
      try {
        await Promise.all([
          refreshProjects(),
          refreshExperience(),
          refreshSocial(),
          refreshTools(),
          refreshResumes(),
          refreshProfile(),
        ]);
        announce("Data refreshed.", "success", true);
      } catch (error) {
        announce(
          error instanceof Error ? error.message : "Refresh failed.",
          "error",
          true,
        );
      }
    });
  }

  useEffect(() => {
    // Initial one-time bootstrap for the studio dashboard.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    void refreshAll();
  }, []);

  function pickProject(item: ProjectItem) {
    setProjectForm({
      id: item.id,
      title: item.title,
      category: item.category,
      status: item.status,
      summary: item.summary,
      techStack: toCsv(item.tech_stack ?? []),
      slug: item.slug ?? "",
      version: item.version,
      thumbnailSrc: item.thumbnail_src,
      repoUrl: item.repo_url ?? "",
      liveUrl: item.live_url ?? "",
      featured: item.featured,
      sortOrder: String(item.sort_order ?? 100),
    });
  }

  async function saveProject() {
    await runBusyTask(async () => {
      announce("Saving project...");

      const payload = {
        title: projectForm.title,
        category: projectForm.category,
        status: projectForm.status,
        summary: projectForm.summary,
        techStack: fromCsv(projectForm.techStack),
        slug: projectForm.slug,
        version: projectForm.version,
        thumbnailSrc: projectForm.thumbnailSrc,
        repoUrl: projectForm.repoUrl,
        liveUrl: projectForm.liveUrl,
        featured: projectForm.featured,
        sortOrder: toNumber(projectForm.sortOrder),
      };

      const isEdit = Boolean(projectForm.id);
      const endpoint = isEdit
        ? `/api/admin/projects/${projectForm.id}`
        : "/api/admin/projects";

      const response = await fetch(endpoint, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await parseResponse<{ error?: string }>(response);

      if (!response.ok) {
        announce(result.error ?? "Project save failed.", "error", true);
        return;
      }

      await refreshProjects();
      setProjectForm(blankProject);
      announce("Project saved.", "success", true);
    });
  }

  async function removeProject(id: string) {
    await runBusyTask(async () => {
      announce("Deleting project...");
      const response = await fetch(`/api/admin/projects/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        announce("Project delete failed.", "error", true);
        return;
      }
      await refreshProjects();
      if (projectForm.id === id) {
        setProjectForm(blankProject);
      }
      announce("Project deleted.", "success", true);
    });
  }

  function pickExperience(item: ExperienceItem) {
    setExperienceForm({
      id: item.id,
      period: item.period,
      role: item.role,
      company: item.company,
      summary: item.summary,
      highlightsText: toLines(item.highlights ?? []),
      sortOrder: String(item.sort_order ?? 100),
    });
  }

  async function saveExperience() {
    await runBusyTask(async () => {
      announce("Saving experience...");
      const payload = {
        period: experienceForm.period,
        role: experienceForm.role,
        company: experienceForm.company,
        summary: experienceForm.summary,
        highlights: fromLines(experienceForm.highlightsText),
        sortOrder: toNumber(experienceForm.sortOrder),
      };

      const isEdit = Boolean(experienceForm.id);
      const endpoint = isEdit
        ? `/api/admin/experience/${experienceForm.id}`
        : "/api/admin/experience";

      const response = await fetch(endpoint, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await parseResponse<{ error?: string }>(response);

      if (!response.ok) {
        announce(result.error ?? "Experience save failed.", "error", true);
        return;
      }

      await refreshExperience();
      setExperienceForm(blankExperience);
      announce("Experience saved.", "success", true);
    });
  }

  async function removeExperience(id: string) {
    await runBusyTask(async () => {
      announce("Deleting experience...");
      const response = await fetch(`/api/admin/experience/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        announce("Experience delete failed.", "error", true);
        return;
      }
      await refreshExperience();
      if (experienceForm.id === id) {
        setExperienceForm(blankExperience);
      }
      announce("Experience deleted.", "success", true);
    });
  }

  function pickSocial(item: unknown) {
    const value = item as SocialItem;
    setSocialForm({
      id: value.id,
      label: value.label,
      href: value.href,
      sortOrder: String(value.sort_order ?? 100),
    });
  }

  async function saveSocial() {
    await runBusyTask(async () => {
      announce("Saving social link...");
      const payload = {
        label: socialForm.label,
        href: socialForm.href,
        sortOrder: toNumber(socialForm.sortOrder),
      };

      const isEdit = Boolean(socialForm.id);
      const endpoint = isEdit
        ? `/api/admin/social-links/${socialForm.id}`
        : "/api/admin/social-links";

      const response = await fetch(endpoint, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await parseResponse<{ error?: string }>(response);

      if (!response.ok) {
        announce(result.error ?? "Social link save failed.", "error", true);
        return;
      }

      await refreshSocial();
      setSocialForm(blankSocial);
      announce("Social link saved.", "success", true);
    });
  }

  async function removeSocial(id: string) {
    await runBusyTask(async () => {
      announce("Deleting social link...");
      const response = await fetch(`/api/admin/social-links/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        announce("Social link delete failed.", "error", true);
        return;
      }
      await refreshSocial();
      if (socialForm.id === id) {
        setSocialForm(blankSocial);
      }
      announce("Social link deleted.", "success", true);
    });
  }

  function pickTool(item: unknown) {
    const value = item as ToolItem;
    setToolForm({
      id: value.id,
      name: value.name,
      sortOrder: String(value.sort_order ?? 100),
    });
  }

  async function saveTool() {
    await runBusyTask(async () => {
      announce("Saving tool badge...");
      const payload = {
        name: toolForm.name,
        sortOrder: toNumber(toolForm.sortOrder),
      };

      const isEdit = Boolean(toolForm.id);
      const endpoint = isEdit
        ? `/api/admin/tool-badges/${toolForm.id}`
        : "/api/admin/tool-badges";

      const response = await fetch(endpoint, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await parseResponse<{ error?: string }>(response);

      if (!response.ok) {
        announce(result.error ?? "Tool badge save failed.", "error", true);
        return;
      }

      await refreshTools();
      setToolForm(blankTool);
      announce("Tool badge saved.", "success", true);
    });
  }

  async function removeTool(id: string) {
    await runBusyTask(async () => {
      announce("Deleting tool badge...");
      const response = await fetch(`/api/admin/tool-badges/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        announce("Tool badge delete failed.", "error", true);
        return;
      }
      await refreshTools();
      if (toolForm.id === id) {
        setToolForm(blankTool);
      }
      announce("Tool badge deleted.", "success", true);
    });
  }

  function pickResume(item: unknown) {
    const value = item as ResumeItem;
    setResumeForm({
      id: value.id,
      title: value.title,
      summary: value.summary,
      fileUrl: value.file_url,
      fileName: value.file_name,
      isActive: value.is_active,
      sortOrder: String(value.sort_order ?? 100),
    });
    setResumeFile(null);
  }

  async function uploadResumePdf(): Promise<{
    fileUrl: string;
    fileName: string;
  } | null> {
    if (!resumeFile) {
      if (resumeForm.fileUrl && resumeForm.fileName) {
        return {
          fileUrl: resumeForm.fileUrl,
          fileName: resumeForm.fileName,
        };
      }

      announce("Please upload a PDF first.", "error", true);
      return null;
    }

    if (!resumeFile.name.toLowerCase().endsWith(".pdf")) {
      announce("Only PDF files are allowed.", "error", true);
      return null;
    }

    const formData = new FormData();
    formData.append("file", resumeFile);

    const response = await fetch("/api/admin/resumes/upload", {
      method: "POST",
      body: formData,
    });

    const payload = await parseResponse<{
      data?: { fileUrl: string; fileName: string };
      error?: string;
    }>(response);

    if (!response.ok || !payload.data) {
      announce(payload.error ?? "PDF upload failed.", "error", true);
      return null;
    }

    announce("PDF uploaded successfully.", "success", true);

    return payload.data;
  }

  async function saveResume() {
    await runBusyTask(async () => {
      announce("Uploading PDF and saving resume...");

      const uploaded = await uploadResumePdf();
      if (!uploaded) {
        return;
      }

      const payload = {
        title: resumeForm.title,
        summary: resumeForm.summary,
        fileUrl: uploaded.fileUrl,
        fileName: uploaded.fileName,
        isActive: resumeForm.isActive,
        sortOrder: toNumber(resumeForm.sortOrder),
      };

      const isEdit = Boolean(resumeForm.id);
      const endpoint = isEdit
        ? `/api/admin/resumes/${resumeForm.id}`
        : "/api/admin/resumes";

      const response = await fetch(endpoint, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await parseResponse<{ error?: string }>(response);

      if (!response.ok) {
        announce(result.error ?? "Resume save failed.", "error", true);
        return;
      }

      await refreshResumes();
      setResumeForm(blankResume);
      setResumeFile(null);
      announce("Resume saved.", "success", true);
    });
  }

  async function removeResume(id: string) {
    await runBusyTask(async () => {
      announce("Deleting resume...");
      const response = await fetch(`/api/admin/resumes/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        announce("Resume delete failed.", "error", true);
        return;
      }
      await refreshResumes();
      if (resumeForm.id === id) {
        setResumeForm(blankResume);
        setResumeFile(null);
      }
      announce("Resume deleted.", "success", true);
    });
  }

  async function saveProfile() {
    await runBusyTask(async () => {
      announce("Saving profile settings...");
      const payload = {
        name: profileForm.name,
        sidebarFootnote: profileForm.sidebarFootnote,
        dashboardTitle: profileForm.dashboardTitle,
        dashboardSubtitle: profileForm.dashboardSubtitle,
        profilePhotoSrc: profileForm.profilePhotoSrc,
        overviewHeading: profileForm.overviewHeading,
        overviewIntro: profileForm.overviewIntro,
        learnerHeading: profileForm.learnerHeading,
        learnerIntro: profileForm.learnerIntro,
        availabilityText: profileForm.availabilityText,
        targetText: profileForm.targetText,
        workStyleText: profileForm.workStyleText,
        foundationAreas: fromLines(profileForm.foundationAreasText),
        contactHeading: profileForm.contactHeading,
        contactIntro: profileForm.contactIntro,
        contactBio: profileForm.contactBio,
        contactHighlights: fromLines(profileForm.contactHighlightsText),
      };

      const response = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await parseResponse<{ error?: string }>(response);

      if (!response.ok) {
        announce(result.error ?? "Profile save failed.", "error", true);
        return;
      }

      await refreshProfile();
      announce("Profile settings saved.", "success", true);
    });
  }

  async function signOut() {
    await fetch("/api/admin/session", { method: "DELETE" });
    window.location.href = "/admin/login";
  }

  const toastToneClass =
    toast?.tone === "success"
      ? "border-emerald-300/70 bg-emerald-50 text-emerald-900"
      : toast?.tone === "error"
        ? "border-red-300/70 bg-red-50 text-red-900"
        : "border-sky-300/70 bg-sky-50 text-sky-900";

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-4 pb-4 md:gap-5 md:pb-6">
      {toast ? (
        <div className="pointer-events-none fixed right-4 top-4 z-50">
          <div
            className={`min-w-55 rounded-xl border px-4 py-3 text-sm font-semibold shadow-lg transition-all duration-300 ${toastToneClass} ${
              toast.visible
                ? "translate-y-0 scale-100 opacity-100"
                : "-translate-y-2 scale-95 opacity-0"
            }`}
          >
            {toast.message}
          </div>
        </div>
      ) : null}

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
              Manage your portfolio content using forms built for daily editing.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => void refreshAll()}
              className="rounded-full border border-oak-primary/30 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-oak-text"
              disabled={busy}
            >
              Refresh All
            </button>
            <button
              type="button"
              onClick={signOut}
              className="rounded-full border border-oak-primary/30 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-oak-text"
            >
              Sign Out
            </button>
          </div>
        </div>
        <p
          className={`mt-3 text-xs text-oak-muted transition-opacity duration-200 ${
            busy ? "opacity-90" : "opacity-100"
          }`}
        >
          {status}
        </p>
      </section>

      <section className="mecha-panel rounded-2xl border border-oak-primary/20 bg-oak-surface/80 p-3">
        <div className="flex flex-wrap gap-2">
          {sectionTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActivePanel(tab.key)}
              className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                activePanel === tab.key
                  ? "border-oak-primary bg-white text-oak-text"
                  : "border-oak-primary/20 bg-white/70 text-oak-muted"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4">
        <article
          className={`mecha-panel rounded-2xl border border-oak-primary/20 bg-oak-surface/80 p-4 transition-all duration-300 ${
            panelPulse
              ? "translate-y-1 opacity-90"
              : "translate-y-0 opacity-100"
          }`}
        >
          <h2 className="text-lg font-bold text-oak-text">{activeLabel}</h2>

          {activePanel === "projects" ? (
            <div className="mt-4 grid gap-4 xl:grid-cols-[1.1fr_1fr]">
              <div className="max-h-96 space-y-2 overflow-auto rounded-xl border border-oak-primary/20 bg-white/75 p-2">
                {projects.length === 0 ? (
                  <p className="p-2 text-sm text-oak-muted">No projects yet.</p>
                ) : (
                  projects.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-lg border border-oak-primary/20 bg-white px-3 py-2"
                    >
                      <p className="text-sm font-semibold text-oak-text">
                        {item.title}
                      </p>
                      <p className="text-xs text-oak-muted">
                        {item.category} · {item.status}
                      </p>
                      <div className="mt-2 flex gap-2">
                        <button
                          type="button"
                          onClick={() => pickProject(item)}
                          className="rounded-md border border-oak-primary/30 px-2 py-1 text-xs font-semibold text-oak-text"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => void removeProject(item.id)}
                          className="rounded-md border border-red-300 px-2 py-1 text-xs font-semibold text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="grid gap-2">
                <label className="text-xs font-semibold uppercase tracking-[0.12em] text-oak-muted">
                  Title
                </label>
                <input
                  value={projectForm.title}
                  onChange={(event) =>
                    setProjectForm((prev) => ({
                      ...prev,
                      title: event.target.value,
                    }))
                  }
                  className="rounded-lg border border-oak-primary/25 bg-white px-3 py-2 text-sm"
                />
                <label className="text-xs font-semibold uppercase tracking-[0.12em] text-oak-muted">
                  Summary
                </label>
                <textarea
                  value={projectForm.summary}
                  onChange={(event) =>
                    setProjectForm((prev) => ({
                      ...prev,
                      summary: event.target.value,
                    }))
                  }
                  className="h-24 rounded-lg border border-oak-primary/25 bg-white px-3 py-2 text-sm"
                />
                <div className="grid gap-2 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.12em] text-oak-muted">
                      Category
                    </label>
                    <select
                      value={projectForm.category}
                      onChange={(event) =>
                        setProjectForm((prev) => ({
                          ...prev,
                          category: event.target.value as ProjectCategory,
                        }))
                      }
                      className="mt-1 w-full rounded-lg border border-oak-primary/25 bg-white px-3 py-2 text-sm"
                    >
                      <option>Programming</option>
                      <option>AI Automation</option>
                      <option>NoSQL</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.12em] text-oak-muted">
                      Status
                    </label>
                    <select
                      value={projectForm.status}
                      onChange={(event) =>
                        setProjectForm((prev) => ({
                          ...prev,
                          status: event.target.value as ProjectStatus,
                        }))
                      }
                      className="mt-1 w-full rounded-lg border border-oak-primary/25 bg-white px-3 py-2 text-sm"
                    >
                      <option>Production</option>
                      <option>Scaling</option>
                      <option>R&D</option>
                    </select>
                  </div>
                </div>
                <label className="text-xs font-semibold uppercase tracking-[0.12em] text-oak-muted">
                  Tech Stack (comma-separated)
                </label>
                <input
                  value={projectForm.techStack}
                  onChange={(event) =>
                    setProjectForm((prev) => ({
                      ...prev,
                      techStack: event.target.value,
                    }))
                  }
                  className="rounded-lg border border-oak-primary/25 bg-white px-3 py-2 text-sm"
                />
                <div className="grid gap-2 sm:grid-cols-2">
                  <input
                    value={projectForm.repoUrl}
                    onChange={(event) =>
                      setProjectForm((prev) => ({
                        ...prev,
                        repoUrl: event.target.value,
                      }))
                    }
                    className="rounded-lg border border-oak-primary/25 bg-white px-3 py-2 text-sm"
                    placeholder="Repository URL"
                  />
                  <input
                    value={projectForm.liveUrl}
                    onChange={(event) =>
                      setProjectForm((prev) => ({
                        ...prev,
                        liveUrl: event.target.value,
                      }))
                    }
                    className="rounded-lg border border-oak-primary/25 bg-white px-3 py-2 text-sm"
                    placeholder="Live URL"
                  />
                </div>
                <div className="grid gap-2 sm:grid-cols-3">
                  <input
                    value={projectForm.slug}
                    onChange={(event) =>
                      setProjectForm((prev) => ({
                        ...prev,
                        slug: event.target.value,
                      }))
                    }
                    className="rounded-lg border border-oak-primary/25 bg-white px-3 py-2 text-sm"
                    placeholder="Slug"
                  />
                  <input
                    value={projectForm.version}
                    onChange={(event) =>
                      setProjectForm((prev) => ({
                        ...prev,
                        version: event.target.value,
                      }))
                    }
                    className="rounded-lg border border-oak-primary/25 bg-white px-3 py-2 text-sm"
                    placeholder="Version"
                  />
                  <input
                    value={projectForm.sortOrder}
                    onChange={(event) =>
                      setProjectForm((prev) => ({
                        ...prev,
                        sortOrder: event.target.value,
                      }))
                    }
                    className="rounded-lg border border-oak-primary/25 bg-white px-3 py-2 text-sm"
                    placeholder="Sort order"
                  />
                </div>
                <input
                  value={projectForm.thumbnailSrc}
                  onChange={(event) =>
                    setProjectForm((prev) => ({
                      ...prev,
                      thumbnailSrc: event.target.value,
                    }))
                  }
                  className="rounded-lg border border-oak-primary/25 bg-white px-3 py-2 text-sm"
                  placeholder="Thumbnail URL"
                />
                <label className="mt-1 inline-flex items-center gap-2 text-sm text-oak-text">
                  <input
                    type="checkbox"
                    checked={projectForm.featured}
                    onChange={(event) =>
                      setProjectForm((prev) => ({
                        ...prev,
                        featured: event.target.checked,
                      }))
                    }
                  />{" "}
                  Featured project
                </label>
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => void saveProject()}
                    className="rounded-lg bg-oak-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white"
                    disabled={busy}
                  >
                    {projectForm.id ? "Update" : "Create"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setProjectForm(blankProject)}
                    className="rounded-lg border border-oak-primary/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-oak-text"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          {activePanel === "experience" ? (
            <div className="mt-4 grid gap-4 xl:grid-cols-[1.1fr_1fr]">
              <div className="max-h-96 space-y-2 overflow-auto rounded-xl border border-oak-primary/20 bg-white/75 p-2">
                {experienceItems.length === 0 ? (
                  <p className="p-2 text-sm text-oak-muted">No entries yet.</p>
                ) : (
                  experienceItems.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-lg border border-oak-primary/20 bg-white px-3 py-2"
                    >
                      <p className="text-sm font-semibold text-oak-text">
                        {item.role} · {item.company}
                      </p>
                      <p className="text-xs text-oak-muted">{item.period}</p>
                      <div className="mt-2 flex gap-2">
                        <button
                          type="button"
                          onClick={() => pickExperience(item)}
                          className="rounded-md border border-oak-primary/30 px-2 py-1 text-xs font-semibold text-oak-text"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => void removeExperience(item.id)}
                          className="rounded-md border border-red-300 px-2 py-1 text-xs font-semibold text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="grid gap-2">
                <input
                  value={experienceForm.period}
                  onChange={(event) =>
                    setExperienceForm((prev) => ({
                      ...prev,
                      period: event.target.value,
                    }))
                  }
                  className="rounded-lg border border-oak-primary/25 bg-white px-3 py-2 text-sm"
                  placeholder="Period"
                />
                <input
                  value={experienceForm.role}
                  onChange={(event) =>
                    setExperienceForm((prev) => ({
                      ...prev,
                      role: event.target.value,
                    }))
                  }
                  className="rounded-lg border border-oak-primary/25 bg-white px-3 py-2 text-sm"
                  placeholder="Role"
                />
                <input
                  value={experienceForm.company}
                  onChange={(event) =>
                    setExperienceForm((prev) => ({
                      ...prev,
                      company: event.target.value,
                    }))
                  }
                  className="rounded-lg border border-oak-primary/25 bg-white px-3 py-2 text-sm"
                  placeholder="Company"
                />
                <textarea
                  value={experienceForm.summary}
                  onChange={(event) =>
                    setExperienceForm((prev) => ({
                      ...prev,
                      summary: event.target.value,
                    }))
                  }
                  className="h-24 rounded-lg border border-oak-primary/25 bg-white px-3 py-2 text-sm"
                  placeholder="Summary"
                />
                <textarea
                  value={experienceForm.highlightsText}
                  onChange={(event) =>
                    setExperienceForm((prev) => ({
                      ...prev,
                      highlightsText: event.target.value,
                    }))
                  }
                  className="h-24 rounded-lg border border-oak-primary/25 bg-white px-3 py-2 text-sm"
                  placeholder="Highlights (one per line)"
                />
                <input
                  value={experienceForm.sortOrder}
                  onChange={(event) =>
                    setExperienceForm((prev) => ({
                      ...prev,
                      sortOrder: event.target.value,
                    }))
                  }
                  className="rounded-lg border border-oak-primary/25 bg-white px-3 py-2 text-sm"
                  placeholder="Sort order"
                />
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => void saveExperience()}
                    className="rounded-lg bg-oak-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white"
                    disabled={busy}
                  >
                    {experienceForm.id ? "Update" : "Create"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setExperienceForm(blankExperience)}
                    className="rounded-lg border border-oak-primary/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-oak-text"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          {activePanel === "social" ? (
            <SimpleListEditor
              items={socialItems}
              titleField="label"
              subtitleField="href"
              onEdit={(item) => pickSocial(item as SocialItem)}
              onDelete={(id) => void removeSocial(id)}
              form={
                <>
                  <input
                    value={socialForm.label}
                    onChange={(event) =>
                      setSocialForm((prev) => ({
                        ...prev,
                        label: event.target.value,
                      }))
                    }
                    className="rounded-lg border border-oak-primary/25 bg-white px-3 py-2 text-sm"
                    placeholder="Label"
                  />
                  <input
                    value={socialForm.href}
                    onChange={(event) =>
                      setSocialForm((prev) => ({
                        ...prev,
                        href: event.target.value,
                      }))
                    }
                    className="rounded-lg border border-oak-primary/25 bg-white px-3 py-2 text-sm"
                    placeholder="https://..."
                  />
                  <input
                    value={socialForm.sortOrder}
                    onChange={(event) =>
                      setSocialForm((prev) => ({
                        ...prev,
                        sortOrder: event.target.value,
                      }))
                    }
                    className="rounded-lg border border-oak-primary/25 bg-white px-3 py-2 text-sm"
                    placeholder="Sort order"
                  />
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => void saveSocial()}
                      className="rounded-lg bg-oak-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white"
                      disabled={busy}
                    >
                      {socialForm.id ? "Update" : "Create"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSocialForm(blankSocial)}
                      className="rounded-lg border border-oak-primary/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-oak-text"
                    >
                      Clear
                    </button>
                  </div>
                </>
              }
            />
          ) : null}

          {activePanel === "tools" ? (
            <SimpleListEditor
              items={toolItems}
              titleField="name"
              subtitleField="sort_order"
              onEdit={(item) => pickTool(item as ToolItem)}
              onDelete={(id) => void removeTool(id)}
              form={
                <>
                  <input
                    value={toolForm.name}
                    onChange={(event) =>
                      setToolForm((prev) => ({
                        ...prev,
                        name: event.target.value,
                      }))
                    }
                    className="rounded-lg border border-oak-primary/25 bg-white px-3 py-2 text-sm"
                    placeholder="Tool name"
                  />
                  <input
                    value={toolForm.sortOrder}
                    onChange={(event) =>
                      setToolForm((prev) => ({
                        ...prev,
                        sortOrder: event.target.value,
                      }))
                    }
                    className="rounded-lg border border-oak-primary/25 bg-white px-3 py-2 text-sm"
                    placeholder="Sort order"
                  />
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => void saveTool()}
                      className="rounded-lg bg-oak-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white"
                      disabled={busy}
                    >
                      {toolForm.id ? "Update" : "Create"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setToolForm(blankTool)}
                      className="rounded-lg border border-oak-primary/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-oak-text"
                    >
                      Clear
                    </button>
                  </div>
                </>
              }
            />
          ) : null}

          {activePanel === "resumes" ? (
            <SimpleListEditor
              items={resumeItems}
              titleField="title"
              subtitleField="file_name"
              onEdit={(item) => pickResume(item as ResumeItem)}
              onDelete={(id) => void removeResume(id)}
              form={
                <>
                  <input
                    value={resumeForm.title}
                    onChange={(event) =>
                      setResumeForm((prev) => ({
                        ...prev,
                        title: event.target.value,
                      }))
                    }
                    className="rounded-lg border border-oak-primary/25 bg-white px-3 py-2 text-sm"
                    placeholder="Title"
                  />
                  <textarea
                    value={resumeForm.summary}
                    onChange={(event) =>
                      setResumeForm((prev) => ({
                        ...prev,
                        summary: event.target.value,
                      }))
                    }
                    className="h-20 rounded-lg border border-oak-primary/25 bg-white px-3 py-2 text-sm"
                    placeholder="Summary"
                  />
                  <label className="text-xs font-semibold uppercase tracking-[0.12em] text-oak-muted">
                    PDF Upload
                  </label>
                  <input
                    type="file"
                    accept="application/pdf,.pdf"
                    onChange={(event) => {
                      const file = event.target.files?.[0] ?? null;
                      setResumeFile(file);
                    }}
                    className="rounded-lg border border-oak-primary/25 bg-white px-3 py-2 text-sm"
                  />
                  <p className="text-xs text-oak-muted">
                    {resumeFile
                      ? `Selected: ${resumeFile.name}`
                      : resumeForm.fileName
                        ? `Current file: ${resumeForm.fileName}`
                        : "No PDF selected"}
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <input
                      value={resumeForm.sortOrder}
                      onChange={(event) =>
                        setResumeForm((prev) => ({
                          ...prev,
                          sortOrder: event.target.value,
                        }))
                      }
                      className="rounded-lg border border-oak-primary/25 bg-white px-3 py-2 text-sm"
                      placeholder="Sort order"
                    />
                    <label className="inline-flex items-center gap-2 rounded-lg border border-oak-primary/25 bg-white px-3 py-2 text-sm text-oak-text">
                      <input
                        type="checkbox"
                        checked={resumeForm.isActive}
                        onChange={(event) =>
                          setResumeForm((prev) => ({
                            ...prev,
                            isActive: event.target.checked,
                          }))
                        }
                      />{" "}
                      Active resume
                    </label>
                  </div>
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => void saveResume()}
                      className="rounded-lg bg-oak-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white"
                      disabled={busy}
                    >
                      {resumeForm.id ? "Update" : "Create"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setResumeForm(blankResume);
                        setResumeFile(null);
                      }}
                      className="rounded-lg border border-oak-primary/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-oak-text"
                    >
                      Clear
                    </button>
                  </div>
                </>
              }
            />
          ) : null}

          {activePanel === "profile" ? (
            <div className="mt-4 grid gap-2">
              <input
                value={profileForm.name}
                onChange={(event) =>
                  setProfileForm((prev) => ({
                    ...prev,
                    name: event.target.value,
                  }))
                }
                className="rounded-lg border border-oak-primary/25 bg-white px-3 py-2 text-sm"
                placeholder="Profile name"
              />
              <input
                value={profileForm.dashboardTitle}
                onChange={(event) =>
                  setProfileForm((prev) => ({
                    ...prev,
                    dashboardTitle: event.target.value,
                  }))
                }
                className="rounded-lg border border-oak-primary/25 bg-white px-3 py-2 text-sm"
                placeholder="Dashboard title"
              />
              <input
                value={profileForm.dashboardSubtitle}
                onChange={(event) =>
                  setProfileForm((prev) => ({
                    ...prev,
                    dashboardSubtitle: event.target.value,
                  }))
                }
                className="rounded-lg border border-oak-primary/25 bg-white px-3 py-2 text-sm"
                placeholder="Dashboard subtitle"
              />
              <input
                value={profileForm.profilePhotoSrc}
                onChange={(event) =>
                  setProfileForm((prev) => ({
                    ...prev,
                    profilePhotoSrc: event.target.value,
                  }))
                }
                className="rounded-lg border border-oak-primary/25 bg-white px-3 py-2 text-sm"
                placeholder="Profile photo URL"
              />
              <textarea
                value={profileForm.sidebarFootnote}
                onChange={(event) =>
                  setProfileForm((prev) => ({
                    ...prev,
                    sidebarFootnote: event.target.value,
                  }))
                }
                className="h-20 rounded-lg border border-oak-primary/25 bg-white px-3 py-2 text-sm"
                placeholder="Sidebar footnote"
              />
              <textarea
                value={profileForm.overviewIntro}
                onChange={(event) =>
                  setProfileForm((prev) => ({
                    ...prev,
                    overviewIntro: event.target.value,
                  }))
                }
                className="h-20 rounded-lg border border-oak-primary/25 bg-white px-3 py-2 text-sm"
                placeholder="Overview intro"
              />
              <textarea
                value={profileForm.learnerIntro}
                onChange={(event) =>
                  setProfileForm((prev) => ({
                    ...prev,
                    learnerIntro: event.target.value,
                  }))
                }
                className="h-20 rounded-lg border border-oak-primary/25 bg-white px-3 py-2 text-sm"
                placeholder="Learner intro"
              />
              <input
                value={profileForm.overviewHeading}
                onChange={(event) =>
                  setProfileForm((prev) => ({
                    ...prev,
                    overviewHeading: event.target.value,
                  }))
                }
                className="rounded-lg border border-oak-primary/25 bg-white px-3 py-2 text-sm"
                placeholder="Overview heading"
              />
              <input
                value={profileForm.learnerHeading}
                onChange={(event) =>
                  setProfileForm((prev) => ({
                    ...prev,
                    learnerHeading: event.target.value,
                  }))
                }
                className="rounded-lg border border-oak-primary/25 bg-white px-3 py-2 text-sm"
                placeholder="Learner heading"
              />
              <div className="grid gap-2 sm:grid-cols-3">
                <input
                  value={profileForm.availabilityText}
                  onChange={(event) =>
                    setProfileForm((prev) => ({
                      ...prev,
                      availabilityText: event.target.value,
                    }))
                  }
                  className="rounded-lg border border-oak-primary/25 bg-white px-3 py-2 text-sm"
                  placeholder="Availability text"
                />
                <input
                  value={profileForm.targetText}
                  onChange={(event) =>
                    setProfileForm((prev) => ({
                      ...prev,
                      targetText: event.target.value,
                    }))
                  }
                  className="rounded-lg border border-oak-primary/25 bg-white px-3 py-2 text-sm"
                  placeholder="Target text"
                />
                <input
                  value={profileForm.workStyleText}
                  onChange={(event) =>
                    setProfileForm((prev) => ({
                      ...prev,
                      workStyleText: event.target.value,
                    }))
                  }
                  className="rounded-lg border border-oak-primary/25 bg-white px-3 py-2 text-sm"
                  placeholder="Work style text"
                />
              </div>
              <textarea
                value={profileForm.foundationAreasText}
                onChange={(event) =>
                  setProfileForm((prev) => ({
                    ...prev,
                    foundationAreasText: event.target.value,
                  }))
                }
                className="h-24 rounded-lg border border-oak-primary/25 bg-white px-3 py-2 text-sm"
                placeholder="Foundation areas (one per line)"
              />
              <input
                value={profileForm.contactHeading}
                onChange={(event) =>
                  setProfileForm((prev) => ({
                    ...prev,
                    contactHeading: event.target.value,
                  }))
                }
                className="rounded-lg border border-oak-primary/25 bg-white px-3 py-2 text-sm"
                placeholder="Contact heading"
              />
              <textarea
                value={profileForm.contactIntro}
                onChange={(event) =>
                  setProfileForm((prev) => ({
                    ...prev,
                    contactIntro: event.target.value,
                  }))
                }
                className="h-20 rounded-lg border border-oak-primary/25 bg-white px-3 py-2 text-sm"
                placeholder="Contact intro"
              />
              <textarea
                value={profileForm.contactBio}
                onChange={(event) =>
                  setProfileForm((prev) => ({
                    ...prev,
                    contactBio: event.target.value,
                  }))
                }
                className="h-24 rounded-lg border border-oak-primary/25 bg-white px-3 py-2 text-sm"
                placeholder="Contact bio"
              />
              <textarea
                value={profileForm.contactHighlightsText}
                onChange={(event) =>
                  setProfileForm((prev) => ({
                    ...prev,
                    contactHighlightsText: event.target.value,
                  }))
                }
                className="h-24 rounded-lg border border-oak-primary/25 bg-white px-3 py-2 text-sm"
                placeholder="Contact highlights (one per line)"
              />
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => void saveProfile()}
                  className="rounded-lg bg-oak-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white"
                  disabled={busy}
                >
                  Save Profile
                </button>
              </div>
            </div>
          ) : null}
        </article>
      </section>
    </section>
  );
}

function SimpleListEditor({
  items,
  titleField,
  subtitleField,
  onEdit,
  onDelete,
  form,
}: {
  items: unknown[];
  titleField: string;
  subtitleField: string;
  onEdit: (item: unknown) => void;
  onDelete: (id: string) => void;
  form: React.ReactNode;
}) {
  return (
    <div className="mt-4 grid gap-4 xl:grid-cols-[1.1fr_1fr]">
      <div className="max-h-96 space-y-2 overflow-auto rounded-xl border border-oak-primary/20 bg-white/75 p-2">
        {items.length === 0 ? (
          <p className="p-2 text-sm text-oak-muted">No records yet.</p>
        ) : (
          items.map((item) => {
            const record = item as Record<string, unknown>;
            const id = String((record.id as string | undefined) ?? "");
            const title = String(record[titleField] ?? "Item");
            const subtitle = String(record[subtitleField] ?? "");
            return (
              <div
                key={id}
                className="rounded-lg border border-oak-primary/20 bg-white px-3 py-2"
              >
                <p className="text-sm font-semibold text-oak-text">{title}</p>
                <p className="text-xs text-oak-muted">{subtitle}</p>
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(item)}
                    className="rounded-md border border-oak-primary/30 px-2 py-1 text-xs font-semibold text-oak-text"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(id)}
                    className="rounded-md border border-red-300 px-2 py-1 text-xs font-semibold text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
      <div className="grid gap-2">{form}</div>
    </div>
  );
}
