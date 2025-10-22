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
    mesh.rotation.y += angle*speed;
    mesh.rotation.x += angle*speed;
    mesh.position.y = 1.18 + Math.sin(_.clock.getElapsedTime()*0.25) * 1.5*speed;
    mesh.position.x = Math.sin(_.clock.getElapsedTime()*0.25) * 1.0*speed;
    mesh.scale.x=mesh.scale.x*Math.sin(_.clock.getElapsedTime()*11.5)*0.01*speed+4.0;
    mesh.scale.y=mesh.scale.y*Math.cos(_.clock.getElapsedTime()*4.5)*0.01*speed+4.0;
    mesh.scale.z=mesh.scale.z*Math.sin(_.clock.getElapsedTime()*6.5)*0.01*speed+4.0;
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
        chromaticAberration={clicked?1.0:0.0}
        thickness={0.5}
        roughness={0.1}
        ior={1.1}
        color={props.color || 'white'}
        metalness={0.2}
        reflectivity={0.5}
        toneMapped={true}
        visible={true}
        depthWrite={true}
        depthTest={true}
        side={2}
      />
    </Sphere>
  );
}


