
import { Suspense, useMemo, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  Float,
  Points,
  PointMaterial,
  MeshDistortMaterial,
} from '@react-three/drei';
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
      const max =
        document.documentElement.scrollHeight - window.innerHeight;

      scrollState.current =
        max > 0 ? window.scrollY / max : 0;
    };

    const onMouseMove = (e) => {
      mouseState.x =
        (e.clientX / window.innerWidth) * 2 - 1;

      mouseState.y =
        -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('scroll', onScroll, {
      passive: true,
    });

    window.addEventListener('mousemove', onMouseMove, {
      passive: true,
    });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);
}

/* =========================================================
   THEME COLORS
========================================================= */

const DARK_THEME = {
  coreColor: '#0a0a0a',
  coreEmissive: '#ef233c',

  primary: '#ef233c',
  primaryBright: '#ff4056',

  secondary: '#ffffff',
  secondarySoft: '#d8d8d8',

  geometryGray: '#a5a5a5',

  particles: '#8f8f8f',

  mainLight: '#ffffff',
  accentLight: '#ef233c',

  vignette:
    'radial-gradient(circle at center, transparent 35%, rgba(0,0,0,0.12) 65%, rgba(0,0,0,0.48) 100%)',
};

const LIGHT_THEME = {
  coreColor: '#e7eaf0',
  coreEmissive: '#2563eb',

  primary: '#2563eb',
  primaryBright: '#3b82f6',

  secondary: '#64748b',
  secondarySoft: '#94a3b8',

  geometryGray: '#475569',

  particles: '#64748b',

  mainLight: '#ffffff',
  accentLight: '#2563eb',

  vignette:
    'radial-gradient(circle at center, transparent 38%, rgba(255,255,255,0.05) 68%, rgba(148,163,184,0.16) 100%)',
};

/* =========================================================
   MORPHING CORE
========================================================= */

function MorphCore({ colors }) {
  const ref = useRef();
  const matRef = useRef();

  const { viewport } = useThree();

  const scale = viewport.width < 10 ? 1 : 1.3;

  useFrame((state) => {
    if (!ref.current || !matRef.current) return;

    const t = state.clock.elapsedTime;
    const s = scrollState.current;

    /* -----------------------------
       Rotation
    ----------------------------- */

    ref.current.rotation.y =
      s * Math.PI * 4 + t * 0.08;

    ref.current.rotation.x =
      Math.sin(t * 0.15 + s * 2) * 0.3;

    ref.current.rotation.z =
      Math.cos(t * 0.1 + s) * 0.15;

    /* -----------------------------
       Pulse
    ----------------------------- */

    const pulse =
      1 + Math.sin(s * Math.PI * 3) * 0.12;

    ref.current.scale.setScalar(
      scale * pulse
    );

    /* -----------------------------
       Scroll-based distortion
    ----------------------------- */

    matRef.current.distort =
      0.2 + s * 0.5;

    matRef.current.speed =
      1 + s * 2;

    /* -----------------------------
       Mouse parallax
    ----------------------------- */

    ref.current.position.x =
      THREE.MathUtils.lerp(
        ref.current.position.x,
        mouseState.x * 0.3,
        0.05
      );

    ref.current.position.y =
      THREE.MathUtils.lerp(
        ref.current.position.y,
        mouseState.y * 0.2,
        0.05
      );
  });

  return (
    <Float
      speed={0.8}
      rotationIntensity={0.15}
      floatIntensity={0.6}
    >
      <mesh ref={ref}>
        <sphereGeometry
          args={[1.2, 64, 64]}
        />

        <MeshDistortMaterial
          ref={matRef}
          color={colors.coreColor}
          metalness={0.95}
          roughness={0.08}
          emissive={colors.coreEmissive}
          emissiveIntensity={0.07}
          distort={0.2}
          speed={1}
        />
      </mesh>
    </Float>
  );
}

/* =========================================================
   ORBITAL RINGS
========================================================= */

function OrbitalRings({ colors, isDark }) {
  const group = useRef();

  useFrame((state) => {
    if (!group.current) return;

    const t = state.clock.elapsedTime;
    const s = scrollState.current;

    group.current.rotation.y =
      s * Math.PI * 6 + t * 0.12;

    group.current.rotation.x =
      Math.sin(t * 0.2) * 0.4 +
      s * 0.5;
  });

  const rings = isDark
    ? [
        {
          radius: 1.9,
          thick: 0.006,
          color: colors.primaryBright,
          opacity: 0.42,
          rot: [0, 0, 0],
        },
        {
          radius: 2.3,
          thick: 0.004,
          color: colors.secondary,
          opacity: 0.18,
          rot: [1.1, 0, 0],
        },
        {
          radius: 2.7,
          thick: 0.003,
          color: colors.primary,
          opacity: 0.14,
          rot: [0, 1.2, 0.6],
        },
        {
          radius: 3.1,
          thick: 0.002,
          color: colors.secondary,
          opacity: 0.09,
          rot: [0.5, 0.3, 1.4],
        },
      ]
    : [
        {
          radius: 1.9,
          thick: 0.006,
          color: colors.primary,
          opacity: 0.38,
          rot: [0, 0, 0],
        },
        {
          radius: 2.3,
          thick: 0.004,
          color: '#475569',
          opacity: 0.22,
          rot: [1.1, 0, 0],
        },
        {
          radius: 2.7,
          thick: 0.003,
          color: '#3b82f6',
          opacity: 0.15,
          rot: [0, 1.2, 0.6],
        },
        {
          radius: 3.1,
          thick: 0.002,
          color: '#64748b',
          opacity: 0.11,
          rot: [0.5, 0.3, 1.4],
        },
      ];

  return (
    <group ref={group}>
      {rings.map((r, i) => (
        <mesh
          key={i}
          rotation={r.rot}
        >
          <torusGeometry
            args={[
              r.radius,
              r.thick,
              16,
              120,
            ]}
          />

          <meshBasicMaterial
            color={r.color}
            transparent
            opacity={r.opacity}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

/* =========================================================
   FLOATING 3D GEOMETRIES
========================================================= */

function FloatingGeometry({ colors, isDark }) {
  /*
    Dark mode:
    - Increased opacity
    - Brighter red/white
    - meshBasicMaterial means geometry
      doesn't disappear because of lighting.

    Light mode:
    - Blue / slate palette
    - Slightly softer opacity
  */

  const items = isDark
    ? [
        {
          pos: [3.5, 1.8, -1.5],
          scale: 0.24,
          geo: 'icosahedron',
          color: '#ff4056',
          opacity: 0.62,
        },
        {
          pos: [-3.2, -1.8, -0.8],
          scale: 0.21,
          geo: 'octahedron',
          color: '#ffffff',
          opacity: 0.48,
        },
        {
          pos: [2.8, -2.2, 0.8],
          scale: 0.17,
          geo: 'torusKnot',
          color: '#ff4056',
          opacity: 0.58,
        },
        {
          pos: [-2.8, 2.2, -1.2],
          scale: 0.19,
          geo: 'dodecahedron',
          color: '#b8b8b8',
          opacity: 0.42,
        },
        {
          pos: [0.5, 3.5, -2],
          scale: 0.15,
          geo: 'tetrahedron',
          color: '#ff4056',
          opacity: 0.52,
        },
      ]
    : [
        {
          pos: [3.5, 1.8, -1.5],
          scale: 0.24,
          geo: 'icosahedron',
          color: '#2563eb',
          opacity: 0.48,
        },
        {
          pos: [-3.2, -1.8, -0.8],
          scale: 0.21,
          geo: 'octahedron',
          color: '#475569',
          opacity: 0.38,
        },
        {
          pos: [2.8, -2.2, 0.8],
          scale: 0.17,
          geo: 'torusKnot',
          color: '#0891b2',
          opacity: 0.44,
        },
        {
          pos: [-2.8, 2.2, -1.2],
          scale: 0.19,
          geo: 'dodecahedron',
          color: '#64748b',
          opacity: 0.34,
        },
        {
          pos: [0.5, 3.5, -2],
          scale: 0.15,
          geo: 'tetrahedron',
          color: '#3b82f6',
          opacity: 0.42,
        },
      ];

  return (
    <group>
      {items.map((item, i) => (
        <Float
          key={i}
          speed={1 + i * 0.15}
          rotationIntensity={0.8}
          floatIntensity={1.5}
        >
          <mesh
            position={item.pos}
            scale={item.scale}
          >
            {item.geo === 'icosahedron' && (
              <icosahedronGeometry
                args={[1, 0]}
              />
            )}

            {item.geo === 'octahedron' && (
              <octahedronGeometry
                args={[1, 0]}
              />
            )}

            {item.geo === 'torusKnot' && (
              <torusKnotGeometry
                args={[1, 0.3, 64, 8]}
              />
            )}

            {item.geo === 'dodecahedron' && (
              <dodecahedronGeometry
                args={[1, 0]}
              />
            )}

            {item.geo === 'tetrahedron' && (
              <tetrahedronGeometry
                args={[1, 0]}
              />
            )}

            {/*
              meshBasicMaterial is intentional.

              Earlier meshStandardMaterial depended heavily
              on scene lighting. In dark mode that could make
              the wireframe geometries almost disappear.

              Basic material keeps them clearly visible.
            */}

            <meshBasicMaterial
              color={item.color}
              wireframe
              transparent
              opacity={item.opacity}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

/* =========================================================
   PARTICLE FIELD
========================================================= */

function ParticleField({
  count = 1200,
  colors,
}) {
  const ref = useRef();

  const positions = useMemo(() => {
    const arr = new Float32Array(
      count * 3
    );

    for (
      let i = 0;
      i < count * 3;
      i += 3
    ) {
      const theta =
        Math.random() *
        Math.PI *
        2;

      const phi =
        Math.acos(
          2 * Math.random() - 1
        );

      const r =
        2.5 +
        Math.random() * 6;

      arr[i] =
        r *
        Math.sin(phi) *
        Math.cos(theta);

      arr[i + 1] =
        r *
        Math.sin(phi) *
        Math.sin(theta);

      arr[i + 2] =
        r *
        Math.cos(phi);
    }

    return arr;
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;

    ref.current.rotation.y =
      state.clock.elapsedTime * 0.015 +
      scrollState.current *
        Math.PI *
        2;

    ref.current.rotation.x =
      scrollState.current * 0.3;
  });

  return (
    <Points
      ref={ref}
      positions={positions}
      stride={3}
      frustumCulled={false}
    >
      <PointMaterial
        transparent
        color={colors.particles}
        size={0.02}
        sizeAttenuation
        depthWrite={false}
        opacity={0.5}
      />
    </Points>
  );
}

/* =========================================================
   SCENE CONTENT
========================================================= */

function SceneContent({
  theme,
}) {
  const isDark = theme === 'dark';

  const colors = isDark
    ? DARK_THEME
    : LIGHT_THEME;

  return (
    <>
      {/* ---------------------------------------------
          Ambient Light
      --------------------------------------------- */}

      <ambientLight
        intensity={isDark ? 0.15 : 0.55}
      />

      {/* ---------------------------------------------
          Main White Light
      --------------------------------------------- */}

      <pointLight
        position={[5, 5, 5]}
        intensity={isDark ? 0.8 : 1.1}
        color={colors.mainLight}
      />

      {/* ---------------------------------------------
          Theme Accent Light
      --------------------------------------------- */}

      <pointLight
        position={[-5, -3, 2]}
        intensity={isDark ? 0.4 : 0.65}
        color={colors.accentLight}
      />

      {/* ---------------------------------------------
          Additional Fill Light
      --------------------------------------------- */}

      <pointLight
        position={[0, -5, -3]}
        intensity={isDark ? 0.2 : 0.4}
        color={colors.mainLight}
      />

      <Suspense fallback={null}>
        {/* Main futuristic core */}
        <MorphCore
          colors={colors}
        />

        {/* Orbital rings */}
        <OrbitalRings
          colors={colors}
          isDark={isDark}
        />

        {/* Floating wireframe geometries */}
        <FloatingGeometry
          colors={colors}
          isDark={isDark}
        />

        {/* Background particles */}
        <ParticleField
          count={1200}
          colors={colors}
        />
      </Suspense>
    </>
  );
}

/* =========================================================
   HERO SCENE
========================================================= */

export default function HeroScene() {
  const isMobile = useIsMobile();
  const reducedMotion =
    useReducedMotion();

  /*
    This reads the exact same theme
    that your Navbar toggle changes.
  */

  const { theme } = useTheme();

  useScrollListener();

  /*
    Respect user's reduced motion preference.
  */

  if (reducedMotion) {
    return null;
  }

  const isDark = theme === 'dark';

  const colors = isDark
    ? DARK_THEME
    : LIGHT_THEME;

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    >
      <Canvas
        dpr={[
          1,
          isMobile ? 1 : 1.5,
        ]}
        camera={{
          position: [0, 0, 5.5],
          fov: 50,
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference:
            'high-performance',
        }}
        style={{
          background:
            'transparent',
        }}
      >
        <SceneContent
          theme={theme}
        />
      </Canvas>

      {/* ---------------------------------------------
          Theme-aware cinematic vignette

          No dependency on external CSS required.
      --------------------------------------------- */}

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: colors.vignette,
        }}
      />
    </div>
  );
}
