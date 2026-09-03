
import { Link } from 'react-router-dom';
import {
  Mail,
  // Linkedin,
  Home,
  User,
  FolderGit2,
  Code2,
  Briefcase,
  PhoneCall,
} from 'lucide-react';
import { profile } from '../../data/profile';

export default function Footer() { 
  
  console.log({
  Mail,
  // Linkedin,
  Home,
  User,
  FolderGit2,
  Code2,
  Briefcase,
  PhoneCall,
});
  
  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'About', path: '/about', icon: User },
    { label: 'Projects', path: '/projects', icon: FolderGit2 },
    { label: 'Skills', path: '/skills', icon: Code2 },
    { label: 'Experience', path: '/experience', icon: Briefcase },
    { label: 'Contact', path: '/contact', icon: PhoneCall },
  ];

  return (
    <footer
  className="
    relative
    z-50
    pointer-events-auto
    border-t
    border-white/[0.06]
    bg-surface/30
  "
>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">

          {/* Brand */}
          <div>
            <Link
              to="/"
              className="font-display text-2xl font-bold text-foreground"
            >
              AMAN<span className="text-accent">.</span>
            </Link>

            <p className="mt-3 text-sm text-muted">
              Full Stack Developer | MERN Stack
            </p>

            <p className="mt-4 text-xs text-muted/70 max-w-xs leading-relaxed">
              Building production-grade web applications with React, Node.js,
              MongoDB, and modern technology.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-foreground mb-4">
              Navigate
            </h3>

            <div className="flex flex-col gap-3">
              {navItems.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                   className="
    relative
    z-50
    pointer-events-auto
    text-sm
    text-muted
    hover:text-accent
    transition-colors
    flex
    items-center
    gap-2
    cursor-pointer
  "
                  >
                    {Icon && <Icon size={14} />}
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-foreground mb-4">
              Connect
            </h3>

            <div className="flex flex-col gap-3">

              <a
                href={`mailto:${profile.email}`}
                className="text-sm text-muted hover:text-accent transition-colors inline-flex items-center gap-2"
              >
                <Mail size={14} />
                {profile.email}
              </a>

              {/* {profile.linkedinUrl ? (
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted hover:text-accent transition-colors inline-flex items-center gap-2"
                >
                  <Linkedin size={14} />
                  LinkedIn
                </a>
              ) : (
                <span className="text-sm text-muted/50 inline-flex items-center gap-2">
                  <Linkedin size={14} />
                  <span className="italic text-xs">
                    LinkedIn URL to be added
                  </span>
                </span>
              )} */}

            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted/70">
            © 2026 {profile.name}. All rights reserved.
          </p>

          <p className="text-[11px] text-muted/50">
            Built with React + Tailwind CSS + Three.js
          </p>
        </div>
      </div>
    </footer>
  );
}
