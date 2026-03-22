import { getProjects } from "@/services/projects";
import { OverviewPanels } from "@/components/portfolio/overview-panels";

export const revalidate = 60;

const IT_FOUNDATION_AREAS = [
  "IT Support and Troubleshooting",
  "Computer Networks Fundamentals",
  "Programming Fundamentals: HTML, CSS, JavaScript",
  "AI Automation Basics",
  "Database Management Basics",
  "Basic System Administration",
  "Tools: ChatGPT, Claude, Gemini",
];

export default async function DashboardPage() {
  const projects = await getProjects();
  let automationCount = 0;
  let programmingCount = 0;
  let dataCount = 0;

  for (const project of projects) {
    if (project.category === "AI Automation") {
      automationCount += 1;
      continue;
    }

    if (project.category === "Programming") {
      programmingCount += 1;
      continue;
    }

    if (project.category === "NoSQL") {
      dataCount += 1;
    }
  }

  const publishedCount = projects.length;

  return (
    <section className="mx-auto flex min-h-full w-full max-w-7xl flex-col gap-4 pb-4 md:gap-5 md:pb-6">
      <section className="mecha-panel rounded-2xl border border-oak-primary/20 bg-oak-surface/70 p-5 md:p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-oak-muted">
          Overview
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-oak-text md:text-4xl">
          Fresh Graduate IT Portfolio
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-oak-muted md:text-base">
          Entry-level IT graduate with beginner knowledge in support,
          networking, programming, AI automation, and database tasks. Actively
          learning through practical projects and guided real-world exposure.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.4fr_1fr]">
        <OverviewPanels
          publishedCount={publishedCount}
          automationCount={automationCount}
          programmingCount={programmingCount}
          dataCount={dataCount}
          foundationAreas={IT_FOUNDATION_AREAS}
        />

        <aside className="mecha-panel relative overflow-hidden rounded-2xl border border-oak-primary/20 bg-oak-surface/85 p-5 md:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-oak-muted">
            Learner Profile
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-oak-text">
            Entry-Level IT Focus
          </h2>
          <p className="mt-3 max-w-sm text-sm leading-7 text-oak-muted">
            Open to junior opportunities where I can support day-to-day IT
            operations, contribute to technical tasks, and keep building strong
            fundamentals through mentorship and hands-on work.
          </p>

          <div className="mecha-panel-soft relative mt-6 h-64 rounded-xl border border-oak-primary/20 bg-linear-to-br from-white/50 via-oak-surface to-oak-bg">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-oak-primary/20 blur-2xl" />
            <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-oak-accent/20 blur-2xl" />
            <div className="absolute inset-4 grid grid-cols-2 gap-3">
              <div className="mecha-panel-mini rounded-lg border border-oak-primary/15 bg-white/65 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-oak-muted">
                  Availability
                </p>
                <p className="mt-2 text-lg font-bold text-oak-text">
                  Open to Junior Roles
                </p>
              </div>
              <div className="mecha-panel-mini rounded-lg border border-oak-primary/15 bg-white/65 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-oak-muted">
                  Target
                </p>
                <p className="mt-2 text-lg font-bold text-oak-text">
                  IT Support / Staff
                </p>
              </div>
              <div className="mecha-panel-mini col-span-2 rounded-lg border border-oak-primary/15 bg-white/65 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-oak-muted">
                  Work Style
                </p>
                <p className="mt-2 text-sm leading-6 text-oak-text">
                  Responsible, coachable, and documentation-driven. I focus on
                  clear communication, task ownership, and steady improvement.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </section>
  );
}
