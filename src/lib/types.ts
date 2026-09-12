export type IntroSection = {
  firstName: string;
  lastName: string;
  tagline: string;
  role: string;
  availability: string;
  location: string;
  profileImage: string;
  /** Banner behind the avatar. Leave empty to fall back to a plain gradient. */
  coverImage: string;
  /** Short "FOCUS" chips beside the name. Plain strings — no registry. */
  focus: string[];
};

export type ExperienceItem = {
  id: string;
  /** Shown in the left column, e.g. "Mar 2024 — Oct 2025". */
  period: string;
  role: string;
  company: string;
  description: string;
  /** Free-text labels. Deliberately not ids — there is no technology registry. */
  tech: string[];
};

export type ExperienceSectionData = {
  heading: string;
  dateRange: string;
  items: ExperienceItem[];
};

export type Project = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  /** Small square-ish thumbnail shown where the reference design puts a year.
   *  Omit it and the row falls back to an initials tile. */
  image?: string;
  /** Free-text labels. Deliberately not ids — there is no technology registry. */
  tech: string[];
  liveUrl?: string;
  repositoryUrl?: string;
};

export type ProjectsSectionData = {
  heading: string;
  items: Project[];
};

export type SocialLink = {
  id: string;
  name: string;
  handle: string;
  url: string;
};

export type ConnectSectionData = {
  heading: string;
  description: string;
  email: string;
  links: SocialLink[];
};

export type FooterContent = {
  copyright: string;
  credit: string;
};

export type PortfolioData = {
  intro: IntroSection;
  experience: ExperienceSectionData;
  projects: ProjectsSectionData;
  connect: ConnectSectionData;
  footer: FooterContent;
};
