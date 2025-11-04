import { queries, world } from "../world";


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




/* Examples (abstract pseudocode lines):

CheckMessagePendingSystem:

pendingBuildings = find buildings with MessagePending
idleDrones = find drones with dronestate == 'idle'
for each building:
select nearest idle drone ->
set drone.targetEntityId=building.id,
drone.targetPosition=building.position,
drone.dronestate='movingToPickup', ensure drone.returnPosition set

*/


export function CheckMessagePendingSystem(){
  // Purpose: Assign idle drones to buildings with pending messages
  // Query: findEntities({ isBuilding: true, messagePending: true }), findEntities({ isDrone: true, dronestate: 'idle' })
  // Run timing: per-frame or throttled
  // Safety: Check for existence of target entities before assignment

  // Pseudocode implementation:
  /*
  const pendingBuildings = findEntities({ isBuilding: true, messagePending: true });
  const idleDrones = findEntities({ isDrone: true, dronestate: 'idle' });  */

  const idleDrones= queries.idleDrones();
  const pendingBuildings= queries.buildingsWithMessagesPending();

  // pick first building
  const pendingBuilding= pendingBuildings.first;
  if(!pendingBuilding) return console.debug("No pending messages"); // no pending messages

  // pick first idle drone
  const idleDrone= idleDrones.first;
  if(!idleDrone) return console.debug("No idle drones available"); // no idle drones


  // Ensure returnPosition is set
  if(idleDrone.returnPosition===undefined){
    world.addComponent(idleDrone,'returnPosition',idleDrone.position.clone()??new THREE.Vector3(0,0,0));
    idleDrone.returnPosition= idleDrone.position.clone();
    console.debug(`Set return position for drone ${idleDrone.id}.`);
  } else {
    idleDrone.returnPosition= idleDrone.position.clone(); // update return position to current
    console.debug(`Updated return position for drone ${idleDrone.id}.`);
  }
   // assign drone to building
  idleDrone.targetEntityId= pendingBuilding.id;
  idleDrone.targetPosition= pendingBuilding.position;
  idleDrone.dronestate= 'movingToPickup';
  idleDrone.Drone.lastStateChangedAt= Date.now();
  idleDrone.velocity= new THREE.Vector3(0,0,0); // reset velocity
  console.debug(`Assigned drone ${idleDrone.id} to building ${pendingBuilding.id} for message pickup.`);



}
