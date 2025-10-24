import { type Bucket, World } from 'miniplex';


export type Vec3 = { x: number; y: number; z: number };


type Entity = {
  position: Vec3;
  velocity?: Vec3;
  health?: number;
  key?:'asteroid'|'turret'|'beam'|'platform';
  id?:number;
  cooldown?:number;
  targetId?: number;
};


const ecs = new World<Entity>();

export default ecs;



export type { Entity };
export { World };


export function createAsteroid(position:Vec3,velocity:Vec3, health:number) {
  const asteroid: Entity = {
    position,
    velocity,
    health,
    key:'asteroid'};

    ecs.add(asteroid)
    ecs.addComponent(asteroid, id, ecs.id(asteroid));

  return asteroid;
}

export function createTurret(position:Vec3, cooldown:number):Entity {
  const turret: Entity = {
    position,
    cooldown,
    key:'turret'};

    ecs.add(turret)
    ecs.addComponent(turret, id, ecs.id(turret));

  return turret;
}
