import * as THREE from 'three';
import type { Entity } from '../ecs';
import ECS from '../ecs';
import { queries } from '../ecs';


/* Collision System: Detects and handles collisions between beams and targetable entities (like asteroids)
*  Beams are removed upon collision, and targetable entities take damage.
*  This system uses bounding sphere checks for collision detection.
*/


export function CollisionSystem(delta: number) {
  const { targets, beams, beamColliders, hitEntities } = queries;

  // Reset wasHit flag for all targetable entities at the start of the frame
  for(const target of targets.entities) {
    if(target.targetableConfig) {
      target.targetableConfig.wasHit = false;
    }
  }

  // Check for collisions between beams and targetable entities
  for(const beam of beams.entities) {
    const beamPos = beam.position;
    if(!beamPos) continue; // Skip if no position
    const beamConfig=beam.beamConfig;
    if(!beamConfig) continue; // Skip if no beamConfig

    for(const target of targets.entities) {
      if(beamPos.distanceTo(target.position)<(beamConfig.collisionRadius+(target.targetableConfig?.collisionRadius||0))){
        // Collision detected
        // Mark the target as hit
        if(target.targetableConfig) {
          target.targetableConfig.wasHit = true;
        }
        // Increase accumulated damage
        target.targetableConfig.accumulatedDamage=(target.targetableConfig.accumulatedDamage||0)+beamConfig.damage;
        // Remove the beam entity
        ECS.world.remove(beam);
        break; // Exit the inner loop since the beam is removed
      }
    };

  }
}
