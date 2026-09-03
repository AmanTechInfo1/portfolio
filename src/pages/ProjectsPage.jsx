import { projects } from '../data/projects';
import { SectionTag, SectionTitle } from '../components/ui/SectionElements';
import ProjectCard from '../components/sections/ProjectCard';
import Contact from '../components/sections/Contact';

export default function ProjectsPage() {
  return (
    <>
      <section className="pt-32 lg:pt-40 pb-12 lg:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTag>Portfolio</SectionTag>
          <SectionTitle className="mt-4">
            Selected
            <br />
            <span className="text-accent">Work</span>
          </SectionTitle>
          <p className="mt-4 text-muted max-w-xl">
            A selection of production-grade applications I've designed and developed.
          </p>
        </div>
      </section>

      <section className="py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 lg:space-y-12">
          {projects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index} />
          ))}
        </div>
      </section>

      <Contact />
    </>
  );
}
