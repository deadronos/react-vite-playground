import { ECS,world } from '../world';
import { queries } from '../world';
import type { Entity } from '../world';
import * as THREE from 'three';


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


/* ReturnCompletionSystem:
* if drone near returnPosition -> set dronestate='idle', clear targets
*/

export function ReturnCompletionSystem(dt: number): void {
  // Implementation of the Return Completion system
  // This function would typically query the ECS world for drones that are returning,
  // check their distance to the returnPosition, and update their state accordingly.
  const drones = queries.drones().where((drone) => drone.dronestate === 'returning')

  // iterate returning drones
  for (const drone of drones) {
    // check position and returnPosition defined
    if (!drone.position || !drone.returnPosition) return;
    if (!drone.dronestate) return;
    if (drone.dronestate !== 'returning') return;
    console.debug("ReturnCompletionSystem checking drone:", drone.id);
    // Calculate distance to returnPosition
    const distance = drone.position.distanceTo(drone.returnPosition);
    // Check if within a small threshold (e.g., 0.5 units)
    if (distance <= 0.5) {
      // Update drone state to idle and clear targets
      drone.dronestate = 'idle';
      drone.velocity=new THREE.Vector3(0, 0, 0); // stop movement
      world.removeComponent(drone,'targetEntityId');
      world.removeComponent(drone,'targetPosition');
      drone.actionTimer = 0;
      drone.lastStateChangedAt = Date.now();
      // if still carrying message, clear it (safety)
      world.removeComponent(drone,'MessageCarrying');
      console.debug(`Drone ${drone.id} has returned to base and is now idle.`);
    }
  }
}
