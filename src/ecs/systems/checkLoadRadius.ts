import { ECS } from '../world';
import { queries } from '../world';
import type { Entity } from '../world';


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

/*
Proximity/LoadRadiusSystem:

for each moving drone:
if distance <= building.loadRadius ->
set dronestate to loading/unloading,
set actionTimer=load/unload duration
*/

export function CheckLoadRadiusSystem(dt: number): void {
  // Implementation of the Load Radius checking system
  // This function would typically query the ECS world for drones and buildings,
  // check distances, and update drone states and timers accordingly.
  const drones = queries.dronesMoving();
  const buildings = queries.buildings();

  // For each moving drone
  for (const drone of drones) {
    if (!drone.position || !drone.dronestate) continue;
    // Skip drones that are not in a moving state
    if (drone.dronestate == 'idle' || drone.dronestate == 'loading' || drone.dronestate == 'unloading') continue;
    // dronestate left 'movingToPickup', 'movingToDropoff', 'returning'

    for (const building of buildings) {
      // check position undefined or loadRadius undefined
      if (!building.position || building.loadRadius === undefined) continue;
      // Calculate distance
      const distance = drone.position.distanceTo(building.position);
      // Check if within load radius
      if (distance <= building.loadRadius) {
        // Update drone state and action timer
        if (drone.dronestate === 'movingToPickup') {
          drone.dronestate = 'loading';
          drone.actionTimer = 1; // e.g., 3 seconds to load
          drone.lastStateChangedAt = Date.now();
        } else if (drone.dronestate === 'movingToDropoff') {
          drone.dronestate = 'unloading';
          drone.actionTimer = 1; // e.g., 3 seconds to unload
          drone.lastStateChangedAt = Date.now();
        }
        // Break after first match to avoid multiple buildings
        break;
      }
    }
  }
}
