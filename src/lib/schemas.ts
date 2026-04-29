import { z } from "zod";

export const projectSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  shortDescription: z.string().min(1),
  longDescription: z.string().min(1),
  type: z.string().min(1),
  technologies: z.array(z.string()),
  featured: z.boolean(),
  repositoryUrl: z.string().url().optional().or(z.literal("")),
  liveUrl: z.string().url().optional().or(z.literal("")),
  coverImage: z.string().optional(),
  screenshots: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
  role: z.string().min(1),
  visibility: z.enum(["draft", "published"]),
});

export const blogPostSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  excerpt: z.string().min(1),
  coverImage: z.string().optional(),
  content: z.string().min(1),
  tags: z.array(z.string()),
  publishedAt: z.string().optional(),
  status: z.string().min(1),
  relatedProjects: z.array(z.string()).optional(),
});

export const technologySchema = z.object({
  name: z.string().min(1),
  icon: z.string().optional(),
  featured: z.boolean(),
});

export const profileSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  shortBio: z.string().min(1),
  about: z.string().min(1),
  photoUrl: z.string().optional(),
  funFact: z.string().min(1),
  resumeUrl: z.string(),
  githubUrl: z.string(),
  linkedinUrl: z.string(),
  email: z.string().email(),
  location: z.string().optional(),
});
