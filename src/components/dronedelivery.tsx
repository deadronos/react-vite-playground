import type * as THREE from 'three';
import { useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import ECS, {queries, world, type ECSAPIType, type Entity} from '@/ecs/world';
import React from 'react';

interface MeshProps {
  entity: Entity;
  // meshRef is a callback ref that receives the THREE.Mesh or null
  meshRef: React.RefCallback<THREE.Mesh | null>;
}

function DroneMesh({entity, meshRef}: MeshProps) {
  // Simple representation of a drone as a box
  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[0.5, 0.2, 0.5]} />
      <meshStandardMaterial color="white" />
    </mesh>
  );
}

function BuildingMesh({entity, meshRef}: MeshProps) {
  // Simple representation of a building as a box
  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="blue" />
    </mesh>
  );
}


export default function DroneDelivery() {
  const [drones, setDrones] = React.useState<Entity[]>([]);
  const [buildings, setBuildings] = React.useState<Entity[]>([]);

  // Store direct mesh instances (or null) keyed by entity id. Using direct
  // mesh instances makes it straightforward to set position during the
  // render loop without mixing RefObjects and callback refs.
  const droneRefs = React.useRef<Map<number, THREE.Mesh | null>>(new Map());
  const buildingRefs = React.useRef<Map<number, THREE.Mesh | null>>(new Map());

  useEffect(() => {
    const droneSubscription  = queries.drones().onEntityAdded.subscribe((drone)=>{
      console.debug("DroneDelivery detected new drone entity:", drone);
      setDrones((prev) => [...prev, drone]);
      // don't pre-create a RefObject; we'll capture the mesh instance via
      // the ref callback when the mesh mounts
    });
    const buildingSubscription = queries.buildings().onEntityAdded.subscribe((building)=>{
      console.debug("DroneDelivery detected new building entity:", building);
      setBuildings((prev) => [...prev, building]);
      // same as drones: mesh instance will be captured by the ref callback
    });

    const droneRemovedSubscription = queries.drones().onEntityRemoved.subscribe((drone)=>{
      setDrones((prev) => prev.filter(d => d.id !== drone.id));
      droneRefs.current.delete(drone.id);
    });
    const buildingRemovedSubscription = queries.buildings().onEntityRemoved.subscribe((building)=>{
      setBuildings((prev) => prev.filter(b => b.id !== building.id));
      buildingRefs.current.delete(building.id);
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
      // Get the mesh instance for the drone and apply the entity's position
      const mesh = droneRefs.current.get(drone.id);
      if(mesh){
        const position = drone.position;
        mesh.position.set(position.x, position.y, position.z);
        // debug can be noisy every frame; keep it for troubleshooting
        //console.debug(`Updated drone entity ${drone.id} position to (${position.x}, ${position.y}, ${position.z})`);
      }
    }

    for(const building of buildings){
      const mesh = buildingRefs.current.get(building.id);
      if(mesh){
        const position = building.position;
        mesh.position.set(position.x, position.y, position.z);
      }
    }

  });

  return (
    <>
    {drones.map((drone)=>{
      // when mapping, pass a ref callback to capture the mesh instance
      return (
        <DroneMesh
          key={drone.id}
          entity={drone}
          meshRef={(mesh)=>{
            if(mesh) droneRefs.current.set(drone.id, mesh);
            else droneRefs.current.delete(drone.id);
          }}
        />
      );
    })}
    {buildings.map((building)=>{
      // when mapping, pass a ref callback to capture the mesh reference
      return (
        <BuildingMesh
          key={building.id}
          entity={building}
          meshRef={(mesh)=>{
            if(mesh) buildingRefs.current.set(building.id, mesh);
            else buildingRefs.current.delete(building.id);
          }}
        />
      );
    })}
    </>
  );
}


