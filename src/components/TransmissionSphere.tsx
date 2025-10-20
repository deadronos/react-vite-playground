import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, Sphere } from '@react-three/drei';
import type { Mesh } from 'three';

type TransmissionSphereProps = {
  /**
   * Rotation speed in radians per second.
   * Use a negative value to rotate in the opposite direction.
   */
  speed?: number;
} & React.ComponentProps<typeof Sphere>;

export default function TransmissionSphere({ speed = 0.5, ...props }: TransmissionSphereProps) {
  // ref to the underlying mesh (three.Mesh)
  const meshRef = useRef<Mesh | null>(null);

  // rotate every frame; delta is the seconds elapsed since last frame
  // speed is radians per second, so multiply by delta to get radians to rotate this frame
  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const angle = speed * delta; // radians to rotate this frame
    // mesh.rotation.y += angle;
    mesh.rotation.x += angle;
  });

  return (
    <Sphere ref={meshRef} position={[0, 1.18, 0]} scale={[3, 3, 3]} {...props}>
      <MeshTransmissionMaterial
        color={props.color || 'white'}
        metalness={0.1}
        reflectivity={0.1}
        toneMapped={true}
        visible={true}
        depthWrite={true}
        depthTest={true}
        side={2}
      />
    </Sphere>
  );
}


