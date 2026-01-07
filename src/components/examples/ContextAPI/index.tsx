import React, { createContext, useContext, useState } from 'react';
import { Box, Heading, Text, Card, Flex, RadioGroup } from '@radix-ui/themes';

// 1. Create Context
const ThemeContext = createContext<{ theme: string; setTheme: (t: string) => void } | undefined>(undefined);

// 2. Provider Component
function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 3. Custom Hook for consuming context
function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
}

// Sub-component that consumes context
function ThemedCard() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div
      style={{
        padding: '20px',
        borderRadius: '8px',
        backgroundColor: isDark ? '#333' : '#eee',
        color: isDark ? '#fff' : '#000',
        transition: 'all 0.3s ease',
      }}
    >
      <Heading size="3">I am a {theme} card</Heading>
      <Text>My style is derived from the context.</Text>
    </div>
  );
}

function ThemeControls() {
  const { theme, setTheme } = useTheme();
  return (
    <RadioGroup.Root value={theme} onValueChange={setTheme}>
      <Flex gap="2" direction="column">
        <Text as="label" size="2">
          <Flex gap="2">
            <RadioGroup.Item value="light" /> Light Mode
          </Flex>
        </Text>
        <Text as="label" size="2">
          <Flex gap="2">
            <RadioGroup.Item value="dark" /> Dark Mode
          </Flex>
        </Text>
      </Flex>
    </RadioGroup.Root>
  );
}

export default function ContextAPIExample() {
  return (
    <Box p="6">
      <Heading mb="4">Context API</Heading>
      <Text as="p" mb="5">
        Context provides a way to pass data through the component tree without having to pass props down manually at every level.
      </Text>

      <ThemeProvider>
        <Flex gap="6" align="start">
          <Card>
            <Heading size="3" mb="2">Controls</Heading>
            <ThemeControls />
          </Card>

          <ThemedCard />
        </Flex>
      </ThemeProvider>
    </Box>
  );
}
