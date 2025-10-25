import { AsteroidSpawningSystem } from "@/ecs/systems/asteroidspawningSystem";
import { TurretSystem, BeamLifespanSystem } from "@/ecs/systems/turretSystem";
import { MovementSystem } from "@/ecs/systems/movementSystem";
import { CollisionSystem } from "@/ecs/systems/collisionSystem";
import { HealthSystem } from "@/ecs/systems/healthSystem";
import { useEffect } from "react";
import { useFrame } from "@react-three/fiber";



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
    // Set up initial state or subscriptions if needed
    lastTime = performance.now();
    create

    return ()=>{
      // Clean up subscriptions or state if needed
      lastTime = 0;

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
