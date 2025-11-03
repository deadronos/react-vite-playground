import {World} from 'miniplex'
import type * as Miniplex from 'miniplex-react';
import createReactAPI from 'miniplex-react'
import * as THREE from 'three'

type Vector3=THREE.Vector3


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
  dronestate?: 'idle'|'toPickup'|'toDeliver'|'returning';
  returnPosition?: Vector3;
  MessageLog?: Message[]|null;
  MessagePending?: Message|null;
  MessageCarrying? : Message|null;
}

export type Message = {
  text: string;
  createdAt?:number;
  fromEntityId?: number;
  toEntityId?: number;
}

console.debug("Initializing ECS World");
export const world: World<Entity>= new World<Entity>();
console.debug("ECS World initialized");

export type ECSWorldType = typeof world;

export type ECSAPIType = Miniplex.ReactAPI<Entity, ECSWorldType>;

const ECS: ECSAPIType = createReactAPI(world);

export default ECS;

export function addEntity(entity: Partial<Entity>): Entity {
  const newEntity = {
    id: -1,
    ...entity
  } as Entity;
  world.add(newEntity);
  newEntity.id=world.id(newEntity)??-1;
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



export const queries = {
  drones: ECS.world.with('isDrone'),
  buildings: ECS.world.with('isBuilding'),
  dronesMoving: ECS.world.with('isDrone', 'velocity'),
  buildingsWithMessagesPending: ECS.world.with('isBuilding', 'MessagePending'),
  dronesCarryingMessages: ECS.world.with('isDrone', 'MessageCarrying','targetEntityId','targetPosition'),
  dronesCarryingNoMessages: ECS.world.with('isDrone').without('MessageCarrying'),
  buildingsWithMessageLogs: ECS.world.with('isBuilding', 'MessageLog'),
};


export function emptyCargo(entity: Entity): void {
  if (entity.isDrone===undefined || !entity.isDrone) {
    console.warn(`Entity ${entity.id} is not a drone and cannot empty cargo.`);
    return;
  };
  world.removeComponent(entity, 'MessageCarrying');
  console.debug(`Entity ${entity.id} has emptied its cargo.`);
}

export function addDroneEntity(position?:Vector3): Entity {
  const newEntity = {
    id: -1,
    isdrone:true,
    position: position ?? new THREE.Vector3().set(0, 0, 0),
    velocity: new THREE.Vector3().set(0, 0, 0),
    speed: 1, // units per second
    dronestate: 'idle',
    returnPosition: position ?? new THREE.Vector3().set(0, 0, 0),
  };
  world.add(newEntity);
  newEntity.id=world.id(newEntity)??-1;
  console.debug("Added drone entity:", newEntity);
  return newEntity as Entity;
}


export function addBuildingEntity(position?:Vector3): Entity {
  const newEntity = {
    id: -1,
    isBuilding:true,
    position: position ?? new THREE.Vector3().set(0, 0, 0),
    loadRadius: 5,
    MessageLog: [],
  };
  world.add(newEntity);
  newEntity.id=world.id(newEntity)??-1;
  console.debug("Added building entity:", newEntity);
  return newEntity as Entity;
}


