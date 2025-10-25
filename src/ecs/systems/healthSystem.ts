import * as THREE from 'three';
import type { Entity } from '../ecs';
import ECS from '../ecs';
import { queries } from '../ecs';
import { World } from 'miniplex';



/* Health System: Manages health of targetable entities (like asteroids)
*  Entities with health <= 0 are marked as dead.
*  This system processes entities that have been hit in the current frame.
*/

export function HealthSystem(delta: number) {
  // query for entities that were hit this frame
  const { hitEntities } = queries;

  // Iterate over hit entities and apply damage
  for(const entity of hitEntities.entities) {
    const targetableConfig = entity.targetableConfig;
    const health = entity.health;
    // Check if components exist
    if(targetableConfig && health) {
      health.current -= targetableConfig.accumulatedDamage || 0;
      // Reset accumulated damage for next frame
      targetableConfig.accumulatedDamage = 0;

      // Check for death
      if(health.current <= 0) {
        // Mark entity as dead
        entity.dead = true;
        // Optionally, remove targetable component to prevent further processing
        ECS.world.removeComponent(entity, "targetable");
        ECS.world.removeComponent(entity, "targetableConfig");
      }
    }
  }

  // cleanup dead entities from hitEntities query
  for(const deadEntity of queries.deadEntities.entities) {
    if(deadEntity.dead===true) {
      // if dead true remove entity from world
      ECS.world.remove(deadEntity)
    } else {
      // if false remove dead component
      ECS.world.removeComponent(deadEntity, "dead");
    }
  }

}
