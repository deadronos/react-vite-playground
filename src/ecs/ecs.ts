import {World} from 'miniplex';
import CreateReactAPI from 'miniplex-react';
import type { Object3D } from 'three';
import  * as THREE from 'three';

export type Vec3 =[number,number,number];

// Define the component types

export type Entity = {
  // "Tag" components (used for identification)
  platform?: true
  asteroid?: true
  turret?: true
  beam?: true
  targetable?: true // Marks asteroids as things turrets can shoot at

  // Unique numerical or undefined if not in world
  id?:number|undefined

  // Data components
  position?: THREE.Vector3
  previousPosition?: THREE.Vector3
  rotation?: THREE.Quaternion
  velocity?: THREE.Vector3

  // Specific component data
  health?: { current: number, max: number }
  dead?: boolean
  lifespan?: { remaining: number } // For beams

  turretConfig?: {
    fireRate: number    // Shots per second
    cooldown: number    // Time until next shot
    range: number         // Max targeting range
    target: Entity | null // The current entity being targeted
  }

  beamConfig?: {
    source: Entity  // The turret that fired the beam
    speed: number
    damage: number
    ttl: number   // time live for visual beam
    collisionRadius: number
  }

  targetableConfig?: {
    collisionRadius: number
    wasHit?: boolean
    wasHitby?: Entity[]
    accumulatedDamage?: number
  }

  // Reference to the 3D object in the scene
  object3D?: Object3D
}


const world= new World<Entity>();

const ECS= CreateReactAPI(world);

export default ECS;



export const queries = {


  // Things that move
  movingEntities: ECS.world.with("position", "velocity","previousPosition"),

  // Asteroid spawning (needs the platform to spawn around)
  platforms: ECS.world.with("platform", "position"),
  asteroids: ECS.world.with("asteroid", "position", "velocity", "health"),

  // Turret logic
  turrets: ECS.world.with("turret", "position", "rotation", "turretConfig"),
  targets: ECS.world.with("targetable", "position", "health", "targetableConfig"),

  // Beam logic
  beams: ECS.world.with("beam", "position", "lifespan"),
  beamColliders: ECS.world.with("beam", "position", "beamConfig"),

  // Targetable entities that can be hit
  hitEntities: ECS.world.with("targetable", "position", "targetableConfig").where(
    e => (e.targetableConfig?.wasHit) === true),

  // Dead entities
  deadEntities: ECS.world.with("dead"),

  // Entities with 3D objects to render
  renderables: ECS.world.with("object3D"),
};


export function createEntity(components: Partial<Entity> = {}): Entity {
  const entity = ECS.world.add({
    // Default components can be set here
    ...components,
  });
  entity.id=ECS.world.id(entity);
  return entity;
}


export function removeEntity(entity: Entity) {
  ECS.world.remove(entity);
}

export function getEntityById(id: number): Entity | undefined {
  return ECS.world.entity(id);
}

export function getAllEntities(): Entity[] {
  return ECS.world.entities;
}

export function createAsteroid(position:THREE.Vector3):Entity {

  // initial values, modify in spawning system

  return {
    asteroid: true,
    targetable: true,
    position: position,
    previousPosition: position.clone(),
    velocity: new THREE.Vector3(
      (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * 2
    ).normalize().multiplyScalar( (0.5 + Math.random() * 1.5) ),
    health: { current: 100, max: 100 },
    targetableConfig: {
      collisionRadius: 1 + Math.random() * 2
    }
  };
}



export function createTuret(position:THREE.Vector3):Entity {
  // initial values, modify in initialSpawn system

  return {
    turret: true,
    position: position,
    rotation: new THREE.Quaternion(),
    turretConfig: {
      fireRate: 1,    // Shots per second
      cooldown: 0,    // Time until next shot
      range: 35,         // Max targeting range
      target: null // The current entity being targeted
    }

  };
}


export function createPlatform(position:THREE.Vector3):Entity {
 // initial values, modify in initialSpawn system

  return {
    platform: true,
    position: position,
    rotation: new THREE.Quaternion()
  };
}
