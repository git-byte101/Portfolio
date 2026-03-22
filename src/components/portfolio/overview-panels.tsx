"use client";

import { getToolVisual } from "@/lib/tool-visuals";
import { motion, type Variants } from "motion/react";

interface OverviewPanelsProps {
  publishedCount: number;
  automationCount: number;
  programmingCount: number;
  dataCount: number;
  foundationAreas: string[];
}

const metricGridVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const metricCardVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 170,
      damping: 20,
    },
  },
};

export function OverviewPanels({
  publishedCount,
  automationCount,
  programmingCount,
  dataCount,
  foundationAreas,
}: OverviewPanelsProps) {
  const metricCards = [
    {
      label: "Portfolio Entries",
      value: publishedCount,
      description: "Learning projects and practice outputs.",
    },
    {
      label: "Automation Practice",
      value: automationCount,
      description: "Intro-level AI and workflow experiments.",
    },
    {
      label: "Programming Practice",
      value: programmingCount,
      description: "Beginner coding tasks and mini builds.",
    },
    {
      label: "Database Practice",
      value: dataCount,
      description: "Basic data handling and query exercises.",
    },
  ];

  return (
    <div className="mecha-panel relative rounded-2xl border border-oak-primary/20 bg-oak-surface/80 p-5 md:p-6">
      <p className="relative z-10 text-xs font-semibold uppercase tracking-[0.18em] text-oak-muted">
        Learning Snapshot
      </p>
      <motion.div
        className="relative z-10 mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.35 }}
        variants={metricGridVariants}
      >
        {metricCards.map((card) => (
          <motion.article
            key={card.label}
            className="mecha-panel-soft rounded-xl border border-oak-primary/15 bg-white/60 p-4"
            variants={metricCardVariants}
            whileHover={{ y: -4 }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-oak-muted">
              {card.label}
            </p>
            <p className="mt-3 text-3xl font-bold text-oak-text">
              {card.value}
            </p>
            <p className="mt-1 text-xs text-oak-muted">{card.description}</p>
          </motion.article>
        ))}
      </motion.div>

      <div className="mecha-panel-soft tech-grid relative z-10 mt-5 overflow-hidden rounded-xl border border-oak-primary/15 bg-white/55 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-oak-muted">
          IT Foundation Areas
        </p>
        <motion.ul
          className="relative z-10 mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
          variants={metricGridVariants}
        >
          {foundationAreas.map((area) => {
            const { icon: Icon, accentClassName } = getToolVisual(area);

            return (
              <motion.li
                key={area}
                className="group relative"
                variants={metricCardVariants}
                whileHover={{ y: -4, scale: 1.01 }}
              >
                <div className="mecha-panel-soft tech-tile flex h-full items-center gap-3 rounded-xl border border-oak-primary/15 bg-white/70 px-3 py-3 md:px-4">
                  <span
                    className={`flex size-10 shrink-0 items-center justify-center rounded-lg border border-oak-primary/12 bg-oak-surface/90 ${accentClassName}`}
                  >
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-oak-text">
                      {area}
                    </p>
                    <p className="text-xs uppercase tracking-[0.12em] text-oak-muted/90">
                      Foundation
                    </p>
                  </div>
                </div>
                <span className="tool-tooltip" role="tooltip">
                  {area}
                </span>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </div>
  );
}
