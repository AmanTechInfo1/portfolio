import { motion } from 'framer-motion';
import { services } from '../../data/skills';
import { SectionTag, SectionTitle } from '../ui/SectionElements';

export default function Services() {
  return (
    <section id="services" className="py-20 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 tech-grid opacity-50 pointer-events-none" aria-hidden="true" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <SectionTag>What I Build</SectionTag>
            <SectionTitle className="mt-4">
              Capabilities
              <br />
              <span className="text-accent">& Services</span>
            </SectionTitle>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: index * 0.06 }}
              className="group p-6 rounded-2xl border border-white/[0.06] bg-surface/60 backdrop-blur-sm hover:bg-surface hover:border-accent/30 transition-all duration-300"
              data-cursor
            >
              <span className="font-mono text-xs text-accent">
                /{String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-3 font-display text-lg font-semibold text-foreground group-hover:text-accent transition-colors">
                {service.title}
              </h3>
              <p className="mt-3 text-sm text-muted leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
