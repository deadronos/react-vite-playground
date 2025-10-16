import * as THREE from 'three'
import { type ReactElement } from 'react'
import { CanvasProvider } from '@triplex/provider';
import { Canvas } from '@react-three/fiber'
import { MeshWobbleMaterial, OrbitControls, SoftShadows } from '@react-three/drei';
import { PerspectiveCamera } from "@react-three/drei";
import { MeshTransmissionMaterial } from '@react-three/drei';



function R3FView(): ReactElement {
  return (
    <CanvasProvider>
      <Canvas shadows className='r3fview'>
        <>
          <ambientLight name={"Ambient Light"} color={"#f0f0ff"} intensity={1} position={[0, 4.81, 0]} castShadow={false} />
          <directionalLight name={"Key Light"} position={[1.33, 1.51, 5.59]} intensity={3} color={"#f0f0ff"} castShadow={true} />
          <pointLight name={"Fill Light"} position={[-2.47, 2.49, -0.16]} rotation={[-1.122659331488609, -0.948099223993744, 1.8730258687794386]} color={"#f0f0ff"} castShadow={true} intensity={2.5} />
          <pointLight name={"Back Light"} position={[-0.09, 1.07, -3.98]} rotation={[-1.122659331488609, -0.948099223993744, 1.8730258687794386]} color={"#f0f0ff"} castShadow={false} intensity={2.5} />
          <PerspectiveCamera position={[4.62, 7, -6.01]} makeDefault={true} rotation={[-2.9434326494568124, 0.5148495139047417, 3.041670718291418]} />
          <OrbitControls autoRotate={true} enableZoom={false} enableRotate={false} enablePan={false} />
          <mesh>
            <boxGeometry />
            <meshStandardMaterial color={"#5257ff"} />
          </mesh>
          <mesh position={[0, 1.56, 0]}>
            <sphereGeometry />
            <meshStandardMaterial color={"indigo"} />
          </mesh>
          <mesh position={[0, 1.18, 0]} scale={[3, 3, 3]}>
          <sphereGeometry />
          <MeshTransmissionMaterial transmission={1.0} clearcoat={1} color={"#c9ffa1"} vertexColors={false} reflectivity={0.44} opacity={undefined} alphaToCoverage={false} colorWrite={true} clipShadows={false} anisotropicBlur={0.1} attenuationColor={"#000000"} backside={true} chromaticAberration={undefined} forceSinglePass={false} iridescence={undefined} isMeshPhysicalMaterial={false} precision={"mediump"} specularColor={"#000000"} sheenColor={"#000000"} wireframeLinecap={undefined} thickness={0.2} depthFunc={3} clipIntersection={false} bumpScale={undefined} displacementBias={undefined} displacementScale={undefined} fog={false} flatShading={false} emissiveIntensity={0.05} emissive={"indigo"} dithering={false} alphaTest={undefined} alphaHash={false} />
          </mesh>
        </>
      </Canvas>
    </CanvasProvider>
  )
}

export default R3FView;
