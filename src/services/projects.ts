import { type ProjectRecord } from "@/types/project";
import { getSupabaseAdminClient, isSupabaseConfigured } from "@/lib/supabase";
import { unstable_cache } from "next/cache";

const PROJECTS: ProjectRecord[] = [
  {
    id: "automation-orchestrator-revops",
    title: "Automation Orchestrator for Revenue Ops",
    category: "AI Automation",
    techStack: ["n8n", "Zapier", "OpenAI API", "PostgreSQL"],
    version: "v2.1.0",
    status: "Production",
    summary: "Workflow platform that automates lead qualification, CRM sync, and escalation policies.",
    thumbnailSrc: "/images/project-placeholder.svg",
  },
  {
    id: "systems-architect-portfolio",
    title: "Systems Architect Portfolio",
    category: "Programming",
    techStack: ["Next.js 16", "TypeScript", "Tailwind v4", "Motion", "Vercel"],
    version: "v1.1.0",
    status: "Production",
    summary: "Professional portfolio dashboard built for technical storytelling and maintainable growth.",
    thumbnailSrc: "/images/project-placeholder.svg",
  },
  {
    id: "realtime-pipeline-health",
    title: "Realtime Pipeline Health Dashboard",
    category: "NoSQL",
    techStack: ["MongoDB", "Node.js", "JavaScript", "WebSockets"],
    version: "v1.4.2",
    status: "Scaling",
    summary: "Operational dashboard for monitoring async jobs, throughput, and failure recovery metrics.",
    thumbnailSrc: "/images/project-placeholder.svg",
  },
  {
    id: "java-integration-gateway",
    title: "Java Integration Gateway",
    category: "Programming",
    techStack: ["Java", "Spring Boot", "Redis", "Docker"],
    version: "v1.0.3",
    status: "R&D",
    summary: "Service gateway standardizing partner API integrations with retries, audit logging, and SLA controls.",
    thumbnailSrc: "/images/project-placeholder.svg",
  },
  {
    id: "zapier-customer-lifecycle",
    title: "Customer Lifecycle Automation Mesh",
    category: "AI Automation",
    techStack: ["Zapier", "HubSpot", "Slack", "Airtable"],
    version: "v1.3.1",
    status: "Production",
    summary: "Automated customer lifecycle events from onboarding through renewal and expansion motions.",
    thumbnailSrc: "/images/project-placeholder.svg",
  },
  {
    id: "n8n-ticket-triage",
    title: "Support Ticket AI Triage",
    category: "AI Automation",
    techStack: ["n8n", "OpenAI API", "Notion API", "Webhook"],
    version: "v2.0.2",
    status: "Scaling",
    summary: "Priority routing and intent extraction for inbound support tickets across multichannel sources.",
    thumbnailSrc: "/images/project-placeholder.svg",
  },
  {
    id: "js-observability-hub",
    title: "JavaScript Observability Hub",
    category: "Programming",
    techStack: ["JavaScript", "Node.js", "OpenTelemetry", "Grafana"],
    version: "v1.6.0",
    status: "Scaling",
    summary: "Centralized event and tracing pipeline for distributed JavaScript services.",
    thumbnailSrc: "/images/project-placeholder.svg",
  },
  {
    id: "java-batch-processor",
    title: "Java Batch Processing Core",
    category: "Programming",
    techStack: ["Java", "Spring Batch", "PostgreSQL", "Redis"],
    version: "v1.8.4",
    status: "Production",
    summary: "High-throughput background processing engine with robust retry semantics.",
    thumbnailSrc: "/images/project-placeholder.svg",
  },
  {
    id: "nosql-event-store",
    title: "NoSQL Event Store Layer",
    category: "NoSQL",
    techStack: ["MongoDB", "Change Streams", "Node.js", "Kafka"],
    version: "v2.2.0",
    status: "Scaling",
    summary: "Event persistence layer built for timeline reconstruction and auditability.",
    thumbnailSrc: "/images/project-placeholder.svg",
  },
  {
    id: "edge-api-cacher",
    title: "Edge API Caching Gateway",
    category: "Programming",
    techStack: ["Next.js", "Vercel Edge", "TypeScript", "Redis"],
    version: "v1.2.7",
    status: "Production",
    summary: "Low-latency edge gateway with stale-while-revalidate for API-heavy workloads.",
    thumbnailSrc: "/images/project-placeholder.svg",
  },
  {
    id: "workflow-sla-monitor",
    title: "Workflow SLA Monitor",
    category: "AI Automation",
    techStack: ["n8n", "Prometheus", "Grafana", "PagerDuty"],
    version: "v1.1.9",
    status: "Production",
    summary: "SLA watchdog for automation pipelines with proactive incident notifications.",
    thumbnailSrc: "/images/project-placeholder.svg",
  },
  {
    id: "nosql-query-optimizer",
    title: "NoSQL Query Optimization Toolkit",
    category: "NoSQL",
    techStack: ["MongoDB", "Index Advisor", "Node.js", "TypeScript"],
    version: "v0.9.8",
    status: "R&D",
    summary: "Experimentation toolkit for optimizing query plans and reducing hot-path latency.",
    thumbnailSrc: "/images/project-placeholder.svg",
  },
];

const PROJECTS_CACHE_TTL_MS = 60_000;
const PROJECTS_QUERY_TIMEOUT_MS = 2500;

let inMemoryProjectsCache: ProjectRecord[] | null = null;
let inMemoryProjectsCacheExpiresAt = 0;
let inFlightProjectsRefresh: Promise<ProjectRecord[]> | null = null;

async function withProjectsTimeout<T>(query: T): Promise<Awaited<T>> {
  let timeoutHandle: ReturnType<typeof setTimeout> | undefined;

  try {
    return (await Promise.race([
      Promise.resolve(query),
      new Promise<never>((_, reject) => {
        timeoutHandle = setTimeout(() => {
          reject(
            new Error(
              `projects query timed out after ${PROJECTS_QUERY_TIMEOUT_MS}ms`,
            ),
          );
        }, PROJECTS_QUERY_TIMEOUT_MS);
      }),
    ])) as Awaited<T>;
  } finally {
    if (timeoutHandle) {
      clearTimeout(timeoutHandle);
    }
  }
}

const getCachedSupabaseProjects = unstable_cache(
  async () => {
    if (!isSupabaseConfigured()) {
      return [];
    }

    try {
      const { data, error } = await withProjectsTimeout(
        getSupabaseAdminClient()
          .from("projects")
          .select(
            "id, title, slug, category, tech_stack, version, status, summary, thumbnail_src, repo_url, live_url, featured, sort_order",
          )
          .order("sort_order", { ascending: true, nullsFirst: false }),
      );

      if (error) {
        throw error;
      }

      return (data ?? []).map((row) => ({
        id: row.id as string,
        title: (row.title as string) ?? "",
        slug: (row.slug as string | null) ?? undefined,
        category: ((row.category as string) ?? "Programming") as ProjectRecord["category"],
        techStack: Array.isArray(row.tech_stack)
          ? row.tech_stack.filter((value): value is string => typeof value === "string")
          : [],
        version: (row.version as string) ?? "v1.0.0",
        status: ((row.status as string) ?? "Production") as ProjectRecord["status"],
        summary: (row.summary as string) ?? "",
        thumbnailSrc:
          (row.thumbnail_src as string) || "/images/project-placeholder.svg",
        repoUrl: (row.repo_url as string | null) ?? undefined,
        liveUrl: (row.live_url as string | null) ?? undefined,
        featured: row.featured === true,
        sortOrder: typeof row.sort_order === "number" ? row.sort_order : undefined,
      }));
    } catch (error) {
      console.error("Failed to load Supabase projects, using fallback data.", error);
      return [];
    }
  },
  ["portfolio-projects"],
  { revalidate: 60, tags: ["projects"] },
);

async function refreshProjectsCache(): Promise<ProjectRecord[]> {
  const supabaseProjects = await getCachedSupabaseProjects();
  const resolvedProjects = supabaseProjects.length ? supabaseProjects : PROJECTS;

  inMemoryProjectsCache = resolvedProjects;
  inMemoryProjectsCacheExpiresAt = Date.now() + PROJECTS_CACHE_TTL_MS;

  return resolvedProjects;
}

function scheduleProjectsRefresh(): Promise<ProjectRecord[]> {
  if (!inFlightProjectsRefresh) {
    inFlightProjectsRefresh = refreshProjectsCache().finally(() => {
      inFlightProjectsRefresh = null;
    });
  }

  return inFlightProjectsRefresh;
}

export async function getProjects(): Promise<ProjectRecord[]> {
  const now = Date.now();

  if (inMemoryProjectsCache && now < inMemoryProjectsCacheExpiresAt) {
    return inMemoryProjectsCache;
  }

  if (inMemoryProjectsCache) {
    scheduleProjectsRefresh();

    return inMemoryProjectsCache;
  }

  return scheduleProjectsRefresh();
}
