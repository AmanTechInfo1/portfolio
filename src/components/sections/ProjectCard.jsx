import { motion } from 'framer-motion';
import { ArrowUpRight, BookOpen, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRef, useState } from 'react';

export default function ProjectCard({ project, index }) {
  const [hovered, setHovered] = useState(false);
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    containerRef.current.style.transform = `perspective(1000px) rotateY(${x * 6}deg) rotateX(${y * -6}deg)`;
  };

  const handleMouseLeave = () => {
    if (!containerRef.current) return;
    containerRef.current.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
    setHovered(false);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay: index * 0.1 }}
      className="group relative"  
      data-cursor
    >
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        className={`project-tilt card-shine rounded-3xl border overflow-hidden ${
          hovered
            ? 'border-accent/40 bg-surface-light shadow-[0_0_60px_var(--accent-glow-subtle)]'
            : 'border-white/[0.07] bg-surface'
        } transition-all duration-500`}
      >
        {/* Image area */}
        <div className="relative aspect-[16/9] overflow-hidden">
          <div
  className="
    absolute inset-0 flex items-center justify-center
    bg-gradient-to-br
    from-[#0a0a0a] via-[#111827] to-[#1a0a0d]
     [html.light_&]:from-[#b6daff]
    [html.light_&]:via-[#ffffff]
    [html.light_&]:to-[#ffd4e6]
  "
>
  <div className="text-center px-6">
    <span className="font-mono text-accent text-lg lg:text-2xl font-semibold">
      {String(project.id).padStart(2, '0')}
    </span>

    <div className="mt-4 w-24 h-px bg-accent/40 mx-auto" />

    <p className="mt-4 font-display text-xl lg:text-3xl font-bold text-foreground/90">
      {project.name}
    </p>
  </div>
</div>
          {/* Hover overlay */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-500 ${hovered ? 'opacity-100' : 'opacity-0'}`} />
        </div>

        {/* Content */}
        <div className="p-6 lg:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="font-mono text-xs text-accent uppercase tracking-widest">
                Project {String(project.id).padStart(2, '0')}
              </span>
              <h3 className={`mt-2 font-display text-2xl lg:text-3xl font-bold text-foregrund transition-transform duration-500 ${hovered ? 'lg:translate-x-1' : ''}`}>
                {project.name}
              </h3>
              <p className="mt-1 text-sm text-muted">{project.category}</p>
            </div>
            <div className={`shrink-0 w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-500 ${hovered ? 'bg-accent border-accent text-white rotate-45' : 'border-white/15 text-muted'}`}>
               {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
             <ArrowUpRight size={20} />
               
              </a>
            )} 
            </div>
          </div>

          <p className="mt-4 text-muted text-sm leading-relaxed">{project.shortDescription}</p>

          {/* Tech badges */}
          <div className="mt-5 flex flex-wrap gap-2">
            {project.technologies.slice(0, 6).map((tech, i) => (
              <span
                key={tech}
                className="px-2.5 py-1 rounded-full text-[11px] font-mono text-muted border border-white/[0.08] hover:border-accent/40 hover:text-accent transition-all duration-300"
                style={{ transitionDelay: `${i * 30}ms` }}
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 6 && (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-mono text-muted border border-white/[0.08]">
                +{project.technologies.length - 6} more
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              to={`/projects/${project.slug}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent/10 border border-accent/30 text-accent text-sm font-medium hover:bg-accent hover:text-white transition-all duration-300"
            >
              <BookOpen size={15} />
              Case Study
            </Link>

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/15 text-foreground text-sm font-medium hover:border-accent hover:text-accent transition-all duration-300"
              >
                <ArrowUpRight size={15} />
                Live Demo
              </a>
            )}

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/15 text-foreground text-sm font-medium hover:border-accent hover:text-accent transition-all duration-300"
              >
                <Lock size={15} className="hidden" />
                GitHub
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
