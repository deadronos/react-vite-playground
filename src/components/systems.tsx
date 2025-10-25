import { AsteroidSpawningSystem } from "@/ecs/systems/asteroidspawningSystem";
import { TurretSystem, BeamLifespanSystem } from "@/ecs/systems/turretSystem";
import { MovementSystem } from "@/ecs/systems/movementSystem";
import { CollisionSystem } from "@/ecs/systems/collisionSystem";
import { HealthSystem } from "@/ecs/systems/healthSystem";
import { useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import CreateInitialSpawnSystem from "@/ecs/systems/createinitialspawn";
import ECS from "@/ecs/ecs";



function executeSystems(delta:number){
  AsteroidSpawningSystem(delta);
  MovementSystem(delta);
  TurretSystem(delta);
  CollisionSystem(delta);
  HealthSystem(delta);
  BeamLifespanSystem(delta);

}



export function Systems() {



  useEffect((()=>{

    let initialRun=true;
    // Set up initial state or subscriptions if needed
    if (initialRun){
      initialRun=false;
      CreateInitialSpawnSystem()
      ECS.world.onEntityAdded.subscribe(()=>{
        console.log("Entity added")
      })

      ECS.world.onEntityRemoved.subscribe(()=>{
        console.log("Entity removed")
      })

    } else {
      // Subsequent runs can go here if needed
    }

    return ()=>{
      // Clean up subscriptions or state if needed
    };
  }));

  useFrame((_,delta)=>{
    // const currentTime = performance.now();
    // const frameDelta = (currentTime - lastTime) / 1000; // convert to seconds


    executeSystems(delta);
  },);

  return (
    null
  );
}
