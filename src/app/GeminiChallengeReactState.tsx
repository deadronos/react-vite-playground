/*

Here is a great challenge tailored for a React + TypeScript playground. It feels like a small game engine or sandbox tool, but focuses entirely on fundamental React concepts (state, composition, custom events) and practical TypeScript types without getting bogged down in boilerplate.

The Challenge: The Dynamic "Macro" Clicker
You are building an interactive automation grid. The goal is to create a component where clicking an element updates a state machine, and users can toggle an "auto-run" mode that triggers actions using a simple interval.

This forces you to deal with state timing, TypeScript strictness around dynamic keys, and reusable component design.

Core Requirements
The State Structure:
Track a player's resource pool. You have three resources: energy, materials, and credits.

The Control Panel Component:
Create a reusable action card component that accepts:

The name of the resource it generates.

The resource cost required to run it (e.g., generating materials might cost 2 energy).

An action handler callback.

The Auto-Ticker Loop:
Implement a useEffect interval loop. When an "Automation Mode" toggle is checked, the loop ticks every 1 second and automatically executes a chosen action if the player can afford it.

Technical Constraints & TypeScript Focus
To make this a true TypeScript challenge, avoid using any. You should focus on typing these three specifics:

Resource Keys: Prevent arbitrary strings. Use a union type: "energy" | "materials" | "credits".

State Operations: Ensure that when updating state based on a resource key, your function can safely read and write to the state object without causing compiler errors like “Element implicitly has an 'any' type because expression of type 'string' can't be used to index type...”.

Strict Props: Your Action Card props must explicitly type the cost object to map exclusively to your allowed resource keys.

Starting Boilerplate
Copy this structure into your playground to set up the boundaries:

TypeScript
import React, { useState, useEffect } from 'react';

// 1. Fix these types / definitions
type ResourceType = 'energy' | 'materials' | 'credits';

interface ResourceState {
  energy: number;
  materials: number;
  credits: number;
}

// 2. Define strict props for the Reusable Component
interface ActionCardProps {
  resource: ResourceType;
  cost: Partial<Record<ResourceType, number>>;
  onExecute: (resource: ResourceType, cost: Partial<Record<ResourceType, number>>) => void;
  disabled: boolean;
}

export const ActionCard: React.FC<ActionCardProps> = ({ resource, cost, onExecute, disabled }) => {
  return (
    <div style={{ border: '1px solid #ccc', padding: '16px', margin: '8px', borderRadius: '6px' }}>
      <h3>Generate {resource.toUpperCase()}</h3>
      <p>Cost: {Object.entries(cost).map(([k, v]) => `${v} ${k}`).join(', ') || 'Free'}</p>
      <button disabled={disabled} onClick={() => onExecute(resource, cost)}>
        Execute Action
      </button>
    </div>
  );
};

export default function PlaygroundChallenge() {
  const [resources, setResources] = useState<ResourceState>({
    energy: 10,
    materials: 0,
    credits: 0,
  });
  const [autoRun, setAutoRun] = useState<boolean>(false);
  const [selectedAutoTarget, setSelectedAutoTarget] = useState<ResourceType>('materials');

  // 3. Implement the execution logic here safely updating types
  const handleExecute = (target: ResourceType, cost: Partial<Record<ResourceType, number>>) => {
    // Check if affordable...
    // Deduct cost and add 1 to the target resource...
  };

  // 4. Implement the automation useEffect loop here
  useEffect(() => {
    if (!autoRun) return;

    // Set up interval...
  }, [autoRun, selectedAutoTarget, resources]);

  return (
    <div style={{ padding: '24px' }}>
      <h2>Resource Dashboard</h2>
      <pre>{JSON.stringify(resources, null, 2)}</pre>

      {/* Build UI for controls and map the ActionCards here/}
    </div>
  );
}
What this teaches you
State Dependency in Effects: You'll quickly see how passing state arrays inside hooks can create stale closures or rapid-fire re-renders if the dependencies aren't tracked cleanly.

Indexed Access Types: You will learn how to map through Object.keys() safely in TypeScript without casting everything as any.

*/


import React, { useState, useEffect } from 'react';

// 1. Fix these types / definitions
type ResourceType = 'energy' | 'materials' | 'credits';

interface ResourceState {
  energy: number;
  materials: number;
  credits: number;
}

// 2. Define strict props for the Reusable Component
interface ActionCardProps {
  resource: ResourceType;
  cost: Partial<Record<ResourceType, number>>;
  onExecute: (resource: ResourceType, cost: Partial<Record<ResourceType, number>>) => void;
  disabled: boolean;
}

export const ActionCard: React.FC<ActionCardProps> = ({ resource, cost, onExecute, disabled }) => {
  return (
    <div style={{ border: '1px solid #ccc', padding: '16px', margin: '8px', borderRadius: '6px' }}>
      <h3>Generate {resource.toUpperCase()}</h3>
      <p>Cost: {Object.entries(cost).map(([k, v]) => `${v} ${k}`).join(', ') || 'Free'}</p>
      <button disabled={disabled} onClick={() => onExecute(resource, cost)}>
        Execute Action
      </button>
    </div>
  );
};

export default function PlaygroundChallenge() {
  const [resources, setResources] = useState<ResourceState>({
    energy: 10,
    materials: 0,
    credits: 0,
  });
  const [autoRun, setAutoRun] = useState<boolean>(false);
  const [selectedAutoTarget, setSelectedAutoTarget] = useState<ResourceType>('materials');

  // 3. Implement the execution logic here safely updating types
  const handleExecute = (target: ResourceType, cost: Partial<Record<ResourceType, number>>) => {
    // Check if affordable...
    // Deduct cost and add 1 to the target resource...
  };

  // 4. Implement the automation useEffect loop here
  useEffect(() => {
    if (!autoRun) return;

    // Set up interval...
  }, [autoRun, selectedAutoTarget, resources]);

  return (
    <div style={{ padding: '24px' }}>
      <h2>Resource Dashboard</h2>
      <pre>{JSON.stringify(resources, null, 2)}</pre>

      {/* Build UI for controls and map the ActionCards here */}
    </div>
  );
}
