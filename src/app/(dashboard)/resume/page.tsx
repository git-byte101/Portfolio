import { getActiveResume } from "@/services/site-content";

export const revalidate = 0;

export default async function ResumePage() {
  const resume = await getActiveResume();

  return (
    <section className="mx-auto flex min-h-full w-full max-w-7xl flex-col gap-4 pb-4 md:gap-5 md:pb-6">
      <section className="mecha-panel rounded-2xl border border-oak-primary/20 bg-oak-surface/75 p-5 md:p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-oak-muted">
          Resume
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-oak-text md:text-4xl">
          {resume.title}
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-oak-muted md:text-base">
          {resume.summary}
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href={resume.fileUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-oak-primary/30 bg-oak-surface px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-oak-text transition hover:border-oak-primary"
          >
            View PDF
          </a>
          <a
            href={resume.fileUrl}
            download={resume.fileName}
            className="rounded-full bg-oak-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-oak-surface transition hover:opacity-90"
          >
            Download PDF
          </a>
        </div>
      </section>

      <section className="mecha-panel overflow-hidden rounded-2xl border border-oak-primary/20 bg-oak-surface/80 p-3 md:p-4">
        <div className="mecha-border-soft overflow-hidden rounded-xl border border-oak-primary/20 bg-white/75">
          <iframe
            title="Resume PDF Preview"
            src={`${resume.fileUrl}#view=FitH`}
            className="h-[72vh] w-full border-0"
          />
        </div>
      </section>

      <p className="text-xs text-oak-muted">
        Resume file source: {resume.fileName}.
      </p>
    </section>
  );
}
