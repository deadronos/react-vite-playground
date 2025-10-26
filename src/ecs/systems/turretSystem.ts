import ECS from "../ecs";
import type { Entity } from "../ecs";
import { queries } from "../ecs";
import * as THREE from "three";


export const BEAM_SPEED= 50;
export const BEAM_TTL= 2;
export const BEAM_DAMAGE= 25;
export const BEAM_RADIUS= 0.2;

// Turret System finding targets and firing beams
function square(v:number):number{
  return v*v;
}
/*
function distanceSquared(a:THREE.Vector3, b:THREE.Vector3):number{
  return square(a.x - b.x) + square(a.y - b.y) + square(a.z - b.z);
}
*/

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
    if(config.target) {
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
    if(config.target) {
      if(!target!.position) continue; // target has no position, skip
      const targetPosition= target!.position;

      // use a Matrix4 to make turret "look at" the target
      // Assumption: turret model faces +Z forward
      const lookAtMatrix = new THREE.Matrix4().
        lookAt(turretPosition,targetPosition, THREE.Object3D.DEFAULT_UP);
      turretRotation.setFromRotationMatrix(lookAtMatrix);

      // 4. Fire if ready
      if (config.cooldown <= 0) {
        config.cooldown= 1.0 / config.fireRate;  // reset cooldown

        // Get direction from turret's rotation
        const direction = new THREE.Vector3(0, 0, 1)
        .applyQuaternion(turret.rotation)
        .normalize();

        // Create beam entity
        const beamPosition = turretPosition.clone().add(direction.clone().multiplyScalar(2)); // start a bit in front of turret
        const beamVelocity = direction.clone().multiplyScalar(BEAM_SPEED);

        // construct beam entity properties
        const beamEntity: Entity = {
          beam: true,
          position: beamPosition,
          previousPosition: beamPosition.clone(),
          velocity: beamVelocity,
          beamConfig:{
            ttl: BEAM_TTL,
            damage: BEAM_DAMAGE,
            speed: BEAM_SPEED,
            collisionRadius: BEAM_RADIUS,
            source: turret
          },
          lifespan: { remaining: BEAM_TTL },
          three: undefined
        };

        ECS.world.add(beamEntity);
        beamEntity.id=ECS.world.id(beamEntity);

      }
    }
  }
}


export function BeamLifespanSystem(delta: number) {
  const beams: Entity[] = queries.beams.entities as Entity[];

  for (const beam of beams) {
    if (!beam.beamConfig) continue; // no beamConfig, skip
    beam.beamConfig.ttl -= delta;  // decrease ttl
    if (beam.beamConfig.ttl <= 0) {
      // Remove beam entity
      ECS.world.remove(beam);
    }
  }
}
