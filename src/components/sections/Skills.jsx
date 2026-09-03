import { motion } from 'framer-motion';
import { Monitor, Server, Database, CreditCard, Wrench, Layout, Network, Code2 } from 'lucide-react';
import { skills } from '../../data/skills';
import { SectionTag, SectionTitle } from '../ui/SectionElements';

const iconMap = {
  monitor: Monitor,
  server: Server,
  database: Database,
  'credit-card': CreditCard,
  wrench: Wrench,
  layout: Layout,
  network: Network,
};

export default function Skills() {
  return (
    <section id="skills" className="py-20 lg:py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <SectionTag>Skills</SectionTag>
            <SectionTitle className="mt-4">
              Tools of
              <br />
              <span className="text-muted">My Trade</span>
            </SectionTitle>
          </div>
          <p className="text-muted max-w-sm lg:text-right">
            Technologies and tools I use to design, build, and deploy production applications.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((group, index) => {
            const Icon = iconMap[group.icon] || Code2;
            return (
              <motion.div
                key={group.category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group p-6 rounded-2xl border border-white/[0.06] bg-surface hover:border-accent/30 hover:bg-surface-light transition-all duration-300"
                data-cursor
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                    <Icon size={20} className="text-accent" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    {group.category}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 rounded-full text-xs font-mono text-muted border border-white/[0.08] hover:border-accent/40 hover:text-accent hover:bg-accent/5 transition-all duration-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
