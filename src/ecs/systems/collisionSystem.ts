import { world, queries, removeEntity } from "../ecs";
import type { Entity, Vec3 } from "../ecs";

/* Collision system:
* - Detects collisions between beams and asteroids
* - Marks asteroids as hit
* - Removes beams upon collision
* - Delta is in seconds
* - Simple sphere-sphere collision based on colliderRadius
* Notes:
* - More advanced collision detection can be implemented as needed
* - This is a basic implementation for demonstration purposes
*/

function dot(a: Vec3, b: Vec3) { return a.x*b.x + a.y*b.y + a.z*b.z; }
function sub(a: Vec3, b: Vec3) { return { x: a.x-b.x, y: a.y-b.y, z: a.z-b.z }; }

/** segment P0->P1 intersects sphere(center, radius)? handles zero-length segment */
function segmentIntersectsSphere(p0: Vec3, p1: Vec3, center: Vec3, radius: number): boolean {
  const d = sub(p1, p0);           // segment vector
  const f = sub(p0, center);       // vector from center to p0
  const a = dot(d, d);

  // Degenerate segment -> point test
  if (a === 0) {
    const distSq = dot(f, f);
    return distSq <= radius * radius;
  }

  const b = 2 * dot(f, d);
  const c = dot(f, f) - radius * radius;
  let discriminant = b*b - 4*a*c;
  if (discriminant < 0) return false;
  discriminant = Math.sqrt(discriminant);

  const t1 = (-b - discriminant) / (2*a);
  const t2 = (-b + discriminant) / (2*a);
  return (t1 >= 0 && t1 <= 1) || (t2 >= 0 && t2 <= 1);
}


export function collisionSystem(delta: number){
  // Guard: delta must be positive
  if (delta<=0) return;

  // Simple collision detection between beams and asteroids
  // Snapshot beams and asteroids
  const beams=queries.movingBeams;
  const asteroids=queries.asteroids;

  // Collection of beams to remove
  const beamsToRemove=new Set<Entity>()


  for (const beam of beams) {
    // Check if beam has position and colliderRadius
    if (!beam.position || !beam.colliderRadius) continue;

    // Check and store previous position
    const prevPos=beam.previousPosition??(()=>{
      const v=beam.velocity??{x:0,y:0,z:0};
      return {
        x: beam.position.x - v.x * delta,
        y: beam.position.y - v.y * delta,
        z: beam.position.z - v.z * delta,
      };
    })();

    const currentPos=beam.position;
    const beamRadius=beam.colliderRadius;
    const beamDamage=beam.damage??0;

    // Check collision against all asteroids
    for (const asteroid of asteroids) {
      // Check if asteroid has position and colliderRadius
      if (!asteroid.position || !asteroid.colliderRadius) continue;

      const asteroidRadius=asteroid.colliderRadius;
      const combinedRadius=asteroidRadius + beamRadius;

      // Perform segment-sphere intersection test
      const hit=segmentIntersectsSphere(
        prevPos,
        currentPos,
        asteroid.position,
        combinedRadius
      );

      if(!hit) continue;

        // Mark asteroid as hit
      if (!asteroid.wasHit) {
          // add wasHit component
          world.addComponent(asteroid,'wasHit',true);
      } else {
          asteroid.wasHit=true; // keep hit true
      }

      // check and update wasHitProps
      const now = (typeof performance !== 'undefined') ? performance.now() : Date.now();
      if (!asteroid.wasHitProps){
          world.addComponent(asteroid,'wasHitProps',{
            damage:beamDamage,
            sourceIds:[beam.id],
            time:now
          });
      } else {
          asteroid.wasHitProps.damage=(asteroid.wasHitProps.damage??0)+beamDamage;
          asteroid.wasHitProps.sourceIds?.push(beam.id);
          asteroid.wasHitProps.time=now;
      }

        // Remove beam
        beamsToRemove.add(beam);

        // Break out of loop if beam is destroyed
        break;
      }

    // Update beam's previousPosition if not removed
     if(!beamsToRemove.has(beam)) {
      // Update beam's previousPosition for next frame
      beam.previousPosition={ ...currentPos };
    }
  }

    // Remove all beams that hit asteroids
    if (beamsToRemove.size>0){
      for (const b of beamsToRemove){
        try {
          // Safely remove beam
          removeEntity(b);
        } catch (e) {
          console.warn("collisionSystem: failed to remove beam entity", e);
        }
      }
    }
}


