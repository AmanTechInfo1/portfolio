import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, MessageCircle, Sun, Moon, Volume2, VolumeX } from 'lucide-react';
import { useScrollY, useIsMobile } from '../../hooks/useMediaQueries';
import { useTheme } from '../../contexts/ThemeContext';
import { useAudio } from '../../hooks/useAudio';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Projects', path: '/projects' },
  { label: 'Skills', path: '/skills' },
  { label: 'Experience', path: '/experience' },
  { label: 'Contact', path: '/contact' },
];

function SoundBars({ bars }) {
  return (
    <div className="flex items-end gap-[2px] h-4" aria-hidden="true">
      {bars.map((h, i) => (
        <div key={i} className="w-[2px] bg-accent rounded-full transition-all duration-75"
          style={{ height: `${Math.max(3, h * 16)}px` }} />
      ))}
    </div>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const scrollY = useScrollY();
  const isMobile = useIsMobile();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { isPlaying, toggle: toggleSound, bars } = useAudio();

  useEffect(() => {
    const updateScrolled = () => setScrolled(window.scrollY > 50);
    updateScrolled();
    window.addEventListener('scroll', updateScrolled, { passive: true });
    return () => window.removeEventListener('scroll', updateScrolled);
  }, []);

  useEffect(() => { setIsOpen(false); }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const isNotHome = location.pathname !== '/';
  const showGlass = (isNotHome || scrolled) && !isOpen;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      showGlass ? 'bg-background/80 backdrop-blur-xl border-b border-white/[0.06]' : 'bg-transparent border-b border-transparent'
    }`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to="/" className="font-display text-xl lg:text-2xl font-bold tracking-tight text-foreground hover:text-accent transition-colors" aria-label="Aman Chandel - Home">
            AMAN<span className="text-accent">.</span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <NavLink key={item.path} to={item.path} end={item.path === '/'}
                className={({ isActive }) => `nav-link text-sm font-medium text-muted hover:text-foreground transition-colors ${isActive && location.pathname === item.path ? 'active' : ''}`}>
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <button onClick={toggleSound}
              className="flex items-center gap-2 px-3 py-2 rounded-full border border-white/10 hover:border-accent/40 text-muted hover:text-foreground transition-all duration-300"
              aria-label={isPlaying ? 'Mute sound' : 'Play ambient sound'}>
              {isPlaying ? <Volume2 size={16} className="text-accent" /> : <VolumeX size={16} />}
              {isPlaying && <SoundBars bars={bars} />}
            </button>
            <button onClick={toggleTheme}
              className="p-2.5 rounded-full border border-white/10 hover:border-accent/40 text-muted hover:text-foreground transition-all duration-300"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <Link to="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent/10 border border-accent/30 text-accent text-sm font-medium hover:bg-accent hover:text-white transition-all duration-300 glow-accent">
              <MessageCircle size={16} />Let's Talk
            </Link>
          </div>

          <div className="lg:hidden flex items-center gap-2">
            <button onClick={toggleSound} className="p-2 rounded-full text-muted hover:text-foreground transition-colors" aria-label={isPlaying ? 'Mute sound' : 'Play ambient sound'}>
              {isPlaying ? <Volume2 size={18} className="text-accent" /> : <VolumeX size={18} />}
            </button>
            <button onClick={toggleTheme} className="p-2 rounded-full text-muted hover:text-foreground transition-colors" aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="text-muted hover:text-foreground transition-colors" onClick={() => setIsOpen(!isOpen)} aria-label={isOpen ? 'Close menu' : 'Open menu'} aria-expanded={isOpen}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {isOpen && (
        <div className="lg:hidden fixed inset-0 top-16 bg-background/95 backdrop-blur-xl z-40">
          <div className="flex flex-col items-center gap-8 pt-16 px-6">
            {navItems.map((item, index) => (
              <NavLink key={item.path} to={item.path} end={item.path === '/'}
                className={({ isActive }) => `font-display text-2xl font-semibold transition-colors ${isActive && location.pathname === item.path ? 'text-accent' : 'text-foreground hover:text-accent'}`}
                style={{ transitionDelay: `${index * 50}ms` }}>
                {item.label}
              </NavLink>
            ))}
            <Link to="/contact" className="mt-4 inline-flex items-center gap-2 px-8 py-3 rounded-full bg-accent text-white font-medium hover:bg-accent/90 transition-colors">
              <MessageCircle size={16} />Let's Talk
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
