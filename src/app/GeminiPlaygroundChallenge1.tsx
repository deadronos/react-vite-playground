
import React, { useState, useEffect, useCallback } from 'react';

// 1. Fix these types / definitions
type ResourceType = 'energy' | 'materials' | 'credits';

interface ResourceState extends Record<ResourceType, number> {
  energy: number;
  materials: number;
  credits: number;
}

interface ResourceCost extends Partial<Record<ResourceType, number>> {
  energy?: number;
  materials?: number;
  credits?: number;
}

interface ResourceCanAfford extends Record<ResourceType, boolean> {
  energy: boolean;
  materials: boolean;
  credits: boolean;
}

// 2. Define strict props for the Reusable Component
interface ActionCardProps {
  resource: ResourceType;
  cost: Partial<Record<ResourceType, number>>;
  onExecute: (resource: ResourceType, cost: Partial<Record<ResourceType, number>>) => void;
  onClick?: (resource: ResourceType, cost: Partial<Record<ResourceType, number>>) => void; // Optional if you want to handle click separately
  disabled: boolean;
}

export const ActionCard: React.FC<ActionCardProps> = ({ resource, cost, onExecute, disabled }:ActionCardProps) => {
  return (
    <div style={{ border: '1px solid #ccc', padding: '16px', margin: '8px', borderRadius: '6px' }}>
      <h3>Generate {resource.toUpperCase()}</h3>
      <p>Cost: {Object.entries(cost).map(([k, v]) => `${v} ${k}`).join(', ') || 'Free'}</p>
      <button style={{ color: disabled? 'gray':'white',cursor: disabled ? 'not-allowed' : 'pointer' }} disabled={disabled} onClick={() => onExecute(resource, cost)}>
        Execute Action
      </button>
    </div>
  );
};

export default function GeminiPlaygroundChallenge1() {
  const [resources, setResources] = useState<ResourceState>({
    energy: 10,
    materials: 0,
    credits: 0,
  });
  const [costs, setCosts] = useState<Record<ResourceType, ResourceCost>>({
    energy: { /* Free to generate energy */},
    materials: { energy: 2 /* 2 energy to generate 1 material */ },
    credits: { energy:1, materials: 1 /* 1 energy + 1 material to generate 1 credit */ },
  });
  const [autoRun, setAutoRun] = useState<boolean>(false);
  const [selectedAutoTarget, setSelectedAutoTarget] = useState<ResourceType>('materials');
  const [canAfford, setCanAfford] = useState<ResourceCanAfford>({
    energy: true,
    materials: false,
    credits: false,
  });

  const updateAffordability=useCallback(() => {
    const newAffordability: ResourceCanAfford = {
      energy: true, // Always affordable
      materials: Object.entries(costs.materials).every(([k, v]) => resources[k as ResourceType] >= v),
      credits: Object.entries(costs.credits).every(([k, v]) => resources[k as ResourceType] >= v),
    };
    setCanAfford(newAffordability);
  }, [resources, costs]);

  useEffect(() => {
    // Recalculate affordability whenever resources or costs change
    updateAffordability();
    return () => {
      // Clean up if needed
    }
  }, [resources, costs, updateAffordability]);

  // 3. Implement the execution logic here safely updating types
  const handleExecute = useCallback((target: ResourceType, cost: Partial<Record<ResourceType, number>>) => {
    // Check if affordable...
    const currentTargetToGenerate=target;
    const currentCost=costs[currentTargetToGenerate];
    updateAffordability(); // Ensure affordability is up to date before executing
    const currentCanAfford = canAfford[currentTargetToGenerate];
    if (!currentCanAfford) {
      // return if not affordable
      return;
    }
    // Deduct cost and add 1 to the target resource...
    const newResources={ ...resources };
    Object.entries(currentCost).forEach(([k, v]) => {
      newResources[k as ResourceType] -= v ?? 0;
    });
    newResources[currentTargetToGenerate] += 1;
    setResources(newResources);
    return;
  }, [updateAffordability, resources, costs, canAfford]);

  // 4. Implement the automation useEffect loop here
  useEffect(() => {
    if (!autoRun) return;
    // Set up interval...
    const interval = setInterval(() => {
      const targetToGenerate = selectedAutoTarget;
      const costForTarget = costs[targetToGenerate];
      const canAffordTarget = canAfford[targetToGenerate];
      if (canAffordTarget) {
        handleExecute(targetToGenerate, costForTarget);
      }
    },1000); // Run every second
    return () => clearInterval(interval); // Clean up on unmount or when autoRun changes
  }, [autoRun, selectedAutoTarget, resources, canAfford, costs, handleExecute]);

  return (
    <div className="resource-dashboard" style={{ padding: '24px' }}>
      <div className="resource-state" style={{ marginBottom: '24px' }}>
        <h2>Resource Dashboard</h2>
        <pre>{JSON.stringify(resources, null, 2)}</pre>
      </div>
      {/* Build UI for controls and map the ActionCards here */}
      <div className="auto-run-container" style={{ marginTop: '16px' }}>
      <button className="auto-run-button" onClick={() => setAutoRun(!autoRun)}>
        {autoRun ? 'Stop Auto Run' : 'Start Auto Run'}
      </button>
      {autoRun && (
      <select className="auto-target-select" style={{ marginLeft: '8px' }} value={selectedAutoTarget} onChange={(e) => setSelectedAutoTarget(e.target.value as ResourceType)}>
          <option value="energy">Energy</option>
          <option value="materials">Materials</option>
          <option value="credits">Credits</option>
        </select>
      )}
      </div>
      <div className="action-cards" style={{ display: 'flex', flexWrap: 'wrap' }}>
        {Object.entries(costs).map(([resource, cost]) => {
          const resourceType = resource as ResourceType;
          return (
            <ActionCard
              key={resource}
              resource={resourceType}
              cost={cost}
              onExecute={(resourceType,cost)=>handleExecute(resourceType, cost)}
              onClick={(resourceType,cost)=>handleExecute(resourceType, cost)}
              disabled={!canAfford[resourceType]}
            />
          );
        })}
      </div>
    </div>
  );
}

