import { useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { createPlatform, createTurret, create, world } from "@/ecs/ecs";
import { spawningSystem } from "@/ecs/systems/spawningSystem";
import { movementSystem } from "@/ecs/systems/movementSystem";
import { turretSystem, movementBeamSystem} from "@/ecs/systems/turretSystem";
import { collisionSystem } from "@/ecs/systems/collisionSystem";
import { healthSystem } from "@/ecs/systems/healthSystem";
import type { Vec3 } from "@/ecs/ecs";






export function Systems(){

  const world:ecsType= null;

  useEffect(()=>{
    // Initialize ECS world or any other setup if needed

    const platformOrigin: Vec3 = { x: 0, y: -1, z: 0 };
    create(createPlatform(platformOrigin));
    create(createTurret({ position: { x: 5, y: -1, z: 0 }, cooldown: 1 }));
    create(createTurret({ position: { x: -5, y: -1, z: 0 }, cooldown: 1 }));

    return ()=>{
         // Cleanup if necessary
         world.clear();
    }

  }, [world]) // run once on mount

  useFrame((state,delta)=>{
    // Call your ECS systems here, passing in the world and delta time
    // e.g., spawningSystem(ecs, delta * 1000); // delta is in seconds, convert to ms if needed
    spawningSystem(delta);
    movementSystem(delta);
    turretSystem(delta);
    movementBeamSystem(delta);
    collisionSystem(delta);
    healthSystem(delta);

  });


  return (
    <>
    </>
  );
}
