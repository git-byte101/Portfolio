export interface ProfileSettingsRecord {
  id: string;
  name: string;
  sidebarFootnote: string;
  dashboardTitle: string;
  dashboardSubtitle: string;
  profilePhotoSrc: string;
  overviewHeading: string;
  overviewIntro: string;
  learnerHeading: string;
  learnerIntro: string;
  availabilityText: string;
  targetText: string;
  workStyleText: string;
  foundationAreas: string[];
  contactHeading: string;
  contactIntro: string;
  contactBio: string;
  contactHighlights: string[];
}

export interface ExperienceRecord {
  id: string;
  period: string;
  role: string;
  company: string;
  summary: string;
  highlights: string[];
  sortOrder: number;
}

export interface SocialLinkRecord {
  id: string;
  label: string;
  href: string;
  sortOrder: number;
}

export interface ToolBadgeRecord {
  id: string;
  name: string;
  sortOrder: number;
}

export interface ResumeRecord {
  id: string;
  title: string;
  summary: string;
  fileUrl: string;
  fileName: string;
  isActive: boolean;
  sortOrder: number;
}
