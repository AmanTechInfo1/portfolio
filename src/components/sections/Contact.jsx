import { motion } from 'framer-motion';
import { Mail, Download, Linkedin, ArrowRight } from 'lucide-react';
import { profile } from '../../data/profile';

export default function Contact() {
  return (
    <section id="contact" className="py-24 lg:py-40 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 radial-glow pointer-events-none" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-foreground leading-tight">
            Let's Build
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-[#ff4d6d] to-accent">
              Something Great.
            </span>
          </h2>

          <p className="mt-6 text-muted text-base sm:text-lg">
            Have an idea, project, or opportunity?
            <br className="hidden sm:block" />
            Let's talk.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href={`mailto:${profile.email}`}
              className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-accent text-white font-medium hover:bg-accent/90 transition-all duration-300 glow-accent"
            >
              <Mail size={18} />
              Email Me
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </a>

            {/* {profile.linkedinUrl ? (
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full border border-white/15 text-foreground font-medium hover:border-accent hover:text-accent transition-all duration-300"
              >
                <Linkedin size={18} />
                LinkedIn
              </a>
            ) : (
              <span
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full border border-white/10 text-muted/50 font-medium cursor-not-allowed"
                title="LinkedIn URL to be added"
              >
                <Linkedin size={18} />
                LinkedIn (Add URL)
              </span>
            )} */}

            {/* <a
              href={profile.resumeUrl}
              download
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full border border-white/15 text-foreground font-medium hover:border-accent hover:text-accent transition-all duration-300"
            >
              <Download size={18} />
              Download Resume
            </a> */}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
