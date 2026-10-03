import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ArrowDown, MapPin, Radio } from "lucide-react";
import heroBg from "@/assets/Hero-Background.png";
import { event } from "@/content/event";
import { Scribble } from "./primitives";

const ease = [0.2, 0.8, 0.2, 1] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yWord = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -80]);

  const fade = (delay: number, y = 20) => ({
    initial: reduce ? false : { opacity: 0, y },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease },
  });

  return (
    <section
      id="top"
      ref={ref}
      className="grain relative flex min-h-[100svh] flex-col overflow-hidden bg-ink"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBg}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-ink/60" />
        {/* Grain overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink/90" />
      </div>

      {/* Content — centered vertical layout */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-5 pt-28 md:px-10 md:pt-32">
        {/* Metadata row */}
        <motion.div
          {...fade(0.1)}
          className="flex flex-wrap items-center justify-center gap-3 text-center font-type text-xs uppercase tracking-widest text-paper/80 md:text-sm"
        >
          <span>{event.organizer} · {event.college}</span>
          <span className="hidden sm:inline">—</span>
          <span className="hidden sm:inline">Theme — {event.theme.join(" ")}</span>
        </motion.div>

        {/* Slogan annotation */}
        <motion.div
          {...fade(0.6)}
          className="relative mt-6 md:mt-8"
        >
          <p className="font-hand text-2xl leading-tight text-hot md:text-4xl text-center">
            Same minds,{" "}
            <span className="inline md:hidden"><br /></span>
            different arguments.
          </p>
          <Scribble className="absolute -right-16 -top-6 hidden w-28 md:block" />
        </motion.div>

        {/* Wordmark — centered */}
        <motion.h1
          style={{ y: yWord }}
          className="display relative z-20 mt-4 text-center md:mt-6"
          aria-label="DE'BAIT"
        >
          <motion.span
            className="inline-block text-[28vw] leading-[0.85] text-sun md:text-[18vw] xl:text-[260px]"
            initial={reduce ? false : { opacity: 0, y: 120, skewY: 6 }}
            animate={{ opacity: 1, y: 0, skewY: 0 }}
            transition={{ duration: 1, delay: 0.3, ease }}
            style={{ textShadow: "6px 6px 0 var(--ink)" }}
          >
            De&rsquo;
          </motion.span>
          <motion.span
            className="inline-block text-[28vw] leading-[0.85] text-sun md:text-[18vw] xl:text-[260px]"
            initial={reduce ? false : { opacity: 0, y: 120, skewY: 6 }}
            animate={{ opacity: 1, y: 0, skewY: 0 }}
            transition={{ duration: 1, delay: 0.45, ease }}
            style={{ textShadow: "6px 6px 0 var(--ink)" }}
          >
            Bait
          </motion.span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.div {...fade(1.0)} className="mt-8 text-center md:mt-10">
          <p className="font-type text-sm uppercase tracking-widest text-paper/70">Step up &amp;</p>
          <p className="display mt-1 text-3xl text-paper md:text-5xl">Make your point</p>
          <p className="mx-auto mt-3 max-w-md font-serif text-base italic text-paper/80 md:text-lg">
            Gear up for a clash of perspectives where every argument counts.
          </p>
        </motion.div>

        {/* CTA + Info strip */}
        <motion.div {...fade(1.3)} className="mt-8 flex flex-col items-center gap-5 pb-8 md:mt-10 md:flex-row md:gap-8">
          <div className="flex flex-col items-center gap-1 font-type text-sm uppercase tracking-wider text-paper/70">
            <span className="inline-flex items-center gap-2">
              <MapPin size={16} className="text-hot" /> {event.venue}
            </span>
            <span className="text-paper/50">{event.dates.join(" & ")}</span>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#event" className="btn-hot">
              Explore the event <ArrowDown size={18} />
            </a>
            <a href="#live" className="btn-ghost border-paper/40 text-paper hover:bg-paper/10">
              <Radio size={18} /> Live
            </a>
          </div>
        </motion.div>
      </div>

      {/* Marquee */}
      <div className="relative z-30 overflow-hidden border-y-2 border-ink bg-ink py-3 text-sun">
        <div className="marquee flex w-max gap-10 whitespace-nowrap display text-2xl">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex gap-10" aria-hidden={k === 1}>
              {Array.from({ length: 6 }).map((_, i) => (
                <span key={i} className="flex items-center gap-10">
                  Same minds <span className="text-hot">✱</span> Different arguments <span className="text-hot">✱</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
