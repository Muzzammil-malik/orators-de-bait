import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ArrowDown, MapPin, Radio } from "lucide-react";
import speaker from "@/assets/speaker-woman.png";
import { event } from "@/content/event";
import { Scribble } from "./primitives";

const ease = [0.2, 0.8, 0.2, 1] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yWord = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -120]);
  const ySpk = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 80]);

  const fade = (delay: number, y = 20) => ({
    initial: reduce ? false : { opacity: 0, y },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease },
  });

  return (
    <section id="top" ref={ref} className="grain relative min-h-[100svh] overflow-hidden bg-ivory pt-28 md:pt-32">
      <div className="mx-auto grid max-w-[1400px] px-5 md:px-10">
        {/* metadata row */}
        <motion.div {...fade(0.1)} className="flex flex-wrap items-center justify-between gap-3 font-type text-xs uppercase tracking-widest md:text-sm">
          <span>{event.organizer} · {event.college}</span>
          <span className="hidden sm:inline">Theme — {event.theme.join(" ")}</span>
          <span>{event.dates.join(" & ")}</span>
        </motion.div>

        <div className="relative mt-6 md:mt-10">
          {/* Speaker art */}
          <motion.div
            style={{ y: ySpk }}
            initial={reduce ? false : { opacity: 0, x: 60, rotate: 3 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ duration: 1.1, delay: 0.7, ease }}
            className="pointer-events-none absolute -right-10 top-4 z-10 w-[78%] max-w-[640px] sm:w-[58%] md:-right-4 md:top-0 md:w-[46%]"
          >
            <img
              src={speaker}
              alt="Illustration of a speaker addressing a microphone"
              width={1024}
              height={1024}
              className="w-full mix-blend-multiply"
            />
          </motion.div>

          {/* Wordmark */}
          <motion.h1 style={{ y: yWord }} className="display relative z-0 text-sun" aria-label="DE'BAIT">
            <motion.span
              className="block text-[34vw] md:text-[22vw] xl:text-[300px]"
              initial={reduce ? false : { opacity: 0, y: 120, skewY: 6 }}
              animate={{ opacity: 1, y: 0, skewY: 0 }}
              transition={{ duration: 1, delay: 0.3, ease }}
              style={{ textShadow: "6px 6px 0 var(--ink)" }}
            >
              De’
            </motion.span>
            <motion.span
              className="relative z-20 -mt-[4vw] block text-[34vw] md:text-[22vw] xl:-mt-6 xl:text-[300px]"
              initial={reduce ? false : { opacity: 0, y: 120, skewY: 6 }}
              animate={{ opacity: 1, y: 0, skewY: 0 }}
              transition={{ duration: 1, delay: 0.45, ease }}
              style={{ textShadow: "6px 6px 0 var(--ink)" }}
            >
              Bait
            </motion.span>
          </motion.h1>

          {/* Slogan annotation */}
          <motion.div
            {...fade(1.1)}
            className="absolute left-[40%] top-[6%] z-30 hidden -rotate-6 md:block"
          >
            <p className="font-hand text-3xl leading-tight text-hot lg:text-4xl">
              Same minds,<br />different<br />arguments.
            </p>
            <Scribble className="absolute -right-28 -top-10 w-36" />
          </motion.div>
        </div>

        <div className="relative z-30 mt-6 grid gap-8 pb-16 md:mt-0 md:grid-cols-[1.1fr_1fr] md:items-end">
          <motion.div {...fade(1.2)}>
            <p className="font-hand text-2xl text-hot md:hidden">Same minds, different arguments.</p>
            <p className="font-type text-sm uppercase tracking-widest">Step up &amp;</p>
            <p className="display text-5xl md:text-7xl">Make your point</p>
            <p className="mt-4 max-w-md font-serif text-lg italic">
              Gear up for a clash of perspectives where every argument counts.
            </p>
          </motion.div>
          <motion.div {...fade(1.4)} className="flex flex-col gap-5 md:items-end">
            <div className="flex flex-col gap-1 font-type text-sm uppercase tracking-wider md:text-right">
              <span className="inline-flex items-center gap-2 md:justify-end">
                <MapPin size={16} className="text-hot" /> {event.venue}
              </span>
              <span className="text-muted-foreground">Theme: {event.theme.join(" ")}</span>
            </div>
            <div className="flex flex-wrap gap-4">
              <a href="#event" className="btn-hot">
                Explore the event <ArrowDown size={18} />
              </a>
              <a href="#live" className="btn-ghost">
                <Radio size={18} /> Live
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* marquee */}
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
