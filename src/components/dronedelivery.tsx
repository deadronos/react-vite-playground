import type * as THREE from 'three';
import { useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import ECS, {queries, world, type ECSAPIType, type Entity} from '@/ecs/world';
import React from 'react';

interface MeshProps {
  entity: Entity;
  // Adda ref prop for manipulating the mesh if needed
  meshRef: React.Ref<THREE.Mesh>;
}

function DroneMesh({entity:Entity, meshRef}: MeshProps) {
  // Simple representation of a drone as a box
  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[0.5, 0.2, 0.5]} />
      <meshStandardMaterial color="blue" />
    </mesh>
  );
}

function BuildingMesh({entity: Entity, meshRef}: MeshProps) {
  // Simple representation of a building as a box
  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="gray" />
    </mesh>
  );
}


export default function DroneDelivery() {
  const [drones, setDrones] = React.useState<Entity[]>([]);
  const [buildings, setBuildings] = React.useState<Entity[]>([]);

  const droneRefs = React.useRef<Map<number, React.RefObject<THREE.Mesh>>>(new Map());
  const buildingRefs = React.useRef<Map<number, React.RefObject<THREE.Mesh>>>(new Map());

  useEffect(() => {
    const droneSubscription  = queries.drones().onEntityAdded.subscribe((drone)=>{
      setDrones((prev) => [...prev, drone]);
    });
    const buildingSubscription = queries.buildings().onEntityAdded.subscribe((building)=>{
      setBuildings((prev) => [...prev, building]);
    });

    const droneRemovedSubscription = queries.drones().onEntityRemoved.subscribe((drone)=>{
      setDrones((prev) => prev.filter(d => d.id !== drone.id));
    });
    const buildingRemovedSubscription = queries.buildings().onEntityRemoved.subscribe((building)=>{
      setBuildings((prev) => prev.filter(b => b.id !== building.id));
    });

    console.debug("DroneDelivery mounted, subscribing to ECS entity changes.");

    return () => {
      queries.drones().onEntityAdded.unsubscribe(droneSubscription);
      queries.buildings().onEntityAdded.unsubscribe(buildingSubscription);
      queries.drones().onEntityRemoved.unsubscribe(droneRemovedSubscription);
      queries.buildings().onEntityRemoved.unsubscribe(buildingRemovedSubscription);
      console.debug("DroneDelivery unmounted, unsubscribed from ECS entity changes.");
    };
  },[]);

//  console.debug ("Rendering DroneDelivery with drones:", drones);
//  console.debug ("Rendering DroneDelivery with buildings:", buildings);


  useFrame((_, dt)=>{
    // Sync entity positions
    for(const drone of drones){
      const meshRef = droneRefs.current.get(drone.id);
      if(meshRef?.current){
        const position = ECS.getComponent(drone, 'Position');
        meshRef.current.position.set(position.x, position.y, position.z);
      }
    }

    for(const building of buildings){
      const meshRef = buildingRefs.current.get(building.id);
      if(meshRef?.current){
        const position = ECS.getComponent(building, 'Position');
        meshRef.current.position.set(position.x, position.y, position.z);
      }
    }

  });

  return (
    <>
    {drones.map((drone)=>{
      // when mapping, pass a ref callback to capture the mesh reference
      return <DroneMesh
        key={drone.id}
        entity={drone}
        meshRef={(mesh)=>{
        if(mesh) droneRefs.current.set(drone.id, mesh);
        else droneRefs.current.delete(drone.id);
        }}
      />
    })}
    {buildings.map((building)=>{
      // when mapping, pass a ref callback to capture the mesh reference
      return <BuildingMesh
        key={building.id}
        entity={building}
        meshRef={(mesh)=>{
          if(mesh) buildingRefs.current.set(building.id, mesh);
          else buildingRefs.current.delete(building.id);
        }}
      />
    })}
    </>
  );
}


