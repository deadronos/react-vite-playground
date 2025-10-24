import { type Entity, type World, type Vec3, queries } from "../ecs";


/**
 * Simple movement system:
 * - Integrates position based on velocity
 * - Delta is in seconds
 * - Removes entities that leave configured bounds
 *
 * Notes:
 * - updating transforms only
 * - Collision detection handled in separate system
 * - For smoother rendering, consider previousPosition on entities
 *   and interpolate in render loop
 *
 * Configurable parameters
 */
const DEFAULT_BOUNDS = {
  x:100, // +/- X
  yMin: -40, // y < yMin -> remove
  z:100  // +/- Z
};

const MAX_SPEED=50; // clamp for excessive velocities

export function movementSystem(world: World<Entity>, delta: number, bounds?=DEFAULT_BOUNDS){
  if (!world||!delta||delta<=0) return;

  // Iterate over entities with position and velocity
  for (const entity of queries.movingEntities) {
    // Check if entity has position and velocity
    if (!entity.position || !entity.velocity) continue;


    const vx=Number(entity.velocity.x??0);
    const vy=Number(entity.velocity.y??0);
    const vz=Number(entity.velocity.z??0);
    // Update position based on velocity

    // Clamp velocity to MAX_SPEED
    const speedSquared = vx * vx + vy * vy + vz * vz;
    if (speedSquared > MAX_SPEED * MAX_SPEED) {
      const inv=1/Math.sqrt(speedSquared);
      entity.velocity.x = vx * inv * MAX_SPEED;
      entity.velocity.y = vy * inv * MAX_SPEED;
      entity.velocity.z = vz * inv * MAX_SPEED;
    }

    // Integrate position += velocity * delta
    if (entity.previousPosition===undefined){
      entity.addComponent('previousPosition',{...entity.position});
    }else{
      entity.previousPosition={...entity.position};
    }

    entity.position.x += (entity.velocity.x ?? 0) * delta;
    entity.position.y += (entity.velocity.y ?? 0) * delta;
    entity.position.z += (entity.velocity.z ?? 0) * delta;

    // Check bounds and remove entity if out of bounds
    const {x:posX, y:posY, z:posZ} = entity.position;
    if (
      Math.abs(posX)>bounds.x ||
      Math.abs(posZ)>bounds.z ||
      posY<bounds.yMin
    ) {
      try {
        world.remove(entity);
      } catch (e) {
        console.warn("movementSystem: failed to remove out-of-bounds entity", e);
      }
    }
  }

}
