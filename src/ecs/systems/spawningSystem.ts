import { type Entity, type World } from "../ecs";
import { createAsteroid } from "../ecs";
import { type Vec3 } from "../types";

// Config
const SPAWN_INTERVAL = 2; // seconds
const PLATFORM_RADIUS = 10;
const ASTEROID_SPEED = 2;
const ASTEROID_HEALTH = { health: 100 };

// Internal state
let timeSinceLastSpawn = 0;

// Utility function to generate a random position on a circle
function randomPositionOnCircle(radius:number, center:Vec3):Vec3{
  const angle = Math.random() * Math.PI * 2;
  return {
    x: center.x + radius * Math.cos(angle),
    y: center.y,
    z: center.z + radius * Math.sin(angle),
  };
}

// System function for Spawning Asteroids
export function spawningSystem(world: World<Entity>, delta: number) {
  timeSinceLastSpawn += delta;
  if (timeSinceLastSpawn >= SPAWN_INTERVAL) {
    timeSinceLastSpawn = 0;

    const center = { x: 0, y: -1, z: 0 }; // Assuming platform is at origin at y = -1
    const spawnHeight =6;
    const spawnCenter = { x: 0, y: center.y+spawnHeight, z: 0 };
    const spawnPosition:Vec3 = randomPositionOnCircle(PLATFORM_RADIUS, spawnCenter);

    // Velocity towards the center
    const dx = center.x - spawnPosition.x;
    const dy = center.y - spawnPosition.y
    const dz = center.z - spawnPosition.z;
    const length = Math.sqrt(dx * dx + dy * dy + dz * dz);
    const velocity = {
      x: (dx / length) * ASTEROID_SPEED,
      y: (dy / length) * ASTEROID_SPEED,
      z: (dz / length) * ASTEROID_SPEED,
    };

    world.create(createAsteroid(
      spawnPosition,
      velocity,
      ASTEROID_HEALTH.health
    ));

  }
}
