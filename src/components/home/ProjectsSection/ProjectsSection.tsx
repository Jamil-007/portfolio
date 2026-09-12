"use client";

import { forwardRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { ProjectImageModal } from "@/components/home/ProjectImageModal/ProjectImageModal";
import type { ProjectsSectionData } from "@/lib/types";

interface ProjectsSectionProps {
  content: ProjectsSectionData;
}

export const ProjectsSection = forwardRef<HTMLElement, ProjectsSectionProps>(
  function ProjectsSection({ content }, ref) {
    return (
      <section
        id="projects"
        ref={ref}
        className="snap-section px-6 sm:px-8 lg:px-16 py-10 lg:py-0 lg:flex lg:flex-col lg:justify-center opacity-0"
      >
        {/* `section-stack` / `row-list` / `section-row` set a vertical
            rhythm that shrinks on short windows — see globals.css. */}
        <div className="section-stack max-w-4xl mx-auto w-full">
          <h2 className="text-3xl sm:text-4xl font-light">{content.heading}</h2>

          <div className="row-list">
            {content.items.map((project) => (
              <div
                key={project.id}
                className="section-row group grid lg:grid-cols-12 gap-4 sm:gap-6 border-b border-border/50 hover:border-border transition-colors duration-500"
              >
                {/* Where the reference design puts a year, we put the thumbnail.
                    The links sit under it: this column is the shortest of the
                    three, so they cost the row no extra height. */}
                <div className="lg:col-span-2 flex flex-col gap-2">
                  <ProjectImageModal project={project} />
                  {(project.liveUrl || project.repositoryUrl) && (
                    <div className="flex items-center gap-3">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-0.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors duration-300"
                        >
                          LIVE
                          <ArrowUpRight className="w-3 h-3" />
                        </a>
                      )}
                      {project.repositoryUrl && (
                        <a
                          href={project.repositoryUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-0.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors duration-300"
                        >
                          CODE
                          <ArrowUpRight className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  )}
                </div>

                <div className="lg:col-span-6 space-y-2">
                  <div>
                    <h3 className="text-lg font-medium">{project.title}</h3>
                    <div className="text-muted-foreground text-sm">{project.subtitle}</div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed text-sm max-w-lg">
                    {project.description}
                  </p>
                </div>

                <div className="lg:col-span-4 flex flex-wrap gap-x-4 gap-y-2 lg:justify-end content-start mt-2 lg:mt-0">
                  {project.tech.map((tech) => (
                    <span key={tech} className="text-sm text-muted-foreground">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
);
