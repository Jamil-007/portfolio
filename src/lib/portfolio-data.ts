import type { PortfolioData } from "./types";

// Edit this file to update portfolio content.
// Public pages import `portfolioData` directly; there is no admin panel or CMS.
//
// To add a project: append to `projects`. To change which one is highlighted on
// the homepage as "My favorite project.", set `favoriteProjectSlug` to its slug.
// Drop project cover images into `public/projects/<slug>.png` and reference
// them as `/projects/<slug>.png`.

export const portfolioData: PortfolioData = {
  profile: {
    name: "Jamil Orata",
    photoUrl: "/jamilorata.png",
    githubUrl: "https://github.com/Jamil-007",
    linkedinUrl: "https://www.linkedin.com/in/jamilorata/",
    email: "jamilorata@gmail.com",
  },

  favoriteProjectSlug: "aralai",

  projects: [
    {
      id: "aralai",
      slug: "aralai",
      title: "AralAI",
      type: "webApp",
      shortDescription:
        "An AI-powered learning platform that turns any lesson material into a personal AI tutor, auto-generated quizzes, flashcards, and study guides — all grounded in the teacher's own uploaded content.",
      technologies: ["github", "nextjs", "python"],
      skills: ["aiIntegration", "fullStack", "apiDev"],
      repositoryUrl: "https://github.com/Jamil-007/aral-ai",
      liveUrl: "https://aral-ai.vercel.app",
      coverImage: "/projects/aralai.png",
    },
    {
      id: "jamil-travel",
      slug: "jamil-travel",
      title: "Jamil Travel",
      type: "webApp",
      shortDescription:
        "A 3D-style, mobile-first travel portfolio. A voxel-popped, pannable map of every place I've visited — tap a province to slide up photos, ratings, and notes for each spot.",
      technologies: ["tailwind", "nextjs"],
      skills: ["fullStack"],
      repositoryUrl: "https://github.com/Jamil-007/jamil-travel",
      liveUrl: "https://jamil-travel.vercel.app",
      coverImage: "/projects/jamil-travel.png",
    },
    {
      id: "my-portfolio",
      slug: "my-portfolio",
      title: "My Portfolio",
      type: "webApp",
      shortDescription:
        "The site you're on right now. A one-page editorial portfolio built with Next.js, Tailwind, and a hand-rolled static content model edited directly in code.",
      technologies: ["github", "tailwind", "nextjs", "typescript"],
      skills: ["fullStack"],
      repositoryUrl: "https://github.com/Jamil-007/portfolio",
      coverImage: "/projects/my-portfolio.png",
    },
    {
      id: "philippines-schools-connectivity",
      slug: "philippines-schools-connectivity",
      title: "Philippines Schools Internet Connectivity Monitor",
      type: "webApp",
      shortDescription:
        "Interactive Next.js dashboard for monitoring internet connectivity across DepEd schools, CHED higher-education institutions, and Bayanihan SIM project sites in the Philippines. Built with Leaflet.js and backed by Cloud SQL PostgreSQL, with a password-protected admin page for inline editing of school records.",
      technologies: ["nextjs", "react", "nodejs", "javascript", "postgresql", "googlecloudsql", "leaflet", "vercel", "python", "papaparse", "leafletmarkercluster", "html", "css"],
      skills: ["fullStack", "apiDev", "dbDesign", "authentication", "geospatialVisualization", "performanceOptimization", "cloud", "dataPipelines", "responsiveUi", "resilientDataLoading"],
      repositoryUrl: "https://github.com/Jamil-007/deped-schools-connectivity",
      liveUrl: "https://deped-schools-connectivity.vercel.app",
      coverImage: "/projects/philippines-schools-connectivity.png",
    },
  ],

  technologies: [
    { id: "css", name: "CSS", icon: "https://cdn.simpleicons.org/css/1572B6" },
    { id: "docker", name: "Docker", icon: "https://cdn.simpleicons.org/docker/2496ED" },
    { id: "fastapi", name: "FastAPI", icon: "https://cdn.simpleicons.org/fastapi/009688" },
    { id: "firebase", name: "Firebase", icon: "https://cdn.simpleicons.org/firebase/FFCA28" },
    { id: "gcp", name: "GCP", icon: "https://cdn.simpleicons.org/googlecloud/4285F4" },
    { id: "github", name: "GitHub", icon: "https://cdn.simpleicons.org/github/181717" },
    { id: "gitlab", name: "GitLab", icon: "https://cdn.simpleicons.org/gitlab/FC6D26" },
    { id: "googlecloudsql", name: "Google Cloud SQL", icon: "https://cdn.simpleicons.org/googlecloud/4285F4" },
    { id: "html", name: "HTML", icon: "https://cdn.simpleicons.org/html5/E34F26" },
    { id: "javascript", name: "JavaScript", icon: "https://cdn.simpleicons.org/javascript/F7DF1E" },
    { id: "langchain", name: "LangChain", icon: "https://cdn.simpleicons.org/langchain/1C3C3C" },
    { id: "leaflet", name: "Leaflet", icon: "https://cdn.simpleicons.org/leaflet/199900" },
    { id: "leafletmarkercluster", name: "Leaflet.markercluster" },
    { id: "llamachain", name: "LlamaChain" },
    { id: "nextjs", name: "Next.js", icon: "https://cdn.simpleicons.org/nextdotjs/000000" },
    { id: "nodejs", name: "Node.js", icon: "https://cdn.simpleicons.org/nodedotjs/5FA04E" },
    { id: "papaparse", name: "Papa Parse" },
    { id: "postgresql", name: "PostgreSQL", icon: "https://cdn.simpleicons.org/postgresql/4169E1" },
    { id: "python", name: "Python", icon: "https://cdn.simpleicons.org/python/3776AB" },
    { id: "react", name: "React", icon: "https://cdn.simpleicons.org/react/61DAFB" },
    { id: "tailwind", name: "Tailwind CSS", icon: "https://cdn.simpleicons.org/tailwindcss/06B6D4" },
    { id: "typescript", name: "TypeScript", icon: "https://cdn.simpleicons.org/typescript/3178C6" },
    { id: "vercel", name: "Vercel", icon: "https://cdn.simpleicons.org/vercel/000000" },
  ],

  skills: [
    { id: "aiIntegration", name: "AI Integration", iconKey: "Bot" },
    { id: "fullStack", name: "Full-stack Apps", iconKey: "Layers3" },
    { id: "apiDev", name: "API Development", iconKey: "Code2" },
    { id: "dbDesign", name: "Database Design", iconKey: "Database" },
    { id: "cloud", name: "Cloud Deployment", iconKey: "Cloud" },
    { id: "automation", name: "Automation", iconKey: "Wrench" },
    { id: "versionControl", name: "Version Control", iconKey: "GitBranch" },
    { id: "authentication", name: "Authentication", iconKey: "Sparkles" },
    { id: "geospatialVisualization", name: "Geospatial Visualization", iconKey: "Sparkles" },
    { id: "performanceOptimization", name: "Performance Optimization", iconKey: "Wrench" },
    { id: "dataPipelines", name: "Data Pipelines", iconKey: "Database" },
    { id: "responsiveUi", name: "Responsive UI", iconKey: "Sparkles" },
    { id: "resilientDataLoading", name: "Resilient Data Loading", iconKey: "Database" },
  ],

  projectTypes: [
    { id: "webApp", label: "Web app" },
    { id: "mobile", label: "Mobile" },
    { id: "tool", label: "Tool" },
    { id: "experiment", label: "Experiment" },
  ],
};
