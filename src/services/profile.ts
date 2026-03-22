import { unstable_cache } from "next/cache";

const NOTION_VERSION = "2022-06-28";
const PROFILE_REVALIDATE_SECONDS = 60;
const DEFAULT_PROFILE_PHOTO = "/images/mecha-profile-photo.svg";

const PROFILE_IMAGE_PROPERTY_ALIASES = [
  "Profile Image",
  "Avatar",
  "Photo",
  "Profile Photo",
  "Image",
  "Hero Image",
] as const;

interface NotionPageResponse {
  cover?: unknown;
  properties?: Record<string, unknown>;
}

interface NotionDatabaseQueryResponse {
  results?: NotionPageResponse[];
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function normalizePropertyKey(key: string): string {
  return key.trim().toLowerCase().replace(/\s+/g, " ");
}

function normalizeNotionId(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  const compactHexMatch = trimmed.match(/[0-9a-fA-F]{32}/);
  if (compactHexMatch) {
    return compactHexMatch[0].toLowerCase();
  }

  const dashedHexMatch = trimmed.match(
    /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/,
  );
  if (dashedHexMatch) {
    return dashedHexMatch[0].replace(/-/g, "").toLowerCase();
  }

  return trimmed;
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

function readFileOrExternalUrl(fileObject: unknown): string {
  const fileRecord = asRecord(fileObject);
  const fileType = fileRecord.type;

  if (fileType === "external") {
    const external = asRecord(fileRecord.external);
    return typeof external.url === "string" ? external.url : "";
  }

  if (fileType === "file") {
    const file = asRecord(fileRecord.file);
    return typeof file.url === "string" ? file.url : "";
  }

  return "";
}

function readFilesPropertyUrl(
  properties: Record<string, unknown>,
  aliases: readonly string[],
): string {
  const property = asRecord(getPropertyByAliases(properties, aliases));
  const files = property.files;

  if (!Array.isArray(files) || files.length === 0) {
    return "";
  }

  return readFileOrExternalUrl(files[0]);
}

function readCoverUrl(page: NotionPageResponse): string {
  return readFileOrExternalUrl(page.cover);
}

async function fetchNotionPage(pageId: string, apiKey: string): Promise<NotionPageResponse | null> {
  const response = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
    },
    next: {
      tags: ["profile"],
      revalidate: PROFILE_REVALIDATE_SECONDS,
    },
  });

  if (!response.ok) {
    throw new Error(`Notion profile page request failed with status ${response.status}`);
  }

  return (await response.json()) as NotionPageResponse;
}

async function queryNotionDatabase(
  databaseId: string,
  apiKey: string,
): Promise<NotionPageResponse[]> {
  const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      page_size: 25,
    }),
    next: {
      tags: ["profile"],
      revalidate: PROFILE_REVALIDATE_SECONDS,
    },
  });

  if (!response.ok) {
    throw new Error(`Notion profile database query failed with status ${response.status}`);
  }

  const payload = (await response.json()) as NotionDatabaseQueryResponse;
  return Array.isArray(payload.results) ? payload.results : [];
}

function extractProfilePhotoFromPage(page: NotionPageResponse): string {
  const properties = asRecord(page.properties);
  const propertyPhotoUrl = readFilesPropertyUrl(properties, PROFILE_IMAGE_PROPERTY_ALIASES);
  if (propertyPhotoUrl) {
    return propertyPhotoUrl;
  }

  return readCoverUrl(page);
}

async function getProfilePhotoFromNotionPage(pageId: string, apiKey: string): Promise<string> {
  const notionPage = await fetchNotionPage(pageId, apiKey);
  if (!notionPage) {
    return "";
  }

  return extractProfilePhotoFromPage(notionPage);
}

async function getProfilePhotoFromNotionDatabase(
  databaseId: string,
  apiKey: string,
): Promise<string> {
  const rows = await queryNotionDatabase(databaseId, apiKey);

  for (const row of rows) {
    const url = extractProfilePhotoFromPage(row);
    if (url) {
      return url;
    }
  }

  return "";
}

const getCachedNotionProfilePhoto = unstable_cache(
  async () => {
    const notionApiKey = process.env.NOTION_API_KEY ?? "";
    const notionProfilePageId = normalizeNotionId(
      process.env.NOTION_PROFILE_PAGE_ID ?? "",
    );
    const notionProfileDatabaseId = normalizeNotionId(
      process.env.NOTION_PROFILE_DATABASE_ID ?? "",
    );

    if (!notionApiKey) {
      return "";
    }

    if (notionProfilePageId) {
      try {
        const fromPage = await getProfilePhotoFromNotionPage(
          notionProfilePageId,
          notionApiKey,
        );
        if (fromPage) {
          return fromPage;
        }

        const fromDatabaseByPageId = await getProfilePhotoFromNotionDatabase(
          notionProfilePageId,
          notionApiKey,
        );
        if (fromDatabaseByPageId) {
          return fromDatabaseByPageId;
        }
      } catch {
        // Keep going and try the dedicated database env key.
      }
    }

    if (notionProfileDatabaseId) {
      try {
        const fromDatabase = await getProfilePhotoFromNotionDatabase(
          notionProfileDatabaseId,
          notionApiKey,
        );
        if (fromDatabase) {
          return fromDatabase;
        }
      } catch {
        return "";
      }
    }

    return "";
  },
  ["portfolio-profile-photo"],
  {
    revalidate: PROFILE_REVALIDATE_SECONDS,
    tags: ["profile"],
  },
);

export async function getProfilePhotoSrc(): Promise<string> {
  const notionPhotoUrl = await getCachedNotionProfilePhoto();
  return notionPhotoUrl || DEFAULT_PROFILE_PHOTO;
}
