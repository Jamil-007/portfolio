import { notFound } from "next/navigation";
import { portfolioData } from "@/lib/portfolio-data";
import { getProjectBody } from "@/lib/project-content";
import { ProjectDetailPage } from "@/components/projects/ProjectDetailPage/ProjectDetailPage";

export function generateStaticParams() {
  return portfolioData.projects.map((project) => ({ slug: project.slug }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = portfolioData.projects.find((item) => item.slug === slug);
  if (!project) {
    notFound();
  }
  const body = getProjectBody(slug);
  return <ProjectDetailPage slug={slug} body={body} />;
}
