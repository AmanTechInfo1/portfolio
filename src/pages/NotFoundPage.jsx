import { Link } from 'react-router-dom';
import { Home, FolderGit2, Code2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFoundPage() {
  return (
    <section className="min-h-screen flex items-center justify-center py-32 px-4 relative overflow-hidden">
      <div className="absolute inset-0 radial-glow pointer-events-none" aria-hidden="true" />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative text-center max-w-lg"
      >
        <p className="font-mono text-accent text-2xl font-bold">404</p>
        <h1 className="mt-4 font-display text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
          Page Not Found
        </h1>
        <p className="mt-4 text-muted text-sm sm:text-base">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-white font-medium hover:bg-accent/90 transition-all duration-300 glow-accent"
          >
            <Home size={16} />
            Back Home
          </Link>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/15 text-foreground font-medium hover:border-accent hover:text-accent transition-all duration-300"
          >
            <FolderGit2 size={16} />
            View Projects
          </Link>
          <Link
            to="/skills"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/15 text-foreground font-medium hover:border-accent hover:text-accent transition-all duration-300"
          >
            <Code2 size={16} />
            Skills
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
