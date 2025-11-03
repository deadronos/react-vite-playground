import * as THREE from 'three';
import { queries } from "../world";


/*
3) Systems (responsibilities, queries, ordering)
Run order per frame:

CheckMessagePendingSystem — assign idle drones to pending messages (throttled or every frame).
MovementSystem — update drone positions using dt.
Proximity/LoadRadiusSystem — detect entering building radius and set loading/unloading timers.
ActionTimerSystem — decrement timers and perform message transfer on completion.
ReturnCompletionSystem — detect arrival at returnPosition and set drone idle.
Safety/CleanupSystem (optional) — recover stuck drones, handle missing targets.
For each system include:

Purpose: short
Query: miniplex-style abstract query (e.g., findEntities({isDrone, dronestate: 'idle'}))
Run timing: per-frame (or throttled)
Safety: policies for missing targets, removed entities, simultaneous claims
*/


/* MovementSystem(dt)
* Purpose: Update drone positions based on their velocity and speed
* Query: findEntities({isDrone, velocity})
* Run timing: per-frame
* Safety: Ensure velocity is non-zero or set towards targetPosition;
* clamp movement to not overshoot targetPosition
*/



export function MovementSystem(dt: number){
  // Purpose: Update drone positions based on their velocity and speed
  const drones = queries.dronesMoving();
  for(const drone of drones){
    // Skip drones that are not in a moving state
    if(drone.dronestate=='idle'||drone.dronestate=='loading'||drone.dronestate=='unloading') continue;
    // dronestate left 'movingToPickup', 'movingToDropoff', 'returning'

    // Ensure velocity is non-zero or set towards targetPosition
    if(drone.position && drone.velocity){
      // Normalize velocity vector
      const speed = drone.speed ?? 1;
      if(drone.velocity.length() > 0){
        // velocity is non-zero
      } else {
        // velocity is zero, check targetPosition if any
        if(drone.targetPosition){
          const toTarget = new THREE.Vector3().subVectors(drone.targetPosition, drone.position);
          // set velocity towards target
          if(toTarget.length() > 0){
            drone.velocity.copy(toTarget.normalize().multiplyScalar(speed));
          } else {
            // at target
            drone.velocity.set(0,0,0);
          }
        } else {
          // no target, remain stationary
          drone.velocity.set(0,0,0);
        }
      }
    } else {
      console.warn(`Drone entity ${drone.id} missing position or velocity component.`);
    }
    // velocity verified nonzero or set to target or zero
    if(drone.position && drone.velocity){
      // Move drone by velocity * dt
      const movement = drone.velocity.clone().multiplyScalar(dt);
      // clamp movement to not overshoot targetPosition if any
      if(drone.targetPosition){
        const toTarget = new THREE.Vector3().subVectors(drone.targetPosition, drone.position);
        if(movement.lengthSq() > toTarget.lengthSq()){
          // overshoot, clamp to target
          movement.copy(toTarget);
          // also zero velocity as we reached target
          drone.velocity.set(0,0,0);
        }
      }
      drone.position.add(movement);
      // Debug log
      console.debug(`Drone ${drone.id} moved by (${movement.x.toFixed(2)}, ${movement.y.toFixed(2)}, ${movement.z.toFixed(2)}) to new position (${drone.position.x.toFixed(2)}, ${drone.position.y.toFixed(2)}, ${drone.position.z.toFixed(2)})`);
    } else {
      console.warn(`Drone entity ${drone.id} missing position or velocity component during movement.`);
    }
  }
}
