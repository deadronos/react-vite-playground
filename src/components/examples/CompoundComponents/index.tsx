import React, { useState } from 'react';
import { Box, Heading, Text, Card, Flex } from '@radix-ui/themes';

// Compound Component Pattern: Accordion
// The parent component manages the state, and children communicate implicitly.

interface AccordionProps {
  children: React.ReactNode;
}

interface AccordionItemProps {
  id: string;
  children: React.ReactNode;
}

interface AccordionTriggerProps {
  children: React.ReactNode;
}

interface AccordionContentProps {
  children: React.ReactNode;
}

// Context for the Accordion
const AccordionContext = React.createContext<{
  openId: string | null;
  toggle: (id: string) => void;
} | undefined>(undefined);

// Parent
function Accordion({ children }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const toggle = (id: string) => setOpenId(prev => prev === id ? null : id);

  return (
    <AccordionContext.Provider value={{ openId, toggle }}>
      <Flex direction="column" gap="2">
        {children}
      </Flex>
    </AccordionContext.Provider>
  );
}

// Item Context (to pass ID down)
const ItemContext = React.createContext<{ id: string } | undefined>(undefined);

function AccordionItem({ id, children }: AccordionItemProps) {
  return (
    <ItemContext.Provider value={{ id }}>
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        {children}
      </Card>
    </ItemContext.Provider>
  );
}

function AccordionTrigger({ children }: AccordionTriggerProps) {
  const { toggle, openId } = React.useContext(AccordionContext)!;
  const { id } = React.useContext(ItemContext)!;
  const isOpen = openId === id;

  return (
    <Box
      onClick={() => toggle(id)}
      p="3"
      style={{
        cursor: 'pointer',
        backgroundColor: isOpen ? 'var(--gray-3)' : 'transparent',
        fontWeight: 'bold',
        userSelect: 'none'
      }}
    >
      <Flex justify="between" align="center">
        {children}
        <span>{isOpen ? '−' : '+'}</span>
      </Flex>
    </Box>
  );
}

function AccordionContent({ children }: AccordionContentProps) {
  const { openId } = React.useContext(AccordionContext)!;
  const { id } = React.useContext(ItemContext)!;
  const isOpen = openId === id;

  if (!isOpen) return null;

  return (
    <Box p="3" style={{ borderTop: '1px solid var(--gray-4)' }}>
      {children}
    </Box>
  );
}

// Assigning subcomponents to main component (optional, but common)
// Accordion.Item = AccordionItem; ...

export default function CompoundComponentsExample() {
  return (
    <Box p="6">
      <Heading mb="4">Compound Components</Heading>
      <Text as="p" mb="5">
        Compound components share state implicitly, allowing for flexible markup structures.
        Below is a custom Accordion built with this pattern.
      </Text>

      <Box maxWidth="500px">
        <Accordion>
          <AccordionItem id="section-1">
            <AccordionTrigger>What is React?</AccordionTrigger>
            <AccordionContent>
              React is a JavaScript library for building user interfaces.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem id="section-2">
            <AccordionTrigger>Why use Compound Components?</AccordionTrigger>
            <AccordionContent>
              They allow you to export a set of components that work together (like &lt;Select&gt; and &lt;Option&gt;)
              while leaving the rendering and layout control to the user.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem id="section-3">
            <AccordionTrigger>Another Section</AccordionTrigger>
            <AccordionContent>
              This is just more content to demonstrate the toggle functionality.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Box>
    </Box>
  );
}
