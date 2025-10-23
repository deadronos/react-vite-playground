import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import useGameStore, { ECS, asteroidsQuery, turretsQuery, projectilesQuery } from '../store/gameStore'
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

function createDetailedAsteroidGeometry(radius: number, seed: number): THREE.BufferGeometry {
  const geometry = new THREE.IcosahedronGeometry(radius, 5)
  const positions = geometry.attributes.position.array as Float32Array

  const rng = () => {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }

  // Multi-scale noise for realistic asteroid detail
  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i]
    const y = positions[i + 1]
    const z = positions[i + 2]
    const len = Math.sqrt(x * x + y * y + z * z)

    // Large scale deformation (main shape)
    let noise = 0
    noise += rng() * 0.6 - 0.3 // Large craters
    noise += (rng() * 0.3 - 0.15) * 0.5 // Medium details
    noise += (rng() * 0.2 - 0.1) * 0.25 // Small surface texture

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
        metalness={0.4}
        roughness={0.85}
        emissive={'#0a0a0a'}
        map={null}
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
            geometry = createDetailedAsteroidGeometry(a.radius ?? 0.4, seed)
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
        {(p: any) => (
          <group key={ECS.world.id(p)} position={[p.position.x, p.position.y, p.position.z]}>
            <mesh>
              <octahedronGeometry args={[0.15, 2]} />
              <meshStandardMaterial emissive={'#ffeb3b'} color={'#ffeb3b'} emissiveIntensity={1} />
            </mesh>
            <mesh scale={[2, 2, 2]}>
              <octahedronGeometry args={[0.15, 2]} />
              <meshStandardMaterial emissive={'#ff9800'} color={'#ff9800'} transparent opacity={0.3} />
            </mesh>
          </group>
        )}
      </ECS.Entities>
    </group>
  )
}
