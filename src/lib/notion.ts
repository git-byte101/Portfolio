import type { ProjectCategory, ProjectRecord, ProjectStatus } from "@/types/project";

const NOTION_VERSION = "2022-06-28";
const DEFAULT_THUMBNAIL = "/images/project-placeholder.svg";
const PROJECTS_CACHE_TAG = "projects";
const PROJECTS_REVALIDATE_SECONDS = 3600;
const MAX_RETRIES = 3;

const STATUS_SET = new Set<ProjectStatus>(["Production", "Scaling", "R&D"]);
const PROPERTY_ALIASES = {
  name: ["Name"] as const,
  slug: ["Slug"] as const,
  description: ["Description", "DESCRIPTION"] as const,
  techStack: ["Tech Stack", "TECH STACK"] as const,
  heroImage: ["Hero Image", "HERO IMAGE"] as const,
  repoUrl: ["Repo URL", "Repository URL", "GitHub URL", "GITHUB URL"] as const,
  liveUrl: ["Live URL", "LIVE URL"] as const,
  status: ["Status", "STATUS"] as const,
  featured: ["Featured", "FEATURED"] as const,
  sortOrder: ["Sort Order", "SORT ORDER"] as const,
  version: ["Version", "VERSION"] as const,
};

type NotionPage = {
  id: string;
  properties?: Record<string, unknown>;
};

interface NotionQueryResponse {
  results?: NotionPage[];
  has_more?: boolean;
  next_cursor?: string | null;
}

function getNotionConfig() {
  return {
    databaseId: process.env.NOTION_DATABASE_ID ?? "",
    apiKey: process.env.NOTION_API_KEY ?? "",
  };
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function normalizePropertyKey(key: string): string {
  return key.trim().toLowerCase().replace(/\s+/g, " ");
}

function getPropertyByAliases(
  properties: Record<string, unknown>,
  aliases: readonly string[],
): unknown {
  const aliasSet = new Set(aliases.map(normalizePropertyKey));

  for (const [propertyKey, propertyValue] of Object.entries(properties)) {
    if (aliasSet.has(normalizePropertyKey(propertyKey))) {
      return propertyValue;
    }
  }

  return undefined;
}

function readTitle(properties: Record<string, unknown>, aliases: readonly string[]): string {
  const property = asRecord(getPropertyByAliases(properties, aliases));
  const title = property.title;
  if (!Array.isArray(title)) {
    return "";
  }

  return title
    .map((item) => {
      const itemRecord = asRecord(item);
      const plainText = itemRecord.plain_text;
      return typeof plainText === "string" ? plainText : "";
    })
    .join("")
    .trim();
}

function readSelect(properties: Record<string, unknown>, aliases: readonly string[]): string {
  const property = asRecord(getPropertyByAliases(properties, aliases));
  const select = asRecord(property.select);
  const name = select.name;
  return typeof name === "string" ? name : "";
}

function readUrl(properties: Record<string, unknown>, aliases: readonly string[]): string {
  const property = asRecord(getPropertyByAliases(properties, aliases));
  const url = property.url;
  return typeof url === "string" ? url : "";
}

function readNumber(properties: Record<string, unknown>, aliases: readonly string[]): number | null {
  const property = asRecord(getPropertyByAliases(properties, aliases));
  const numberValue = property.number;
  return typeof numberValue === "number" ? numberValue : null;
}

function readCheckbox(properties: Record<string, unknown>, aliases: readonly string[]): boolean {
  const property = asRecord(getPropertyByAliases(properties, aliases));
  return property.checkbox === true;
}

function readText(properties: Record<string, unknown>, aliases: readonly string[]): string {
  const property = asRecord(getPropertyByAliases(properties, aliases));
  const richText = property.rich_text;
  if (!Array.isArray(richText)) {
    return "";
  }

  return richText
    .map((item) => {
      const itemRecord = asRecord(item);
      const plainText = itemRecord.plain_text;
      return typeof plainText === "string" ? plainText : "";
    })
    .join("")
    .trim();
}

function readFiles(properties: Record<string, unknown>, aliases: readonly string[]): string {
  const property = asRecord(getPropertyByAliases(properties, aliases));
  const files = property.files;
  if (!Array.isArray(files) || !files.length) {
    return "";
  }

  const firstFile = asRecord(files[0]);
  const fileType = firstFile.type;

  if (fileType === "external") {
    const external = asRecord(firstFile.external);
    const externalUrl = external.url;
    return typeof externalUrl === "string" ? externalUrl : "";
  }

  if (fileType === "file") {
    const file = asRecord(firstFile.file);
    const fileUrl = file.url;
    return typeof fileUrl === "string" ? fileUrl : "";
  }

  return "";
}

function readMultiSelect(properties: Record<string, unknown>, aliases: readonly string[]): string[] {
  const property = asRecord(getPropertyByAliases(properties, aliases));
  const values = property.multi_select;
  if (!Array.isArray(values)) {
    return [];
  }

  return values
    .map((value) => {
      const valueRecord = asRecord(value);
      const name = valueRecord.name;
      return typeof name === "string" ? name : "";
    })
    .filter(Boolean);
}

function inferCategoryFromTechStack(techStack: string[]): ProjectCategory {
  const loweredTech = techStack.map((tech) => tech.toLowerCase());

  if (loweredTech.some((tech) => tech.includes("n8n") || tech.includes("zapier") || tech.includes("automation"))) {
    return "AI Automation";
  }

  if (loweredTech.some((tech) => tech.includes("mongo") || tech.includes("nosql") || tech.includes("postgres"))) {
    return "NoSQL";
  }

  return "Programming";
}

function normalizeStatus(status: string): ProjectStatus {
  if (STATUS_SET.has(status as ProjectStatus)) {
    return status as ProjectStatus;
  }

  return "Production";
}

function mapNotionPageToProject(page: NotionPage): ProjectRecord | null {
  const properties = asRecord(page.properties);

  const title = readTitle(properties, PROPERTY_ALIASES.name);
  const slug = readText(properties, PROPERTY_ALIASES.slug);
  const summary = readText(properties, PROPERTY_ALIASES.description);
  const techStack = readMultiSelect(properties, PROPERTY_ALIASES.techStack);
  const thumbnailSrc = readFiles(properties, PROPERTY_ALIASES.heroImage) || DEFAULT_THUMBNAIL;
  const repoUrl = readUrl(properties, PROPERTY_ALIASES.repoUrl);
  const liveUrl = readUrl(properties, PROPERTY_ALIASES.liveUrl);
  const status = readSelect(properties, PROPERTY_ALIASES.status);
  const featured = readCheckbox(properties, PROPERTY_ALIASES.featured);
  const sortOrder = readNumber(properties, PROPERTY_ALIASES.sortOrder);

  if (!title) {
    return null;
  }

  const category = inferCategoryFromTechStack(techStack);

  return {
    id: page.id,
    title,
    slug: slug || undefined,
    category,
    techStack,
    version: readText(properties, PROPERTY_ALIASES.version) || "v1.0.0",
    status: normalizeStatus(status),
    summary: summary || "Professional engineering solution.",
    thumbnailSrc,
    repoUrl: repoUrl || undefined,
    liveUrl: liveUrl || undefined,
    featured,
    sortOrder: sortOrder ?? undefined,
  };
}

async function queryDatabasePage(
  databaseId: string,
  apiKey: string,
  startCursor?: string,
  retryCount = 0,
): Promise<NotionQueryResponse> {
  const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      page_size: 100,
      ...(startCursor ? { start_cursor: startCursor } : {}),
    }),
    next: { tags: [PROJECTS_CACHE_TAG], revalidate: PROJECTS_REVALIDATE_SECONDS },
  });

  if (response.status === 429 && retryCount < MAX_RETRIES) {
    const retryAfterHeader = response.headers.get("Retry-After");
    const retryAfterSeconds = Number.parseInt(retryAfterHeader ?? "1", 10);
    const retryDelayMs = Number.isNaN(retryAfterSeconds)
      ? 1000 * (retryCount + 1)
      : retryAfterSeconds * 1000;

    await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
    return queryDatabasePage(databaseId, apiKey, startCursor, retryCount + 1);
  }

  if (!response.ok) {
    throw new Error(`Notion request failed with status ${response.status}`);
  }

  return (await response.json()) as NotionQueryResponse;
}

export async function fetchNotionProjects(): Promise<ProjectRecord[]> {
  const notionConfig = getNotionConfig();
  if (!notionConfig.databaseId || !notionConfig.apiKey) {
    return [];
  }

  const pages: NotionPage[] = [];
  let cursor: string | undefined;
  let hasMore = true;

  while (hasMore) {
    const payload = await queryDatabasePage(notionConfig.databaseId, notionConfig.apiKey, cursor);
    const resultBatch = Array.isArray(payload.results) ? payload.results : [];
    pages.push(...resultBatch);

    hasMore = payload.has_more === true;
    cursor = typeof payload.next_cursor === "string" ? payload.next_cursor : undefined;
  }

  return pages
    .map(mapNotionPageToProject)
    .filter((project): project is ProjectRecord => project !== null)
    .sort((a, b) => {
      const aOrder = a.sortOrder ?? Number.MAX_SAFE_INTEGER;
      const bOrder = b.sortOrder ?? Number.MAX_SAFE_INTEGER;

      if (aOrder !== bOrder) {
        return aOrder - bOrder;
      }

      if (a.featured !== b.featured) {
        return a.featured ? -1 : 1;
      }

      return a.title.localeCompare(b.title);
    });
}
