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
* ActionTimerSystem (dt):
*
* for each drone with actionTimer: actionTimer -= dt
* if timer <= 0:
* if loading -> transfer MessagePending from building to drone.MessageCarrying;
* set droptarget, set dronestate='movingToDropoff';
*
* if unloading -> append to building.MessageLog,
* clear drone.MessageCarrying, set dronestate='returning'
*/

export function ActionTimerSystem(dt: number): void {
  // get drones with actionTimer
  const drones = ECS.world.with('isDrone', 'actionTimer');
  // iterate drones
  for (const drone of drones) {
    // check actionTimer and dronestate defined
    if (drone.actionTimer === undefined || drone.dronestate === undefined) continue;
    // decrement timer
    drone.actionTimer -= dt;
    console.debug("drone actionTimer decremented:", drone.id, drone.actionTimer);
    // check if timer elapsed
    if (drone.actionTimer <= 0) {
      console.debug("drone actionTimer elapsed:", drone.id);
      // handle loading completion
      if (drone.dronestate === 'loading') {
        console.debug(`Drone ${drone.id} completed loading.`);
        // find target building
        if (drone.targetEntityId !== undefined && drone.targetEntityId !== null) {
          const building = ECS.world.find(e => e.id === drone.targetEntityId && e.isBuilding);
          if (building?.MessagePending) {
            // transfer message from building to drone
            drone.MessageCarrying = building.MessagePending;
            building.removeComponent('MessagePending');
            // set drone state to movingToDropoff
            drone.dronestate = 'movingToDropoff';
            // clear actionTimer
            drone.actionTimer = 0;
            drone.targetPosition = drone.MessageCarrying.toEntityId !== undefined && drone.MessageCarrying.toEntityId !== null
              ? ECS.world.find(e => e.id === drone.MessageCarrying.toEntityId)?.position || null
              : null;
            drone.targetEntityId = drone.MessageCarrying.toEntityId !== undefined ? drone.MessageCarrying.toEntityId : null;
            drone.lastStateChangedAt = Date.now();
          }
        }
      }
      // handle unloading completion
      if (drone.dronestate === 'unloading') {
        // find target building
        if (drone.targetEntityId !== undefined && drone.targetEntityId !== null) {
          const building = ECS.world.find(e => e.id === drone.targetEntityId && e.isBuilding);
          if (building) {
            // append to building.MessageLog
            building.MessageLog.push(drone.MessageCarrying);
            // clear drone.MessageCarrying
            drone.removeComponent('MessageCarrying');
            // set drone state to returning
            drone.dronestate = 'returning';
            // clear actionTimer
            drone.actionTimer = 0;
            drone.targetPosition = drone.returnPosition || null;
            drone.targetEntityId = null;
            drone.lastStateChangedAt = Date.now();
          }
        }
      }
    }
  }
}
