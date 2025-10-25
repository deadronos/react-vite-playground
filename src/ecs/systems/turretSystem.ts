import ECS from "../ecs";
import type { Entity } from "../ecs";
import { queries } from "../ecs";
import type * as THREE from "three";



// Turret System finding targets and firing beams
function square(v:number):number{
  return v*v;
}

function distanceSquared(a:THREE.Vector3, b:THREE.Vector3):number{
  return square(a.x - b.x) + square(a.y - b.y) + square(a.z - b.z);
}

export function TurretSystem(delta: number) {

  // Query targetable entities
  const targets: Entity[] = queries.targets.entities as Entity[];

  // Query turrets
  const turrets: Entity[] = queries.turrets.entities as Entity[];


  // Iterate over each turret
  for (const turret of turrets) {
    if (!turret.turretConfig || !turret.position || !turret.rotation) continue;

    const config= turret.turretConfig;
    const turretPosition= turret.position;
    const turretRotation= turret.rotation;


    // 1. Update cooldown
    config.cooldown= Math.max(0, (config.cooldown ?? 0) - delta);
    if (config.cooldown > 0) continue; // Still cooling down

    // 2. find new target if needed
    let target:Entity|undefined= undefined;
    // check existing target and not dead
    if(config.target!==undefined) {
      if(config.target?.dead!==true) {  // still alive
        target=config.target!;
      } else {
        config.target=null;  // was defined, but dead, target to null
      }
    } else {
      // target undefined or dead, find new target
      let closestTarget: Entity | undefined = undefined;
      let closestDistanceSq = square(config.range);

      for (const potentialTarget of targets) {
        if (!potentialTarget.position) continue; // no position, skip
        const dist=turretPosition.distanceTo(potentialTarget.position);
        const distSq= square(dist);
        if (dist <= config.range && distSq < closestDistanceSq) {
          closestDistanceSq = distSq;
          closestTarget = potentialTarget;
        }
      }
      config.target = closestTarget?? null;
      if (config.target==null) continue; // no target found
      target= config.target;
    }

    // 3. Aim and fire at target

  }

}
