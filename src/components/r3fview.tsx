import * as THREE from 'three'
import { type ReactElement } from 'react'
import { CanvasProvider } from '@triplex/provider';
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei';
import { PerspectiveCamera } from "@react-three/drei";
import { MeshTransmissionMaterial } from '@react-three/drei';



function R3FView(): ReactElement {
  return (
    <CanvasProvider>
      <Canvas className='r3fview'>
        <>
          <pointLight name={"Key Light"} position={[1.33, 0.64, 1.99]} intensity={5} color={"#f0f0ff"} />
          <pointLight name={"Fill Light"} position={[-2.47, 2.49, -0.16]} rotation={[-1.122659331488609, -0.948099223993744, 1.8730258687794386]} castShadow={false} intensity={2.5} />
          <pointLight name={"Back Light"} position={[-0.09, 1.07, -3.98]} rotation={[-1.122659331488609, -0.948099223993744, 1.8730258687794386]} castShadow={false} intensity={2.5} />
          <PerspectiveCamera position={[0.62, 2, 4.02]} makeDefault={true} />
          <OrbitControls />
          <mesh>
            <boxGeometry />
            <meshStandardMaterial color={"#ff2424"} />
          </mesh>
          <mesh position={[0, 1.56, 0]}>
            <sphereGeometry />
            <meshStandardMaterial color={"indigo"}/>
          </mesh>
          <mesh>
            <sphereGeometry />
            <MeshTransmissionMaterial />
          </mesh>
        </>
      </Canvas>
    </CanvasProvider>
  )
}

export default R3FView;
