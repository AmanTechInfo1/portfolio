import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X, Sun, Moon, Box, Sparkles, Check } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useReducedMotion } from '../../hooks/useMediaQueries';

const ANIM_INTENSITIES = [
  { key: 'low', label: 'Low' },
  { key: 'normal', label: 'Normal' },
  { key: 'high', label: 'High' },
];

/* Floating gear button that opens the live appearance panel. */
export default function ThemeCustomizer() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    theme,
    toggleTheme,
    accentKey,
    setAccentKey,
    ACCENT_PRESETS,
    threeDEffects,
    setThreeDEffects,
    animationIntensity,
    setAnimationIntensity,
  } = useTheme();
  const reducedMotion = useReducedMotion();

  /* Close when Escape is pressed */
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  /* Lock body scroll while the panel is open on mobile */
  useEffect(() => {
    if (!isOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [isOpen]);

  return (
    <>
      {/* Floating toggle button — bottom left (kept clear of the assistant fab) */}
      <motion.button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        aria-label={isOpen ? 'Close appearance settings' : 'Open appearance settings'}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        data-cursor
        className="fixed bottom-5 left-5 z-[90] w-11 h-11 rounded-full flex items-center justify-center
                   bg-surface border border-foreground/[0.1] text-muted hover:text-accent
                   hover:border-accent/40 hover:rotate-90 transition-all duration-300
                   shadow-lg backdrop-blur-md"
        whileTap={{ scale: 0.92 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
      >
        {isOpen ? <X size={18} /> : <Settings size={18} className={reducedMotion ? '' : 'animate-[spin_6s_linear_infinite]'} />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-[95] bg-background/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />

            {/* Panel */}
            <motion.div
              role="dialog"
              aria-label="Appearance settings"
              className="fixed left-5 bottom-[4.6rem] z-[100] w-[min(20rem,calc(100vw-2.5rem))]
                         rounded-2xl border border-foreground/[0.08] bg-surface shadow-2xl overflow-hidden"
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.96 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
            >
              {/* Header */}
              <div className="px-5 py-4 border-b border-foreground/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/30 text-accent flex items-center justify-center">
                    <Sparkles size={15} />
                  </span>
                  <div>
                    <h2 className="text-sm font-semibold text-foreground leading-tight">Appearance</h2>
                    <p className="text-[11px] text-muted leading-tight">Live theme customizer</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close appearance settings"
                  className="p-2 rounded-lg text-muted hover:text-accent hover:bg-surface-light transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Settings body */}
              <div className="px-5 py-4 space-y-4 max-h-[min(60vh,440px)] overflow-y-auto">
                {/* Mode */}
                <fieldset>
                  <legend className="text-[11px] uppercase tracking-wider font-mono text-muted mb-2.5">Mode</legend>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key: 'light', label: 'Light', icon: Sun },
                      { key: 'dark', label: 'Dark', icon: Moon },
                    ].map(({ key, label, icon: Icon }) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => { if (theme !== key) toggleTheme(); }}
                        aria-pressed={theme === key}
                        className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-[13px] font-medium border transition-all duration-300 ${
                          theme === key
                            ? 'border-accent/60 bg-accent/10 text-accent'
                            : 'border-foreground/[0.1] text-muted hover:border-foreground/25 hover:text-foreground'
                        }`}
                      >
                        <Icon size={15} />
                        {label}
                        {theme === key && <Check size={14} />}
                      </button>
                    ))}
                  </div>
                </fieldset>

                {/* Accent color */}
                <fieldset>
                  <legend className="text-[11px] uppercase tracking-wider font-mono text-muted mb-2.5">Accent</legend>
                  <div className="grid grid-cols-4 gap-2">
                    {Object.entries(ACCENT_PRESETS).map(([key, preset]) => {
                      const active = key === accentKey;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setAccentKey(key)}
                          aria-label={`${preset.label} accent`}
                          aria-pressed={active}
                          title={preset.label}
                          data-cursor
                          className={`relative aspect-square rounded-xl flex items-center justify-center border-2 transition-all duration-300 ${
                            active ? 'border-foreground/60 scale-[1.06]' : 'border-transparent hover:scale-[1.05]'
                          }`}
                          style={{ backgroundColor: preset.primary }}
                        >
                          {active && <Check size={16} className="text-white" strokeWidth={3} />}
                        </button>
                      );
                    })}
                  </div>
                  <p className="mt-2 text-[11px] text-muted">
                    Selected: <span className="text-foreground font-medium">{ACCENT_PRESETS[accentKey].label}</span>
                  </p>
                </fieldset>

                {/* 3D effects */}
                {/* <fieldset>
                  <legend className="text-[11px] uppercase tracking-wider font-mono text-muted mb-2.5">3D Effects</legend>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={threeDEffects}
                    onClick={() => setThreeDEffects(!threeDEffects)}
                    className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl border transition-all duration-300 ${
                      threeDEffects
                        ? 'border-accent/50 bg-accent/5'
                        : 'border-foreground/[0.1] hover:border-foreground/25'
                    }`}
                  >
                    <span className="flex items-center gap-2 text-[13px] text-foreground font-medium">
                      <Box size={15} className={threeDEffects ? 'text-accent' : 'text-muted'} />
                      Three.js scene
                    </span>
                    <span
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-300 ${
                        threeDEffects ? 'bg-accent' : 'bg-foreground/20'
                      }`}
                    >
                      <span
                        className={`absolute h-4 w-4 rounded-full bg-white shadow transition-transform duration-300 ${
                          threeDEffects ? 'translate-x-[18px]' : 'translate-x-[2px]'
                        }`}
                      />
                    </span>
                  </button>
                </fieldset> */}

                {/* Animation intensity */}
                <fieldset>
                  <legend className="text-[11px] uppercase tracking-wider font-mono text-muted mb-2.5">Animation Intensity</legend>
                  <div className="grid grid-cols-3 gap-2">
                    {ANIM_INTENSITIES.map(({ key, label }) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setAnimationIntensity(key)}
                        aria-pressed={animationIntensity === key}
                        className={`px-2 py-2 rounded-xl border text-[12px] font-medium transition-all duration-300 ${
                          animationIntensity === key
                            ? 'border-accent/60 bg-accent/10 text-accent'
                            : 'border-foreground/[0.1] text-muted hover:border-foreground/25 hover:text-foreground'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <p className="mt-2 text-[11px] text-muted/80 leading-relaxed">
                    Reduced complexity when set to Low; also respects the system 'reduce motion' setting.
                  </p>
                </fieldset>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}