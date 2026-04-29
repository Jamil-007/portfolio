# Portfolio App Plan

## Product Goal

Build a simple, recruiter-friendly portfolio inspired by `DESIGN.md`. The site should feel clean, direct, and easy to scan, while still letting me edit projects, blogs, tech stack, profile content, and project status directly inside the app.

The core idea: this is not only a portfolio website. It is a small personal content system for tracking, publishing, and analyzing my work.

## Main Audience

Primary audience:
- Recruiters
- Hiring managers
- Technical interviewers
- People quickly checking whether my experience matches their role

Secondary audience:
- Other developers
- Future collaborators
- Readers of my blog posts

The site should answer these questions quickly:
- Who am I?
- What have I built?
- What technologies do I use?
- What kind of projects do I usually make?
- Which projects are finished, in progress, or actively maintained?
- Can I write clearly about technical work?

## Recommended Tech Stack

Use this stack:

- **Frontend:** Next.js App Router + TypeScript
- **Styling:** Tailwind CSS, with custom design tokens based on `DESIGN.md`
- **Database:** Cloud Firestore
- **Auth:** Firebase Authentication
- **Admin Editing:** Custom `/admin` dashboard inside the app
- **Media:** Firebase Storage, or local/public images for the first version
- **Charts / Analytics UI:** Recharts
- **Deployment:** Vercel
- **Validation:** Zod
- **Forms:** React Hook Form for admin forms
- **Icons:** Lucide React

## Why This Stack

Next.js is a good fit because the portfolio needs SEO-friendly public pages, dynamic content, image optimization, and a clean deployment path.

Firestore is a good fit because I want browser-based in-app editing without managing a Postgres server. It is serverless and does not have the same free-project inactivity pause concern that made Supabase feel risky for this portfolio.

Firebase Auth is a good fit because the admin dashboard only needs a private login for me. The first version can keep auth simple with one allowed admin email.

A custom admin dashboard is better than a full CMS for this project because the content model is small and specific: projects, blogs, technologies, profile, and analytics. Building only the fields I need keeps the app lighter and easier to understand.

Recharts is enough for the analytics views because the charts are simple: project counts, project type breakdowns, tech stack usage, status breakdowns, and yearly activity.

Vercel is the deployment target because it works naturally with Next.js and supports preview deployments.

## Firebase Notes

Firestore should be used for editable portfolio content:
- Projects
- Blog posts
- Technologies
- Profile/about content
- Site settings

Firebase Auth should protect admin routes and write operations.

Security rules matter. Public visitors should be able to read only published content. Only the admin user should be able to create, update, or delete content.

Recommended first auth rule:
- Only allow writes when the signed-in user's email matches my admin email.

Later, this can be upgraded to custom claims if I need multiple admin users.

## Core Features

### Public Portfolio

The public site should include:
- Short direct introduction
- Highlight that I started learning to code with Python at 12 years old
- Dynamic project count
- Featured projects
- All projects with filters
- Tech stack overview
- Project analytics section
- Blog list
- Individual blog pages
- Contact links

### Admin / Content Editing

The admin dashboard should allow me to manage:
- Projects
- Blog posts
- Technologies
- Profile/about content
- Featured content
- Images and screenshots

Admin should be private and require Firebase login.

Recommended admin routes:
- `/admin` - Admin overview
- `/admin/projects` - Manage projects
- `/admin/projects/new` - Add project
- `/admin/projects/[id]` - Edit project
- `/admin/blog` - Manage blog posts
- `/admin/blog/new` - Add blog post
- `/admin/blog/[id]` - Edit blog post
- `/admin/technologies` - Manage tech stack
- `/admin/profile` - Edit profile and links

### Project Analytics

Analytics should be generated from Firestore project data.

Examples:
- Total projects
- Completed projects
- In-progress projects
- Projects by type:
  - Web app
  - Mobile app
  - Full-stack app
  - API/backend
  - Automation/script
  - AI/tooling
  - Design/frontend experiment
- Projects by status:
  - Completed
  - In progress
  - Maintained
  - Archived
- Tech stack usage count
- Projects by year
- Featured project count

Charts should show useful hover breakdowns. For example, hovering over a tech stack chart should reveal which projects used that technology.

## Firestore Content Model

### Collection: `projects`

Each project document should have:
- `title`
- `slug`
- `shortDescription`
- `longDescription`
- `status`: completed, in-progress, maintained, archived
- `type`: web-app, mobile-app, full-stack-app, api-backend, automation-script, ai-tooling, design-frontend
- `technologies`: array of technology ids or names
- `startDate`
- `endDate`, optional
- `featured`
- `repositoryUrl`, optional
- `liveUrl`, optional
- `coverImage`, optional
- `screenshots`, optional
- `outcomes`
- `role`: solo, team, school, freelance, experiment
- `visibility`: draft, published
- `createdAt`
- `updatedAt`

### Collection: `blogPosts`

Each blog post document should have:
- `title`
- `slug`
- `excerpt`
- `coverImage`, optional
- `content`
- `tags`
- `publishedAt`
- `status`: draft, published
- `relatedProjects`, optional
- `createdAt`
- `updatedAt`

### Collection: `technologies`

Each technology document should have:
- `name`
- `slug`
- `category`: language, framework, database, tool, cloud, design, testing
- `icon`, optional
- `experienceLevel`, optional
- `featured`

### Document: `profile/main`

Profile content should include:
- `name`
- `role`
- `shortBio`
- `about`
- `photoUrl`
- `startedCodingAge`
- `resumeUrl`
- `githubUrl`
- `linkedinUrl`
- `email`
- `location`, optional

### Document: `settings/site`

Site settings should include:
- `siteTitle`
- `siteDescription`
- `featuredProjectLimit`
- `latestBlogLimit`
- `adminEmail`

## Suggested Pages

- `/` - One-page portfolio overview with anchored sections
- `/#projects` - Filterable project list
- `/#analytics` - Project analytics
- `/#writing` - Blog/writing previews
- `/#about` - Personal story and contact
- `/login` - Admin login
- `/admin` - Private dashboard

For recruiters, the homepage should contain the full public experience for now. They should be able to scan the portfolio by scrolling, with anchor navigation available for quick jumps.

## Homepage Structure

Recommended order:

1. **Hero**
   - Name
   - Short role statement
   - One direct sentence about what I build
   - Small note: started learning Python at 12
   - Links to projects, resume, GitHub, and contact

2. **Snapshot Metrics**
   - Total projects
   - Completed projects
   - In-progress projects
   - Main tech categories

3. **Featured Projects**
   - 3 to 6 best projects
   - Clear status badges
   - Tech tags
   - Live/repo links where available

4. **All Projects**
   - Filterable list
   - Clear status badges
   - Tech tags
   - Short outcomes

5. **Analytics**
   - Project type breakdown
   - Tech stack usage
   - Status breakdown
   - Yearly project activity

6. **Writing**
   - Latest posts shown inline
   - Keep excerpts and short content visible without opening separate pages

7. **About / Contact**
   - Short personal story
   - Direct contact links

## One-Page Considerations

The public portfolio should be a one-pager for the MVP because it reduces clicks and helps recruiters scan faster.

Important considerations:
- Keep the first viewport strong: name, role, short bio, project count, and direct links.
- Use anchor navigation instead of separate public pages.
- Keep `/admin` and `/login` separate because editing is a private workflow.
- Avoid making sections too long. Use filters, compact cards, and clear headings.
- Put enough detail in project cards so users do not need to open a project page.
- Keep old public routes redirecting to anchors so shared links do not feel broken.
- Revisit separate project/blog detail pages later if SEO, case studies, or long writing become important.

## Design Direction

Follow `DESIGN.md` closely:
- Warm white and pure white sections
- Near-black text
- Warm gray secondary text
- Thin whisper borders
- Very restrained shadows
- Small radius for buttons and controls
- Pill badges for statuses and tags
- Blue only for primary actions and links
- Clean recruiter-first layout

Avoid:
- Overly decorative landing-page sections
- Heavy gradients
- Huge marketing-style cards
- One-note dark or purple theme
- Too much animation
- Hiding important content behind interactions

The design should feel like a polished workspace: calm, clear, and useful.

## Important Decisions To Make First

Before building, decide:

1. **Firebase project setup**
   - Create a Firebase project.
   - Enable Firestore.
   - Enable Firebase Authentication.
   - Choose email/password or Google login for admin.

2. **Admin access**
   - Recommended: allow only my email to access `/admin`.
   - Add the same email in Firestore security rules.

3. **Image strategy**
   - MVP option: use image URLs or local images first.
   - Later option: add Firebase Storage uploads from the admin dashboard.

4. **Project taxonomy**
   - Decide the exact project types and statuses early.
   - This prevents messy analytics later.

5. **What counts as a project**
   - Decide whether experiments, school work, scripts, and unfinished builds count.
   - Recommended: include them if they show skill, but label them honestly.

6. **Recruiter priority**
   - Decide which 3 to 6 projects should be featured first.
   - The best projects should show problem-solving, technical range, and finished outcomes.

7. **Blog purpose**
   - Decide whether blogs are for technical tutorials, build logs, reflections, or case studies.
   - Recommended: start with project case studies because they directly support hiring.

8. **Resume strategy**
   - Decide whether the resume is a static PDF, generated from profile/project data, or both.
   - Recommended for MVP: static PDF link first.

9. **Analytics scope**
   - Keep analytics focused on portfolio/project data first.
   - Visitor analytics can be added later with Vercel Analytics, Plausible, or PostHog.

## MVP Scope

Build this first:

- Public homepage
- Firebase setup
- Firebase Auth login
- Protected admin dashboard
- Projects CRUD
- Blog posts CRUD
- Technologies CRUD
- Profile editor
- Featured projects section
- Dynamic project metrics
- Simple charts from Firestore project data
- Project detail pages
- Blog detail pages
- Basic responsive design
- SEO metadata
- Firestore security rules

Do not build these in the first version:
- Comments
- Newsletter
- Multi-user roles
- Complex visitor analytics
- Resume generator
- Theme switcher
- Overly complex animations
- Rich image upload workflow, unless Firebase Storage is quick to add

## Later Improvements

After MVP:
- Case study template for projects
- Search and filters
- Firebase Storage uploads
- Resume generator from Firestore data
- Visitor analytics
- Blog series
- Project timeline
- Public changelog for ongoing projects
- Draft preview
- Better image gallery for project screenshots
- Automated OG images
- Custom claims for multiple admins

## Success Criteria

The portfolio is successful if:
- A recruiter understands my skills in less than 30 seconds.
- I can add a new project from `/admin` without touching code.
- Analytics update automatically when project data changes.
- The design feels simple, polished, and consistent with `DESIGN.md`.
- The content stays honest about completed and in-progress work.
- The app is easy to extend later.
- Public users can only read published content.
- Only I can create, update, or delete content.

## Build Principle

Make the content model stable first, then build the UI around it.

If the Firestore documents are clean and consistent, the portfolio can keep changing without becoming hard to maintain.
