import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
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

  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);

  // rotate every frame; delta is the seconds elapsed since last frame
  // speed is radians per second, so multiply by delta to get radians to rotate this frame
  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const angle = speed * delta;
    mesh.rotation.y += angle;
    mesh.rotation.x += angle;
    mesh.position.y = 1.18 + Math.sin(_.clock.getElapsedTime()) * 0.5;
  });



  return (
    <Sphere
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => (event.stopPropagation(), hover(true))}
      onPointerOut={(event) => hover(false)}
      ref={meshRef}
      position={[0, 1.18, 0]}
      scale={[3, 3, 3]} {...props}

      >
      <MeshTransmissionMaterial wireframe={hovered? true:false}

        thickness={0.5}
        roughness={0.1}
        ior={1.1}
        color={props.color || 'white'}
        metalness={0.1}
        reflectivity={0.9}
        toneMapped={true}
        visible={true}
        depthWrite={true}
        depthTest={true}
        side={2}
      />
    </Sphere>
  );
}


