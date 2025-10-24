import type * as Components from './components';
import type { MyWorld } from './world';


// Vector types
export type Vec2 = { x: number; y: number };
export type Vec3 = { x: number; y: number; z: number };

// Entity type (optional, for type safety)

export type Entity = Partial<
  Components.Position &
  Components.Velocity &
  Components.Health &
  Components.Asteroid &
  Components.Turret
>;

// Game state enum
export enum GameState {
  Playing = 'playing',
  Paused = 'paused',
  GameOver = 'gameover'
}

// Utility types
export type EntityId = string | number;
export type Milliseconds = number;

// System function type

export type System = (world: typeof MyWorld) => void;
