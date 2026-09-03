import Hero from '../components/sections/Hero';
import HeroScene from '../components/three/HeroScene';
import TechnologyMarquee from '../components/sections/TechnologyMarquee';
import About from '../components/sections/About';
import ProjectsSection from '../components/sections/ProjectsSection';
import Skills from '../components/sections/Skills';
import Experience from '../components/sections/Experience';
import Education from '../components/sections/Education';
import Services from '../components/sections/Services';
import Workflow from '../components/sections/Workflow';
import Contact from '../components/sections/Contact';

export default function HomePage() {
  return (
    <>
      <HeroScene />
      <Hero />
      <TechnologyMarquee />
      <About />
      <ProjectsSection />
      <Skills />
      <Experience />
      <Education />
      <Services />
      <Workflow />
      <Contact />
    </>
  );
}
