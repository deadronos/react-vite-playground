import * as THREE from 'three';
import ECS, { queries, type Entity } from '@/ecs/ecs';
import React, { useRef, forwardRef } from 'react';
import { useFrame } from '@react-three/fiber';
// removed unused Line import; we render a cylinder mesh instead



/**
 * Simple visual model for a beam: a small emissive sphere.
 * We also render a thin line from the source (if available) to the beam position.
 */

const BeamModel = forwardRef<THREE.Mesh, {}>(function BeamModel(_props, ref) {
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.12, 8, 8]} />
      <meshStandardMaterial
        emissive={'#00aaff'}
        emissiveIntensity={2}
        color={'#ffffff'}
        metalness={0.2}
        roughness={0.1}
      />
    </mesh>
  );
});

const beams = queries.beams;

const RenderBeams = () => (
  <ECS.Entities in={beams} key="beams-list">
    {(entity) => <RenderBeam {...entity} key={`beam-entity-${entity.id}`} />}
  </ECS.Entities>
);

function RenderBeam(entity: Entity) {
  const meshRef = useRef<THREE.Mesh>(null);
  const cylinderRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh || !entity.position) return;

    // Update beam sphere position to match entity
    mesh.position.set(entity.position.x, entity.position.y, entity.position.z);

    // Update the optional line from source -> beam
    const cyl = cylinderRef.current;
    const src = entity.beamConfig?.source?.position;
    if (cyl) {
      if (src && entity.position) {
        // Build a cylinder that spans from source -> beam position
        const start = src;
        const end = entity.position;
        const dir = new THREE.Vector3().subVectors(end, start);
        const len = dir.length();
        if (len > 0.0001) {
          // midpoint
          const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
          cyl.position.copy(mid);

          // orient the cylinder (its local Y axis points up by default)
          const up = new THREE.Vector3(0, 1, 0);
          const q = new THREE.Quaternion().setFromUnitVectors(up, dir.clone().normalize());
          cyl.quaternion.copy(q);

          // scale the cylinder so its height equals the distance
          // cylinder geometry is created with height = 1, so scale.y = len
          cyl.scale.set(1, len, 1);
          cyl.visible = true;
        } else {
          cyl.visible = false;
        }
      } else {
        cyl.visible = false;
      }
    }
  });

  // Use a group to hold the beam visuals. We position child meshes directly in world
  // space in useFrame (mesh and cylinder), so group remains at origin.
  return (
    <group>
      <BeamModel ref={meshRef} />

      {/* Cylinder that stretches from turret (source) to current beam position */}
      <mesh ref={cylinderRef}>
        {/* height 1 - we'll scale y to the actual distance each frame */}
        <cylinderGeometry args={[0.06, 0.06, 1, 12]} />
        <meshStandardMaterial
          color={'#00ccff'}
          emissive={'#00ccff'}
          emissiveIntensity={3}
          transparent={true}
          opacity={0.9}
        />
      </mesh>
    </group>
  );
}

export function Beams() {
  useFrame(() => {
    // Nothing required here now but kept to mirror Asteroids pattern
  });

  console.log('Rendering Beams component');
  return <RenderBeams />;
}
