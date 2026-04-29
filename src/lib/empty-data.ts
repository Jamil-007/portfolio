import type { PortfolioData, Profile } from "./types";

export const emptyProfile: Profile = {
  name: "",
  role: "",
  shortBio: "",
  about: "",
  funFact: "",
  resumeUrl: "",
  githubUrl: "",
  linkedinUrl: "",
  email: "",
};

export const emptyPortfolioData: PortfolioData = {
  profile: emptyProfile,
  projects: [],
  blogPosts: [],
  technologies: [],
  settings: {
    projectTypes: [],
    projectRoles: [],
    skills: [],
  },
};
