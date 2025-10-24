import { useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { createPlatform, createTurret, World } from "@/ecs/ecs";
import ecs, { type ecsType }  from "@/ecs/ecs";
import { spawningSystem } from "@/ecs/systems/spawningSystem";
import { movementSystem } from "@/ecs/systems/movementSystem";
import { turretSystem } from "@/ecs/systems/turretSystem";
import { collisionSystem } from "@/ecs/systems/collisionSystem";
import { healthSystem } from "@/ecs/systems/healthSystem";
import type { Vec3 } from "@/ecs/ecs";






export function Systems(){

  const world:ecsType= null;

  const useEffect(()=>{
    // Initialize ECS world or any other setup if needed
    const world = ecs; // Assuming ecs is your World instance
    world.init();
    const platformOrigin: Vec3 = { x: 0, y: -1, z: 0 };
    world.create((createPlatform(platformOrigin)));
    world.create((createTurret({x:5,y:-1,z:0},1)))


    world.addSystem(spawningSystem);
    world.addSystem(movementSystem);
    world.addSystem(turretSystem);
    world.addSystem(collisionSystem);
    world.addSystem(healthSystem);

    return ()=>{
         // Cleanup if necessary
         world.clear();
    }

  }, [world=null]) // run once on mount

  useFrame((state,delta)=>{
    // Call your ECS systems here, passing in the world and delta time
    // e.g., spawningSystem(ecs, delta * 1000); // delta is in seconds, convert to ms if needed
    spawningSystem(world, delta);
    movementSystem(world, delta);
    turretSystem(world, delta);
    collisionSystem(world, delta);
    healthSystem(world, delta);

  });


  return (
    <>
    </>
  );
}
