export type ProjectCategory = "AI Automation" | "Programming" | "NoSQL";

export type ProjectStatus = "Production" | "Scaling" | "R&D";

export interface ProjectRecord {
  id: string;
  title: string;
  slug?: string;
  category: ProjectCategory;
  techStack: string[];
  version: string;
  status: ProjectStatus;
  summary: string;
  thumbnailSrc: string;
  repoUrl?: string;
  liveUrl?: string;
  featured?: boolean;
  sortOrder?: number;
}
