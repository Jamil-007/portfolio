export type Project = {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  type: string;
  technologies: string[];
  skills?: string[];
  repositoryUrl?: string;
  liveUrl?: string;
  coverImage?: string;
  // The long-form description body lives in `content/projects/<slug>.md`,
  // loaded by `getProjectBody(slug)` and rendered on the detail page.
};

export type Technology = {
  id: string;
  name: string;
  icon?: string;
};

export type Profile = {
  name: string;
  photoUrl?: string;
  githubUrl: string;
  linkedinUrl: string;
  email: string;
};

export type ProjectType = {
  id: string;
  label: string;
};

export type Skill = {
  id: string;
  name: string;
  iconKey: string;
};

export type PortfolioData = {
  profile: Profile;
  favoriteProjectSlug: string;
  projects: Project[];
  technologies: Technology[];
  skills: Skill[];
  projectTypes: ProjectType[];
};
