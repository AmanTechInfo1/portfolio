import { Suspense, useMemo, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

import {
  useIsMobile,
  useReducedMotion,
} from '../../hooks/useMediaQueries';

import { useTheme } from '../../contexts/ThemeContext';

const scrollState = { current: 0 };
const mouseState = { x: 0, y: 0 };

/* =========================================================
   SCROLL + MOUSE LISTENER
========================================================= */

function useScrollListener() {
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollState.current = max > 0 ? window.scrollY / max : 0;
    };

    const onMouseMove = (e) => {
      mouseState.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseState.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);
}

/* =========================================================
   THEME TOKENS
========================================================= */

const DARK_THEME = {
  laneCenter: '#ff4056',
  laneEdge: '#f2f2f2',
  gridLine: '#4b4b4b',
  gateFill: '#0d0d0d',
  motes: '#ffd9c2',
  vignette:
    'radial-gradient(circle at center, transparent 35%, rgba(0,0,0,0.14) 66%, rgba(0,0,0,0.5) 100%)',
};

const LIGHT_THEME = {
  laneCenter: '#2563eb',
  laneEdge: '#1e293b',
  gridLine: '#94a3b8',
  gateFill: '#f8fafc',
  motes: '#2563eb',
  vignette:
    'radial-gradient(circle at center, transparent 38%, rgba(255,255,255,0.05) 68%, rgba(148,163,184,0.18) 100%)',
};

/* =========================================================
   ROAD — recycled dashes racing toward the viewer, plus
   two static glowing edge lines either side.
========================================================= */

function RoadLines({ colors, count }) {
  const dashSpacing = 1.7;
  const totalDepth = count * dashSpacing;
  const dashRefs = useRef([]);

  const dashes = useMemo(
    () => Array.from({ length: count }, (_, i) => -i * dashSpacing - 4),
    [count]
  );

  useFrame((state, delta) => {
    const speed = 1.4 + scrollState.current * 4.5;

    dashRefs.current.forEach((mesh) => {
      if (!mesh) return;
      mesh.position.z += delta * speed;
      if (mesh.position.z > 6) mesh.position.z -= totalDepth;
    });
  });

  return (
    <group>
      {dashes.map((z, i) => (
        <mesh
          key={i}
          ref={(el) => (dashRefs.current[i] = el)}
          position={[0, -1.5, z]}
        >
          <boxGeometry args={[0.1, 0.03, 0.7]} />
          <meshBasicMaterial
            color={colors.laneCenter}
            transparent
            opacity={0.85}
            toneMapped={false}
          />
        </mesh>
      ))}

      {[-1.7, 1.7].map((x) => (
        <mesh key={x} position={[x, -1.5, -totalDepth / 2 + 3]}>
          <boxGeometry args={[0.06, 0.03, totalDepth]} />
          <meshBasicMaterial
            color={colors.laneEdge}
            transparent
            opacity={0.3}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

/* =========================================================
   GATE — a glowing ring the road threads through; the one
   bold, memorable focal point of the scene.
========================================================= */

function Gate({ colors }) {
  const ringRef = useRef();
  const matRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const s = scrollState.current;

    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.06;
      const pulse = 1 + Math.sin(t * 0.5) * 0.03 + s * 0.18;
      ringRef.current.scale.setScalar(pulse);
    }

    if (matRef.current) {
      matRef.current.distort = 0.22 + Math.sin(t * 0.4) * 0.08;
      matRef.current.opacity = 0.28 + s * 0.3;
    }
  });

  return (
    <Float speed={0.6} rotationIntensity={0.05} floatIntensity={0.35}>
      <group position={[0, 0.25, -9]}>
        <mesh ref={ringRef}>
          <torusGeometry args={[1.7, 0.05, 16, 100]} />
          <meshBasicMaterial
            color={colors.laneCenter}
            transparent
            opacity={0.85}
            toneMapped={false}
          />
        </mesh>

        <mesh>
          <circleGeometry args={[1.55, 64]} />
          <MeshDistortMaterial
            ref={matRef}
            color={colors.gateFill}
            transparent
            opacity={0.3}
            distort={0.25}
            speed={2}
            side={THREE.DoubleSide}
            metalness={0.2}
            roughness={0.6}
          />
        </mesh>
      </group>
    </Float>
  );
}

/* =========================================================
   HORIZON GRID — a rippling wireframe floor stretching
   away under the road, standing in for the night skyline.
========================================================= */

function HorizonGrid({ colors, segments }) {
  const meshRef = useRef();

  useFrame((state) => {
    const geo = meshRef.current?.geometry;
    if (!geo) return;

    const t = state.clock.elapsedTime;
    const pos = geo.attributes.position;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const wave =
        Math.sin(x * 0.45 + t * 0.5) * 0.18 +
        Math.sin(y * 0.3 - t * 0.35) * 0.18;
      pos.setZ(i, wave);
    }

    pos.needsUpdate = true;
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2.3, 0, 0]} position={[0, -2.3, -10]}>
      <planeGeometry args={[24, 24, segments, segments]} />
      <meshBasicMaterial color={colors.gridLine} wireframe transparent opacity={0.22} />
    </mesh>
  );
}

/* =========================================================
   SCENE RIG — subtle scroll-driven push into the scene and
   mouse parallax tilt, wrapping everything else.
========================================================= */

function SceneRig({ children }) {
  const group = useRef();

  useFrame(() => {
    if (!group.current) return;

    group.current.position.z = THREE.MathUtils.lerp(
      group.current.position.z,
      scrollState.current * 3.2,
      0.06
    );

    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      mouseState.x * 0.06,
      0.05
    );

    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      mouseState.y * 0.035,
      0.05
    );
  });

  return <group ref={group}>{children}</group>;
}

/* =========================================================
   SCENE CONTENT
========================================================= */

function SceneContent({ theme, isMobile }) {
  const isDark = theme === 'dark';
  const colors = isDark ? DARK_THEME : LIGHT_THEME;

  return (
    <>
      <ambientLight intensity={isDark ? 0.2 : 0.6} />
      <pointLight position={[4, 4, 4]} intensity={isDark ? 0.6 : 0.9} color="#ffffff" />
      <pointLight
        position={[-4, -2, 3]}
        intensity={isDark ? 0.5 : 0.6}
        color={colors.laneCenter}
      />

      <Suspense fallback={null}>
        <SceneRig>
          <RoadLines colors={colors} count={isMobile ? 12 : 20} />
          <Gate colors={colors} />
          <HorizonGrid colors={colors} segments={isMobile ? 16 : 30} />
        </SceneRig>

        <Sparkles
          count={isMobile ? 70 : 160}
          scale={[9, 5, 9]}
          size={2}
          speed={0.25}
          opacity={0.55}
          color={colors.motes}
        />
      </Suspense>
    </>
  );
}

/* =========================================================
   HERO SCENE
========================================================= */

export default function NewHeroScene() {
  const isMobile = useIsMobile();
  const reducedMotion = useReducedMotion();
  const { theme } = useTheme();

  useScrollListener();

  if (reducedMotion) {
    return null;
  }

  const isDark = theme === 'dark';
  const colors = isDark ? DARK_THEME : LIGHT_THEME;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
      <Canvas
        dpr={[1, isMobile ? 1 : 1.5]}
        camera={{ position: [0, 0.4, 5.5], fov: 50 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
      >
        <SceneContent theme={theme} isMobile={isMobile} />
      </Canvas>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: colors.vignette }}
      />
    </div>
  );
}