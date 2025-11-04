import { type Query, World } from 'miniplex'
import type * as Miniplex from 'miniplex-react';
import createReactAPI from 'miniplex-react'
import * as THREE from 'three'

type Vector3 = THREE.Vector3

export type Entity = {
  id: number;
  isBuilding?: boolean;
  isDrone?: boolean;
  position?: Vector3;
  velocity?: Vector3;
  speed?: number; // units per second
  loadRadius?: number;
  targetPosition?: Vector3;
  targetEntityId?: number|null;
  dronestate?: 'idle'|'movingToPickup'|'loading'|'movingToDropoff'|'unloading'|'returning';
  lastStateChangedAt?: number; // timestamp
  actionTimer: number; // seconds remaining for current action
  returnPosition?: Vector3;
  MessageLog?: Message[]|null;
  MessagePending?: Message|null;
  MessageCarrying? : Message|null;
}

/*Drone state transitions (summary):
*
* idle -> movingToPickup (on assignment)
* movingToPickup -> loading (on within loadRadius)
* loading -> movingToDropoff (after load timer; transfer message from building to drone)
* movingToDropoff -> unloading (on within dropoff loadRadius)
* unloading -> returning (after unload timer; append message to target building.MessageLog and clear drone carrying)
* returning -> idle (on returnPosition reached)
*/

export type Message = {
  text: string;
  createdAt?:number;
  fromEntityId?: number;
  toEntityId?: number;
}

let localNextEntityId = 0;

export function getNextEntityId(): number {
  return localNextEntityId++;
}

console.debug("Initializing ECS World module");

// factory to create a fresh World instance
function createWorldInstance(): World<Entity> {
  return new World<Entity>();
}

// exported mutable bindings so we can replace them on reset
export let world: World<Entity> = createWorldInstance();
console.debug("ECS World initialized");

// React API (miniplex-react) bound to the current world
export type ECSWorldType = typeof world;


export let ECS = createReactAPI(world);

export default ECS;

/**
 * Replace the current world (and the miniplex-react API) with fresh instances.
 * This guarantees that IDs start from scratch (no reliance on .clear() behavior).
 */
export function resetWorld(): void {
  const prevCount = (world as any)?.entities?.length ?? 0;
  console.debug(`Resetting world. Previous world had ~${prevCount} entities (approx).`);

  // create a fresh world and new API bound to it
  world.clear();
  world = createWorldInstance();
  ECS = createReactAPI(world);
  localNextEntityId=0;

  console.debug("World reset: new World instance created and ECS API recreated.");
}

/* --- existing helper functions --- */

export function addEntity(entity: Partial<Entity>): Entity {
  const newEntity = {
    id: getNextEntityId(),
    ...entity
  } as Entity;
  world.add(newEntity);
  // prefer localID newEntity.id = world.id(newEntity) ?? -1;
  console.debug("Added generic entity:", newEntity);
  return newEntity;
}

export function removeEntity(entity: Entity): void {
  world.remove(entity);
  console.debug("Removed entity:", entity);
}

export function getEntityById(id: number): Entity | undefined {
  console.debug("Retrieving entity by ID:", id);
  return world.entity(id);
}

/*
  Queries must be created against the current `ECS.world`. We expose them as
  functions so callers always get queries bound to the current world instance.
  (If you prefer, you can wrap these in getters.)
*/
export const queries = {
  drones: () => ECS.world.with('isDrone'),
  idleDrones: () => ECS.world.with('isDrone').where((drone)=> drone.dronestate === 'idle'),
  buildings: () => ECS.world.with('isBuilding'),
  dronesMoving: () => ECS.world.with('isDrone', 'velocity'),
  buildingsWithMessagesPending: () => ECS.world.with('isBuilding', 'MessagePending'),
  dronesCarryingMessages: () => ECS.world.with('isDrone', 'MessageCarrying', 'targetEntityId', 'targetPosition'),
  dronesCarryingNoMessages: () => ECS.world.with('isDrone').without('MessageCarrying'),
  buildingsWithMessageLogs: () => ECS.world.with('isBuilding', 'MessageLog'),
};

export function emptyCargo(entity: Entity): void {
  if (entity.isDrone === undefined || !entity.isDrone) {
    console.warn(`Entity ${entity.id} is not a drone and cannot empty cargo.`);
    return;
  };
  world.removeComponent(entity, 'MessageCarrying');
  console.debug(`Entity ${entity.id} has emptied its cargo.`);
}

export function addDroneEntity(position?: Vector3): Entity {
  const newEntity = {
    id: getNextEntityId(),
    isDrone: true,
    position: position ?? new THREE.Vector3().set(0, 0, 0),
    velocity: new THREE.Vector3().set(0, 0, 0),
    speed: 1, // units per second
    dronestate: 'idle',
    returnPosition: position ?? new THREE.Vector3().set(0, 0, 0),
  };
  world.add(newEntity);
  // prefer localID newEntity.id = world.id(newEntity) ?? -1;
  console.debug("Added drone entity:", newEntity);
  return newEntity as Entity;
}

export function addBuildingEntity(position?: Vector3): Entity {
  const newEntity = {
    id: getNextEntityId(),
    isBuilding: true,
    position: position ?? new THREE.Vector3().set(0, 0, 0),
    loadRadius: 1,
    MessageLog: [],
  } as any;
  world.add(newEntity);
  // prefer localID newEntity.id = world.id(newEntity) ?? -1;
  console.debug("Added building entity:", newEntity);
  return newEntity as Entity;
}


