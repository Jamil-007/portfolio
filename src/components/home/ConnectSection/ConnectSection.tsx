"use client";

import { forwardRef, type ReactNode } from "react";
import { Button } from "@heroui/react";
import { ArrowUpRight, Mail, Moon, Sun } from "lucide-react";
import { SOCIAL_ICONS } from "@/lib/social-icons";
import type { ConnectSectionData, FooterContent } from "@/lib/types";

interface ConnectSectionProps {
  content: ConnectSectionData;
  footer: FooterContent;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const ConnectSection = forwardRef<HTMLElement, ConnectSectionProps>(
  function ConnectSection({ content, footer, isDark, onToggleTheme }, ref) {
    const [emailUser, emailDomain] = content.email.split("@");

    // Email first — it is the one that matters. The socials follow in data order.
    const tiles = [
      {
        id: "email",
        name: "Email",
        // <wbr> so a narrow tile wraps after the "@" rather than mid-word.
        handle: (
          <>
            {emailUser}@<wbr />
            {emailDomain}
          </>
        ) as ReactNode,
        url: `mailto:${content.email}`,
        Icon: Mail,
        external: false,
      },
      ...content.links.map((social) => ({
        ...social,
        Icon: SOCIAL_ICONS[social.id],
        external: true,
      })),
    ];

    return (
      <section
        id="connect"
        ref={ref}
        className="snap-section px-6 sm:px-8 lg:px-16 py-10 lg:py-0 lg:flex lg:flex-col lg:justify-center opacity-0"
      >
        <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col justify-center">
          {/* Stacked, not side by side: heading centred on top, tiles centred
              under it. `text-left` on the grid keeps the tile copy aligned. */}
          <div className="space-y-8 lg:space-y-10 text-center">
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl font-light">{content.heading}</h2>
              {content.description && (
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
                  {content.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3 max-w-2xl mx-auto text-left">
              {tiles.map(({ id, name, handle, url, Icon, external }) => (
                <a
                  key={id}
                  href={url}
                  {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                  className="group flex flex-col gap-3 p-3 sm:p-4 rounded-lg ring-1 ring-border hover:ring-muted-foreground/50 hover:shadow-sm transition-all duration-300"
                >
                  <div className="flex items-center justify-between text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                    {Icon && <Icon className="w-4 h-4" />}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-sm text-foreground">{name}</div>
                    <div className="text-xs text-muted-foreground break-words">{handle}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* `mt-auto` only does anything once the section is full height, which
            is desktop-only — mobile needs a real margin or the rule collides
            with the social links above it. */}
        <footer className="max-w-4xl mx-auto w-full py-6 border-t border-border mt-12 lg:mt-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">{footer.copyright}</div>
              <div className="text-xs text-muted-foreground">{footer.credit}</div>
            </div>

            <Button
              variant="outline"
              isIconOnly
              size="sm"
              onPress={onToggleTheme}
              aria-label="Toggle theme"
              className="rounded-lg"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-muted-foreground" />
              ) : (
                <Moon className="w-4 h-4 text-muted-foreground" />
              )}
            </Button>
          </div>
        </footer>
      </section>
    );
  }
);
