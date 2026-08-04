export type MenuItem = {
  id: number;
  group: "public" | "admin";
  parentId: number | null;
  section: string;
  label: string;
  path: string;
  icon: string;
  sortOrder: number;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
  children?: MenuItem[];
};

export type PaginationMeta = {
  total: number;
  limit: number;
  nextCursor: string | null;
  prevCursor: string | null;
};

export type PostSummary = {
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  publishedAt: string;
  readingTimeMinutes: number;
  status: "draft" | "scheduled" | "published";
  coverImageUrl: string;
};

export type Post = PostSummary & {
  contentHtml: string;
};

export type ContactPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type ShortLink = {
  code: string;
  targetUrl: string;
  clickCount: number;
  expiresAt: string | null;
  isActive: boolean;
  lastClickedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ProjectLinks = {
  live?: string;
  repo?: string;
};

export type ProjectSummary = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  role: string;
  year: number;
  featured: boolean;
  links: ProjectLinks;
  status: "active" | "in-progress" | "archived";
};

export type Project = ProjectSummary & {
  longDescription: string[];
  highlights: string[];
};

// Profile types

export type SkillGroup = {
  category: string;
  skills: string[];
};

export type ExperienceEntry = {
  role: string;
  organization: string;
  location: string;
  startDate: string;
  endDate: string | "Present";
  summary?: string;
  highlights: string[];
};

export type EducationEntry = {
  degree: string;
  institution: string;
  location: string;
  period: string;
  highlights: string[];
};

export type CertificationEntry = {
  name: string;
  issuer: string;
  date: string;
};

export type AwardEntry = {
  name: string;
  issuer: string;
  year: string;
  description?: string;
};

export type VolunteeringEntry = {
  role: string;
  organization: string;
  location: string;
  year: string;
  highlights: string[];
};

export type Profile = {
  name: string;
  title: string;
  location: string;
  website: string;
  tagline: string;
  bio: string[];
  skills: SkillGroup[];
  experience: ExperienceEntry[];
  education: EducationEntry[];
  certifications: CertificationEntry[];
  awards: AwardEntry[];
  volunteering: VolunteeringEntry[];
  languages: { name: string; level: string }[];
  interests: string[];
  createdAt: string;
};

