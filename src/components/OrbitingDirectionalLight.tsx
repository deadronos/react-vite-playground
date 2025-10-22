import React, { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { type DirectionalLight, Object3D } from 'three';
import { DirectionalLightHelper } from 'three';
import { useHelper } from '@react-three/drei';

type OrbitingDirectionalLightProps = {
  speed?: number; // radians per second multiplier
  radius?: number; // orbit radius on XZ plane
  height?: number; // Y position of the light
  inclination?: number; // tilt of the orbit in radians (rotation around X axis)
  color?: string | number;
  intensity?: number;
  castShadow?: boolean;
  shadowMapSize?: number;
  target?: [number, number, number];
  helper?: boolean;
};

export default function OrbitingDirectionalLight({
  speed = 1,
  radius = 6,
  height = 3,
  inclination = 0,
  color = '#ffffff',
  intensity = 1,
  castShadow = true,
  shadowMapSize = 2048,
  target = [0, 0, 0],
  helper = false,
}: OrbitingDirectionalLightProps) {
  const lightRef = useRef<DirectionalLight | null>(null);
  // We'll create a dedicated Object3D to be the target of the directional light and add it to the scene
  const targetRef = useRef<Object3D>(new Object3D());
  const { scene } = useThree();

  // Optionally show a helper
  if (helper && lightRef.current) {
    // useHelper requires a ref that exists during render; wrap in try/catch in case of SSR/initial mount
    try {
      useHelper(lightRef as React.RefObject<DirectionalLight>, DirectionalLightHelper, 1, 'hotpink');
    } catch (e) {
      // ignore helper errors during initial render
    }
  }

  useEffect(() => {
    // Add target into the scene so the DirectionalLight can point at it
    const t = targetRef.current;
    t.position.set(target[0], target[1], target[2]);
    if (!scene.getObjectById(t.id)) scene.add(t);
    return () => {
      if (scene.getObjectById(t.id)) scene.remove(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once

  // Configure shadow camera extents based on orbit radius
  useEffect(() => {
    const light = lightRef.current;
    if (!light) return;
    light.castShadow = castShadow;
    const extent = Math.max(10, radius * 1.5);
    const sc = light.shadow;
    sc.mapSize.width = shadowMapSize;
    sc.mapSize.height = shadowMapSize;
    // @ts-ignore - shadow.camera is OrthographicCamera for DirectionalLight
    sc.camera.left = -extent;
    // @ts-ignore
    sc.camera.right = extent;
    // @ts-ignore
    sc.camera.top = extent;
    // @ts-ignore
    sc.camera.bottom = -extent;
    sc.camera.near = 0.5;
    sc.camera.far = Math.max(50, extent * 4);
    sc.bias = -0.0005;
    sc.radius = 1;
    // update projection matrix
    // @ts-ignore
    sc.camera.updateProjectionMatrix();
  }, [radius, shadowMapSize, castShadow]);

  // Animate the light around the XZ plane; we optionally tilt the orbit by 'inclination'
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed;
    const cos = Math.cos(t);
    const sin = Math.sin(t);
    const x = cos * radius;
    const z = sin * radius;
    const y = height;

    // rotate the position by inclination around the X axis
    // apply simple rotation: y' = y * cos(i) - z * sin(i); z' = y * sin(i) + z * cos(i)
    const ci = Math.cos(inclination);
    const si = Math.sin(inclination);
    const rotatedY = y * ci - z * si;
    const rotatedZ = y * si + z * ci;

    if (!lightRef.current) return;
    lightRef.current.position.set(x, rotatedY, rotatedZ);
    // update / ensure the light's target is at the requested target position
    targetRef.current.position.set(target[0], target[1], target[2]);
    // Inform three that the target has moved
    lightRef.current.target = targetRef.current;
    lightRef.current.target.updateMatrixWorld();
    // If shadows are enabled, ensure shadow camera is up to date
    if (lightRef.current.shadow && (lightRef.current.shadow as any).camera) {
      // @ts-ignore
      lightRef.current.shadow.camera.updateProjectionMatrix();
    }
  });

  return (
    <>
      <directionalLight
        ref={lightRef}
        color={color}
        intensity={intensity}
        castShadow={castShadow}
        // the shadow camera settings are applied in the effect above
        // some props can be passed as attributes too:
        shadow-mapSize-width={shadowMapSize}
        shadow-mapSize-height={shadowMapSize}
      />
      {/* Ensure the target object is part of the scene graph */}
      <primitive object={targetRef.current} />
    </>
  );
}
