import { type Bucket, World } from 'miniplex';


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
  damage?: number;
  radius?: number;
  ttl?:number;
  colliderRadius?: number;
  wasHit?: boolean;
  wasHitProps?:{damage: number, sourceIds?: number[], time: number },
  dead?:boolean;
};


const ecs = new World<Entity>();
export const world=ecs;

export default ecs;

type ecsType = World<Entity>;
type worldType= ecsType;
export type { ecsType, worldType };

export type { Entity };
export { World };

export function createEntity(entity:Entity):void{
  world.add(entity);
  const newid = world.id(entity);
  if (entity.id===undefined){
    world.addComponent(entity,'id',newid);
  } else {
    entity.id=newid;
  }
}

export function create(entity:Entity):void{
  createEntity(entity);
}

world.onEntityAdded.subscribe((entity) => {
  console.log("A new entity has been spawned:", entity)
});

world.onEntityRemoved.subscribe((entity) => {
  console.log("An entity has been removed:", entity)
});

export function removeEntity(entity:Entity):void{
  world.remove(entity);
}


export function createAsteroid({ position, velocity, health }: { position: Vec3; velocity: Vec3; health: number; }) {
  const asteroid: Entity = {
    position,
    velocity,
    health,
    key:'asteroid',
    colliderRadius:1,
  };

  return asteroid;
}


export const TURRET_DEFAULT_RANGE=20;

export function createTurret({ position, cooldown }: { position: Vec3; cooldown: number; }):Entity {
  const turret: Entity = {
    position,
    cooldown,
    fireRate: cooldown,
    range:TURRET_DEFAULT_RANGE,
    damage:10,
    key:'turret'
  };

  return turret;
}

export const MAX_BEAM_DISTANCE=100;

export function createBeam(position:Vec3, velocity:Vec3):Entity {
  const beam: Entity = {
    position,
    velocity,
    damage:10,
    radius:0.5,
    colliderRadius:0.5,
    ttl:MAX_BEAM_DISTANCE,
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
  movingEntities: world.with('position','velocity','id'),
  movingAsteroids: world.with('key','position','velocity','id').where(({key})=>key==='asteroid'),
  movingBeams: world.with('key','position','velocity','id').where(({key})=>key==='beam'),
  turrets:world.with('key','position','cooldown').where(({key})=>key==='turret'),
  asteroids:world.with('key','position','velocity','health','id').where(({key})=>key==='asteroid'),
  platforms:world.with('key').where(({key})=>key==='platform'),
  beams:world.with('key','id').where(({key})=>key==='beam'),
  hitEntities:world.with('wasHit','wasHitProps').where(({wasHit})=>wasHit===true),
  deadEntities:world.with('dead').where(({dead})=>dead===true),
}
