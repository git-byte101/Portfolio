import { unstable_cache } from "next/cache";
import { isSupabaseConfigured, getSupabaseAdminClient } from "@/lib/supabase";
import type {
  ExperienceRecord,
  ProfileSettingsRecord,
  ResumeRecord,
  SocialLinkRecord,
  ToolBadgeRecord,
} from "@/types/content";

const DEFAULT_PROFILE_SETTINGS: ProfileSettingsRecord = {
  id: "default",
  name: "PAULO",
  sidebarFootnote:
    "Fresh graduate in Information Technology focused on building practical skills in support, systems, and software fundamentals.",
  dashboardTitle: "Portfolio Dashboard",
  dashboardSubtitle: "Fresh Graduate IT Profile",
  profilePhotoSrc: "/images/mecha-profile-photo.svg",
  overviewHeading: "Fresh Graduate IT Portfolio",
  overviewIntro:
    "Entry-level IT graduate with beginner knowledge in support, networking, programming, AI automation, and database tasks. Actively learning through practical projects and guided real-world exposure.",
  learnerHeading: "Entry-Level IT Focus",
  learnerIntro:
    "Open to junior opportunities where I can support day-to-day IT operations, contribute to technical tasks, and keep building strong fundamentals through mentorship and hands-on work.",
  availabilityText: "Open to Junior Roles",
  targetText: "IT Support / Staff",
  workStyleText:
    "Responsible, coachable, and documentation-driven. I focus on clear communication, task ownership, and steady improvement.",
  foundationAreas: [
    "IT Support and Troubleshooting",
    "Computer Networks Fundamentals",
    "Programming Fundamentals: HTML, CSS, JavaScript",
    "AI Automation Basics",
    "Database Management Basics",
    "Basic System Administration",
    "Tools: ChatGPT, Claude, Gemini",
  ],
  contactHeading: "Let's Connect",
  contactIntro:
    "Recently completed internship training and now open to junior and entry-level IT roles where I can contribute and continue growing.",
  contactBio:
    "I am a fresh graduate in Information Technology with beginner-level knowledge in core IT work. After completing internship experience, I am continuing to build skills in networking, programming, AI automation, database tasks, and user support.",
  contactHighlights: [
    "Basic IT support and troubleshooting for common technical issues",
    "Foundational networking and system setup knowledge",
    "Beginner web development with HTML, CSS, and JavaScript",
    "Entry-level AI assistant usage with ChatGPT, Claude, and Gemini",
    "Basic database handling and simple task documentation",
  ],
};

const DEFAULT_EXPERIENCE: ExperienceRecord[] = [
  {
    id: "exp-1",
    period: "Nov 2025 - Jan 2026",
    role: "Project-Based Automation Builder",
    company: "Independent Project Work",
    summary:
      "Delivered beginner-to-intermediate automation projects focused on website workflow and social media process automation.",
    highlights: [
      "Built website automation workflows using Notion, GoHighLevel (GHL), and Twilio.",
      "Implemented Instagram automation flows using GHL and ManyChat.",
      "Configured project-based automations to reduce repetitive manual tasks.",
    ],
    sortOrder: 1,
  },
  {
    id: "exp-2",
    period: "May 2025 - Aug 2025",
    role: "IT Intern",
    company: "Vantrippers Travel and Tours",
    summary:
      "Completed internship focused on supporting website development and practical IT tasks in a real business environment.",
    highlights: [
      "Contributed to building the company website using PHP and CodeIgniter.",
      "Worked with a legacy CSS framework to style and update web pages.",
      "Supported basic testing, bug fixes, and implementation tasks during development.",
    ],
    sortOrder: 2,
  },
];

const DEFAULT_SOCIAL_LINKS: SocialLinkRecord[] = [
  { id: "social-github", label: "GitHub", href: "https://github.com", sortOrder: 1 },
  { id: "social-linkedin", label: "LinkedIn", href: "https://linkedin.com", sortOrder: 2 },
  { id: "social-x", label: "X", href: "https://x.com", sortOrder: 3 },
  {
    id: "social-email",
    label: "Email",
    href: "mailto:architect@example.com",
    sortOrder: 4,
  },
];

const DEFAULT_TOOL_BADGES: ToolBadgeRecord[] = [
  { id: "tb-1", name: "n8n", sortOrder: 1 },
  { id: "tb-2", name: "Zapier", sortOrder: 2 },
  { id: "tb-3", name: "Java", sortOrder: 3 },
  { id: "tb-4", name: "JavaScript", sortOrder: 4 },
  { id: "tb-5", name: "TypeScript", sortOrder: 5 },
  { id: "tb-6", name: "NoSQL", sortOrder: 6 },
  { id: "tb-7", name: "MongoDB", sortOrder: 7 },
  { id: "tb-8", name: "PostgreSQL", sortOrder: 8 },
  { id: "tb-9", name: "Docker", sortOrder: 9 },
  { id: "tb-10", name: "Vercel", sortOrder: 10 },
  { id: "tb-11", name: "Neon", sortOrder: 11 },
  { id: "tb-12", name: "Supabase", sortOrder: 12 },
];

const DEFAULT_RESUMES: ResumeRecord[] = [
  {
    id: "resume-default",
    title: "Resume Preview",
    summary: "HR can review the resume directly on the web page or download a copy.",
    fileUrl: "/RAMOS_CV.pdf",
    fileName: "RAMOS_CV.pdf",
    isActive: true,
    sortOrder: 1,
  },
];

const SETTINGS_CACHE_SECONDS = 60;

function normalizeStringArray(input: unknown): string[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
}

type SupabaseProfileRow = {
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
};

function mapProfile(row: SupabaseProfileRow): ProfileSettingsRecord {
  return {
    id: row.id,
    name: row.name,
    sidebarFootnote: row.sidebar_footnote,
    dashboardTitle: row.dashboard_title,
    dashboardSubtitle: row.dashboard_subtitle,
    profilePhotoSrc: row.profile_photo_src,
    overviewHeading: row.overview_heading,
    overviewIntro: row.overview_intro,
    learnerHeading: row.learner_heading,
    learnerIntro: row.learner_intro,
    availabilityText: row.availability_text,
    targetText: row.target_text,
    workStyleText: row.work_style_text,
    foundationAreas: normalizeStringArray(row.foundation_areas),
    contactHeading: row.contact_heading,
    contactIntro: row.contact_intro,
    contactBio: row.contact_bio,
    contactHighlights: normalizeStringArray(row.contact_highlights),
  };
}

const getCachedProfileSettings = unstable_cache(
  async () => {
    if (!isSupabaseConfigured()) {
      return DEFAULT_PROFILE_SETTINGS;
    }

    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("profile_settings")
      .select("*")
      .eq("id", "default")
      .maybeSingle();

    if (error || !data) {
      if (error) {
        console.error("Failed to load profile settings from Supabase", error);
      }
      return DEFAULT_PROFILE_SETTINGS;
    }

    return mapProfile(data as SupabaseProfileRow);
  },
  ["site-profile-settings"],
  {
    revalidate: SETTINGS_CACHE_SECONDS,
    tags: ["profile-settings"],
  },
);

export async function getProfileSettings(): Promise<ProfileSettingsRecord> {
  return getCachedProfileSettings();
}

const getCachedExperience = unstable_cache(
  async () => {
    if (!isSupabaseConfigured()) {
      return DEFAULT_EXPERIENCE;
    }

    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("experience_entries")
      .select("id, period, role, company, summary, highlights, sort_order")
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      if (error) {
        console.error("Failed to load experience from Supabase", error);
      }
      return DEFAULT_EXPERIENCE;
    }

    return data.map((row) => ({
      id: row.id as string,
      period: (row.period as string) ?? "",
      role: (row.role as string) ?? "",
      company: (row.company as string) ?? "",
      summary: (row.summary as string) ?? "",
      highlights: normalizeStringArray(row.highlights),
      sortOrder: Number(row.sort_order ?? 0),
    }));
  },
  ["site-experience"],
  {
    revalidate: SETTINGS_CACHE_SECONDS,
    tags: ["experience"],
  },
);

export async function getExperienceEntries(): Promise<ExperienceRecord[]> {
  return getCachedExperience();
}

const getCachedSocialLinks = unstable_cache(
  async () => {
    if (!isSupabaseConfigured()) {
      return DEFAULT_SOCIAL_LINKS;
    }

    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("social_links")
      .select("id, label, href, sort_order")
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      if (error) {
        console.error("Failed to load social links from Supabase", error);
      }
      return DEFAULT_SOCIAL_LINKS;
    }

    return data.map((row) => ({
      id: row.id as string,
      label: (row.label as string) ?? "",
      href: (row.href as string) ?? "",
      sortOrder: Number(row.sort_order ?? 0),
    }));
  },
  ["site-social-links"],
  {
    revalidate: SETTINGS_CACHE_SECONDS,
    tags: ["social-links"],
  },
);

export async function getSocialLinks(): Promise<SocialLinkRecord[]> {
  return getCachedSocialLinks();
}

const getCachedToolBadges = unstable_cache(
  async () => {
    if (!isSupabaseConfigured()) {
      return DEFAULT_TOOL_BADGES;
    }

    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("tool_badges")
      .select("id, name, sort_order")
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      if (error) {
        console.error("Failed to load tool badges from Supabase", error);
      }
      return DEFAULT_TOOL_BADGES;
    }

    return data.map((row) => ({
      id: row.id as string,
      name: (row.name as string) ?? "",
      sortOrder: Number(row.sort_order ?? 0),
    }));
  },
  ["site-tool-badges"],
  {
    revalidate: SETTINGS_CACHE_SECONDS,
    tags: ["tool-badges"],
  },
);

export async function getToolBadges(): Promise<ToolBadgeRecord[]> {
  return getCachedToolBadges();
}

const getCachedResumes = unstable_cache(
  async () => {
    if (!isSupabaseConfigured()) {
      return DEFAULT_RESUMES;
    }

    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("resume_assets")
      .select("id, title, summary, file_url, file_name, is_active, sort_order")
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      if (error) {
        console.error("Failed to load resumes from Supabase", error);
      }
      return DEFAULT_RESUMES;
    }

    return data.map((row) => ({
      id: row.id as string,
      title: (row.title as string) ?? "Resume",
      summary: (row.summary as string) ?? "",
      fileUrl: (row.file_url as string) ?? "",
      fileName: (row.file_name as string) ?? "resume.pdf",
      isActive: row.is_active === true,
      sortOrder: Number(row.sort_order ?? 0),
    }));
  },
  ["site-resumes"],
  {
    revalidate: SETTINGS_CACHE_SECONDS,
    tags: ["resume-assets"],
  },
);

export async function getResumes(): Promise<ResumeRecord[]> {
  return getCachedResumes();
}

export async function getActiveResume(): Promise<ResumeRecord> {
  const resumes = await getResumes();
  const activeResume = resumes.find((item) => item.isActive);

  if (activeResume) {
    return activeResume;
  }

  return resumes[0] ?? DEFAULT_RESUMES[0];
}
