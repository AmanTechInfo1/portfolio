import { motion } from 'framer-motion';
import { profile } from '../data/profile';
import { SectionTag, SectionTitle } from '../components/ui/SectionElements';
import { PrimaryButton } from '../components/ui/SectionElements';
import TechnologyMarquee from '../components/sections/TechnologyMarquee';
import About from '../components/sections/About';
import Education from '../components/sections/Education';
import Services from '../components/sections/Services';
import Workflow from '../components/sections/Workflow';
import Contact from '../components/sections/Contact';

export default function AboutPage() {
  return (
    <>
      <section className="pt-32 lg:pt-40 pb-12 lg:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <SectionTag>About</SectionTag>
            <SectionTitle className="mt-4">
              {profile.name}
              <br />
              <span className="text-muted text-xl sm:text-2xl lg:text-3xl font-display">
                {profile.title}
              </span>
            </SectionTitle>
          </motion.div>
        </div>
      </section>
      <TechnologyMarquee />
      <About />
      <Education />
      <Services />
      <Workflow />
      <Contact />
    </>
  );
}
