import { AsteroidSpawningSystem } from "@/ecs/systems/asteroidspawningSystem";
import { TurretSystem, BeamLifespanSystem } from "@/ecs/systems/turretSystem";
import { MovementSystem } from "@/ecs/systems/movementSystem";
import { CollisionSystem } from "@/ecs/systems/collisionSystem";
import { HealthSystem } from "@/ecs/systems/healthSystem";
import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import CreateInitialSpawnSystem from "@/ecs/systems/createinitialspawn";
import ECS, { type Entity } from "@/ecs/ecs";



function executeSystems(delta:number){
  AsteroidSpawningSystem(delta);
  MovementSystem(delta);
  TurretSystem(delta);
  CollisionSystem(delta);
  HealthSystem(delta);
  BeamLifespanSystem(delta);

}



export function Systems() {

  // one-time initialization
  useEffect(() => {
    CreateInitialSpawnSystem();

    const onAdd = (e: Entity) => console.log("Entity added", e);
    const onRemove = (e: Entity) => console.log("Entity removed", e);

    ECS.world.onEntityAdded.subscribe(onAdd);
    ECS.world.onEntityRemoved.subscribe(onRemove);

    return () => {
      // unsubscribe on unmount
      ECS.world.onEntityAdded.unsubscribe(onAdd);
      ECS.world.onEntityRemoved.unsubscribe(onRemove);
    };
  }, []); // <- run once

  const accumulatorRef = useRef(0); // seconds

  useFrame((_, delta) => {
    const dt = 1 / 60; // fixed timestep in seconds
    accumulatorRef.current += delta;

    // run systems in fixed steps while we have accumulated time
    while (accumulatorRef.current >= dt) {
      executeSystems(dt);
      accumulatorRef.current -= dt;
    }

    // optional: lightweight debug per real frame (not per fixed step)
    // console.log(`Frame: delta=${delta.toFixed(4)}s, acc=${accumulatorRef.current.toFixed(4)}s`);
  });

  return (
    <></>
  );
}
