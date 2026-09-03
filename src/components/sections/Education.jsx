import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import { education } from '../../data/experience';
import { SectionTag, SectionTitle, MonoLabel } from '../ui/SectionElements';

export default function Education() {
  return (
    <section id="education" className="py-16 lg:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTag>Education</SectionTag>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mt-8"
        >
          {education.map((edu) => (
            <div
              key={edu.degree}
              className="max-w-2xl p-6 sm:p-8 rounded-2xl border border-white/[0.06] bg-surface"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                  <GraduationCap size={20} className="text-accent" />
                </div>
                <div>
                  <h3 className="font-display text-xl lg:text-2xl font-bold text-foreground">
                    {edu.degree}
                  </h3>
                  <p className="mt-1 text-accent font-medium">{edu.institution}</p>
                  <div className="mt-3 flex flex-wrap gap-4">
                    <MonoLabel>{edu.period}</MonoLabel>
                    <span className="font-mono text-xs text-muted">
                      CGPA: <span className="text-foreground">{edu.cgpa}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
