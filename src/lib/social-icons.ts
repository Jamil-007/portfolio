import { Github, Linkedin, type LucideIcon } from "lucide-react";

/** Socials with no entry here still render — just without an icon. */
export const SOCIAL_ICONS: Record<string, LucideIcon> = {
  github: Github,
  linkedin: Linkedin,
};
