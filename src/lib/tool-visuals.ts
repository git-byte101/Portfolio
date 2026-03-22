import type { IconType } from "react-icons";
import {
  FaBoltLightning,
  FaChartLine,
  FaCode,
  FaCodeBranch,
  FaDiagramProject,
  FaJava,
  FaLink,
  FaServer,
  FaWandMagicSparkles,
} from "react-icons/fa6";
import {
  SiAirtable,
  SiDocker,
  SiFramer,
  SiGrafana,
  SiHubspot,
  SiJavascript,
  SiMongodb,
  SiN8N,
  SiNextdotjs,
  SiNodedotjs,
  SiNotion,
  SiOpenai,
  SiOpentelemetry,
  SiPagerduty,
  SiPostgresql,
  SiPrometheus,
  SiRedis,
  SiSlack,
  SiSpringboot,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
  SiZapier,
  SiApachekafka,
} from "react-icons/si";
import { TbDatabase } from "react-icons/tb";

export interface ToolVisual {
  icon: IconType;
  accentClassName: string;
}

const FALLBACK_VISUAL: ToolVisual = {
  icon: FaCode,
  accentClassName: "text-[#2f4858]",
};

function normalizeToolName(value: string): string {
  return value.trim().toLowerCase();
}

function extractHexFromClassName(className: string): string | null {
  const match = className.match(/text-\[(#[0-9a-fA-F]{3,8})\]/);
  return match?.[1] ?? null;
}

export function getToolVisual(toolName: string): ToolVisual {
  const normalized = normalizeToolName(toolName);

  if (normalized.includes("n8n")) {
    return { icon: SiN8N, accentClassName: "text-[#ea4b71]" };
  }

  if (normalized.includes("zapier")) {
    return { icon: SiZapier, accentClassName: "text-[#ff4f00]" };
  }

  if (normalized.includes("spring")) {
    return { icon: SiSpringboot, accentClassName: "text-[#6db33f]" };
  }

  if (normalized.includes("next.js") || normalized.includes("nextjs")) {
    return { icon: SiNextdotjs, accentClassName: "text-[#000000]" };
  }

  if (normalized.includes("node.js") || normalized.includes("nodejs")) {
    return { icon: SiNodedotjs, accentClassName: "text-[#339933]" };
  }

  if (normalized.includes("javascript")) {
    return { icon: SiJavascript, accentClassName: "text-[#F7DF1E]" };
  }

  if (normalized === "java" || /\bjava\b/.test(normalized)) {
    return { icon: FaJava, accentClassName: "text-[#ED8B00]" };
  }

  if (normalized.includes("typescript")) {
    return { icon: SiTypescript, accentClassName: "text-[#3178c6]" };
  }

  if (normalized.includes("mongodb")) {
    return { icon: SiMongodb, accentClassName: "text-[#47a248]" };
  }

  if (normalized.includes("postgres")) {
    return { icon: SiPostgresql, accentClassName: "text-[#4169E1]" };
  }

  if (normalized.includes("nosql") || normalized.includes("database")) {
    return { icon: TbDatabase, accentClassName: "text-[#2f4858]" };
  }

  if (normalized.includes("docker")) {
    return { icon: SiDocker, accentClassName: "text-[#2496ed]" };
  }

  if (normalized.includes("vercel") || normalized.includes("edge")) {
    return { icon: SiVercel, accentClassName: "text-[#000000]" };
  }

  if (normalized.includes("neon")) {
    return { icon: FaBoltLightning, accentClassName: "text-[#00e699]" };
  }

  if (normalized.includes("notion")) {
    return { icon: SiNotion, accentClassName: "text-[#000000]" };
  }

  if (normalized.includes("openai") || normalized.includes("ai")) {
    return { icon: SiOpenai, accentClassName: "text-[#10a37f]" };
  }

  if (normalized.includes("redis")) {
    return { icon: SiRedis, accentClassName: "text-[#DC382D]" };
  }

  if (normalized.includes("opentelemetry")) {
    return { icon: SiOpentelemetry, accentClassName: "text-[#425cc7]" };
  }

  if (normalized.includes("grafana")) {
    return { icon: SiGrafana, accentClassName: "text-[#f46800]" };
  }

  if (normalized.includes("pagerduty")) {
    return { icon: SiPagerduty, accentClassName: "text-[#06AC38]" };
  }

  if (normalized.includes("kafka")) {
    return { icon: SiApachekafka, accentClassName: "text-[#231F20]" };
  }

  if (normalized.includes("prometheus")) {
    return { icon: SiPrometheus, accentClassName: "text-[#e6522c]" };
  }

  if (normalized.includes("hubspot")) {
    return { icon: SiHubspot, accentClassName: "text-[#ff7a59]" };
  }

  if (normalized.includes("slack")) {
    return { icon: SiSlack, accentClassName: "text-[#4a154b]" };
  }

  if (normalized.includes("airtable")) {
    return { icon: SiAirtable, accentClassName: "text-[#fcb400]" };
  }

  if (normalized.includes("webhook") || normalized.includes("api")) {
    return { icon: FaLink, accentClassName: "text-[#2563eb]" };
  }

  if (normalized.includes("observability") || normalized.includes("monitor")) {
    return { icon: FaChartLine, accentClassName: "text-[#0f766e]" };
  }

  if (normalized.includes("ci/cd") || normalized.includes("cicd") || normalized.includes("pipeline")) {
    return { icon: FaCodeBranch, accentClassName: "text-[#0f766e]" };
  }

  if (normalized.includes("motion") || normalized.includes("framer")) {
    return { icon: SiFramer, accentClassName: "text-[#2563eb]" };
  }

  if (normalized.includes("tailwind")) {
    return { icon: SiTailwindcss, accentClassName: "text-[#06b6d4]" };
  }

  if (normalized.includes("project") || normalized.includes("delivery")) {
    return { icon: FaDiagramProject, accentClassName: "text-[#2f4858]" };
  }

  if (normalized.includes("automation")) {
    return { icon: FaWandMagicSparkles, accentClassName: "text-[#7c3aed]" };
  }

  if (normalized.includes("service") || normalized.includes("gateway")) {
    return { icon: FaServer, accentClassName: "text-[#0f766e]" };
  }

  return FALLBACK_VISUAL;
}

export function getToolBrandColor(toolName: string): string {
  const { accentClassName } = getToolVisual(toolName);
  return extractHexFromClassName(accentClassName) ?? "#2f4858";
}