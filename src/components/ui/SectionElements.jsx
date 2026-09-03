import { motion } from 'framer-motion';

export function SectionTag({ children, className = '' }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5 }}
      className={`inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-accent ${className}`}
    >
      <span className="w-8 h-px bg-accent/50" />
      {children}
    </motion.span>
  );
}

export function SectionTitle({ children, className = '' }) {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className={`font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight ${className}`}
    >
      {children}
    </motion.h2>
  );
}

export function PrimaryButton({ href, children, icon: Icon, external = false, className = '' }) {
  const base = `inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-white font-medium text-sm lg:text-base hover:bg-accent/90 transition-all duration-300 glow-accent group ${className}`;
  const content = (
    <>
      {children}
      {Icon && <Icon size={18} className="group-hover:translate-x-0.5 transition-transform" />}
    </>
  );
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={base}>
        {content}
      </a>
    );
  }
  return (
    <a href={href} className={base}>
      {content}
    </a>
  );
}

export function SecondaryButton({ href, children, icon: Icon, className = '' }) {
  return (
    <a
      href={href}
      className={`inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/15 text-foreground font-medium text-sm lg:text-base hover:border-accent hover:text-accent transition-all duration-300 ${className}`}
    >
      {children}
      {Icon && <Icon size={18} />}
    </a>
  );
}

export function MonoLabel({ children, className = '' }) {
  return (
    <span className={`font-mono text-xs text-muted tracking-widest uppercase ${className}`}>
      {children}
    </span>
  );
}
