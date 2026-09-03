import { motion } from 'framer-motion';
import { Briefcase, MapPin, Calendar } from 'lucide-react';
import { experience } from '../../data/experience';
import { SectionTag, SectionTitle, MonoLabel } from '../ui/SectionElements';

export default function Experience() {
  return (
    <section id="experience" className="py-20 lg:py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTag>Experience</SectionTag>
        <SectionTitle className="mt-4">
          Where I've Built
          <br />
          <span className="text-muted">Real Things.</span>
        </SectionTitle>

        <div className="mt-14 relative">
          {/* Timeline line */}
          <div className="absolute left-4 lg:left-1/2 top-0 bottom-0 w-px bg-white/[0.08] lg:translate-x-[-0.5px]" aria-hidden="true" />

          <div className="space-y-12 lg:space-y-20">
            {experience.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7, delay: index * 0.1 }}
                className={`relative lg:grid lg:grid-cols-2 gap-8 lg:gap-16 pl-12 lg:pl-0 ${
                  index % 2 === 0 ? '' : ''
                }`}
              >
                {/* Timeline dot */}
                <div className="absolute left-4 lg:left-1/2 top-2 -translate-x-1/2 w-3 h-3 rounded-full bg-accent glow-accent" aria-hidden="true" />

                <div className={`${index % 2 === 0 ? 'lg:pr-16 lg:text-right' : 'lg:pl-16 lg:col-start-2'}`}>
                  <div
                    className={`group p-6 sm:p-8 rounded-2xl border border-white/[0.06] bg-surface hover:border-accent/30 transition-all duration-300 ${
                      index % 2 === 0 ? 'lg:mr-auto' : 'lg:ml-auto'
                    }`}
                  >
                    <div className={`flex flex-wrap items-center gap-3 ${index % 2 === 0 ? 'lg:justify-end' : ''}`}>
                      <MonoLabel>{exp.period}</MonoLabel>
                      <span className="px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[11px] font-medium uppercase tracking-wider">
                        {exp.type}
                      </span>
                    </div>

                    <h3 className="mt-4 font-display text-xl lg:text-2xl font-bold text-foreground">
                      {exp.role}
                    </h3>
                    <p className="mt-1 font-medium text-accent">{exp.company}</p>
                    {exp.context && (
                      <p className="mt-1 text-sm text-muted flex items-center gap-2">
                        <Briefcase size={14} className="shrink-0" />
                        {exp.context}
                      </p>
                    )}
                    {exp.location && (
                      <p className="mt-1 text-sm text-muted flex items-center gap-2">
                        <MapPin size={14} className="shrink-0" />
                        {exp.location}
                      </p>
                    )}

                    {exp.description && (
                      <p className="mt-4 text-muted text-sm leading-relaxed">{exp.description}</p>
                    )}

                    <div className={`mt-5 flex flex-wrap gap-2 ${index % 2 === 0 ? 'lg:justify-end' : ''}`}>
                      {exp.highlights?.map((h) => (
                        <span
                          key={h}
                          className="px-3 py-1.5 rounded-full text-xs text-muted border border-white/[0.08] hover:border-accent/40 hover:text-foreground transition-colors"
                        >
                          {h}
                        </span>
                      ))}
                    </div>

                    <div className={`mt-5 pt-5 border-t border-white/[0.06]`}>
                      <p className={`text-xs font-semibold uppercase tracking-widest text-muted mb-3 ${index % 2 === 0 ? 'lg:text-right' : ''}`}>
                        Key Responsibilities
                      </p>
                      <ul className={`space-y-2.5 text-sm text-muted leading-relaxed ${index % 2 === 0 ? 'lg:text-right' : ''}`}>
                        {exp.responsibilities.map((resp, i) => (
                          <li key={i} className="flex gap-2.5 lg:flex-row-reverse">
                            <span className="text-accent mt-0.5 shrink-0">›</span>
                            <span>{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
