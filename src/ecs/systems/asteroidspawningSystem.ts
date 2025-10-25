import ECS, { queries } from "../ecs";
import type { Entity } from "../ecs";

let spawnTimer = 0;
const SPAWN_INTERVAL = 2; // seconds
const SPAWN_MIN_RADIUS = 20;
const SPAWN_MAX_RADIUS = 50;

const SPAWN_MAX_ASTEROIDS = 20;

export function AsteroidSpawningSystem(delta: number) {
  // Update spawn timer
  spawnTimer += delta;
  // Return if not enough time has passed
  if (spawnTimer < SPAWN_INTERVAL) return;
  // Reset timer
  spawnTimer = 0;

  // Check how many asteroids currently exist
  const asteroids: Entity[] = queries.asteroids.entities as Entity[];
  if (asteroids.length >= SPAWN_MAX_ASTEROIDS) return;

  // Get the platform to spawn around
  const platform:Entity = queries.platforms.entities[0] as Entity;
  if (platform===undefined) return; // No platform to spawn around

  // 1. Calculate a random spawn position around the platform
  const angle= Math.random() * Math.PI * 2;
  const distance= SPAWN_MIN_RADIUS + Math.random() * (SPAWN_MAX_RADIUS - SPAWN_MIN_RADIUS);
  const spawnX:number= (platform.position?.x?0 + Math.cos(angle) * distance);
  const spawnZ:number= (platform.position?.y?0 + Math.sin(angle) * distance)as number;
  const spawnY:number= (platform.position?.z?0 + (Math.random()-0.5)* 10)as number; // Slight vertical variation



}



