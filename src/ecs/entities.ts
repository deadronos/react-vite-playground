import type {Position,Velocity, Health, Asteroid, Turret} from './components.ts';
import type { Entity } from './types.ts';



function createAsteroid(position: Position, velocity: Velocity, health: Health):Entity {
  return {
    position,
    velocity,
    health,
    asteroid: true
  };
}

function createTurret(position: Position, health: Health, cooldown: number):Entity {
  return {
    position,
    health,
    turret: true,
    cooldown
  };
}

export { createAsteroid, createTurret };
