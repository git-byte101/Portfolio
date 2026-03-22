interface ExperienceItem {
  period: string;
  role: string;
  company: string;
  summary: string;
  highlights: string[];
}

const experienceTimeline: ExperienceItem[] = [
  {
    period: "Nov 2025 - Jan 2026",
    role: "Project-Based Automation Builder",
    company: "Independent Project Work",
    summary:
      "Delivered beginner-to-intermediate automation projects focused on website workflow and social media process automation.",
    highlights: [
      "Built website automation workflows using Notion, GoHighLevel (GHL), and Twilio.",
      "Implemented Instagram automation flows using GHL and ManyChat.",
      "Configured project-based automations to reduce repetitive manual tasks.",
    ],
  },
  {
    period: "May 2025 - Aug 2025",
    role: "IT Intern",
    company: "Vantrippers Travel and Tours",
    summary:
      "Completed internship focused on supporting website development and practical IT tasks in a real business environment.",
    highlights: [
      "Contributed to building the company website using PHP and CodeIgniter.",
      "Worked with a legacy CSS framework to style and update web pages.",
      "Supported basic testing, bug fixes, and implementation tasks during development.",
    ],
  },
];

export default function ExperiencePage() {
  return (
    <section className="mx-auto flex min-h-full w-full max-w-7xl flex-col gap-4 pb-4 md:gap-5 md:pb-6">
      <section className="mecha-panel rounded-2xl border border-oak-primary/20 bg-oak-surface/70 p-5 md:p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-oak-muted">
          Experience
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-oak-text md:text-4xl">
          IT and Project Experience
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-oak-muted md:text-base">
          Internship and project-based work focused on practical IT delivery,
          web development support, and beginner automation implementation.
        </p>
      </section>

      <section className="mecha-panel rounded-2xl border border-oak-primary/20 bg-oak-surface/80 p-4 md:p-6">
        <ul className="space-y-4">
          {experienceTimeline.map((item) => (
            <li
              key={`${item.company}-${item.period}`}
              className="mecha-panel-soft rounded-xl border border-oak-primary/15 bg-white/60 p-4 md:p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-oak-muted">
                    {item.period}
                  </p>
                  <h2 className="mt-2 text-xl font-bold text-oak-text">
                    {item.role}
                  </h2>
                  <p className="text-sm font-semibold text-oak-primary">
                    {item.company}
                  </p>
                </div>
              </div>

              <p className="mt-3 text-sm leading-7 text-oak-muted">
                {item.summary}
              </p>
              <ul className="mt-3 grid gap-2">
                {item.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="mecha-panel-mini rounded-lg border border-oak-primary/10 bg-oak-surface/70 px-3 py-2 text-sm text-oak-text"
                  >
                    {highlight}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}
