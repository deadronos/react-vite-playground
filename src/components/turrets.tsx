import * as THREE from 'three';
import ECS, { queries, type Entity } from '@/ecs/ecs';
import { useRef } from 'react';


export function TurretModel() {
  const meshRef= useRef<THREE.Mesh>(null);
  return (
    <mesh ref={meshRef}>
      <cylinderGeometry args={[0.2, 0.5, 1, 16]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

const turrets=queries.turrets;



const RenderTurrets=()=>(
  <ECS.Entities in={turrets} key="turrets-list">
    {(entity) =>
     <RenderTurret {...entity} key={`turret-entity-${entity.id}`} />
    }
  </ECS.Entities>
)

const RenderTurret=(entity:Entity)=>(
  <group position={entity.position?.toArray() as [number,number,number]} rotation={new THREE.Euler().setFromQuaternion(entity.rotation!)}>
    <TurretModel />
  </group>
)



export default function Turrets() {
  return(
    <RenderTurrets />
  )
}

