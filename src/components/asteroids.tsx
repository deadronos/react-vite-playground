import * as THREE from 'three';
import ECS, { queries, type Entity } from '@/ecs/ecs';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';




function AsteroidModel() {
  const meshRef=useRef<THREE.Mesh>(null);
  return(
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.5,16,16]} />
      <meshStandardMaterial color="gray" />
    </mesh>
  )
}

const asteroids=queries.asteroids;

const RenderAsteroids=()=>(
  <ECS.Entities in={asteroids} key="asteroids-list">
    {(entity) =>
       <RenderAsteroid {...entity} key={`asteroid-entity-${entity.id}`} />
    }
  </ECS.Entities>
)


function RenderAsteroid(entity:Entity){
  const meshRef=useRef<THREE.Mesh>(null);

  useFrame((_,_delta)=>{
    const mesh=meshRef.current;

    if(!mesh) return;

    mesh.position.set(
      entity.position!.x,
      entity.position!.y,
      entity.position!.z
    );
    if(entity.rotation){
      mesh.rotation.setFromQuaternion(entity.rotation);
    }

  });

  return (

   <group ref={meshRef} position={entity.position?.toArray() as [number,number,number]} rotation={new THREE.Euler().setFromQuaternion(entity.rotation!)}>
    <AsteroidModel />
  </group>
);
}



export function Asteroids() {

  useFrame((_state,_delta)=>{
    // You can add per-frame logic for asteroids here if needed
  });

  console.log("Rendering Asteroids component");
  return (
    <RenderAsteroids />
  )
}
