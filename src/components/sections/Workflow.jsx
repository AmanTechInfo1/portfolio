import { motion } from 'framer-motion';
import { SectionTag, SectionTitle } from '../ui/SectionElements';

const workflowSteps = [
  { num: '01', title: 'Understand', desc: 'Deep-dive into requirements, goals, and constraints.' },
  { num: '02', title: 'Plan', desc: 'Map out architecture, data models, and workflows.' },
  { num: '03', title: 'Architect', desc: 'Design scalable systems with clear separation of concerns.' },
  { num: '04', title: 'Build', desc: 'Develop with clean, maintainable, tested code.' },
  { num: '05', title: 'Integrate', desc: 'Connect APIs, payments, third-party services, and AI.' },
  { num: '06', title: 'Test', desc: 'Validate functionality, edge cases, and performance.' },
  { num: '07', title: 'Deploy', desc: 'Ship to production and monitor for reliability.' },
];

export default function Workflow() {
  return (
    <section id="workflow" className="py-20 lg:py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTag>Process</SectionTag>
        <SectionTitle className="mt-4">
          How I
          <span className="text-accent"> Work</span>
        </SectionTitle>

        <div className="mt-14 relative">
          {/* Connecting line */}
          <div className="absolute left-[27px] lg:left-0 top-0 bottom-0 w-px lg:w-full lg:h-px bg-gradient-to-b lg:bg-gradient-to-r from-accent/30 via-white/10 to-accent/30" aria-hidden="true" />

          <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 lg:gap-0 relative">
            {workflowSteps.map((step, index) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative flex lg:flex-col items-start lg:items-center gap-4 lg:gap-0 px-4"
              >
                {/* Dot */}
                <div className="relative z-10 shrink-0 w-14 h-14 rounded-full border-2 border-accent/40 bg-background flex items-center justify-center">
                  <span className="font-mono text-accent text-sm font-bold">{step.num}</span>
                </div>

                <div className="lg:text-center lg:mt-4 lg:px-2">
                  <h3 className="font-display text-base font-semibold text-foreground uppercase tracking-wider">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-xs text-muted leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Animated progression hint */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="font-mono text-sm text-muted">
            From <span className="text-accent">idea</span> to{' '}
            <span className="text-accent">production</span> — a complete delivery cycle.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
