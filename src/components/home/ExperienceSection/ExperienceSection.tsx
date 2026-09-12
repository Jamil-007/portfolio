"use client";

import { forwardRef } from "react";
import type { ExperienceSectionData } from "@/lib/types";

interface ExperienceSectionProps {
  content: ExperienceSectionData;
}

export const ExperienceSection = forwardRef<HTMLElement, ExperienceSectionProps>(
  function ExperienceSection({ content }, ref) {
    return (
      <section
        id="experience"
        ref={ref}
        className="snap-section px-6 sm:px-8 lg:px-16 py-10 lg:py-0 lg:flex lg:flex-col lg:justify-center opacity-0"
      >
        <div className="section-stack max-w-4xl mx-auto w-full">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <h2 className="text-3xl sm:text-4xl font-light">{content.heading}</h2>
            <div className="text-sm text-muted-foreground font-mono">{content.dateRange}</div>
          </div>

          <div className="row-list">
            {content.items.map((job) => (
              <div
                key={job.id}
                className="section-row group grid lg:grid-cols-12 gap-4 sm:gap-6 border-b border-border/50 hover:border-border transition-colors duration-500"
              >
                {/* Same slot the project rows use for a thumbnail. */}
                <div className="lg:col-span-2">
                  <div className="text-sm font-mono text-muted-foreground group-hover:text-foreground transition-colors duration-500">
                    {job.period}
                  </div>
                </div>

                <div className="lg:col-span-6 space-y-2">
                  <div>
                    <h3 className="text-lg font-medium">{job.role}</h3>
                    <div className="text-muted-foreground text-sm">{job.company}</div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed text-sm max-w-lg">
                    {job.description}
                  </p>
                </div>

                <div className="lg:col-span-4 flex flex-wrap gap-x-4 gap-y-2 lg:justify-end content-start mt-2 lg:mt-0">
                  {job.tech.map((tech) => (
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
