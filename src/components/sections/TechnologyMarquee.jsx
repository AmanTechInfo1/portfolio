import { marqueeSkills } from '../../data/skills';

export default function TechnologyMarquee() {
  const items = [...marqueeSkills, ...marqueeSkills];

  return (
    <section className="py-12 lg:py-16 border-y border-white/[0.04] bg-surface/20 overflow-hidden relative" aria-label="Technologies">
      <div className="flex items-center">
        <div className="flex whitespace-nowrap animate-marquee">
          {items.map((tech, index) => (
            <span
              key={index}
              className="mx-6 lg:mx-8 inline-flex items-center"
              data-cursor
            >
              <span className="text-foreground/40 font-display text-lg lg:text-xl font-medium hover:text-accent transition-colors">
                {tech}
              </span>
              <span className="ml-6 lg:ml-8 text-accent/40">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* Edge fade */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent pointer-events-none" aria-hidden="true" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent pointer-events-none" aria-hidden="true" />
    </section>
  );
}
