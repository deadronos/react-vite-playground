import ECS from '../ecs';
import { queries } from '../ecs';




// Movement system to update entity positions based on their velocities
// and handle simple boundary conditions

export function MovementSystem(delta: number) {
  //console.log("MovementSystem running with delta:", delta);
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



    // Simple boundary conditions (e.g., wrap around a cube of size 100)
    const BOUNDARY_SIZE = 110;
    const HALF = BOUNDARY_SIZE / 2;

    // Wrap each axis into [-HALF, HALF]
    if (entity.position.x > HALF) entity.position.x -= BOUNDARY_SIZE;
    if (entity.position.x < -HALF) entity.position.x += BOUNDARY_SIZE;

    if (entity.position.y > HALF) entity.position.y -= BOUNDARY_SIZE;
    if (entity.position.y < -HALF) entity.position.y += BOUNDARY_SIZE;

    if (entity.position.z > HALF) entity.position.z -= BOUNDARY_SIZE;
    if (entity.position.z < -HALF) entity.position.z += BOUNDARY_SIZE;

   // Remove if entity is outside boundaries
   if (entity.position.x < -HALF || entity.position.x > HALF ||
       entity.position.y < -HALF || entity.position.y > HALF ||
       entity.position.z < -HALF || entity.position.z > HALF) {
     ECS.world.remove(entity);
   }

  }

}
