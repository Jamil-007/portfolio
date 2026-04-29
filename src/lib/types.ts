export type ProjectType = string;

export type Visibility = "draft" | "published";

export type Project = {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  type: ProjectType;
  technologies: string[];
  featured: boolean;
  repositoryUrl?: string;
  liveUrl?: string;
  coverImage?: string;
  screenshots?: string[];
  skills?: string[];
  role: string;
  visibility: Visibility;
  createdAt?: string;
  updatedAt?: string;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: string;
  content: string;
  tags: string[];
  publishedAt?: string;
  status: Visibility;
  relatedProjects?: string[];
  createdAt?: string;
  updatedAt?: string;
};

export type Technology = {
  id: string;
  name: string;
  icon?: string;
};

export type Profile = {
  name: string;
  role: string;
  shortBio: string;
  about: string;
  photoUrl?: string;
  funFact: string;
  resumeUrl: string;
  githubUrl: string;
  linkedinUrl: string;
  email: string;
  location?: string;
};

export type PortfolioData = {
  profile: Profile;
  projects: Project[];
  blogPosts: BlogPost[];
  technologies: Technology[];
  settings: PortfolioSettings;
};

export type SettingsOption = {
  id: string;
  label: string;
};

export type SkillSetting = {
  id: string;
  name: string;
  iconKey: string;
};

export type PortfolioSettings = {
  projectTypes: SettingsOption[];
  projectRoles: SettingsOption[];
  skills: SkillSetting[];
};
