import { Suspense, useMemo, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Points, PointMaterial, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useIsMobile, useReducedMotion } from '../../hooks/useMediaQueries';

const scrollState = { current: 0 };
const mouseState = { x: 0, y: 0 };

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

function MorphCore() {
  const ref = useRef();
  const matRef = useRef();
  const { viewport } = useThree();
  const scale = viewport.width < 10 ? 1 : 1.3;

  useFrame((state) => {
    if (!ref.current || !matRef.current) return;
    const t = state.clock.elapsedTime;
    const s = scrollState.current;
    ref.current.rotation.y = s * Math.PI * 4 + t * 0.08;
    ref.current.rotation.x = Math.sin(t * 0.15 + s * 2) * 0.3;
    ref.current.rotation.z = Math.cos(t * 0.1 + s) * 0.15;
    const pulse = 1 + Math.sin(s * Math.PI * 3) * 0.12;
    ref.current.scale.setScalar(scale * pulse);
    matRef.current.distort = 0.2 + s * 0.5;
    matRef.current.speed = 1 + s * 2;
    ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, mouseState.x * 0.3, 0.05);
    ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, mouseState.y * 0.2, 0.05);
  });

  return (
    <Float speed={0.8} rotationIntensity={0.15} floatIntensity={0.6}>
      <mesh ref={ref}>
        <sphereGeometry args={[1.2, 64, 64]} />
        <MeshDistortMaterial
          ref={matRef}
          color="#0a0a0a"
          metalness={0.95}
          roughness={0.08}
          emissive="#ef233c"
          emissiveIntensity={0.06}
          distort={0.2}
          speed={1}
        />
      </mesh>
    </Float>
  );
}

function OrbitalRings() {
  const group = useRef();

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    const s = scrollState.current;
    group.current.rotation.y = s * Math.PI * 6 + t * 0.12;
    group.current.rotation.x = Math.sin(t * 0.2) * 0.4 + s * 0.5;
  });

  const rings = [
    { radius: 1.9, thick: 0.006, color: '#ef233c', opacity: 0.35, rot: [0, 0, 0] },
    { radius: 2.3, thick: 0.004, color: '#ffffff', opacity: 0.12, rot: [1.1, 0, 0] },
    { radius: 2.7, thick: 0.003, color: '#ef233c', opacity: 0.08, rot: [0, 1.2, 0.6] },
    { radius: 3.1, thick: 0.002, color: '#ffffff', opacity: 0.05, rot: [0.5, 0.3, 1.4] },
  ];

  return (
    <group ref={group}>
      {rings.map((r, i) => (
        <mesh key={i} rotation={r.rot}>
          <torusGeometry args={[r.radius, r.thick, 16, 120]} />
          <meshBasicMaterial color={r.color} transparent opacity={r.opacity} />
        </mesh>
      ))}
    </group>
  );
}

function FloatingGeometry() {
  const items = [
    { pos: [3.5, 1.8, -1.5], scale: 0.22, geo: 'icosahedron', color: '#ef233c', opacity: 0.25 },
    { pos: [-3.2, -1.8, -0.8], scale: 0.18, geo: 'octahedron', color: '#ffffff', opacity: 0.15 },
    { pos: [2.8, -2.2, 0.8], scale: 0.14, geo: 'torusKnot', color: '#ef233c', opacity: 0.2 },
    { pos: [-2.8, 2.2, -1.2], scale: 0.16, geo: 'dodecahedron', color: '#8b8b8b', opacity: 0.18 },
    { pos: [0.5, 3.5, -2], scale: 0.12, geo: 'tetrahedron', color: '#ef233c', opacity: 0.15 },
  ];

  return (
    <group>
      {items.map((item, i) => (
        <Float key={i} speed={1 + i * 0.15} rotationIntensity={0.8} floatIntensity={1.5}>
          <mesh position={item.pos} scale={item.scale}>
            {item.geo === 'icosahedron' && <icosahedronGeometry args={[1, 0]} />}
            {item.geo === 'octahedron' && <octahedronGeometry args={[1, 0]} />}
            {item.geo === 'torusKnot' && <torusKnotGeometry args={[1, 0.3, 64, 8]} />}
            {item.geo === 'dodecahedron' && <dodecahedronGeometry args={[1, 0]} />}
            {item.geo === 'tetrahedron' && <tetrahedronGeometry args={[1, 0]} />}
            <meshStandardMaterial color={item.color} wireframe transparent opacity={item.opacity} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function ParticleField({ count = 1200 }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2.5 + Math.random() * 6;
      arr[i] = r * Math.sin(phi) * Math.cos(theta);
      arr[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.015 + scrollState.current * Math.PI * 2;
    ref.current.rotation.x = scrollState.current * 0.3;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#666666" size={0.02} sizeAttenuation depthWrite={false} opacity={0.5} />
    </Points>
  );
}

function SceneContent() {
  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-5, -3, 2]} intensity={0.4} color="#ef233c" />
      <pointLight position={[0, -5, -3]} intensity={0.2} color="#ffffff" />
      <Suspense fallback={null}>
        <MorphCore />
        <OrbitalRings />
        <FloatingGeometry />
        <ParticleField count={1200} />
      </Suspense>
    </>
  );
}

export default function HeroScene() {
  const isMobile = useIsMobile();
  const reducedMotion = useReducedMotion();
  useScrollListener();

  if (reducedMotion) return null;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
      <Canvas
        dpr={[1, isMobile ? 1 : 1.5]}
        camera={{ position: [0, 0, 5.5], fov: 50 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
      >
        <SceneContent />
      </Canvas>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(8,8,8,0.6) 70%, rgba(8,8,8,0.95) 100%)',
        }}
      />
    </div>
  );
}
