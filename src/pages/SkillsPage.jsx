import Skills from '../components/sections/Skills';
import Services from '../components/sections/Services';
import TechnologyMarquee from '../components/sections/TechnologyMarquee';
import { SectionTag, SectionTitle } from '../components/ui/SectionElements';

export default function SkillsPage() {
  return (
    <>
      <section className="pt-32 lg:pt-40 pb-12 lg:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTag>Skills</SectionTag>
          <SectionTitle className="mt-4">
            Tools of
            <br />
            <span className="text-muted">My Trade</span>
          </SectionTitle>
          <p className="mt-4 text-muted max-w-xl">
            Technologies and tools I use to design, build, and deploy production applications.
          </p>
        </div>
      </section>
      <TechnologyMarquee />
      <Skills />
      <Services />
    </>
  );
}
