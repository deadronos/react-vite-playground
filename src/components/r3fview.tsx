import { useRef, type ReactElement } from 'react'
import { CanvasProvider } from '@triplex/provider';
import { Canvas, useFrame} from '@react-three/fiber'
import { Sphere, PerspectiveCamera, OrbitControls } from "@react-three/drei";
import TransmissionSphere from './TransmissionSphere';
import type { Mesh } from 'node_modules/@types/three/build/three.d.cts';




function R3FView(): ReactElement {

  type InnerSphereProps = {
    /**
     * Rotation speed in radians per second.
     * Use a negative value to rotate in the opposite direction
     */
    speed?:number;
  }



  function InnerSphere({speed=1,...props}:InnerSphereProps){
    const innerSpheremeshref=useRef<Mesh|null>();

    useFrame((_, delta) => {
      const mesh=innerSpheremeshref.current;
      if(!mesh) return;
      const angle=speed*delta;
      mesh.rotation.y+=angle;
    });
  return(
    <Sphere ref={innerSpheremeshref} position={[0,1.56,0]} scale={[2,1,1]} {...props}>
      <meshStandardMaterial transparent opacity={0.9} color={"indigo"}/>
    </Sphere>


  )
  };

  return (
    <CanvasProvider>
      <Canvas frameloop='always' shadows className='r3fview'>
          <ambientLight name={"Ambient Light"} color={"#f0f0ff"} intensity={Math.PI/2} position={[0, 4.81, 0]} castShadow={false} />
          <directionalLight name={"Key Light"} position={[1.33, 1.51, 5.59]} intensity={Math.PI} color={"#f0f0ff"} castShadow={true} />
          <pointLight name={"Fill Light"} position={[-2.47, 2.49, -0.16]} rotation={[-1.122659331488609, -0.948099223993744, 1.8730258687794386]} color={"#f0f0ff"} castShadow={true} intensity={Math.PI} />
          <pointLight name={"Back Light"} position={[-0.09, 1.07, -3.98]} rotation={[-1.122659331488609, -0.948099223993744, 1.8730258687794386]} color={"#f0f0ff"} castShadow={false} intensity={Math.PI} />
          <PerspectiveCamera position={[4.62, 7, -6.01]} makeDefault={true} rotation={[-2.9434326494568124, 0.5148495139047417, 3.041670718291418]} />
          <OrbitControls autoRotate={false} enableZoom={false} enableRotate={false} enablePan={false} />
          <mesh>
            <boxGeometry />
            <meshStandardMaterial color={"#5257ff"} />
          </mesh>
          <InnerSphere speed={1.0} />
          <TransmissionSphere speed={0.5} scale={[4,4,4]} />
      </Canvas>
    </CanvasProvider>
  )
}

export default R3FView;



