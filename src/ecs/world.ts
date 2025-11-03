import {World as MiniplexWorld, } from 'miniplex';
import type ECS from 'miniplex-react';
import { createReactAPI } from 'miniplex-react';
import type {Entity} from './components';





/**
 *
 *  Miniplex world adapter for React
 *
 *  - provide create/get/remove/query helpers
 *  - provide subscribe/notify mechanism so React components can re-render
 *    when the world changes, (use wrappers for mutations)
 *
 *
 */



console.debug("Initializing Miniplex ECS World");

const world=new MiniplexWorld<Entity>();

export type ECSWorldType = typeof world;

const ECSWorld=createReactAPI(world);

export const useECSWorld=ECSWorld;


let nextLocalId = 1;
const listeners = new Set<()=>void>();

function notify() {
  for (const listener of listeners) {
    listener();
  }
}

/** createEntity: use miniplex if present; return entity object
 * will contain an id property (local unique id)
*/
export function createEntity(components:Partial<Entity>={}){
  const id=nextLocalId++;
  const entity = {id, ...components};

  // try miniplex API
  try {
    const created=world.add(entity);
    created.id=world.id(created); // ensure id is synced
    notify();
    console.debug("Created entity", created);
    return created as Entity;
  } catch (e) {
    console.warn("Miniplex createEntity failed", e);
  }
}


export function updateEntity(id:number, patch:Partial<Entity>){
  const entity=getEntityById(id);
  if (!entity) return null;
  world.update(entity,patch);
  console.debug("Updated entity", id, patch);
  notify();
  return entity;
}

export function getEntityById(id:number){
  try {
    const entity=world.entity(id)??null;
    console.debug("Fetched entity by id", id, entity);
    return entity??null;
  } catch (e) {
    console.warn("Miniplex getEntityById failed", e);
    return null;
  }
}

export function removeEntityById(id:number){
  try {
    if (typeof (world).removeEntityById === 'function') {
      const entity=getEntityById(id);
      if (entity) world.remove(entity)
      console.debug("Removed entity by id", id);
      notify();
      return;
    }
  } catch (e) {
    console.warn("Miniplex removeEntityById failed", e);
  }
}
