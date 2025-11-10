import { Vector3 } from 'three';
import { ECS, world } from '../world';


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
          const building = world.entity(drone.targetEntityId);
          if (building?.MessagePending) {
            // transfer message from building to drone
            drone.MessageCarrying = building.MessagePending;
            console.debug(`Drone ${drone.id} loaded message:`, drone.MessageCarrying);
            // remove MessagePending from building
            try{
              world.removeComponent(building, "MessagePending");
            }catch(e){
              // If world.removeComponent is not supported or fails, fallback to deleting property
              // (some codepaths assign MessagePending directly on the entity)
              delete (building as any).MessagePending;
            }
            // Ensure the plain property is removed as well so UI consumers don't see stale data
            if ((building as any).MessagePending !== undefined) delete (building as any).MessagePending;
            // set drone state to movingToDropoff
            drone.dronestate = 'movingToDropoff';
            // clear actionTimer
            drone.actionTimer = 0;
            drone.targetEntityId = drone.MessageCarrying?.toEntityId ?? null;
            if (drone.targetEntityId !== null) {
              drone.targetPosition=world?.entity(drone.targetEntityId)?.position??undefined;
              console.debug(`Drone ${drone.id} targetPosition set to dropoff entity ${drone.targetEntityId}.`);
              if (drone.targetPosition === undefined) {
                console.warn(`Drone ${drone.id} targetPosition for dropoff is undefined, target entity ${drone.targetEntityId} not found, returning`);
                drone.dronestate = 'returning';
                drone.targetPosition = drone.returnPosition ?? new Vector3(0,0,0);
                drone.targetEntityId = null;
                drone.lastStateChangedAt = Date.now();
                return;
              }
              console.debug(`Drone ${drone.id} loaded message, heading to dropoff at entity ${drone.targetEntityId}.`);
            } else {
              console.warn(`Drone ${drone.id} has no valid targetEntityId from MessageCarrying, returning`);
              drone.dronestate = 'returning';
              drone.targetPosition = drone.returnPosition ?? new Vector3(0,0,0);
              drone.targetEntityId = null;
              return;
            }
            drone.lastStateChangedAt = Date.now();
          } else {
            console.warn(`Drone ${drone.id} loading completed but no MessagePending found on building ${drone.targetEntityId}, returning`);
            drone.dronestate = 'returning';
            drone.actionTimer = 0;
            drone.targetPosition = drone.returnPosition ?? new Vector3(0,0,0);
            drone.targetEntityId = null;
            drone.lastStateChangedAt = Date.now();
            return;
          }
        }
      }
      // handle unloading completion
      if (drone.dronestate === 'unloading') {
        // find target building
        if (drone.targetEntityId !== undefined && drone.targetEntityId !== null) {
          const building = world.entity(drone.targetEntityId);
          if (building?.isBuilding) {
            // ensure MessageLog exists
            if (!building.MessageLog) building.MessageLog = [];
            // append to building.MessageLog (guard for null)
            if (drone.MessageCarrying) building.MessageLog.push(drone.MessageCarrying);
            // clear drone.MessageCarrying via world API for consistency
            try{
              world.removeComponent(drone, 'MessageCarrying');
            }catch(e){
              // fallback to direct delete
              delete (drone as any).MessageCarrying;
            }
            // set drone state to returning
            drone.dronestate = 'returning';
            // clear actionTimer
            drone.actionTimer = 0;
            drone.targetPosition = drone.returnPosition ?? undefined;
            drone.targetEntityId = null;
            drone.lastStateChangedAt = Date.now();
          }
        }
      }
    }
  }
}
