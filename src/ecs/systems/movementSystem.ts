import ECS from '../ecs';
import { queries } from '../ecs';




// Movement system to update entity positions based on their velocities
// and handle simple boundary conditions

export function MovementSystem(delta: number) {
  // query all moving entities
  const movingEntities = queries.movingEntities;

  for(const entity of movingEntities) {
    // ensure required components exist
    if(!entity.position || !entity.velocity || !entity.previousPosition) continue;

    // Store previous position
    entity.previousPosition.copy(entity.position);

    // Update position based on velocity and delta time
    const deltaVelocity = entity.velocity.clone().multiplyScalar(delta);
    entity.position.add(deltaVelocity);
    // Update entity in the ECS
    ECS.world.update(entity);

    // Simple boundary conditions (e.g., wrap around a cube of size 100)
    const BOUNDARY_SIZE = 100;
    // Wrap around logic
    entity.position.x = (entity.position.x + BOUNDARY_SIZE) % BOUNDARY_SIZE;
    entity.position.y = (entity.position.y + BOUNDARY_SIZE) % BOUNDARY_SIZE;
    entity.position.z = (entity.position.z + BOUNDARY_SIZE) % BOUNDARY_SIZE;

    // Remove if entity is outside boundaries
    if (entity.position.x < 0 || entity.position.x > BOUNDARY_SIZE ||
        entity.position.y < 0 || entity.position.y > BOUNDARY_SIZE ||
        entity.position.z < 0 || entity.position.z > BOUNDARY_SIZE) {
      ECS.world.remove(entity);
    }

  }

}
