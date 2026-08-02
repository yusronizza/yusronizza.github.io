export type PostSummary = {
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  publishedAt: string;
  readingTimeMinutes: number;
};

export type Post = PostSummary & {
  content: string;
};

export type PostMeta = {
  total: number;
  limit: number;
  nextCursor: string | null;
  prevCursor: string | null;
};

export type PostList = {
  posts: PostSummary[];
  meta: PostMeta;
};

export type TagCount = {
  tag: string;
  count: number;
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
};

export type Project = ProjectSummary & {
  longDescription: string[];
  highlights: string[];
};

export type Tool = {
  slug: string;
  title: string;
  description: string;
};
