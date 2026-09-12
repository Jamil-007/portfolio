"use client";

import { HeroSection } from "@/components/home/HeroSection/HeroSection";
import { ExperienceSection } from "@/components/home/ExperienceSection/ExperienceSection";
import { ProjectsSection } from "@/components/home/ProjectsSection/ProjectsSection";
import { ConnectSection } from "@/components/home/ConnectSection/ConnectSection";
import { SideNav } from "@/components/layout/SideNav/SideNav";
import { portfolioData } from "@/lib/portfolio-data";
import { usePortfolioPage } from "./usePortfolioPage";

export function PortfolioPage() {
  const { isDark, toggleTheme, activeSection, registerSection } = usePortfolioPage();

  return (
    <div className="snap-container bg-background text-foreground relative">
      <SideNav activeSection={activeSection} />

      <HeroSection
        ref={registerSection(0)}
        content={portfolioData.intro}
        socials={portfolioData.connect.links}
        email={portfolioData.connect.email}
      />

      <ExperienceSection ref={registerSection(1)} content={portfolioData.experience} />

      <ProjectsSection ref={registerSection(2)} content={portfolioData.projects} />

      <ConnectSection
        ref={registerSection(3)}
        content={portfolioData.connect}
        footer={portfolioData.footer}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />
    </div>
  );
}
