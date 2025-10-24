import { queries } from "@/ecs/ecs"
import { useFrame } from "@react-three/fiber";
import React, { useRef } from "react";
import { type Mesh } from "three";






export default function Turrets(): React.ReactElement {
  const ref = useRef<Mesh[]>([]);

  useFrame((state, delta) => {
    // Update turret meshes based on ECS turret entities
    const turretEntities = queries.turrets;

    const turretMeshes = ref.current;

    for ( const turretEntity of turretEntities ) {

    }
  });





  return (
    <>
    {/* Turret components can be added here if needed */}
    </>
  )
}

