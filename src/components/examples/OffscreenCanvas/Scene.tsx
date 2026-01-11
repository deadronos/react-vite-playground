import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Sphere, Torus } from '@react-three/drei';
import type * as THREE from 'three';

function AnimatedBox({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.5;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Box ref={meshRef} position={position} args={[1, 1, 1]}>
      <meshStandardMaterial color="orange" />
    </Box>
  );
}

function AnimatedSphere({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.5;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <Sphere ref={meshRef} position={position} args={[0.7, 32, 32]}>
      {/* eslint-disable-next-line react/no-unknown-property */}
      <meshStandardMaterial color="purple" metalness={0.5} roughness={0.2} />
    </Sphere>
  );
}

function AnimatedTorus({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.4;
    }
  });

  return (
    <Torus ref={meshRef} position={position} args={[0.6, 0.2, 16, 100]}>
      <meshStandardMaterial color="cyan" />
    </Torus>
  );
}

export default function Scene() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="blue" />

      {/* Animated 3D objects */}
      <AnimatedBox position={[-2, 0, 0]} />
      <AnimatedSphere position={[0, 0, 0]} />
      <AnimatedTorus position={[2, 0, 0]} />

      {/* Controls */}
      <OrbitControls enableDamping dampingFactor={0.05} />
    </>
  );
}
