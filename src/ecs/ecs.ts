import {World} from 'miniplex';
import CreateReactAPI from 'miniplex-react';
import { render } from 'sass-embedded';
import type { Object3D } from 'three';
import type * as THREE from 'three';

export type Vec3 =[number,number,number];

// Define the component types
export type Entity = {
  // "Tag" components (used for identification)
  platform?: true
  asteroid?: true
  turret?: true
  beam?: true
  targetable?: true // Marks asteroids as things turrets can shoot at

  // Data components
  position?: THREE.Vector3
  previousPosition?: THREE.Vector3
  rotation?: THREE.Euler
  velocity?: THREE.Vector3

  // Specific component data
  health?: { current: number, max: number }
  dead?: true
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
    collisionRadius: number
  }

  targetableConfig?: {
    collisionRadius: number
    wasHit?: boolean
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
  hitEntities: ECS.world.with("targetable", "position", "targetableConfig"),
  // Dead entities
  deadEntities: ECS.world.with("dead"),

  // Entities with 3D objects to render
  renderables: ECS.world.with("object3D"),
};
