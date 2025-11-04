import * as THREE from 'three';
import { useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import ECS, {queries, world, type Entity} from '@/ecs/world';



function DroneMesh(entity:Entity) {
  // Simple representation of a drone as a box
  return (
    <mesh position={entity.position ? [entity.position.x, entity.position.y, entity.position.z] : [0,0,0]}>
      <boxGeometry args={[0.5, 0.2, 0.5]} />
    </mesh>
  );
}




export default function DroneDelivery() {
  const drones = world.with('isDrone').entities;

  console.debug ("Rendering DroneDelivery with drones:", drones);

  return (
    <>
    {drones.map((drone)=>{
      <DroneMesh key={drone.id} entity={drone} />
    })}
    </>
  );
}


