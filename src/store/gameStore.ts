import { create } from 'zustand'
import { World } from 'miniplex'
import createReactAPI from 'miniplex-react'

type Vec3 = { x: number; y: number; z: number }
type Biome = 'rock' | 'ice' | 'lava' | 'forest'

type AsteroidEntity = {
  position: Vec3
  velocity: Vec3
  health: { current: number; max: number }
  biome: Biome
  type: 'asteroid'
  radius?: number
}

type TurretEntity = {
  position: Vec3
  velocity: Vec3
  cannon: {
    projectileSpeed: number
    damage: number
    cooldown: number
    range: number
  }
  cooldown?: number
  type: 'turret'
}

type ProjectileEntity = {
  position: Vec3
  velocity: Vec3
  damage: number
  lifetime: number
  type: 'projectile'
}

type MuzzleFlashEntity = {
  position: Vec3
  direction: Vec3
  lifetime: number
  type: 'muzzleFlash'
}

export type GameEntity = AsteroidEntity | TurretEntity | ProjectileEntity | MuzzleFlashEntity | Record<string, any>

type GameState = {
  world: World<GameEntity>
  tick: number
  spawnAsteroid: (opts?: Partial<AsteroidEntity>) => GameEntity
  spawnTurret: (pos?: Vec3, cannon?: Partial<TurretEntity['cannon']>) => GameEntity
  spawnProjectile: (pos: Vec3, velocity: Vec3, damage: number) => GameEntity
  step: (dt: number) => void
}

// Create the Miniplex world and React bindings once at module load time so queries
// can be reused and React hooks provided by miniplex-react work correctly.
const rawWorld = new World<GameEntity>()
export const ECS = createReactAPI(rawWorld)
const world = ECS.world

// Reusable queries (created once and exported via the module)
export const asteroidsQuery = world.where((e) => e.type === 'asteroid') as any
export const turretsQuery = world.where((e) => e.type === 'turret') as any
export const projectilesQuery = world.where((e) => e.type === 'projectile') as any
export const muzzleFlashesQuery = world.where((e) => e.type === 'muzzleFlash') as any

export const useGameStore = create<GameState>((set) => {

  function spawnAsteroid(opts: Partial<AsteroidEntity> = {}) {
    const biomeList: Biome[] = ['rock', 'ice', 'lava', 'forest']
    const position: Vec3 = opts.position || { x: (Math.random() - 0.5) * 8, y: 3 + Math.random() * 2, z: (Math.random() - 0.5) * 8 }
    const velocity: Vec3 = opts.velocity || { x: (Math.random() - 0.5) * 0.2, y: -(0.6 + Math.random() * 0.6), z: (Math.random() - 0.5) * 0.2 }
    const maxHealth = (opts.health?.max ?? 0) || 6 + Math.floor(Math.random() * 12)
    const healthVal = opts.health || { current: 6 + Math.floor(Math.random() * 12), max: maxHealth }
    const biome: Biome = opts.biome || biomeList[Math.floor(Math.random() * biomeList.length)]
    const radius = opts.radius || Math.max(0.3, (healthVal.current / healthVal.max) * 0.8 + 0.2)

    const entity = world.add({ position, velocity, health: healthVal, biome, radius, type: 'asteroid' })
    set((s) => ({ tick: s.tick + 1 }))
    return entity
  }

  function spawnTurret(pos: Vec3 = { x: 0, y: 0, z: 0 }, cannon: Partial<TurretEntity['cannon']> = {}) {
    const defaultCannon = { projectileSpeed: 8, damage: 4, cooldown: 0.6, range: 6 }
    const conf = { ...defaultCannon, ...cannon }
    const entity = world.add({ position: pos, velocity: { x: 0, y: 0, z: 0 }, cannon: conf, cooldown: 0, type: 'turret' })
    set((s) => ({ tick: s.tick + 1 }))
    return entity
  }

  function spawnProjectile(pos: Vec3, velocity: Vec3, damage: number) {
    const entity = world.add({ position: { ...pos }, velocity: { ...velocity }, damage, lifetime: 5, type: 'projectile' })
    set((s) => ({ tick: s.tick + 1 }))
    return entity
  }

  function spawnMuzzleFlash(pos: Vec3, direction: Vec3) {
    const entity = world.add({ position: { ...pos }, direction: { ...direction }, lifetime: 0.15, type: 'muzzleFlash' })
    set((s) => ({ tick: s.tick + 1 }))
    return entity
  }

  function step(dt: number) {
    // Movement for turrets (recoil)
    for (const t of turretsQuery) {
      const entity = t as TurretEntity
      entity.position.x += entity.velocity.x * dt
      entity.position.y += entity.velocity.y * dt
      entity.position.z += entity.velocity.z * dt

      const friction = 0.85
      entity.velocity.x *= friction
      entity.velocity.y *= friction
      entity.velocity.z *= friction
    }

    // Movement for asteroids
    for (const a of asteroidsQuery) {
      const entity = a as AsteroidEntity
      entity.position.x += entity.velocity.x * dt
      entity.position.y += entity.velocity.y * dt
      entity.position.z += entity.velocity.z * dt

      // If asteroid falls past the ground circle, remove it
      if (entity.position.y < -3) {
        world.remove(entity)
      }
    }

    // Movement and collision for projectiles
    for (const p of projectilesQuery) {
      const entity = p as ProjectileEntity
      entity.position.x += entity.velocity.x * dt
      entity.position.y += entity.velocity.y * dt
      entity.position.z += entity.velocity.z * dt
      entity.lifetime -= dt

      if (entity.lifetime <= 0) {
        world.remove(entity)
        continue
      }

      // Simple collision check against asteroids
      for (const a of asteroidsQuery) {
        const asteroid = a as AsteroidEntity
        const dx = asteroid.position.x - entity.position.x
        const dy = asteroid.position.y - entity.position.y
        const dz = asteroid.position.z - entity.position.z
        const dist2 = dx * dx + dy * dy + dz * dz
        const radius = asteroid.radius || 0.5
        if (dist2 <= radius * radius) {
          // hit
          if (typeof asteroid.health === 'object') {
            asteroid.health.current -= entity.damage
          }
          try {
            world.remove(entity)
          } catch (e) {
            // ignore if already removed
          }
          if (typeof asteroid.health === 'object' && asteroid.health.current <= 0) {
            world.remove(asteroid)
          }
          break
        }
      }
    }

    // Decay muzzle flashes
    for (const m of muzzleFlashesQuery) {
      const entity = m as MuzzleFlashEntity
      entity.lifetime -= dt
      if (entity.lifetime <= 0) {
        world.remove(entity)
      }
    }

    // Turret targeting and firing
    for (const t of turretsQuery) {
      const turret = t as TurretEntity
      turret.cooldown = Math.max(0, (turret.cooldown || 0) - dt)

      if ((turret.cooldown || 0) > 0) continue

      let target: AsteroidEntity | null = null
      let bestDist = Infinity

      for (const a of asteroidsQuery) {
        const asteroid = a as AsteroidEntity
        const dx = asteroid.position.x - turret.position.x
        const dy = asteroid.position.y - turret.position.y
        const dz = asteroid.position.z - turret.position.z
        const d2 = dx * dx + dy * dy + dz * dz
        if (d2 <= turret.cannon.range * turret.cannon.range && d2 < bestDist) {
          bestDist = d2
          target = asteroid
        }
      }

      if (target) {
        const dir = {
          x: target.position.x - turret.position.x,
          y: target.position.y - turret.position.y,
          z: target.position.z - turret.position.z,
        }
        const len = Math.sqrt(dir.x * dir.x + dir.y * dir.y + dir.z * dir.z) || 1
        const vel = { x: (dir.x / len) * turret.cannon.projectileSpeed, y: (dir.y / len) * turret.cannon.projectileSpeed, z: (dir.z / len) * turret.cannon.projectileSpeed }

        world.add({ position: { ...turret.position }, velocity: vel, damage: turret.cannon.damage, lifetime: 5, type: 'projectile' })
        world.add({ position: { ...turret.position }, direction: dir, lifetime: 0.15, type: 'muzzleFlash' })

        // Apply recoil in opposite direction
        const recoilStrength = 0.8
        turret.velocity.x -= (dir.x / len) * recoilStrength
        turret.velocity.y -= (dir.y / len) * recoilStrength
        turret.velocity.z -= (dir.z / len) * recoilStrength

        turret.cooldown = turret.cannon.cooldown
      }
    }

    // Basic asteroid health system
    for (const a of asteroidsQuery) {
      const asteroid = a as AsteroidEntity
      if (typeof asteroid.health === 'object' && asteroid.health.current <= 0) {
        world.remove(asteroid)
      }
    }

    set((s) => ({ tick: s.tick + 1 }))
  }

  return {
    world,
    tick: 0,
    spawnAsteroid,
    spawnTurret,
    spawnProjectile,
    spawnMuzzleFlash: spawnMuzzleFlash,
    step,
  }
})

export default useGameStore
