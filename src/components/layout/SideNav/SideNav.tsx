"use client";

const SECTIONS = ["intro", "experience", "projects", "connect"];

export function SideNav({ activeSection }: { activeSection: string }) {
  const scrollTo = (section: string) =>
    document.getElementById(section)?.scrollIntoView({ behavior: "smooth" });

  return (
    <>
      <nav className="fixed left-8 top-1/2 -translate-y-1/2 z-10 hidden lg:block">
        <div className="flex flex-col gap-4">
          {SECTIONS.map((section) => (
            <button
              key={section}
              onClick={() => scrollTo(section)}
              className={`w-2 h-8 rounded-full transition-all duration-500 ${
                activeSection === section
                  ? "bg-foreground"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/60"
              }`}
              aria-label={`Navigate to ${section}`}
            />
          ))}
        </div>
      </nav>

      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-10 lg:hidden">
        <div className="flex flex-row gap-3">
          {SECTIONS.map((section) => (
            <button
              key={section}
              onClick={() => scrollTo(section)}
              className={`w-2 h-2 rounded-full transition-all duration-500 ${
                activeSection === section ? "bg-foreground scale-125" : "bg-muted-foreground/30"
              }`}
              aria-label={`Navigate to ${section}`}
            />
          ))}
        </div>
      </nav>
    </>
  );
}
