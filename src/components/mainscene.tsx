import '../index.css';
import { Box, CameraControls, Circle, PerspectiveCamera, RenderTexture, RoundedBox, Stars } from '@react-three/drei';
import { useStore } from '@react-three/fiber';
import ErrorBoundary from './ErrorBoundary';
import R3FView from './r3fview';
import GameSystems from './GameSystems';



export default MainScene;

function MainScene(): React.ReactElement {

  function RootStore(): null {
    const root = useStore();

    root.subscribe((): void => {
      const state = root.getState();
      // You can access the current state of the store here
      // For example, log the current camera position
      console.log('Camera position:', state.camera.position);
      console.log('Scene children:', state.scene.children);
    });

    root.subscribe((onchange) => {
      console.log('Store changed:', onchange);
    });

    return null;
  }

  function RoundedViewBox({ position = [0, 0, 0], args = [1, 1, 1], ...props }: any) {
    return (
      <mesh position={[0, 2, 0]} scale={[1, 1, 1]} {...props}>
        <RoundedBox args={[4, 3, 0.1]} radius={0.2} smoothness={4}>
          <meshPhysicalMaterial side={2}>
            <RenderTexture attach="map" width={512} height={320}>
              <PerspectiveCamera makeDefault position={[-0.16, 4.63, 15]} fov={50} rotation={[-0.4918214282273997, 0.24984003412046796, -0.09356690919815536]} scale={[1, 1, 1]} />
              <R3FView />
            </RenderTexture>
          </meshPhysicalMaterial>
        </RoundedBox>
      </mesh>
    )
  }


  return (
    <ErrorBoundary>
      <RootStore />

      {/* Camera controls */}
      <PerspectiveCamera key="main-camera" makeDefault fov={50} position={[0, 3, 4.127009088949638]} />
      <CameraControls />

      {/* Lighting setup */}
      <ambientLight intensity={0.5} />
      <color attach="background" args={['#000000']} />
      <pointLight position={[-0.34, 2.73, 3.53]} intensity={1.5} rotation={[0, 0.6632251157578454, 0]} castShadow={true} />

      {/* Starfield background */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      {/* Add your 3D components here */}

      <Box name="box" position={[3, 1, 0]}>
        <boxGeometry args={[1, 2, 1]} />
        <meshStandardMaterial color="orange" />
      </Box>

      <RoundedBox name="roundedbox" position={[-3, 1, 0]} args={[1, 2, 1]} radius={0.2} smoothness={4}>
        <meshStandardMaterial color="blue" />
      </RoundedBox>

      <RoundedViewBox />

      <group>
        <Circle name="groundcircle" args={[5, 64]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
          <meshPhysicalMaterial side={2} color="gray" />
        </Circle>
      </group>

      {/* Game ECS and rendering */}
      <GameSystems />

    </ErrorBoundary>
  );
}

