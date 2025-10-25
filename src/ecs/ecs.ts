import {World} from 'miniplex';
import CreateReactAPI from 'miniplex-react';
import type { Object3D } from 'three';
import type * as THREE from 'three';

export type Vec3 =[number,number,number];

// Define the component types
type Entity = {
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

export const ECS= CreateReactAPI(world);

