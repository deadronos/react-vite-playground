import ECS from '../ecs';
import { queries } from '../ecs';


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
        target.targetableConfig.accumulatedDamage=(target.targetableConfig.accumulatedDamage??0)+beamConfig.damage;
        // Remove the beam entity
        ECS.world.remove(beam);
        break; // Exit the inner loop since the beam is removed
      }
    };
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
