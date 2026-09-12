import type { PortfolioData } from "./types";

// Single source of truth for every word and image on the site.
// There is no CMS, database, or admin panel — edit this file and redeploy.
//
// Content is drawn from Jamil's resume (Makati, Philippines). Thumbnails live
// in `public/projects/<name>.png` and are referenced as `/projects/<name>.png`.
// Tech labels are plain display strings: there is no registry to register them
// in, and a project with no thumbnail falls back to an initials tile.
//
// TODO(jamil): the two values marked PLACEHOLDER below are guesses — the DICT
// start date and the projects date range.
//
// The hero reuses `connect.links` and `connect.email` for its icon row, so
// GitHub/LinkedIn/email are defined once, under `connect`.

export const portfolioData: PortfolioData = {
  intro: {
    firstName: "Jamil",
    lastName: "Orata",
    tagline:
      "AI engineer working on agentic AI, RAG systems, multi-agent workflows, and evaluation.",
    role: "AI Engineer",
    availability: "",
    location: "Makati, Philippines",
    profileImage: "/jamilorata.png",
    coverImage: "/cover.jpg", // low-poly wireframe banner; set to "" for a plain gradient
    focus: [
      "Agentic AI",
      "RAG",
      "LLM Applications",
      "Multi-Agent Systems",
      "Automation",
      "Cloud",
    ],
  },

  experience: {
    heading: "Experience",
    dateRange: "2024 — Present",
    items: [
      {
        id: "dict",
        period: "2025 — Present", // PLACEHOLDER: matches intro.period
        role: "AI Engineer",
        company: "Department of Information and Communications Technology",
        description:
          "Lead DICT's AI technical unit as architect and hands-on developer, directing 8 engineers building AI applications and automations for government agencies.",
        tech: [
          "Google ADK",
          "LangGraph",
          "LangChain",
          "RAG",
          "FastAPI",
          "Next.js",
          "GCP",
          "Python",
        ],
      },
      {
        id: "depdev",
        period: "Mar 2024 — Oct 2025",
        role: "AI and Data Engineer",
        company: "Department of Economy, Planning and Development",
        description:
          "Built DEPDev's AI knowledge assistant, which answers staff questions from the agency's own documents. Reworked how it searched those documents and tested it case by case until the answers were accurate and follow-up questions worked.",
        tech: ["LlamaIndex", "Docling", "PostgreSQL", "pgvector", "Python"],
      },
      {
        id: "apptitude",
        period: "Jul 2024 — Mar 2025",
        role: "Software Engineer",
        company: "Apptitude",
        description:
          "Built and maintained backend services for a Learning Management System: REST APIs, database models, and the integrations that kept data moving reliably between frontend and backend.",
        tech: ["PostgreSQL", "Python", "REST APIs"],
      },
    ],
  },

  projects: {
    heading: "Featured Projects",
    dateRange: "2022 — 2026", // PLACEHOLDER: adjust to your real range
    // Exactly three: the section renders every item with no pager, and four
    // rows no longer fit one screen.
    items: [
      {
        id: "mydict-superapp",
        title: "myDICT SuperApp",
        subtitle: "Government Services Platform",
        description:
          "One place for DICT employees to time in, file leave, and request approvals. A built-in assistant answers questions about HR policy and an employee's own records.",
        image: "/projects/mydict-superapp.png",
        tech: ["Next.js", "TypeScript", "LangGraph", "FastAPI", "Python", "GCP"],
        liveUrl: "https://my.dict.gov.ph/",
        repositoryUrl: "https://github.com/Jamil-007/mydict-portal",
      },
      {
        id: "aralai",
        title: "AralAI",
        subtitle: "AI-Integrated Classroom",
        description:
          "A classroom app where students ask questions about their own course materials and get answers with the source shown. Teachers upload the materials and track how their class is doing.",
        image: "/projects/aralai.png",
        tech: ["FastAPI", "Python", "pgvector", "Supabase", "Gemini", "Next.js"],
        liveUrl: "https://aral-ai.vercel.app",
        repositoryUrl: "https://github.com/Jamil-007/aral-ai",
      },
      {
        id: "depdev-knowledge-hub",
        title: "DEPDev Knowledge Hub",
        subtitle: "AI Knowledge Assistant",
        description:
          "An assistant that answers staff questions using DEPDev's own documents, with a source link for every answer. Handles follow-up questions in the same conversation.",
        image: "/projects/depdev-knowledge-hub.png",
        tech: ["LlamaIndex", "Docling", "PostgreSQL", "pgvector", "Python"],
        liveUrl: "https://ai.depdev.gov.ph",
        repositoryUrl: "https://github.com/Jamil-007/depdev-ai",
      },
    ],
  },

  connect: {
    heading: "Let's connect",
    description: "", // empty hides the paragraph — heading and email only
    email: "jamilorata@gmail.com",
    links: [
      {
        id: "github",
        name: "GitHub",
        handle: "@Jamil-007",
        url: "https://github.com/Jamil-007",
      },
      {
        id: "linkedin",
        name: "LinkedIn",
        handle: "jamilorata",
        url: "https://www.linkedin.com/in/jamilorata/",
      },
    ],
  },

  footer: {
    copyright: "© 2026 Jamil Orata",
    credit: "BS Computer Engineering, UP Diliman — Magna Cum Laude",
  },
};
