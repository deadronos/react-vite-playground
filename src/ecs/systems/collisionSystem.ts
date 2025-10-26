import ECS from '../ecs';
import { queries } from '../ecs';
import * as THREE from 'three';


/* Collision System: Detects and handles collisions between beams and targetable entities (like asteroids)
*  Beams are removed upon collision, and targetable entities take damage.
*  This system uses bounding sphere checks for collision detection.
*/


export function CollisionSystem(_delta: number) {
  // console.log("CollisionSystem running with delta:", _delta);
  const { targets, beams, asteroids, platforms } = queries;

  // Reset wasHit flag for all targetable entities at the start of the frame
  for(const target of targets.entities) {
    if(target.targetableConfig) {
      target.targetableConfig.wasHit = false;
    }
  }

  // Check for collisions between beams and targetable entities
  for(const beam of beams.entities) {
    const beamPos = beam.position;
    const beamPrev = beam.previousPosition;
    if(!beamPos || !beamPrev) continue; // Skip if no position data
    const beamConfig=beam.beamConfig;
    if(!beamConfig) continue; // Skip if no beamConfig

    // For fast-moving beams we must test the swept segment between previousPosition -> position
    // against each target's sphere to avoid tunneling. We'll compute distance from target center
    // to the segment and compare to combined radius.
    for(const target of targets.entities) {
      if(!target.position) continue;
      const targetRadius = target.targetableConfig?.collisionRadius ?? 0;

      // compute squared distance from point (target.position) to segment (beamPrev -> beamPos)
      const segStart = beamPrev;
      const segEnd = beamPos;
      const segVec = new THREE.Vector3().subVectors(segEnd, segStart);
      const ptVec = new THREE.Vector3().subVectors(target.position, segStart);
      const segLenSq = segVec.lengthSq();

      let t = 0;
      if (segLenSq > 0) {
        t = Math.max(0, Math.min(1, ptVec.dot(segVec) / segLenSq));
      }
      const closest = new THREE.Vector3().copy(segStart).add(segVec.clone().multiplyScalar(t));
      const distSq = closest.distanceToSquared(target.position);

      const combined = beamConfig.collisionRadius + targetRadius;
      if (distSq <= combined * combined) {
        // Collision detected
        if(target.targetableConfig) {
          target.targetableConfig.wasHit = true;
          target.targetableConfig.accumulatedDamage = (target.targetableConfig.accumulatedDamage ?? 0) + beamConfig.damage;
        }

        // Visual debug: log the collision for easier verification in browser console
        try {
          console.log('Beam hit target', {
            beamId: beam.id,
            targetId: target.id,
            beamPos: beam.position?.toArray(),
            targetPos: target.position?.toArray(),
            damage: beamConfig.damage,
            remainingTTL: beam.lifespan?.remaining ?? beam.beamConfig?.ttl
          });
        } catch {
          // swallow any logging errors to avoid breaking the game loop
        }

        ECS.world.remove(beam);
        break;
      }
    }
    ;
  }

  // check asterois vs platform collision
  for(const asteroid of asteroids.entities) {
    const asteroidPos = asteroid.position;
    if(!asteroidPos) continue; // Skip if no position



    for(const platform of platforms.entities) {
      const platformPos = platform.position;
      if(!platformPos) continue; // Skip if no position

      const PLATFORM_RADIUS=5; // DEFAULT VALUE, adjust as needed
      const ASTEROID_RADIUS:number=asteroid.targetableConfig?.collisionRadius??2;

      if(asteroidPos.distanceTo(platformPos)<(PLATFORM_RADIUS+ASTEROID_RADIUS)){
        // Collision detected
        // Handle collision response (e.g., destroy asteroid, damage platform, etc.)
        asteroid.dead = true; // Mark asteroid as dead
        break; // Exit the inner loop since the asteroid is handled
      }
    }
  }

}
