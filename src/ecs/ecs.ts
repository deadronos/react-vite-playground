import { type Bucket, World } from 'miniplex';
import { platform } from 'os';
import { modelWorldMatrix } from 'three/tsl';


export type Vec3 = { x: number; y: number; z: number };


type Entity = {
  position: Vec3;
  previousPosition?: Vec3;
  velocity?: Vec3;
  health?: number;
  key?:'asteroid'|'turret'|'beam'|'platform';
  id?:number;
  cooldown?:number;
  fireRate?:number;
  range?:number;
  targetId?: number;
  wasHit?: boolean;
};


const ecs = new World<Entity>();

export default ecs;

type ecsType = World<Entity>;
export type { ecsType };

export type { Entity };
export { World };


export function create(world:World<Entity>,entity:Entity){
  world.add(entity);
  const id = world.id(entity);
  world.addComponent(entity, entity.id,id);
}

export function createAsteroid(position:Vec3, velocity:Vec3, health:number) {
  const asteroid: Entity = {
    position,
    velocity,
    health,
    key:'asteroid'
  };

  return asteroid;
}

export function createTurret(position:Vec3, cooldown:number):Entity {
  const turret: Entity = {
    position,
    cooldown,
    fireRate: cooldown,
    range:20,
    key:'turret'
  };

  return turret;
}

export function createBeam(position:Vec3, velocity:Vec3):Entity {
  const beam: Entity = {
    position,
    velocity,
    key:'beam'
  };

  return beam;
}

export function createPlatform(position:Vec3):Entity {
  const platform: Entity = {
    position,
    key:'platform'
  };

  return platform;
}



export const queries = {
  movingEntities: ecs.with('position','velocity'),
  turrets:ecs.with('key','position','cooldown').filter(e=>e.key==='turret'),
  asteroids:ecs.with('key','position','velocity','health').filter(e=>e.key==='asteroid'),
  platforms:ecs.with('key','position').filter(e=>e.key==='platform'),
  beams:ecs.with('key','position','velocity').filter(e=>e.key==='beam'),
  hitEntities:ecs.with('wasHit'),
}
