import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import logoMark from "@/assets/logo-mark.png";

const links = [
  { href: "#event", label: "Event" },
  { href: "#format", label: "Format" },
  { href: "#schedule", label: "Schedule" },
  { href: "#teams", label: "Teams" },
  { href: "#rules", label: "Rules" },
  { href: "/scoreboard", label: "Live / Scoreboard" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? "bg-ivory/90 py-3 shadow-[0_2px_0_var(--ink)] backdrop-blur-md" : "bg-white/50 py-5 backdrop-blur-md"
        }`}
    >
      <nav className="mx-auto flex max-w-[1400px] items-center justify-between px-5 md:px-10" aria-label="Main">
        <a href="#top" className="flex items-center gap-3">
          <img src={logoMark} alt="Orators' Club MJCET" className="h-12 w-12 rounded-full object-cover" />
          <div className="flex flex-col leading-tight">
            <span className="font-type text-[10px] uppercase tracking-widest text-hot">Orators&rsquo; Club</span>
            <span className="display text-2xl">
              De<span className="text-hot">&rsquo;</span>Bait
            </span>
          </div>
        </a>
        <ul className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="group relative font-type text-sm uppercase tracking-wider focus-visible:outline-2 focus-visible:outline-hot"
              >
                {l.href === "/scoreboard" && <span className="pulse-dot mr-1.5 inline-block h-2 w-2 rounded-full bg-hot" />}
                {l.label}
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-hot transition-all group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>
        <button
          className="md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "circle(0% at 100% 0%)" }}
            animate={{ clipPath: "circle(150% at 100% 0%)" }}
            exit={{ clipPath: "circle(0% at 100% 0%)" }}
            transition={{ duration: 0.5, ease: [0.7, 0, 0.3, 1] }}
            className="fixed inset-0 top-0 -z-10 flex flex-col justify-center bg-sun px-8 md:hidden"
          >
            {links.map((l, i) => (
              <motion.a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.05 }}
                className="display py-1 text-6xl text-ink"
              >
                {l.label}
              </motion.a>
            ))}
            <p className="mt-10 font-hand text-xl text-hot">Same minds, different arguments.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
