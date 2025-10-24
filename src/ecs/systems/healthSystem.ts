import { world, queries, removeEntity, type Entity } from "../ecs";

/* Health system:
* - Processes wasHit components on entities
* - Reduces health based on wasHitProps.damage
* - Marks entities as dead if health <= 0
* - Cleans up dead entities
* - Resets wasHit components after processing
*
* Notes:
* - Should be run after collision detection system
* - Assumes wasHitProps contains damage and sourceIds
*
* Configurable parameters:
* - None currently
* Usage:
* - Call healthSystem(delta) each frame
*/

export function healthSystem(delta: number) {
  if (delta||delta<=0) return;

  const now=Date.now();

  // Snapshot entities that were hit
  const hitEntities=queries.hitEntities;

  const deadToRemove:Entity[]=[];

  for (const entity of hitEntities) {
    try {
       // Guard: must have health and wasHitProps
      if (typeof entity.health !== "number"){
        entity.wasHit=false;
        world.removeComponent(entity, "wasHitProps");
        continue;
      }

      const damage=entity.wasHitProps?.damage??0;

      if (!damage || damage<=0){
        // No damage to apply
        entity.wasHit=false;
        world.removeComponent(entity, "wasHitProps");
        continue;
      }

      // Apply damage
      entity.health=Math.max(0, (entity.health ?? 0) - damage);

      // Optionally: you could add a 'lastDamagedBy' / 'lastDamageTime' here using wasHitProps
      // const lastSourceIds = ent.wasHitProps?.sourceIds ?? [];
      // const now = ent.wasHitProps?.time ?? Date.now();

      // Clear hit status so we don't process again next frame
      entity.wasHit=false;
      world.removeComponent(entity, "wasHitProps");

      // Check for death
      if(entity.health<=0){
        if (!entity.dead){
          world.addComponent(entity,'dead',true);
        } else {
          entity.dead=true; // keep dead true
        }
        deadToRemove.push(entity);
      }


    } catch (e) {
      console.warn("healthSystem: entity missing health or wasHitProps", e);
      try {
        entity.wasHit=false;
        world.removeComponent(entity, "wasHitProps");
      } catch (e2) {
        console.warn("healthSystem: failed to clean up wasHitProps", e2);
      }
    }

    // Remove dead entities we marked
    if (deadToRemove.length>0){
      for (const deadEntity of deadToRemove){
        try {
          removeEntity(deadEntity);
        } catch (e) {
          console.warn("healthSystem: failed to remove dead entity", e);
        }
      }
    }

    // also remove entites that are marked dead but not processed here
    try {
      const deadEntities=queries.deadEntities;
      for (const deadEntity of deadEntities){
        try {
          removeEntity(deadEntity);
        } catch (e) {
          console.warn("healthSystem: failed to remove dead entities from query", e);
        }
      }
    } catch (e) {
      console.warn("healthSystem: failed to query dead entities", e);
    }
  }
}
