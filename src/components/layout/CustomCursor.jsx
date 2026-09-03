import { useEffect, useRef, useState } from 'react';
import { useIsMobile } from '../../hooks/useMediaQueries';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    setEnabled(true);
  }, [isMobile]);

  useEffect(() => {
    if (!enabled) return;

    document.body.classList.add('has-custom-cursor');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let raf = null;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (dotRef.current) {
        dotRef.current.style.left = `${mouseX}px`;
        dotRef.current.style.top = `${mouseY}px`;
      }

      const target = e.target;
      const interactive = target.closest('a, button, [data-cursor], .project-card, canvas');
      setIsHovering(!!interactive);
    };

    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;

      if (ringRef.current) {
        ringRef.current.style.left = `${ringX}px`;
        ringRef.current.style.top = `${ringY}px`;
      }

      raf = requestAnimationFrame(animateRing);
    };

    window.addEventListener('mousemove', onMouseMove);
    raf = requestAnimationFrame(animateRing);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      if (raf) cancelAnimationFrame(raf);
      document.body.classList.remove('has-custom-cursor');
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div ref={dotRef} className="cursor-dot" style={{ position: 'fixed' }} />
      <div
        ref={ringRef}
        className={`cursor-ring ${isHovering ? 'is-hovering' : ''}`}
        style={{ position: 'fixed' }}
      />
    </>
  );
}
