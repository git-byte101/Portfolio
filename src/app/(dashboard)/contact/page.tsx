"use client";

import { useEffect, useRef, useState } from "react";
import { Comfortaa } from "next/font/google";
import { FaEnvelope, FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { getToolVisual } from "@/lib/tool-visuals";

const SOCIAL_LINKS = [
  { label: "GitHub", href: "https://github.com", icon: FaGithub },
  { label: "LinkedIn", href: "https://linkedin.com", icon: FaLinkedin },
  { label: "X", href: "https://x.com", icon: FaXTwitter },
  { label: "Email", href: "mailto:architect@example.com", icon: FaEnvelope },
];

function getSocialIconColor(label: string): string {
  if (label === "GitHub") {
    return "text-[#1f2328]";
  }

  if (label === "LinkedIn") {
    return "text-[#0a66c2]";
  }

  if (label === "X") {
    return "text-[#0f172a]";
  }

  return "text-[#7c2d12]";
}

const TOOL_BADGES = [
  "n8n",
  "Zapier",
  "Java",
  "JavaScript",
  "TypeScript",
  "NoSQL",
  "MongoDB",
  "PostgreSQL",
  "Docker",
  "Vercel",
  "Neon",
  "Notion API",
];

const comfortaa = Comfortaa({ subsets: ["latin"], weight: ["600", "700"] });

export default function ContactPage() {
  const marqueeTools = [...TOOL_BADGES, ...TOOL_BADGES];
  const [isMarqueePaused, setIsMarqueePaused] = useState(false);
  const marqueeTrackRef = useRef<HTMLDivElement | null>(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    pausedRef.current = isMarqueePaused;
  }, [isMarqueePaused]);

  useEffect(() => {
    const track = marqueeTrackRef.current;
    if (!track) {
      return;
    }

    let frameId = 0;
    let lastTime = performance.now();
    let x = 0;
    let velocity = -38;

    const update = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      const fullWidth = track.scrollWidth;
      const loopWidth = fullWidth / 2;
      const targetVelocity = pausedRef.current ? 0 : -38;

      // Smooth braking/acceleration so hover feels like a car slowing down.
      velocity += (targetVelocity - velocity) * Math.min(1, dt * 6);
      x += velocity * dt;

      if (loopWidth > 0) {
        if (x <= -loopWidth) {
          x += loopWidth;
        } else if (x > 0) {
          x -= loopWidth;
        }
      }

      track.style.transform = `translate3d(${x}px, 0, 0)`;
      frameId = window.requestAnimationFrame(update);
    };

    frameId = window.requestAnimationFrame(update);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <section className="mx-auto flex min-h-full w-full max-w-7xl flex-col gap-4 pb-4 md:gap-5 md:pb-6">
      <section className="mecha-panel rounded-2xl border border-oak-primary/20 bg-oak-surface/70 p-5 md:p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-oak-muted">
          Contact
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-oak-text md:text-4xl">
          Let&apos;s Connect
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-oak-muted md:text-base">
          Recently completed internship training and now open to junior and
          entry-level IT roles where I can contribute and continue growing.
        </p>
      </section>

      <section className="grid grid-cols-1 items-stretch gap-4 xl:grid-cols-[1.2fr_1fr]">
        <article className="mecha-panel rounded-2xl border border-oak-primary/20 bg-oak-surface/80 p-5 md:p-6">
          <h2 className="text-2xl font-bold tracking-tight text-oak-text md:text-3xl">
            Bio Panel
          </h2>
          <p className="mt-3 text-sm leading-7 text-oak-muted md:text-base">
            I am a fresh graduate in Information Technology with beginner-level
            knowledge in core IT work. After completing internship experience, I
            am continuing to build skills in networking, programming, AI
            automation, database tasks, and user support.
          </p>

          <ul className="mt-4 grid gap-2">
            {[
              "Basic IT support and troubleshooting for common technical issues",
              "Foundational networking and system setup knowledge",
              "Beginner web development with HTML, CSS, and JavaScript",
              "Entry-level AI assistant usage with ChatGPT, Claude, and Gemini",
              "Basic database handling and simple task documentation",
            ].map((item) => (
              <li
                key={item}
                className="mecha-panel-mini rounded-lg border border-oak-primary/12 bg-white/60 px-3 py-2 text-sm text-oak-text"
              >
                {item}
              </li>
            ))}
          </ul>
        </article>

        <article className="mecha-panel flex h-full flex-col rounded-2xl border border-oak-primary/20 bg-oak-surface/80 p-5 md:p-6">
          <h2 className="text-2xl font-bold tracking-tight text-oak-text md:text-3xl">
            Socials
          </h2>
          <div className="mt-4 grid flex-1 auto-rows-fr grid-cols-2 gap-3">
            {SOCIAL_LINKS.map((link) => {
              const Icon = link.icon;

              return (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mecha-panel-soft flex h-full min-h-28 flex-col items-center justify-center gap-2 rounded-xl border border-oak-primary/15 bg-white/65 px-3 py-3 text-center text-sm font-semibold text-oak-text transition hover:border-oak-primary/40 hover:bg-white/80"
                >
                  <span className="rounded-xl border border-oak-primary/15 bg-oak-surface/85 p-2.5">
                    <Icon
                      className={`size-6 ${getSocialIconColor(link.label)}`}
                      aria-hidden="true"
                    />
                  </span>
                  <span className="text-sm font-semibold text-oak-text">
                    {link.label}
                  </span>
                </a>
              );
            })}
          </div>
        </article>
      </section>

      <section className="mecha-panel tech-grid relative overflow-hidden rounded-2xl border border-oak-primary/20 bg-oak-surface/80 p-5 md:p-6">
        <h2 className="relative z-10 text-2xl font-bold tracking-tight text-oak-text md:text-3xl">
          Tech Stack &amp; Tools
        </h2>
        <p className="relative z-10 mt-2 max-w-3xl text-sm leading-6 text-oak-muted md:text-base">
          Core engineering tooling with a high-signal, fast-scanning interface.
          Built for resilient delivery and smooth interaction across all
          devices.
        </p>

        <div className="mecha-panel-soft tools-marquee relative z-10 mt-6 overflow-hidden rounded-2xl bg-white/45 py-5 md:py-6">
          <div
            ref={marqueeTrackRef}
            className="tools-marquee-track flex w-max gap-3 px-4 md:gap-5 md:px-6"
            onPointerEnter={() => setIsMarqueePaused(true)}
            onPointerLeave={() => setIsMarqueePaused(false)}
            onPointerDown={() => setIsMarqueePaused(true)}
            onPointerUp={() => setIsMarqueePaused(false)}
            onPointerCancel={() => setIsMarqueePaused(false)}
          >
            {marqueeTools.map((tool, index) => {
              const { icon: Icon, accentClassName } = getToolVisual(tool);

              return (
                <div
                  key={`${tool}-${index}`}
                  className="mecha-panel-soft flex min-w-28 flex-col items-center justify-center rounded-2xl border border-oak-primary/18 bg-white/90 px-4 py-3 shadow-[0_12px_24px_-18px_rgba(28,54,77,0.65)] md:min-w-32 md:px-5 md:py-4"
                >
                  <span
                    className={`flex size-14 items-center justify-center rounded-xl bg-oak-surface/90 ${accentClassName} md:size-16`}
                  >
                    <Icon className="size-9 md:size-10" aria-hidden="true" />
                  </span>
                  <p
                    className={`${comfortaa.className} mt-2.5 text-center text-xs font-bold tracking-[0.04em] text-oak-text md:text-sm`}
                  >
                    {tool}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </section>
  );
}
