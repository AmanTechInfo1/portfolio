import { motion } from 'framer-motion';
import { profile } from '../../data/profile';
import { SectionTag, SectionTitle } from '../ui/SectionElements';

export default function About() {
  return (
    <section id="about" className="py-20 lg:py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTag>About Me</SectionTag>
        <SectionTitle className="mt-4">
          Developer. Builder.
          <br />
          <span className="text-muted">Problem Solver.</span>
        </SectionTitle>

        <div className="mt-12 lg:mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Large editorial text */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <p className="font-display text-xl lg:text-2xl text-foreground leading-relaxed">
              I'm a full stack developer with <span className="text-accent">3 years</span> of
              experience turning complex ideas into{' '}
              <span className="text-accent">production-grade applications</span>.
            </p>
            <p className="text-muted leading-relaxed">
              My journey has taken me through the entire development lifecycle — from
              architecting REST APIs and modelling databases to building authentication
              systems, integrating payment gateways, and deploying to production.
            </p>
            <p className="text-muted leading-relaxed">
              I specialize in the <span className="text-foreground">MERN stack</span>, working
              directly with clients to understand their vision and translate it into
              scalable, maintainable technology. Whether it's a subscription learning
              platform with AI-powered features or a complex instructor management system
              with real-time booking, I bring a{' '}
              <span className="text-foreground">detail-oriented</span> approach to every project.
            </p>
            <p className="text-muted leading-relaxed">
              Beyond shipping code, I care about architecture decisions, performance,
              and building systems that other developers enjoy working with.
            </p>
          </motion.div>

          {/* Key highlights */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { label: 'Experience', value: '3 Years' },
              { label: 'Stack', value: 'MERN' },
              { label: 'API Endpoints', value: '200+' },
              { label: 'Payment Gateways', value: '4' },
              { label: 'Roles Built', value: 'Admin / Instructor / Student' },
              { label: 'Focus', value: 'Production-grade' },
            ].map((item) => (
              <div
                key={item.label}
                className="p-5 rounded-xl border border-white/[0.06] bg-surface hover:border-accent/30 hover:bg-surface-light transition-all duration-300"
              >
                <p className="text-xs text-muted uppercase tracking-widest mb-2">{item.label}</p>
                <p className="font-display font-semibold text-foreground">{item.value}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
