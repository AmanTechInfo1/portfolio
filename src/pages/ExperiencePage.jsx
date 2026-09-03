import Experience from '../components/sections/Experience';
import Education from '../components/sections/Education';
import Workflow from '../components/sections/Workflow';
import Contact from '../components/sections/Contact';
import { SectionTag, SectionTitle } from '../components/ui/SectionElements';

export default function ExperiencePage() {
  return (
    <>
      <section className="pt-32 lg:pt-40 pb-12 lg:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTag>Experience</SectionTag>
          <SectionTitle className="mt-4">
            Where I've Built
            <br />
            <span className="text-muted">Real Things.</span>
          </SectionTitle>
        </div>
      </section>
      <Experience />
      <Education />
      <Workflow />
      <Contact />
    </>
  );
}
