
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Download,
  MessageCircle,
  ChevronDown,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { profile } from '../../data/profile';
import { useTheme } from '../../contexts/ThemeContext';

const panels = [
  {
    tag: "Hello I'm",
    t1: 'Aman',
    t2: 'Chandel',
    sub: 'Full Stack Developer',
    det: 'MERN Stack',
    desc: profile.heroDescription,
    btns: 'primary',
  },
  {
    tag: 'What I Build',
    t1: 'Production',
    t2: 'Applications',
    sub: 'From concept to deployment',
    det: '200+ API Endpoints · 4 Payment Gateways',
    desc: 'I architect and build full-stack MERN applications — from REST APIs and database models to authentication systems, payment integrations, and production deployment.',
    btns: 'secondary',
  },
  {
    tag: 'Current Focus',
    t1: 'Clean Code',
    t2: '& Systems',
    sub: 'Scalable architecture',
    det: 'React · Node.js · MongoDB',
    desc: 'Building systems that other developers enjoy working with. Thoughtful architecture, performance, and maintainability in every project.',
    btns: 'cta',
  },
];

function Buttons({ type }) {
  if (type === 'primary' || type === 'cta') {
    return (
      <div className="mt-10 flex flex-wrap items-center gap-4">
        <Link
          to="/projects"
          className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-accent text-white font-medium text-sm lg:text-base hover:bg-accent/90 transition-all duration-300 glow-accent"
        >
          View My Work
          <ArrowRight
            size={18}
            className="group-hover:translate-x-0.5 transition-transform"
          />
        </Link>

        <a
          href={profile.resumeUrl}
          download
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/15 text-foreground font-medium text-sm lg:text-base hover:border-accent hover:text-accent transition-all duration-300"
        >
          <Download size={18} />
          Download Resume
        </a>

        {type === 'cta' && (
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/15 text-foreground font-medium text-sm lg:text-base hover:border-accent hover:text-accent transition-all duration-300"
          >
            <MessageCircle size={18} />
            Let's Talk
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="mt-10 flex flex-wrap items-center gap-4">
      <Link
        to="/experience"
        className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-accent text-white font-medium text-sm lg:text-base hover:bg-accent/90 transition-all duration-300 glow-accent"
      >
        My Experience
        <ArrowRight
          size={18}
          className="group-hover:translate-x-0.5 transition-transform"
        />
      </Link>

      <Link
        to="/skills"
        className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/15 text-foreground font-medium text-sm lg:text-base hover:border-accent hover:text-accent transition-all duration-300"
      >
        View Skills
      </Link>
    </div>
  );
}

export default function Hero() {


  const { theme } = useTheme();
  const [idx, setIdx] = useState(0);

  const p = panels[idx];

  return (
    <section className="relative min-h-screen" id="home">
      <div className="relative min-h-screen">
        <div className="relative min-h-screen overflow-hidden">
          {/* Background */}
          <div
            className="absolute inset-0 radial-glow pointer-events-none"
            aria-hidden="true"
          />

          <div
            className="absolute inset-0 tech-grid pointer-events-none opacity-40"
            aria-hidden="true"
          />

          {/* Hero Content */}
          <motion.div className="relative z-10 min-h-screen flex items-center">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
              <AnimatePresence mode="wait">
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  transition={{
                    duration: 0.6,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  className="max-w-3xl"
                >
                  {/* Tag */}
                  <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="font-mono text-accent text-sm sm:text-base uppercase tracking-widest mb-4 flex items-center gap-3"
                  >
                    <span className="w-8 h-px bg-accent/60" />
                    {p.tag}
                  </motion.p>

                  {/* Heading */}
                  <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.15,
                      duration: 0.7,
                    }}
                    className="font-display text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-foreground leading-[1.05]"
                  >
                    {p.t1}{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-[#ff4d6d] to-accent">
                      {p.t2}
                    </span>
                  </motion.h1>

                  {/* Subtitle */}
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="mt-6 font-display text-xl sm:text-2xl lg:text-3xl font-semibold text-foreground/90"
                  >
                    {p.sub}

                    <span className="block mt-1 text-base sm:text-lg text-muted font-normal">
                      {p.det}
                    </span>
                  </motion.p>

                  {/* Description */}
                  <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="mt-6 text-muted text-sm sm:text-base max-w-xl leading-relaxed"
                  >
                    {p.desc}
                  </motion.p>

                  {/* Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                  >
                    <Buttons type={p.btns} />
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* 
            DOT NAVIGATION
            Same design, but now clickable.
            Scroll does NOT change the active panel.
          */}
          <div
            className="absolute right-6 sm:right-10 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3"
            aria-label="Hero slides navigation"
          >
            {panels.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIdx(i)}
                aria-label={`Show hero panel ${i + 1}`}
                aria-current={idx === i ? 'true' : 'false'}
                className={`w-2 h-2 rounded-full transition-all duration-500 cursor-pointer ${
                  idx === i
                    ? 'bg-accent scale-125 shadow-[0_0_8px_rgba(239,35,60,0.6)]'
                    : theme === 'dark' ? 'bg-white/20 hover:bg-red-700' : 'bg-black/20 hover:bg-red-700'
                    
                }`}
              />
            ))}
          </div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
            aria-hidden="true"
          >
            <span className="text-[10px] font-mono text-muted/40 uppercase tracking-widest">
              Scroll
            </span>

            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <ChevronDown
                size={16}
                className="text-muted/30"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
