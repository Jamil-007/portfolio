"use client";

import Image from "next/image";
import { forwardRef } from "react";
import { Chip } from "@heroui/react";
import { Mail } from "lucide-react";
import { SOCIAL_ICONS } from "@/lib/social-icons";
import type { IntroSection, SocialLink } from "@/lib/types";

// Only socials with an icon appear in this row; the Connect section lists them all.
const ICON_LINK =
  "inline-flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors duration-300";

interface HeroSectionProps {
  content: IntroSection;
  socials: SocialLink[];
  email: string;
}

export const HeroSection = forwardRef<HTMLElement, HeroSectionProps>(function HeroSection(
  { content, socials, email },
  ref
) {
  return (
    <header
      id="intro"
      ref={ref}
      className="snap-section px-6 sm:px-8 lg:px-16 py-10 lg:py-0 lg:flex lg:items-center opacity-0"
    >
      <div className="max-w-4xl mx-auto w-full">
        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-5 lg:gap-x-12 lg:gap-y-6 w-full">
          <div className="lg:col-start-4 lg:col-span-2 lg:row-start-1">
            <div className="relative mb-10">
              <div className="rounded-xl overflow-hidden border border-border h-28 relative bg-gradient-to-br from-muted-foreground/20 to-muted-foreground/5">
                {content.coverImage && (
                  <Image
                    src={content.coverImage}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 320px, 100vw"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="absolute -bottom-8 left-3">
                <Image
                  src={content.profileImage}
                  alt={`${content.firstName} ${content.lastName}`}
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-full object-cover border-3 border-background shadow-md"
                  priority
                />
              </div>
            </div>
          </div>

          <div className="lg:col-start-1 lg:col-span-3 lg:row-start-1 lg:row-span-4 lg:flex lg:flex-col lg:justify-center space-y-4 sm:space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight">
              {content.firstName}
              <br />
              <span className="text-muted-foreground">{content.lastName}</span>
            </h1>

            <div className="space-y-4 max-w-md">
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                {content.tagline}
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 text-sm text-muted-foreground">
                {content.availability && <span>{content.availability}</span>}
                <span>{content.location}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-start-4 lg:col-span-2 lg:row-start-2">
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground font-mono">WORK</div>
              <div className="text-foreground">{content.role}</div>

              <div className="flex items-center gap-4 pt-1">
                {socials.map((social) => {
                  const Icon = SOCIAL_ICONS[social.id];
                  if (!Icon) return null;
                  return (
                    <a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={social.name}
                      className={ICON_LINK}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
                <a href={`mailto:${email}`} aria-label="Email" className={ICON_LINK}>
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-start-4 lg:col-span-2 lg:row-start-3">
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground font-mono">FOCUS</div>
              <div className="flex flex-wrap gap-2">
                {content.focus.map((item) => (
                  <Chip
                    key={item}
                    size="sm"
                    variant="tertiary"
                    className="border border-border rounded-full hover:border-muted-foreground/50 transition-colors duration-300 px-3 py-1 text-xs"
                  >
                    {item}
                  </Chip>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
});
