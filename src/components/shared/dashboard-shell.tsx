"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useEffect, useState } from "react";

interface DashboardShellProps {
  children: React.ReactNode;
  profilePhotoSrc: string;
}

interface NavItem {
  label: "Overview" | "Projects" | "Experience" | "Contact";
  href: "/" | "/projects" | "/experience" | "/contact";
}

const navItems: NavItem[] = [
  { label: "Overview", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Experience", href: "/experience" },
  { label: "Contact", href: "/contact" },
];

function isNavItemActive(pathname: string, href: NavItem["href"]): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function DashboardShell({
  children,
  profilePhotoSrc,
}: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [theme, setTheme] = useState<"oak" | "slate">(() => {
    if (typeof window === "undefined") {
      return "oak";
    }

    const persistedTheme = window.localStorage.getItem("portfolio-theme");
    return persistedTheme === "slate" ? "slate" : "oak";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem("portfolio-theme", theme);
  }, [theme]);

  useEffect(() => {
    for (const item of navItems) {
      if (item.href !== pathname) {
        router.prefetch(item.href);
      }
    }
  }, [pathname, router]);

  const renderNavItem = ({
    item,
    isMobile = false,
  }: {
    item: NavItem;
    isMobile?: boolean;
  }) => {
    const isActive = isNavItemActive(pathname, item.href);

    return (
      <Link
        key={item.href}
        href={item.href}
        className={
          isMobile
            ? "relative whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold"
            : "sidebar-nav-link relative flex items-center rounded-lg px-4 py-3"
        }
        aria-current={isActive ? "page" : undefined}
      >
        {isActive ? (
          <motion.span
            layoutId={isMobile ? "mobile-active-nav" : "active-nav-indicator"}
            className={
              isMobile
                ? "absolute inset-0 rounded-lg bg-oak-primary/12"
                : "sidebar-active-rail absolute inset-y-2 left-0 w-1 rounded-full bg-oak-primary"
            }
            transition={{
              type: "spring",
              stiffness: isMobile ? 340 : 360,
              damping: 30,
            }}
          />
        ) : null}
        <span
          className={
            isMobile
              ? `relative ${isActive ? "text-oak-primary" : "text-oak-muted"}`
              : `sidebar-nav-text pl-3 text-sm font-semibold transition-colors ${
                  isActive ? "text-oak-primary" : "text-oak-muted"
                }`
          }
        >
          {item.label}
        </span>
      </Link>
    );
  };

  return (
    <div className="dashboard-shell h-screen overflow-hidden text-oak-text">
      <div className="dashboard-shell-inner mx-auto flex h-full w-full max-w-400 gap-4 px-3 py-3 md:px-6 md:py-5">
        <aside className="oak-card sidebar-mecha hidden w-64 shrink-0 p-4 lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="sidebar-kicker text-xs font-semibold uppercase tracking-[0.22em] text-oak-muted">
              Tech Profile
            </p>
            <h1 className="sidebar-name mt-2 text-2xl font-bold text-oak-text">
              PAULO
            </h1>

            <div className="mt-5">
              <div
                className="mecha-profile-frame"
                aria-label="Profile picture frame"
              >
                <div className="mecha-profile-bezel">
                  <div className="mecha-profile-core">
                    <div className="mecha-profile-slot">
                      <Image
                        src={profilePhotoSrc}
                        alt="Paulo professional profile portrait"
                        fill
                        sizes="(max-width: 1279px) 192px, 216px"
                        className="mecha-profile-photo"
                        priority
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <LayoutGroup>
            <nav className="sidebar-nav my-10 space-y-2" aria-label="Primary">
              {navItems.map((item) => renderNavItem({ item }))}
            </nav>
          </LayoutGroup>

          <p className="sidebar-footnote text-xs text-oak-muted">
            Fresh graduate in Information Technology focused on building
            practical skills in support, systems, and software fundamentals.
          </p>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="oak-card top-header-mecha mb-3 flex min-h-16 items-center justify-between px-4 py-3 md:mb-4 md:px-6">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-oak-muted">
                Portfolio Dashboard
              </p>
              <p className="text-sm font-semibold text-oak-text md:text-base">
                Fresh Graduate IT Profile
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  setTheme((prev) => (prev === "oak" ? "slate" : "oak"))
                }
                className="rounded-full border border-oak-primary/30 bg-oak-surface px-3 py-1.5 text-xs font-semibold text-oak-text transition hover:border-oak-primary"
                aria-label="Toggle theme"
              >
                <span suppressHydrationWarning>
                  {theme === "oak" ? "Theme: Oak" : "Theme: Slate"}
                </span>
              </button>
              <a
                href="/resume"
                className="hidden rounded-full border border-oak-primary/30 bg-oak-surface px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-oak-text transition hover:border-oak-primary sm:block"
              >
                View Resume
              </a>
              <a
                href="/RAMOS_CV.pdf"
                download="RAMOS_CV.pdf"
                className="hidden rounded-full bg-oak-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-oak-surface transition hover:opacity-90 sm:block"
              >
                Download Resume
              </a>
            </div>
          </header>

          <nav
            className="oak-card mb-3 flex items-center gap-1 overflow-x-auto p-1.5 lg:hidden"
            aria-label="Primary"
          >
            <LayoutGroup>
              {navItems.map((item) => renderNavItem({ item, isMobile: true }))}
            </LayoutGroup>
          </nav>

          <main className="oak-card min-h-0 flex-1 overflow-y-auto p-4 md:p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -8, filter: "blur(3px)" }}
                transition={{ duration: 0.24, ease: "easeOut" }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}
