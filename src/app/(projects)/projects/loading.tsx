export default function ProjectsLoading() {
  return (
    <section className="mecha-border relative h-full overflow-hidden rounded-2xl">
      <div className="relative z-10 grid h-full grid-cols-1 gap-4 lg:grid-cols-[320px_1fr]">
        <aside className="oak-card mecha-border h-full p-3">
          <div className="animate-pulse space-y-2">
            {Array.from({ length: 7 }).map((_, index) => (
              <div
                key={index}
                className="mecha-border-soft h-16 rounded-xl border border-oak-primary/15 bg-oak-surface/80"
              />
            ))}
          </div>
        </aside>

        <article className="mecha-border relative flex h-full flex-col justify-center overflow-hidden rounded-2xl border border-white/20 bg-white/5 p-6 md:p-10">
          <div className="animate-pulse space-y-4">
            <div className="h-4 w-32 rounded bg-oak-surface/70" />
            <div className="h-10 w-2/3 rounded bg-oak-surface/70" />
            <div className="h-5 w-full rounded bg-oak-surface/60" />
            <div className="h-5 w-11/12 rounded bg-oak-surface/60" />
            <div className="mt-2 flex flex-wrap gap-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-7 w-20 rounded-full bg-oak-surface/70"
                />
              ))}
            </div>
            <div className="mecha-border-soft mt-4 aspect-16/10 w-full rounded-2xl border border-oak-surface/35 bg-oak-surface/60" />
          </div>
        </article>
      </div>
    </section>
  );
}
