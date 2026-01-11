import { lazy, useMemo, useEffect } from 'react';
import { Canvas } from '@react-three/offscreen';
import { Box, Heading, Text, Badge, Flex } from '@radix-ui/themes';

// Lazy load the Scene component for fallback
const Scene = lazy(() => import('./Scene'));

export default function OffscreenCanvasExample() {
  // Create the worker instance
  const worker = useMemo(
    () => new Worker(new URL('./worker.tsx', import.meta.url), { type: 'module' }),
    []
  );

  // Cleanup worker on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      worker.terminate();
    };
  }, [worker]);

  return (
    <Box style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box
        p="4"
        style={{
          position: 'absolute',
          zIndex: 10,
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          borderRadius: '8px',
          margin: '16px',
          maxWidth: '500px',
        }}
      >
        <Flex direction="column" gap="2">
          <Flex align="center" gap="2">
            <Heading size="4">React Three Offscreen Canvas</Heading>
            <Badge color="green">Worker Thread</Badge>
          </Flex>
          <Text size="2">
            This example demonstrates offscreen canvas rendering with React Three Fiber.
            The 3D scene runs in a Web Worker, keeping the main thread unblocked for better performance.
          </Text>
          <Text size="1" color="gray">
            Note: Falls back to main thread rendering if OffscreenCanvas is not supported (e.g., Safari).
          </Text>
        </Flex>
      </Box>
      <Canvas
        worker={worker}
        fallback={<Scene />}
        shadows
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ width: '100%', height: '100%' }}
      />
    </Box>
  );
}
