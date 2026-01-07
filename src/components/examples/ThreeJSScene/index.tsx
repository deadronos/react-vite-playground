import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Box, Sphere, MeshDistortMaterial } from '@react-three/drei';
import { Heading, Text, Box as RadixBox } from '@radix-ui/themes';

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />

      <Box position={[-1.2, 0, 0]}>
        <meshStandardMaterial color="orange" />
      </Box>

      <Sphere position={[1.2, 0, 0]}>
        <MeshDistortMaterial color="purple" distort={0.6} speed={2} />
      </Sphere>

      <Stars />
      <OrbitControls />
    </>
  );
}

export default function ThreeJSExample() {
  return (
    <RadixBox style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <RadixBox p="4" style={{ position: 'absolute', zIndex: 10, background: 'rgba(0,0,0,0.5)', color: 'white', borderRadius: '8px', margin: '16px' }}>
            <Heading size="4">React Three Fiber</Heading>
            <Text>A simple 3D scene embedded in the app.</Text>
        </RadixBox>
        <Canvas>
            <Scene />
        </Canvas>
    </RadixBox>
  );
}
