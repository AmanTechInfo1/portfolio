import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Points, PointMaterial, Sphere, MeshDistortMaterial, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useIsMobile, useReducedMotion } from '../../hooks/useMediaQueries';

// Digital core - the main central sphere
function DigitalCore() {
  const sphereRef = useRef();
  const materialRef = useRef();

  useFrame((state, delta) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += delta * 0.15;
      sphereRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.3} floatIntensity={1.5}>
      <Sphere ref={sphereRef} args={[1, 48, 48]}>
        <MeshDistortMaterial
          ref={materialRef}
          color="#111827"
          metalness={0.9}
          roughness={0.15}
          emissive="#ef233c"
          emissiveIntensity={0.08}
          distort={0.35}
          speed={1.5}
        />
      </Sphere>
    </Float>
  );
}

// Wireframe shell around the core
function OrbitalRings() {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
      groupRef.current.rotation.x += delta * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <torusGeometry args={[1.8, 0.008, 16, 100]} />
        <meshBasicMaterial color="#ef233c" transparent opacity={0.3} />
      </mesh>
      <mesh rotation={[Math.PI / 2.5, 0, 0]}>
        <torusGeometry args={[2.2, 0.005, 16, 100]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.15} />
      </mesh>
      <mesh rotation={[0, Math.PI / 3, Math.PI / 4]}>
        <torusGeometry args={[2.5, 0.004, 16, 100]} />
        <meshBasicMaterial color="#ef233c" transparent opacity={0.15} />
      </mesh>
    </group>
  );
}

// Particle field
function ParticleField({ count = 1200 }) {
  const points = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 12;
      positions[i + 1] = (Math.random() - 0.5) * 8;
      positions[i + 2] = (Math.random() - 0.5) * 12;
    }
    return positions;
  }, [count]);

  const pointsRef = useRef();

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <Points ref={pointsRef} positions={points} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#8b8b8b"
        size={0.03}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.6}
      />
    </Points>
  );
}

// Floating geometric objects
function FloatingGeometries() {
  return (
    <group>
      <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
        <mesh position={[3.2, 1.5, -1]} scale={0.3}>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#ef233c" wireframe transparent opacity={0.4} />
        </mesh>
      </Float>
      <Float speed={1.2} rotationIntensity={1.2} floatIntensity={2.5}>
        <mesh position={[-3, -1.5, -0.5]} scale={0.25} rotation={[0.5, 1, 0.2]}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#ffffff" wireframe transparent opacity={0.25} />
        </mesh>
      </Float>
      <Float speed={1.8} rotationIntensity={0.8} floatIntensity={1.8}>
        <mesh position={[2.5, -2, 0.5]} scale={0.18} rotation={[0.1, 0.3, 0.5]}>
          <torusKnotGeometry args={[1, 0.3, 64, 8]} />
          <meshStandardMaterial color="#ef233c" wireframe transparent opacity={0.3} />
        </mesh>
      </Float>
      <Float speed={1.1} rotationIntensity={1.5} floatIntensity={2}>
        <mesh position={[-2.5, 2, -1]} scale={0.2} rotation={[0.3, 0.7, 0.1]}>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#8b8b8b" wireframe transparent opacity={0.3} />
        </mesh>
      </Float>
    </group>
  );
}

export default function ThreeHero() {
  const isMobile = useIsMobile();
  const reducedMotion = useReducedMotion();

  if (isMobile && typeof window !== 'undefined') return null;
  if (reducedMotion) return null;

  const particleCount = isMobile ? 400 : 1200;

  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <Canvas
        dpr={[1, isMobile ? 1 : 1.5]}
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, -3, 2]} intensity={0.5} color="#ef233c" />
        <Suspense fallback={null}>
          <DigitalCore />
          <OrbitalRings />
          <ParticleField count={particleCount} />
          <FloatingGeometries />
        </Suspense>
      </Canvas>
    </div>
  );
}
