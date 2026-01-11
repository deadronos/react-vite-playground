import React from 'react';
import { Box, Flex, ScrollArea, Heading, Button, Separator } from '@radix-ui/themes';

interface AppLayoutProps {
  children: React.ReactNode;
  activeExample: string;
  onSelectExample: (id: string) => void;
}

const EXAMPLES = [
  { id: 'custom-hooks', label: 'Custom Hooks' },
  { id: 'context-api', label: 'Context API' },
  { id: 'compound-components', label: 'Compound Components' },
  { id: 'state-management', label: 'State Management (Zustand)' },
  { id: 'threejs-scene', label: 'Three.js Scene' },
  { id: 'offscreen-canvas', label: 'Offscreen Canvas (Worker)' },
];

export const AppLayout: React.FC<AppLayoutProps> = ({ children, activeExample, onSelectExample }) => {
  return (
    <Flex style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
      {/* Sidebar */}
      <Box
        width="250px"
        style={{
          backgroundColor: 'var(--gray-2)',
          borderRight: '1px solid var(--gray-6)',
          flexShrink: 0,
        }}
      >
        <Flex direction="column" height="100%">
          <Box p="4">
            <Heading size="4">React Patterns</Heading>
          </Box>
          <Separator size="4" />
          <ScrollArea type="auto" scrollbars="vertical" style={{ height: '100%' }}>
            <Flex direction="column" gap="1" p="2">
              {EXAMPLES.map((ex) => (
                <Button
                  key={ex.id}
                  variant={activeExample === ex.id ? 'solid' : 'ghost'}
                  onClick={() => onSelectExample(ex.id)}
                  style={{ justifyContent: 'flex-start', cursor: 'pointer' }}
                >
                  {ex.label}
                </Button>
              ))}
            </Flex>
          </ScrollArea>
        </Flex>
      </Box>

      {/* Main Content */}
      <Box flexGrow="1" style={{ position: 'relative', overflow: 'hidden' }}>
        {children}
      </Box>
    </Flex>
  );
};
