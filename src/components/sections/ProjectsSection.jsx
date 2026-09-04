import { projects } from '../../data/projects';
import { SectionTag, SectionTitle } from '../ui/SectionElements';
import ProjectCard from './ProjectCard';

export default function ProjectsSection() {
  return (
    <section id="projects" className="py-20 lg:py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <SectionTag>Portfolio</SectionTag>
            <SectionTitle className="mt-4">
              Selected
              <br />
              <span className="text-accent">Work</span>
            </SectionTitle>
          </div>
          <p className="text-muted max-w-sm lg:text-right">
            A selection of production-grade applications I've designed and developed.
          </p>
        </div>

        <div className="mt-14 lg:mt-20 space-y-8 lg:space-y-12" style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(500px, 100%), 1fr))',
    gap: '30px',
  }}>
          {projects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
