import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext();

/* ── Accent presets ──────────────────────────────────────── */

const ACCENT_PRESETS = {
  red: {
    label: 'Red',
    primary: '#ef233c',
    bright: '#ff4056',
    dark: '#c41e30',
    glow: 'rgba(239, 35, 60, 0.35)',
    glowSubtle: 'rgba(239, 35, 60, 0.12)',
    selection: 'rgba(239, 35, 60, 0.3)',
    lightBg: 'rgba(239, 35, 60, 0.08)',
    // 3D scene mapping
    coreEmissive: '#ef233c',
    primaryBright3d: '#ff4056',
    accentLight3d: '#ef233c',
    vignette3d: 'radial-gradient(circle at center, transparent 35%, rgba(0,0,0,0.12) 65%, rgba(0,0,0,0.48) 100%)',
    vignetteLight3d: 'radial-gradient(circle at center, transparent 38%, rgba(255,255,255,0.05) 68%, rgba(148,163,184,0.16) 100%)',
  },
  purple: {
    label: 'Purple',
    primary: '#a855f7',
    bright: '#c084fc',
    dark: '#7e22ce',
    glow: 'rgba(168, 85, 247, 0.35)',
    glowSubtle: 'rgba(168, 85, 247, 0.12)',
    selection: 'rgba(168, 85, 247, 0.3)',
    lightBg: 'rgba(168, 85, 247, 0.08)',
    coreEmissive: '#a855f7',
    primaryBright3d: '#c084fc',
    accentLight3d: '#a855f7',
    vignette3d: 'radial-gradient(circle at center, transparent 35%, rgba(0,0,0,0.12) 65%, rgba(0,0,0,0.48) 100%)',
    vignetteLight3d: 'radial-gradient(circle at center, transparent 38%, rgba(255,255,255,0.05) 68%, rgba(148,163,184,0.16) 100%)',
  },
  blue: {
    label: 'Blue',
    primary: '#3b82f6',
    bright: '#60a5fa',
    dark: '#1d4ed8',
    glow: 'rgba(59, 130, 246, 0.35)',
    glowSubtle: 'rgba(59, 130, 246, 0.12)',
    selection: 'rgba(59, 130, 246, 0.3)',
    lightBg: 'rgba(59, 130, 246, 0.08)',
    coreEmissive: '#3b82f6',
    primaryBright3d: '#60a5fa',
    accentLight3d: '#3b82f6',
    vignette3d: 'radial-gradient(circle at center, transparent 35%, rgba(0,0,0,0.12) 65%, rgba(0,0,0,0.48) 100%)',
    vignetteLight3d: 'radial-gradient(circle at center, transparent 38%, rgba(255,255,255,0.05) 68%, rgba(148,163,184,0.16) 100%)',
  },
  green: {
    label: 'Green',
    primary: '#22c55e',
    bright: '#4ade80',
    dark: '#15803d',
    glow: 'rgba(34, 197, 94, 0.35)',
    glowSubtle: 'rgba(34, 197, 94, 0.12)',
    selection: 'rgba(34, 197, 94, 0.3)',
    lightBg: 'rgba(34, 197, 94, 0.08)',
    coreEmissive: '#22c55e',
    primaryBright3d: '#4ade80',
    accentLight3d: '#22c55e',
    vignette3d: 'radial-gradient(circle at center, transparent 35%, rgba(0,0,0,0.12) 65%, rgba(0,0,0,0.48) 100%)',
    vignetteLight3d: 'radial-gradient(circle at center, transparent 38%, rgba(255,255,255,0.05) 68%, rgba(148,163,184,0.16) 100%)',
  },
};

/* ── Helpers ─────────────────────────────────────────────── */

function loadSetting(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v !== null ? v : fallback;
  } catch {
    return fallback;
  }
}

function loadBool(key, fallback) {
  const v = loadSetting(key, String(fallback));
  return v === 'true';
}

/* ── Provider ────────────────────────────────────────────── */

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => loadSetting('portfolio-theme', 'dark'));
  const [accentKey, setAccentKey] = useState(() => loadSetting('portfolio-accent', 'red'));
  const [threeDEffects, setThreeDEffects] = useState(() => loadBool('portfolio-3d', true));
  const [animationIntensity, setAnimationIntensity] = useState(() => loadSetting('portfolio-anim', 'normal'));
  const [bgEffects, setBgEffects] = useState(() => loadBool('portfolio-bgfx', true));

  const accent = ACCENT_PRESETS[accentKey] || ACCENT_PRESETS.red;

  /* Apply theme class + accent CSS variables */
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'light');
    root.classList.add(theme);
    root.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);

    // Accent CSS custom properties (runtime-dynamic)
    root.style.setProperty('--accent', accent.primary);
    root.style.setProperty('--accent-bright', accent.bright);
    root.style.setProperty('--accent-dark', accent.dark);
    root.style.setProperty('--accent-glow', accent.glow);
    root.style.setProperty('--accent-glow-subtle', accent.glowSubtle);
    root.style.setProperty('--accent-selection', accent.selection);
    root.style.setProperty('--accent-light-bg', accent.lightBg);

    // Keep Tailwind @theme --color-accent in sync
    root.style.setProperty('--color-accent', accent.primary);
  }, [theme, accent]);

  /* Persist settings */
  useEffect(() => { localStorage.setItem('portfolio-accent', accentKey); }, [accentKey]);
  useEffect(() => { localStorage.setItem('portfolio-3d', String(threeDEffects)); }, [threeDEffects]);
  useEffect(() => { localStorage.setItem('portfolio-anim', animationIntensity); }, [animationIntensity]);
  useEffect(() => { localStorage.setItem('portfolio-bgfx', String(bgEffects)); }, [bgEffects]);

  const toggleTheme = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), []);

  const value = {
    theme,
    toggleTheme,
    accentKey,
    setAccentKey,
    accent,
    ACCENT_PRESETS,
    threeDEffects,
    setThreeDEffects,
    animationIntensity,
    setAnimationIntensity,
    bgEffects,
    setBgEffects,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
