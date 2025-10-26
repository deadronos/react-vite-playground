// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import * as THREE from 'three';
import ECS, { queries, type Entity } from '@/ecs/ecs';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';



/**
 * Simple visual model for a beam: a small emissive sphere.
 * We also render a thin line from the source (if available) to the beam position.
 */

function BeamModel() {
  const meshRef = useRef<THREE.Mesh>(null);
  return (
    <mesh ref={meshRef}>
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
}

const beams = queries.beams;

const RenderBeams = () => (
  <ECS.Entities in={beams} key="beams-list">
    {(entity) => <RenderBeam {...entity} key={`beam-entity-${entity.id}`} />}
  </ECS.Entities>
);

function RenderBeam(entity: Entity) {
  const meshRef = useRef<THREE.Mesh>(null);
  const lineRef = useRef<THREE.Line>(null);

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh || !entity.position) return;

    // Update beam sphere position to match entity
    mesh.position.set(entity.position.x, entity.position.y, entity.position.z);

    // Update the optional line from source -> beam
    const line = lineRef.current;
    const src = entity.beamConfig?.source?.position;
    if (line) {
      if (src && entity.position) {
        // set line geometry to two points: source and beam
        const pts = [src.clone(), entity.position.clone()];
        // setFromPoints will replace the underlying attribute buffer
        (line.geometry).setFromPoints(pts);
        line.visible = true;
      } else {
        line.visible = false;
      }
    }
  });

  // Use a group to position/rotate if needed later; initial position derived from entity
  return (
    <group position={entity.position?.toArray() as [number, number, number]}>
      <BeamModel />
      {/* Line from source to beam; material uses additive blending to look like a laser */}
      <line ref={lineRef}>
        <bufferGeometry />
        <lineBasicMaterial
          color="#00ccff"
          linewidth={2}
          transparent={true}
          opacity={0.9}
        />
      </line>
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
