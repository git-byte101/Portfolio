import { getExperienceEntries } from "@/services/site-content";

export const revalidate = 60;

export default async function ExperiencePage() {
  const experienceTimeline = await getExperienceEntries();

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
