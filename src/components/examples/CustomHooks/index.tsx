import { useState, useEffect } from 'react';
import { Box, Heading, Text, Card, Flex, Button } from '@radix-ui/themes';

// Example Hook: useWindowSize
function useWindowSize() {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}

// Example Hook: useCounter
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  const increment = () => setCount((c) => c + 1);
  const decrement = () => setCount((c) => c - 1);
  const reset = () => setCount(initialValue);
  return { count, increment, decrement, reset };
}

export default function CustomHooksExample() {
  const { width, height } = useWindowSize();
  const { count, increment, decrement, reset } = useCounter(10);

  return (
    <Box p="6">
      <Heading mb="4">Custom Hooks</Heading>
      <Text as="p" mb="5">
        Custom hooks allow you to extract component logic into reusable functions.
      </Text>

      <Flex gap="4" wrap="wrap">
        <Card>
          <Heading size="3" mb="2">useWindowSize</Heading>
          <Text>Resize the window to see changes.</Text>
          <Box mt="4">
            <Text weight="bold">Width: {width}px</Text>
            <br />
            <Text weight="bold">Height: {height}px</Text>
          </Box>
        </Card>

        <Card>
          <Heading size="3" mb="2">useCounter</Heading>
          <Text size="6" weight="bold" align="center" my="4">{count}</Text>
          <Flex gap="2">
            <Button onClick={decrement} variant="soft" color="red">-</Button>
            <Button onClick={reset} variant="outline">Reset</Button>
            <Button onClick={increment} variant="soft" color="green">+</Button>
          </Flex>
        </Card>
      </Flex>
    </Box>
  );
}
