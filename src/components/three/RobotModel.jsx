import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

export default function RobotModel({ scrollRef = { current: 0 }, mouseRef = { x: 0, y: 0 } }) {
  const groupRef = useRef();
  const eyeLeftRef = useRef();
  const eyeRightRef = useRef();
  const haloRef = useRef();
  const particlesRef = useRef();

  const particlePositions = useMemo(() => {
    const count = 200;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      const angle = Math.random() * Math.PI * 2;
      const r = 1.2 + Math.random() * 1.5;
      arr[i] = Math.cos(angle) * r;
      arr[i + 1] = (Math.random() - 0.5) * 2;
      arr[i + 2] = Math.sin(angle) * r;
    }
    return arr;
  }, []);

  const circuitLines = useMemo(() => [
    { pos: [0, 0.35, 0.501], scale: [0.6, 0.01, 0.001], color: '#ef233c' },
    { pos: [-0.2, 0.25, 0.501], scale: [0.15, 0.01, 0.001], color: '#ef233c' },
    { pos: [0.2, 0.25, 0.501], scale: [0.15, 0.01, 0.001], color: '#ef233c' },
    { pos: [0, -0.15, 0.501], scale: [0.4, 0.008, 0.001], color: '#ef233c' },
    { pos: [-0.35, 0, 0.501], scale: [0.008, 0.35, 0.001], color: '#ffffff' },
    { pos: [0.35, 0, 0.501], scale: [0.008, 0.35, 0.001], color: '#ffffff' },
  ], []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    const s = scrollRef.current;
    const g = groupRef.current;

    g.position.x = THREE.MathUtils.lerp(g.position.x, THREE.MathUtils.lerp(0, 2.2, s) + mouseRef.x * 0.08, 0.04);
    g.position.y = THREE.MathUtils.lerp(g.position.y, THREE.MathUtils.lerp(0, -0.3, s) + mouseRef.y * 0.05, 0.04);
    g.position.z = THREE.MathUtils.lerp(g.position.z, THREE.MathUtils.lerp(0, 0.5, s), 0.04);

    const ts = THREE.MathUtils.lerp(1.0, 0.75, s);
    g.scale.setScalar(THREE.MathUtils.lerp(g.scale.x, ts, 0.04));

    g.rotation.y = Math.sin(t * 0.3) * 0.15 + s * 0.5;
    g.rotation.x = Math.sin(t * 0.2) * 0.05 + mouseRef.y * 0.08;
    g.rotation.z = Math.sin(t * 0.15) * 0.02;

    const pulse = 0.8 + Math.sin(t * 2) * 0.2;
    if (eyeLeftRef.current) eyeLeftRef.current.emissiveIntensity = pulse * 2.5;
    if (eyeRightRef.current) eyeRightRef.current.emissiveIntensity = pulse * 2.5;
    if (haloRef.current) { haloRef.current.rotation.y = t * 0.4; haloRef.current.rotation.x = Math.sin(t * 0.3) * 0.3; }
    if (particlesRef.current) { particlesRef.current.rotation.y = t * 0.05; }
  });

  return (
    <group ref={groupRef}>
      {/* Head */}
      <RoundedBox args={[0.9, 1.0, 0.8]} radius={0.12} smoothness={4} position={[0, 0.3, 0]}>
        <meshStandardMaterial color="#1a1a2e" metalness={0.85} roughness={0.18} />
      </RoundedBox>
      {/* Face plate */}
      <RoundedBox args={[0.7, 0.7, 0.05]} radius={0.06} smoothness={2} position={[0, 0.25, 0.42]}>
        <meshStandardMaterial color="#12121f" metalness={0.9} roughness={0.15} />
      </RoundedBox>
      {/* Left eye */}
      <RoundedBox args={[0.18, 0.08, 0.06]} radius={0.03} smoothness={2} position={[-0.16, 0.35, 0.46]}>
        <meshStandardMaterial color="#0a0a12" metalness={0.9} roughness={0.3} />
      </RoundedBox>
      <mesh position={[-0.16, 0.35, 0.5]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial ref={eyeLeftRef} color="#ef233c" emissive="#ef233c" emissiveIntensity={2.5} toneMapped={false} />
      </mesh>
      {/* Right eye */}
      <RoundedBox args={[0.18, 0.08, 0.06]} radius={0.03} smoothness={2} position={[0.16, 0.35, 0.46]}>
        <meshStandardMaterial color="#0a0a12" metalness={0.9} roughness={0.3} />
      </RoundedBox>
      <mesh position={[0.16, 0.35, 0.5]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial ref={eyeRightRef} color="#ef233c" emissive="#ef233c" emissiveIntensity={2.5} toneMapped={false} />
      </mesh>
      {/* Forehead ridge */}
      <RoundedBox args={[0.5, 0.04, 0.1]} radius={0.01} smoothness={2} position={[0, 0.52, 0.42]}>
        <meshStandardMaterial color="#2a2a3e" metalness={0.8} roughness={0.25} />
      </RoundedBox>
      {/* Mouth vents */}
      <RoundedBox args={[0.3, 0.02, 0.04]} radius={0.005} smoothness={1} position={[0, 0.1, 0.44]}>
        <meshStandardMaterial color="#ef233c" emissive="#ef233c" emissiveIntensity={0.5} />
      </RoundedBox>
      <RoundedBox args={[0.2, 0.015, 0.04]} radius={0.005} smoothness={1} position={[0, 0.06, 0.44]}>
        <meshStandardMaterial color="#ef233c" emissive="#ef233c" emissiveIntensity={0.3} />
      </RoundedBox>
      {/* Circuit lines */}
      {circuitLines.map((line, i) => (
        <mesh key={i} position={line.pos}>
          <boxGeometry args={line.scale} />
          <meshStandardMaterial color={line.color} emissive={line.color} emissiveIntensity={0.8} transparent opacity={0.6} toneMapped={false} />
        </mesh>
      ))}
      {/* Ear pieces */}
      <mesh position={[-0.52, 0.3, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.08, 0.12, 16]} />
        <meshStandardMaterial color="#2a2a3e" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[-0.52, 0.3, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.04, 0.14, 16]} />
        <meshStandardMaterial color="#ef233c" emissive="#ef233c" emissiveIntensity={1} toneMapped={false} />
      </mesh>
      <mesh position={[0.52, 0.3, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.08, 0.12, 16]} />
        <meshStandardMaterial color="#2a2a3e" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0.52, 0.3, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.04, 0.14, 16]} />
        <meshStandardMaterial color="#ef233c" emissive="#ef233c" emissiveIntensity={1} toneMapped={false} />
      </mesh>
      {/* Antenna */}
      <mesh position={[0, 0.95, 0]}>
        <cylinderGeometry args={[0.01, 0.015, 0.3, 8]} />
        <meshStandardMaterial color="#3a3a4e" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.15, 0]}>
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshStandardMaterial color="#ef233c" emissive="#ef233c" emissiveIntensity={3} toneMapped={false} />
      </mesh>
      {/* Neck */}
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.15, 0.2, 0.2, 16]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.85} roughness={0.2} />
      </mesh>
      <mesh position={[0, -0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.18, 0.015, 8, 32]} />
        <meshStandardMaterial color="#ef233c" emissive="#ef233c" emissiveIntensity={0.6} toneMapped={false} />
      </mesh>
      {/* Shoulders */}
      <mesh position={[-0.35, -0.5, 0]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.25, 0.08, 0.35]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.85} roughness={0.2} />
      </mesh>
      <mesh position={[0.35, -0.5, 0]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.25, 0.08, 0.35]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.85} roughness={0.2} />
      </mesh>
      {/* Halo ring */}
      <group ref={haloRef} position={[0, 0.3, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.7, 0.006, 8, 64]} />
          <meshStandardMaterial color="#ef233c" emissive="#ef233c" emissiveIntensity={1.5} toneMapped={false} />
        </mesh>
        <mesh rotation={[Math.PI / 3, 0.5, 0]}>
          <torusGeometry args={[0.85, 0.004, 8, 64]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.15} />
        </mesh>
      </group>
      {/* Orbiting particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={particlePositions.length / 3} array={particlePositions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial transparent color="#ef233c" size={0.012} sizeAttenuation depthWrite={false} opacity={0.6} />
      </points>
    </group>
  );
}
