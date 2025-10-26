import { queries, createEntity, createAsteroid } from "../ecs";
import type { Entity } from "../ecs";
import * as THREE from "three";

let spawnTimer = 0;
const SPAWN_INTERVAL = 2; // seconds
const SPAWN_MIN_RADIUS = 20;
const SPAWN_MAX_RADIUS = 50;

const SPAWN_MAX_VELOCITY = 4;
const SPAWN_MIN_VELOCITY = 1;

const SPAWN_MAX_ASTEROIDS = 20;

export function AsteroidSpawningSystem(delta: number) {
  // console.log("AsteroidSpawningSystem running with delta:", delta);
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
  const spawnX:number= (platform.position?.x??0) + Math.cos(angle) * distance;
  const spawnZ:number= (platform.position?.z??0) + Math.sin(angle) * distance;
  const spawnY:number= (platform.position?.y??0) + (Math.random()-0.5)* 10; // Slight vertical variation
  const spawnPosition=new THREE.Vector3(spawnX, spawnY, spawnZ);

  // 2. Calculate velocity aiming vaguely toward the platform
  const toPlatform = new THREE.Vector3().subVectors(platform.position!, spawnPosition).normalize();

  const speed = SPAWN_MIN_VELOCITY + Math.random() * (SPAWN_MAX_VELOCITY - SPAWN_MIN_VELOCITY);

  const lateral = new THREE.Vector3(
    (Math.random() - 0.5) * 0.4,
    (Math.random() - 0.5) * 0.2,
    (Math.random() - 0.5) * 0.4
  );

  const velocity = toPlatform.multiplyScalar(speed).add(lateral);
  velocity.clampLength(SPAWN_MIN_VELOCITY, SPAWN_MAX_VELOCITY);

  // 3. Create a new asteroid entity
  const asteroid: Entity = createEntity(createAsteroid(spawnPosition));

  // Additional initialization can be done here if needed
  asteroid.asteroid=true;
  asteroid.targetable=true;
  asteroid.position=spawnPosition;
  asteroid.previousPosition=spawnPosition.clone();
  asteroid.velocity=velocity;
  asteroid.rotation=new THREE.Quaternion();
  asteroid.health={ current: 100, max: 100 };
  asteroid.dead=false;
  asteroid.targetableConfig={
    collisionRadius: 1 + Math.random() * 2,
    wasHit: false,
    wasHitby: [],
    accumulatedDamage: 0
  };







}



