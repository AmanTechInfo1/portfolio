import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ExternalLink, CheckCircle2, Workflow as WorkflowIcon, Layers, Monitor, Database, Shield, CreditCard, Brain, Calendar, LineChart, ArrowUpRight } from 'lucide-react';
import { projects } from '../data/projects';
import { SectionTag, MonoLabel } from '../components/ui/SectionElements';
import Contact from '../components/sections/Contact';

const archIconMap = {
  frontend: Monitor,
  backend: WorkflowIcon,
  database: Database,
  authentication: Shield,
  payments: CreditCard,
  ai: Brain,
  booking: Calendar,
  analytics: LineChart,
};

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return <Navigate to="/projects" replace />;
  }

  const nextProject = projects[(project.id % projects.length)];

  return (
    <>
      {/* Project Hero */}
      <section className="pt-28 lg:pt-36 pb-12 lg:pb-16 relative overflow-hidden">
        <div className="absolute inset-0 radial-glow pointer-events-none" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-accent transition-colors mb-8"
          >
            <ArrowLeft size={16} />
            Back to Projects
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <MonoLabel>Project {String(project.id).padStart(2, '0')}</MonoLabel>
            <h1 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
              {project.name}
            </h1>
            <p className="mt-3 text-muted">{project.category}</p>
            <p className="mt-6 text-muted max-w-2xl leading-relaxed">{project.description}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-white font-medium hover:bg-accent/90 transition-all duration-300 glow-accent"
                >
                  <ExternalLink size={16} />
                  Live Project
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/15 text-foreground font-medium hover:border-accent hover:text-accent transition-all duration-300"
                >
                  <ArrowUpRight size={16} />
                  GitHub
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Project image / visual */}
      <section className="py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-white/[0.06] overflow-hidden bg-gradient-to-br from-[#0a0a0a] via-[#111827] to-[#1a0a0d] aspect-[21/9] flex items-center justify-center">
            <div className="text-center px-6">
              <span className="font-mono text-accent text-2xl sm:text-4xl font-semibold">
                {String(project.id).padStart(2, '0')}
              </span>
              <p className="mt-4 font-display text-2xl sm:text-4xl font-bold text-foreground/90">
                {project.name}
              </p>
              <p className="mt-3 text-muted text-sm sm:text-base">{project.category}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-10 lg:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14">
            <div className="lg:col-span-2">
              <SectionTag>Overview</SectionTag>
              <h2 className="mt-3 font-display text-2xl lg:text-3xl font-bold text-foreground">
                Project Overview
              </h2>
              <p className="mt-4 text-muted leading-relaxed">{project.description}</p>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-white/[0.06] bg-surface">
                  <p className="text-xs text-muted uppercase tracking-widest mb-1">My Role</p>
                  <p className="font-medium text-foreground">{project.role}</p>
                </div>
                <div className="p-4 rounded-xl border border-white/[0.06] bg-surface">
                  <p className="text-xs text-muted uppercase tracking-widest mb-1">Duration</p>
                  <p className="font-medium text-foreground">{project.duration}</p>
                </div>
              </div>
            </div>

            <div>
              <div className="sticky top-24">
                <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-muted mb-4">
                  Tech Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 rounded-full text-xs font-mono text-muted border border-white/[0.08] hover:border-accent/40 hover:text-accent transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Key Features */}
      <section className="py-10 lg:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTag>Features</SectionTag>
          <h2 className="mt-3 font-display text-2xl lg:text-3xl font-bold text-foreground">
            Key Features
          </h2>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {project.features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="flex items-start gap-3 p-4 rounded-xl border border-white/[0.06] bg-surface hover:border-accent/30 transition-colors"
              >
                <CheckCircle2 size={18} className="text-accent mt-0.5 shrink-0" />
                <span className="text-sm text-muted leading-relaxed">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Architecture */}
      <section className="py-10 lg:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTag>Architecture</SectionTag>
          <h2 className="mt-3 font-display text-2xl lg:text-3xl font-bold text-foreground">
            Technical Architecture
          </h2>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(project.architecture).map(([key, value]) => {
              const Icon = archIconMap[key] || Layers;
              return (
                <div
                  key={key}
                  className="p-5 rounded-xl border border-white/[0.06] bg-surface hover:border-accent/30 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Icon size={18} className="text-accent" />
                    <span className="text-xs font-semibold uppercase tracking-widest text-muted">
                      {key}
                    </span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{value}</p>
                </div>
              );
            })}
          </div>
        </div>

      {/* Challenges & Solutions */}
      {(project.challenges?.length > 0 || project.solutions?.length > 0) && (
        <section className="py-10 lg:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTag>Process</SectionTag>
            <h2 className="mt-3 font-display text-2xl lg:text-3xl font-bold text-foreground">
              Challenges & Solutions
            </h2>

            {project.challenges?.length > 0 && (
              <div className="mt-8">
                <h3 className="font-display text-lg font-semibold text-accent mb-4">Challenges</h3>
                <div className="space-y-4">
                  {project.challenges.map((challenge, i) => (
                    <div key={i} className="flex gap-3 p-4 rounded-xl border border-white/[0.06] bg-surface">
                      <span className="font-mono text-accent text-sm font-bold shrink-0">
                        C{i + 1}
                      </span>
                      <p className="text-sm text-muted leading-relaxed">{challenge}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {project.solutions?.length > 0 && (
              <div className="mt-8">
                <h3 className="font-display text-lg font-semibold text-foreground mb-4">Solutions</h3>
                <div className="space-y-4">
                  {project.solutions.map((solution, i) => (
                    <div key={i} className="flex gap-3 p-4 rounded-xl border border-white/[0.06] bg-surface hover:border-accent/30 transition-colors">
                      <span className="font-mono text-foreground text-sm font-bold shrink-0">
                        S{i + 1}
                      </span>
                      <p className="text-sm text-muted leading-relaxed">{solution}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Next Project */}
      <section className="py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to={`/projects/${nextProject.slug}`}
            className="group flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 sm:p-8 rounded-2xl border border-white/[0.06] bg-surface hover:border-accent/30 transition-all duration-300 card-shine"
          >
            <div>
              <p className="font-mono text-xs text-accent uppercase tracking-widest">
                Next Project
              </p>
              <h3 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-foreground group-hover:text-accent transition-colors">
                {nextProject.name}
              </h3>
              <p className="mt-1 text-sm text-muted">{nextProject.category}</p>
            </div>
            <div className="w-12 h-12 rounded-full border border-white/15 flex items-center justify-center group-hover:bg-accent group-hover:border-accent group-hover:text-white transition-all duration-300 shrink-0">
              <ArrowRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      <Contact />
          </section>
</>
  );
}

