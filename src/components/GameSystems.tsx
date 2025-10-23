import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import useGameStore, { ECS, asteroidsQuery, turretsQuery, projectilesQuery, muzzleFlashesQuery } from '../store/gameStore'
import * as THREE from 'three'

function colorByBiome(b: string) {
  switch (b) {
    case 'ice':
      return '#aee7ff'
    case 'lava':
      return '#ff6a3d'
    case 'forest':
      return '#66cc66'
    default:
      return '#888888'
  }
}

function createSpaceyAsteroidGeometry(radius: number, seed: number): THREE.BufferGeometry {
  // Start with a tetrahedron and subdivide heavily for extreme detail
  const geometry = new THREE.TetrahedronGeometry(radius, 4)
  const positions = geometry.attributes.position.array as Float32Array

  const seededRandom = (s: number) => {
    s = Math.sin(s) * 10000
    return s - Math.floor(s)
  }

  // Apply aggressive multi-scale noise for dramatic spiky appearance
  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i]
    const y = positions[i + 1]
    const z = positions[i + 2]
    const len = Math.sqrt(x * x + y * y + z * z)

    if (len === 0) continue

    const baseSeed = seed + i

    // Aggressive noise with extreme spikes
    let noise = 0

    // Primary chaos - large jutting spikes
    noise += (seededRandom(baseSeed * 1.1) * 2 - 1) * 0.8

    // Sharp ridges
    noise += (seededRandom(baseSeed * 2.3) * 2 - 1) * 0.5

    // Crevasses and sharp details
    noise += (seededRandom(baseSeed * 3.7) * 2 - 1) * 0.35

    // Micro-texturing for surface detail
    noise += (seededRandom(baseSeed * 5.2) * 2 - 1) * 0.2

    // Spike generation - create pointed protrusions
    const spikeStrength = Math.abs(seededRandom(baseSeed * 7.1)) > 0.7 ? 0.6 : 0
    noise += spikeStrength

    const scale = (1 + noise) * radius / len

    positions[i] = x * scale
    positions[i + 1] = y * scale
    positions[i + 2] = z * scale
  }

  geometry.computeVertexNormals()
  return geometry
}

interface AsteroidProps {
  a: any
  geometry: THREE.BufferGeometry
}

function AsteroidMesh({ a, geometry }: AsteroidProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.003
      meshRef.current.rotation.y += 0.005
      meshRef.current.rotation.z += 0.002
    }
  })

  return (
    <mesh
      ref={meshRef}
      key={ECS.world.id(a)}
      position={[a.position.x, a.position.y, a.position.z]}
      geometry={geometry}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial
        color={colorByBiome(a.biome)}
        metalness={0.65}
        roughness={0.5}
        emissive={colorByBiome(a.biome)}
        emissiveIntensity={0.15}
        envMapIntensity={1.2}
      />
    </mesh>
  )
}

export default function GameSystems() {
  const step = useGameStore((s: any) => s.step)
  const geometryCacheRef = useRef(new Map<string, THREE.BufferGeometry>())

  useFrame((_, delta) => {
    step(delta)
  })

  // spawn a couple of turrets and periodically spawn asteroids
  useEffect(() => {
    const spawn = useGameStore.getState()
    // place two turrets on either side of the ground circle
    spawn.spawnTurret({ x: -2, y: 0.1, z: 0 }, { projectileSpeed: 9, damage: 4, cooldown: 0.6, range: 6 })
    spawn.spawnTurret({ x: 2, y: 0.1, z: 0 }, { projectileSpeed: 9, damage: 4, cooldown: 0.6, range: 6 })

    const id = setInterval(() => {
      spawn.spawnAsteroid()
    }, 1200)

    return () => clearInterval(id)
  }, [])

  // Use the miniplex-react component API to render entities
  return (
    <group>
      <ECS.Entities in={asteroidsQuery}>
        {(a: any) => {
          const entityId = ECS.world.id(a)?.toString() ?? ''
          const cache = geometryCacheRef.current
          let geometry = cache.get(entityId)
          if (!geometry && entityId) {
            const seed = parseInt(entityId, 10) || 0
            geometry = createSpaceyAsteroidGeometry(a.radius ?? 0.4, seed)
            cache.set(entityId, geometry)
          }
          return geometry ? <AsteroidMesh a={a} geometry={geometry} /> : null
        }}
      </ECS.Entities>

      <ECS.Entities in={turretsQuery}>
        {(t: any) => {
          const asteroids: any[] = Array.from(asteroidsQuery)
          const yaw = (() => {
            let best: any = null
            let bestD = Infinity
            for (const a of asteroids) {
              const dx = (a).position.x - t.position.x
              const dz = (a).position.z - t.position.z
              const d2 = dx * dx + dz * dz
              if (d2 < bestD) {
                bestD = d2
                best = a
              }
            }
            if (!best) return 0
            return Math.atan2((best).position.x - t.position.x, (best).position.z - t.position.z)
          })()

          return (
            <group key={ECS.world.id(t)} position={[t.position.x, t.position.y, t.position.z]} rotation={[0, yaw, 0]}>
              <mesh>
                <cylinderGeometry args={[0.18, 0.18, 0.18, 12]} />
                <meshStandardMaterial color="#333" />
              </mesh>
              <mesh position={[0, 0.12, 0.18]} rotation={[0, 0, 0]}>
                <boxGeometry args={[0.1, 0.06, 0.5]} />
                <meshStandardMaterial color="#222" />
              </mesh>
            </group>
          )
        }}
      </ECS.Entities>

      <ECS.Entities in={projectilesQuery}>
        {(p: any) => {
          const progress = 1 - p.lifetime / 5
          const trailSegments = 4
          const trails = []
          for (let i = 0; i < trailSegments; i++) {
            const t = (i / trailSegments) * progress
            trails.push(
              <mesh key={i} position={[-p.velocity.x * 0.1 * t, -p.velocity.y * 0.1 * t, -p.velocity.z * 0.1 * t]}>
                <octahedronGeometry args={[0.08, 1]} />
                <meshStandardMaterial
                  emissive={'#ffeb3b'}
                  color={'#ffeb3b'}
                  emissiveIntensity={0.4 * (1 - t)}
                  transparent
                  opacity={0.6 * (1 - t)}
                />
              </mesh>,
            )
          }
          return (
            <group key={ECS.world.id(p)} position={[p.position.x, p.position.y, p.position.z]}>
              {trails}
              <mesh>
                <octahedronGeometry args={[0.2, 2]} />
                <meshStandardMaterial emissive={'#ffeb3b'} color={'#ffeb3b'} emissiveIntensity={1} />
              </mesh>
              <mesh scale={[2.5, 2.5, 2.5]}>
                <octahedronGeometry args={[0.2, 2]} />
                <meshStandardMaterial emissive={'#ff9800'} color={'#ff9800'} transparent opacity={0.25} />
              </mesh>
            </group>
          )
        }}
      </ECS.Entities>

      <ECS.Entities in={muzzleFlashesQuery}>
        {(m: any) => {
          const progress = m.lifetime / 0.15
          const scale = 1.5 - progress * 1.5
          return (
            <group key={ECS.world.id(m)} position={[m.position.x, m.position.y, m.position.z]}>
              <mesh scale={scale}>
                <sphereGeometry args={[0.3, 8, 8]} />
                <meshStandardMaterial
                  emissive={'#ffeb3b'}
                  color={'#ffeb3b'}
                  emissiveIntensity={2}
                  transparent
                  opacity={progress}
                />
              </mesh>
              <mesh scale={scale * 0.6}>
                <sphereGeometry args={[0.3, 8, 8]} />
                <meshStandardMaterial
                  emissive={'#ff6a3d'}
                  color={'#ff6a3d'}
                  emissiveIntensity={2}
                  transparent
                  opacity={progress * 0.8}
                />
              </mesh>
            </group>
          )
        }}
      </ECS.Entities>
    </group>
  )
}
