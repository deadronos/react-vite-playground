import { useRef, type ReactElement } from 'react';
import { CanvasProvider } from '@triplex/provider';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, PerspectiveCamera, OrbitControls, MeshWobbleMaterial, MeshReflectorMaterial, Edges } from "@react-three/drei";
import TransmissionSphere from './TransmissionSphere';
import '../index.css';
import OrbitingDirectionalLight from './OrbitingDirectionalLight';

export default R3FView;


function R3FView(...props): ReactElement {

  type InnerSphereProps = {
    /**
     * Rotation speed in radians per second.
     * Use a negative value to rotate in the opposite direction
     */
    speed?: number;
  }

  function InnerSphere({ speed = 1, ...props }: InnerSphereProps) {
    const innerSpheremeshref = useRef<Mesh | null>();

    useFrame((_, delta) => {
      const time = _.clock.getElapsedTime();
      const mesh = innerSpheremeshref.current;
      if (!mesh) return;
      const rot = delta * Math.sin(time) / 2 * speed;
      const angle = rot;
      mesh.rotation.x += angle;
      mesh.rotation.y += angle;
      mesh.rotation.z += angle;
    });
    return (
      <Sphere ref={innerSpheremeshref} position={[0, 1.56, 0]} scale={[1, 1, 1]} {...props}>
        <meshPhysicalMaterial transparent opacity={0.9} color={"indigo"} />
      </Sphere>
    )
  };

  /**
    * MovingBox
    * - Moves the box around a circle using elapsed time
    * - speed: multiplier for angular speed
    * - radius: circle radius
    * - y: vertical offset
    * - size: size of the box
    */
  type MovingBoxProps = {
    speed?: number;
    radius?: number;
    y?: number;
    size?: number;
    color?: string;
  };

  function MovingBox({ speed = 1, radius = 4, y = 1, size = 0.8, color = "#ff6b6b" }: MovingBoxProps) {
    const ref = useRef<Mesh | null>(null);

    useFrame(({ clock }, delta) => {
      const t = clock.getElapsedTime() * speed;
      const x = Math.cos(t) * (radius + Math.sin(t));
      const z = Math.sin(t) * (radius + Math.cos(t));

      if (!ref.current) return;
      // Move position along circle and add a gentle rotation
      ref.current.position.set(x, y, z);
      ref.current.position.y = y - 1 + Math.sin(t) * 1.5;
      ref.current.rotation.x += delta * 0.5;
      ref.current.rotation.y += delta * 0.3;
    });

    return (
      <mesh ref={ref} castShadow receiveShadow>
        <boxGeometry args={[size, size, size]} />
        <MeshWobbleMaterial factor={10} speed={speed} color={color} metalness={0.2} roughness={0.4} />
      </mesh>
    );
  }

  return (
    <CanvasProvider>
      <div className='r3f-canvas'>
        <Canvas frameloop='always'
          camera={{ position: [0, 0, 10], fov: 50 }}
          shadows className='r3fview' webgl={{ antialias: true, powerPreference: "high-performance" }}>
          <axesHelper visible={false} args={[5]} />
          <gridHelper visible={false} opacity={0.1} args={[20, 20, 0xff22aa, 0x55ccff]} />
          <ambientLight name={"Ambient Light"} color={"#f0f0ff"} intensity={Math.PI / 2} position={[0, 4.81, 0]} castShadow={false} />
          <directionalLight castShadow name={"Key Light"} position={[1.33, 1.51, 5.59]} intensity={Math.PI} color={"#f0f0ff"} castShadow={true} />
          <pointLight castShadow name={"Fill Light"} position={[-2.47, 2.49, -0.16]} rotation={[-1.122659331488609, -0.948099223993744, 1.8730258687794386]} color={"#f0f0ff"} castShadow={true} intensity={Math.PI} />
          <pointLight castShadow name={"Back Light"} position={[-0.09, 1.07, -3.98]} rotation={[-1.122659331488609, -0.948099223993744, 1.8730258687794386]} color={"#f0f0ff"} castShadow={true} intensity={Math.PI} />
          <fog attach="fog" args={["#000011", 1, 100]}/>
          <OrbitingDirectionalLight
            speed={0.05}
            radius={6}
            height={3.5}
            color={"#f0f0ff"}
            inclination={Math.PI / 6}
            intensity={Math.PI * 3}
            castShadow={true}
            shadowMapSize={2048}
            target={[0, -2, 0]}
            helper={false}
          />
          <OrbitingDirectionalLight
            speed={0.1}
            radius={10}
            height={6}
            inclination={Math.PI / 6}
            color={"ultraviolet"}
            intensity={Math.PI}
            castShadow={true}
            shadowMapSize={2048}
            target={[0, 0, 0]}
            helper={false}
          />
          <PerspectiveCamera makeDefault position={[-0.16, 4.63, 15]} fov={50} rotation={[-0.4918214282273997, 0.24984003412046796, -0.09356690919815536]} scale={[1, 1, 1]} />
          <OrbitControls autoRotate={false} enableZoom={false} enableRotate={false} enablePan={false} />
          <MovingBox receiveShadow speed={0.1} radius={6} color={"indigo"} />
          <MovingBox receiveShadow speed={0.2} radius={6} color={"indigo"} />
          <MovingBox receiveShadow speed={0.3} radius={6} color={"indigo"} y={3} />
          <MovingBox receiveShadow speed={0.4} radius={6} color={"indigo"} y={4} />
          <mesh>
            <boxGeometry />
            <meshPhysicalMaterial color={"#5257ff"} />
          </mesh>
          <InnerSphere speed={1.0} />
          <TransmissionSphere transmissionSampler castShadow receiveShadow speed={0.5} scale={[4, 4, 4]} />
          <mesh>
            <sphereGeometry args={[50, 64, 64]} />
            <MeshReflectorMaterial
              color={"#000011"}
              metalness={0.3}
              roughness={0.3}
              opacity={0.9}
              mixBlur={1}
              mixStrength={80}
              toneMapped={true}
              side={1}
              depthScale={6.2}
              minDepthThreshold={0.4}
              maxDepthThreshold={1.4}
            />
          </mesh>
          <mesh receiveShadow position={[0, -10, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[100, 100]} />
            <MeshReflectorMaterial
              blur={[300, 100]}
              resolution={2048}
              mixBlur={1}
              mixStrength={80}
              roughness={0.1}
              depthScale={6.2}
              minDepthThreshold={0.4}
              maxDepthThreshold={1.4}
              color="#000011"
              metalness={0.1}
            />
          </mesh>
        </Canvas>
      </div>
    </CanvasProvider>
  )
}
