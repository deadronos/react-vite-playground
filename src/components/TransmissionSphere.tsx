import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, Sphere } from '@react-three/drei';
import type { Mesh } from 'three';


type TransmissionSphereProps = {
  speed?: number; // rotation speed multiplier (radians per second)
} & React.ComponentProps<typeof Sphere>;

export default function TransmissionSphere({ speed = 0.5, ...props }: TransmissionSphereProps) {
  // ref to the underlying mesh
  const meshRef = useRef<Mesh | null>(null);

 // rotate every frame; delta is the seconds elapsed since last frame
  useFrame((state,delta)=>{
    if(!meshRef.current) return;
    meshRef.current.rotation.y+=delta*speed;
    meshRef.current.rotation.x+=delta*speed;
  });

  return(
    <Sphere ref={meshRef} position={[0, 1.18, 0]} scale={[3,3, 3]} {...props}>
      <MeshTransmissionMaterial
      />
    </Sphere>
  )

}


