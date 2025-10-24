import { type Entity, MAX_BEAM_DISTANCE, create, createBeam, queries, removeEntity, world } from "../ecs";
import { type Vec3 } from "../ecs";

/**
 * Turret System
 * - Picks nearest asteroid as target
 * - Fires beams at target if cooldown allows
 * - entity.fireRate (derived from initial cooldown
 *
 *  Assumptions:
 *  - createTurret populates fireRate from cooldown
 *  - entity.cooldown is time remaining until next shot
 *  - Use world.createBeam to spawn beams
 *
 */

const BEAM_SPEED=20; // units per second
const AIM_OFFSET_Y=0.5; // aim slightly above center

function sqr(v:number){
  return v*v;
}

function distanceSquared(a:Vec3,b:Vec3):number{
  const dx=a.x-b.x;
  const dy=a.y-b.y;
  const dz=a.z-b.z;
  return sqr(dx)+sqr(dy)+sqr(dz);
}

function normalize(v:Vec3):Vec3{
  const len=Math.sqrt(sqr(v.x)+sqr(v.y)+sqr(v.z));
  if (len===0) return {x:0,y:0,z:0};
  return {x:v.x/len,y:v.y/len,z:v.z/len};
}

export function turretSystem(delta: number) {
  if (!world || !delta || delta <= 0) return;

  // Snapshot asteroids per tick for selection
  const asteroids= Array.from(queries.asteroids)||[] as Entity[];

  // extract turrets
  const turrets:Entity[]=Array.from(queries.turrets)||[] as Entity[];

  for (const turret of turrets) {
    if (!turret.position||turret.cooldown===undefined||turret.fireRate===undefined) continue;

    const fireRate=(turret).fireRate;
    const range=(turret).range!;
    const rangeSq=range*range;

    // reduce cooldown
    (turret).cooldown=Math.max(0,(turret.cooldown??0)-delta);

    // if still cooling down, skip
    if ((turret.cooldown??0)>0) continue;

    // find nearest target within range
    let bestTarget:Entity|null=null;
    let bestDistSq=Number.MAX_VALUE;

    for (const asteroid of asteroids) {
      if (!asteroid.position) continue;

      // if health is zero or below, skip
      if (typeof asteroid.health==='number' && asteroid.health<=0) continue;

      const d2 = distanceSquared(turret.position, asteroid.position);
      if (d2<bestDistSq && d2 <= rangeSq){
        bestDistSq=d2;
        bestTarget=asteroid;
      }

      if(!bestTarget){
        continue; // no target found
      }

      // Aim and fire: create beam towards target
      const dir = {
        x: bestTarget.position.x - turret.position.x,
        y: (bestTarget.position.y+Math.random()*AIM_OFFSET_Y) - turret.position.y,
        z: bestTarget.position.z - turret.position.z,
      }

      const normDir = normalize(dir);

      const beamVelocity:Vec3 = {
        x: normDir.x * BEAM_SPEED,
        y: normDir.y * BEAM_SPEED,
        z: normDir.z * BEAM_SPEED,
      };

      const beamPosition:Vec3 = {
        x: turret.position.x,
        y: turret.position.y,
        z: turret.position.z,
      };

      // createBeam from ../ecs spawning uses world.create
      try {
          create(createBeam(beamPosition, beamVelocity));
      } catch (e) {
        console.warn("turretSystem: failed to create beam entity", e);
      }
    }

    // Reset turret cooldown
    (turret).cooldown=fireRate;

    try {
      turret.targetId=bestTarget?.id??undefined;
    }
    catch (e) {
      console.warn("turretSystem: failed to set turret targetId", e);
    }




    }
  }

  export function movementBeamSystem(delta: number) {
    if (delta||delta<=0) return;
    // Iterate over entities with position and velocity
    for (const entity of queries.movingBeams) {
      // Check if entity has position and velocity
      if (!entity.position || !entity.velocity) continue;

      // Check and store previous position
      if (entity.previousPosition===undefined){
        world.addComponent(entity,'previousPosition',{...entity.position});
      }else{
        entity.previousPosition={...entity.position};
      }

      // Update position based on velocity
      entity.position.x += (entity.velocity.x ?? 0) * delta;
      entity.position.y += (entity.velocity.y ?? 0) * delta;
      entity.position.z += (entity.velocity.z ?? 0) * delta;

      // Optionally, add logic to remove beams after certain distance or time
      const distance = Math.sqrt(
        sqr(entity.position.x) +
        sqr(entity.position.y) +
        sqr(entity.position.z)
      );
      if (distance > MAX_BEAM_DISTANCE) {
        removeEntity(entity);
      }
    }
  }



