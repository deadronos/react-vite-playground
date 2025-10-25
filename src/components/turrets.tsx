import React, { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group, Mesh } from "three";
import { queries, world } from "@/ecs/ecs";
import type { Entity } from "@/ecs/ecs";
import { sub } from "three/tsl";

/** Turrets component
 * - Renders turret entities from ECS world queries.turrets
 * - Updates turret meshes based on ECS turret in useFrame
 * Notes:
 *  - This is a basic implementation and can be extended with more features
 *  - Extend: targetfacing, firing effects, cooldown visuals, etc.
 */


export default function Turrets(): React.ReactElement {
  const groupRef = useRef<Group|null>(null);

  // map entity IDs to mesh refs
  const turretMeshRefs = useRef<Map<number, Mesh>>(new Map());

  // Local state to trigger re-renders when turrets change
  const [, setVersion] = useState(0);

  useEffect(() => {
    // Subscribe to ECS world changes to update turrets
    const onAdded=(entity: Entity) => {
      try {
        if (queries.turrets.has(entity)) {
          // Trigger re-render to add new turret
          setVersion((v) => v + 1);
        }
      } catch (error) {
        console.error("Error in onAdded turret:", error);
      }
    };

    const onRemoved=(entity: Entity) => {
      try {
        if (queries.turrets.has(entity)) {
          // Trigger re-render to remove turret
          setVersion((v) => v + 1);
          // Also remove from mesh refs
          turretMeshRefs.current.delete(entity.id);
        }
      } catch (error) {
        console.error("Error in onRemoved turret:", error);
      }
    };
    const subscribeAdded = world.events.entityAdded.subscribe(onAdded);
    const subscribeRemoved = world.events.entityRemoved.subscribe(onRemoved);

    return () => {
      // Cleanup subscriptions on unmount
      try { subscribeAdded.unsubscribe(); } catch (error) {
        console.error("Error unsubscribing added turret:", error);
      }
      try { subscribeRemoved.unsubscribe(); } catch (error) {
        console.error("Error unsubscribing removed turret:", error);
      }
    }

  }, []);

  // Updates positions/rotations of turret meshes each frame
  useFrame((state, delta) => {
    // Iterate over current turrets in ECS

    for (const turret of queries.turrets) {{
      const id=turret.id;
      if (id===undefined) continue;
      const mesh=turretMeshRefs.current.get(id);
      if (!mesh) continue;
      //Update mesh position/rotation from turret component
      if (turret.position) {
        mesh.position.set(turret.position.x, turret.position.y, turret.position.z);
      }

      // Optional rotate towards target if exists
      if (turret.targetId==="number" && turret.targetId!==undefined) {
        const target=queries.asteroids.find((a:Entity)=>a.id===turret.targetId);
        if (target?.position) {
          const dx=target.position.x - turret.position.x;
          const dz =target.position.z - turret.position.z;
          const yaw=Math.atan2(dx, dz);
          mesh.rotation.set(0, yaw, 0);

        }
      }
    }


    }
  });





  return (
    <group ref={groupRef}>
      {queries.turrets.map((turret) => {
        const id=turret.id;
        if (id===undefined) return null;
        return (
          <mesh
            key={id}
            position={[
              turret.position.x ?? 0,
              turret.position.y ?? 0,
              turret.position.z ?? 0,
            ]}
            ref={(mesh) => {
              if (mesh) {
                turretMeshRefs.current.set(id as number, mesh);
              } else {
                turretMeshRefs.current.delete(id as number);
              }
            }}
            castShadow
            receiveShadow
          >
            {/* Turret body simple cylinder */}
            <cylinderGeometry args={[0.5, 0.5, 1, 16]} />
            <meshStandardMaterial color="gray" metalness={0.6} roughness={0.4} />
            {/* Turret barrel */}
            <mesh position={[0, 0.25, 0.75]}>
              <cylinderGeometry args={[0.1, 0.1, 1, 12]} />
              <meshStandardMaterial color="darkgray" metalness={0.7} roughness={0.3} />
            </mesh>
          </mesh>
        );
      })}
    </group>
  );
}

