"use client";

import Image from "next/image";
import { Modal } from "@heroui/react";
import { X } from "lucide-react";
import type { Project } from "@/lib/types";

interface ProjectImageModalProps {
  project: Project;
}

/**
 * The row thumbnail, clickable, with a lightbox for the full-size screenshot.
 *
 * HeroUI's Modal wraps react-aria-components, so focus trapping, Escape to
 * close, click-outside, and page scroll locking all come for free — worth the
 * compound markup versus a hand-rolled overlay.
 */
const TILE = "w-20 h-20 lg:w-24 lg:h-24 rounded-lg border border-border/60";

export function ProjectImageModal({ project }: ProjectImageModalProps) {
  // Nothing to zoom into without a screenshot, so render a static tile.
  if (!project.image) {
    return (
      <div
        aria-hidden
        className={`${TILE} bg-muted-foreground/10 flex items-center justify-center text-sm font-mono text-muted-foreground`}
      >
        {initials(project.title)}
      </div>
    );
  }

  return (
    <Modal>
      <Modal.Trigger>
        <button
          type="button"
          aria-label={`View a larger screenshot of ${project.title}`}
          className={`${TILE} relative block overflow-hidden bg-muted-foreground/10 cursor-zoom-in`}
        >
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="96px"
            className="object-cover opacity-80 group-hover:opacity-100 hover:scale-105 transition-all duration-500"
          />
        </button>
      </Modal.Trigger>

      <Modal.Backdrop>
        <Modal.Container size="lg" placement="center" className="project-lightbox">
          {/* The width cap lives on `.modal__dialog--lg`, not the container, so
              the override has to be on the dialog too. */}
          <Modal.Dialog className="project-lightbox relative outline-none">
            <Modal.CloseTrigger
              aria-label="Close"
              className="absolute top-3 right-3 z-10 rounded-full bg-background/80 p-1.5 text-muted-foreground hover:text-foreground backdrop-blur-sm transition-colors duration-300"
            >
              <X className="w-4 h-4" />
            </Modal.CloseTrigger>

            <Image
              src={project.image}
              alt={`${project.title} screenshot`}
              width={1600}
              height={1000}
              sizes="(min-width: 1024px) 900px, 100vw"
              className="w-full h-auto rounded-lg"
            />

            <div className="pt-3">
              <div className="text-sm">{project.title}</div>
              <div className="text-xs text-muted-foreground">{project.subtitle}</div>
            </div>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

/** "EDSA Bus Carousel Optimization" -> "EB". Two letters keeps the tile legible. */
function initials(title: string): string {
  return title
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}
