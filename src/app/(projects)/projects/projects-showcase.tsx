"use client";

import type { ProjectRecord } from "@/types/project";
import { getToolVisual } from "@/lib/tool-visuals";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import Image from "next/image";
import { memo, useCallback, useMemo, useState } from "react";

interface ProjectsShowcaseProps {
  projects: ProjectRecord[];
}

const FALLBACK_PROJECTS: ProjectRecord[] = [
  {
    id: "fallback-project",
    title: "Project Data Unavailable",
    category: "Programming",
    techStack: ["Notion API", "Next.js"],
    version: "v1.0.0",
    status: "Production",
    summary: "No projects were returned from Notion at this time.",
    thumbnailSrc: "/images/project-placeholder.svg",
  },
];

interface ProjectListItemProps {
  project: ProjectRecord;
  isActive: boolean;
  onSelect: (id: string) => void;
}

const ProjectListItem = memo(function ProjectListItem({
  project,
  isActive,
  onSelect,
}: ProjectListItemProps) {
  const handleClick = useCallback(() => {
    onSelect(project.id);
  }, [onSelect, project.id]);

  return (
    <li>
      <button
        type="button"
        onClick={handleClick}
        className="mecha-border-soft relative w-full overflow-hidden rounded-xl border border-transparent px-4 py-3 text-left"
      >
        {isActive ? (
          <motion.span
            layoutId="active-project-panel"
            className="absolute inset-0 rounded-xl border border-oak-primary/30 bg-oak-primary/10"
            transition={{
              type: "spring",
              stiffness: 280,
              damping: 28,
            }}
          />
        ) : null}
        <div className="relative">
          <p className="text-sm font-semibold text-oak-text">{project.title}</p>
          <p className="mt-1 text-xs text-oak-muted">{project.summary}</p>
        </div>
      </button>
    </li>
  );
});

export function ProjectsShowcase({ projects }: ProjectsShowcaseProps) {
  const safeProjects = projects.length > 0 ? projects : FALLBACK_PROJECTS;

  const projectMap = useMemo(() => {
    return new Map(safeProjects.map((project) => [project.id, project]));
  }, [safeProjects]);

  const [activeProjectId, setActiveProjectId] = useState<string>(
    safeProjects[0].id,
  );

  const activeProject = useMemo<ProjectRecord>(() => {
    return projectMap.get(activeProjectId) ?? safeProjects[0];
  }, [activeProjectId, projectMap, safeProjects]);

  const handleProjectSelect = useCallback((projectId: string) => {
    setActiveProjectId(projectId);
  }, []);

  return (
    <section className="mecha-border relative h-full overflow-hidden rounded-2xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeProject.id}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <Image
            src={activeProject.thumbnailSrc}
            alt={`${activeProject.title} preview`}
            fill
            className="object-cover blur-md"
            sizes="(min-width: 1024px) 70vw, 100vw"
            quality={40}
            priority={activeProject.id === safeProjects[0].id}
          />
          <div className="absolute inset-0 bg-black/48" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/72 via-black/48 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 grid h-full grid-cols-1 gap-4 text-oak-text lg:grid-cols-[320px_1fr]">
        <aside className="oak-card mecha-border h-full overflow-y-auto p-3 text-oak-text">
          <h2 className="px-2 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-oak-muted">
            Project Showcase
          </h2>
          <LayoutGroup>
            <ul className="space-y-2">
              {safeProjects.map((project) => {
                const isActive = project.id === activeProject.id;

                return (
                  <ProjectListItem
                    key={project.id}
                    project={project}
                    isActive={isActive}
                    onSelect={handleProjectSelect}
                  />
                );
              })}
            </ul>
          </LayoutGroup>
        </aside>

        <article className="mecha-border relative flex h-full flex-col justify-center overflow-hidden rounded-2xl border border-white/20 bg-white/5 p-6 backdrop-blur-sm md:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeProject.id}
              className="grid items-center gap-8 lg:grid-cols-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <motion.div
                initial={{ x: -24, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.05, duration: 0.35, ease: "easeOut" }}
              >
                <p className="text-xs uppercase tracking-[0.22em] text-black/55">
                  {activeProject.category}
                </p>
                <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                  {activeProject.title}
                </h1>
                <motion.p
                  className="mt-4 max-w-xl text-sm leading-7 text-black/70 md:text-base"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.35, ease: "easeOut" }}
                >
                  {activeProject.summary}
                </motion.p>
                <motion.ul
                  className="mt-6 flex flex-wrap gap-2"
                  initial="hidden"
                  animate="show"
                  variants={{
                    hidden: { opacity: 0 },
                    show: { opacity: 1, transition: { staggerChildren: 0.07 } },
                  }}
                >
                  {activeProject.techStack.map((tech) => {
                    const { icon: Icon, accentClassName } = getToolVisual(tech);

                    return (
                      <motion.li
                        key={tech}
                        className="group relative"
                        variants={{
                          hidden: { y: 10, opacity: 0 },
                          show: { y: 0, opacity: 1 },
                        }}
                        whileHover={{ y: -2 }}
                      >
                        <div className="mecha-border-mini flex items-center gap-2 rounded-xl border border-black/20 bg-white/55 px-2.5 py-1.5 backdrop-blur-xs transition duration-200 group-hover:border-black/35 group-hover:bg-white/72">
                          <span
                            className={`flex size-6 shrink-0 items-center justify-center rounded-md border border-oak-surface/30 bg-white/90 ${accentClassName}`}
                          >
                            <Icon className="size-3.5" aria-hidden="true" />
                          </span>
                          <span className="text-xs font-semibold text-black/75">
                            {tech}
                          </span>
                        </div>
                        <span className="tool-tooltip" role="tooltip">
                          {tech}
                        </span>
                      </motion.li>
                    );
                  })}
                </motion.ul>
              </motion.div>

              <motion.div
                layoutId={`project-hero-${activeProject.id}`}
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="mecha-border-soft relative mx-auto aspect-16/10 w-full max-w-2xl overflow-hidden rounded-2xl border border-white/20 bg-white/10"
              >
                <Image
                  src={activeProject.thumbnailSrc}
                  alt={`${activeProject.title} mockup`}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 40vw, 100vw"
                />
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </article>
      </div>
    </section>
  );
}
