/*
Mini Factory Queue Simulator

Very Factorio-lite.

Ore -> Furnace -> Plate -> Storage

Every second:

Ore node generates ore
Furnace processes ore after delay
Storage counts items

Display nodes as cards connected by arrows.

Goal: avoid prop drilling by introducing context.

type Resource = "ore" | "plate";

type Machine = {
  id: string;
  input?: Resource;
  output: Resource;
  progress: number;
};

Stretch:

Drag machines
Save state
Offline progression
*/

import React from "react";
import { useState, useEffect, useContext } from "react";

type Resource = "ore" | "plate";

type Machine = {
  id: string;
  input?: Resource;
  output: Resource;
  progress: number;
  inputResourceAmount?: number; // Amount of input resource currently held
  outputResourceAmount?: number; // Amount of output resource currently held
};

type MachineRules = {
  id?: string;
  input?: Resource;
  inputResourceAmount?: number; // Amount of input resource required to produce one output
  output: Resource;
  outputResourceAmount?: number; // Amount of output resource produced per process cycle
  processTime?: number; // seconds to process one item
  delay?: number; // seconds before starting to process
}

type MachineTypes = "oreNode" | "furnace" | "storage";

type MachineTypeRules = Record<MachineTypes, MachineRules>;

const machineTypeRules: MachineTypeRules = {
  oreNode: {
    output: "ore",
    outputResourceAmount: 1, // Produces 1 ore per process cycle
    processTime: 1,
  },
  furnace: {
    input: "ore",
    inputResourceAmount: 1, // Requires 1 ore to produce output
    output: "plate",
    outputResourceAmount: 1, // Produces 1 plate per process cycle
    processTime: 2,
    delay: 1,
  },
  storage: {
    input: "plate",
    inputResourceAmount: 1, // Requires 1 plate to store
    output: "plate",
    outputResourceAmount: 1, // Stores 1 plate per process cycle
  },
};

type FactoryState = {
  machines: Machine[];
  resources: Record<Resource, number>;
  rules: MachineTypeRules;
};

const initialFactoryState: FactoryState = {
  machines: [{
      id: "oreNode",
      output: "ore",
      outputResourceAmount: 0,
      progress: 0,
    },
    {
      id: "furnace",
      input: "ore",
      inputResourceAmount: 0,
      output: "plate",
      outputResourceAmount: 0,
      progress: 0,
    },
    {
      id: "storage",
      input: "plate",
      inputResourceAmount: 0,
      output: "plate",
      outputResourceAmount: 0,
      progress: 0,
    }
  ],
  resources: {
    ore: 0,
    plate: 0,
  },
  rules: machineTypeRules,
};

type FactoryContextType = {
  state: FactoryState;
  addMachine: (machine: Machine) => void;
  removeMachine: (id: string) => void;
  setInitialState: (state: FactoryState) => void;
  updateMachine: (id: string, updates: Partial<Machine>) => void;
  decrementMachineInput: (id: string, amount: number) => void;
  incrementMachineOutput: (id: string, amount: number) => void;
  resetMachineProgress: (id: string) => void;
  updateMachineProgress: (id: string, progress: number) => boolean;
  updateGlobalResources: (resource: Resource, amount: number) => void;
  machineTypeRules: MachineTypeRules;
};

type FactoryProviderProps = {
  children: React.ReactNode;
};



function FactoryProvider({ children }: FactoryProviderProps) {

  const [state, setState] = useState<FactoryState>(initialFactoryState);


  function addMachine(machine: Machine) {
    setState((prev) => ({
      ...prev,
      machines: [...prev.machines, machine],
    }));
  }

  function removeMachine(id: string) {
    setState((prev) => ({
      ...prev,
      machines: prev.machines.filter((m) => m.id !== id),
    }));
  }

  function setInitialState(state: FactoryState) {
    setState(state);
  }

  function updateMachine(id: string, updates: Partial<Machine>) {
    setState((prev) => ({
      ...prev,
      machines: prev.machines.map((m) => (m.id === id ? { ...m, ...updates } : m)),
    }));
  }

  function decrementMachineInput(id: string, amount: number) {
    setState((prev) => ({
      ...prev,
      machines: prev.machines.map((m) =>
        m.id === id
          ? { ...m, inputResourceAmount: (m.inputResourceAmount ?? 0) - amount }
          : m
      ),
    }));
  }

  function incrementMachineOutput(id: string, amount: number) {
    setState((prev) => ({
      ...prev,
      machines: prev.machines.map((m) =>
        m.id === id
          ? { ...m, outputResourceAmount: (m.outputResourceAmount ?? 0) + amount }
          : m
      ),
    }));
  }

  function resetMachineProgress(id: string) {
    setState((prev) => ({
      ...prev,
      machines: prev.machines.map((m) => (m.id === id ? { ...m, progress: 0 } : m)),
    }));
  }

  function updateMachineProgress(id: string, progress: number) {
    setState((prev) => ({
      ...prev,
      machines: prev.machines.map((m) => (m.id === id ? { ...m, progress } : m)),
    }));
    const machine = state.machines.find((m) => m.id === id);
    if (!machine) {
      console.warn(`Machine with id ${id} not found`);
      return false; // Machine not found, should never happen
    }
    const rules = state.rules[id as MachineTypes];
    if (!rules) {
      console.warn(`No rules defined for machine type ${id}`);
      return false; // No rules defined, can't process
    }
    if (progress >= rules.processTime!*100) {
      // progress reached is proportional to processTime, scaled by 100 for easier percentage handling

      // Check if machine can produce output (e.g. has input resources)
      if (rules.input) {
        // only true if machine needs input

        // check if machine has enough input resource to produce output
        const availableInput = machine.inputResourceAmount; // Get input resource amount from machine state
        if(!availableInput) {
          console.warn(`Machine with id ${id} has no input resource amount defined`);
          return false; // No input resource amount defined, treat as 0
        }
        if (availableInput <= 0) {
          console.info(`Machine with id ${id} does not have enough input resources`);
          return false; // Not enough input to produce output
        }
        decrementMachineInput(id, 1); // Consume input resource
      } else {
        // If machine doesn't require input, just produce output
      }
      incrementMachineOutput(id, 1); // Produce output resource
      resetMachineProgress(id); // Reset progress for next item
      return true; // Finished processing
    } else {
      return false; // Not finished processing yet
    }
}

  function updateGlobalResources(resource: Resource, amount: number) {
    setState((prev) => ({
      ...prev,
      resources: {
        ...prev.resources,
        [resource]: (prev.resources[resource] || 0) + amount,
      },
    }));
  }

  return (
    <FactoryContext.Provider value={{
      state,
      addMachine,
      removeMachine,
      setInitialState,
      updateMachine,
      decrementMachineInput,
      incrementMachineOutput,
      resetMachineProgress,
      updateMachineProgress,
      updateGlobalResources,
      machineTypeRules: state.rules}}>
      {children}
    </FactoryContext.Provider>
  );
}


const FactoryContext = React.createContext<FactoryContextType | undefined>(undefined);

export default function ChatGPTChallenge1() {
  return (
    <FactoryProvider>
      <ChatGPTChallenge1Content />
    </FactoryProvider>
  );
}

function ChatGPTChallenge1Content() {
  const factoryContext = useContext(FactoryContext);
  const [tick, setTick] = useState(0); // Used to trigger re-renders on each simulation step
  const [isLooping, setIsLooping] = useState(false); // Track if simulation loop is running

  if (!factoryContext) {
    throw new Error("FactoryContext not available. Make sure to wrap components in FactoryProvider.");
  }

  useEffect(() => {
    function onMount() {
      // Initialize factory state and start simulation loop
      if(!factoryContext) return; // Should never happen due to useFactory check
      // factoryContext.addMachine(...); // Add initial machines if needed
      if (factoryContext.state.machines.length === 0) {
        // If no machines defined, set initial state with default machines
        factoryContext.setInitialState(initialFactoryState);
      }
      console.log('Factory state initialized',factoryContext.state)
    };




    onMount(); //Run once on mount

    return () => {
      // Cleanup simulation loop if needed when component unmounts
    }
  }, []);

  useEffect(() => {
    function simLoop():() => void {
        handleSimTick();
        return () => {
          // Cleanup if needed (e.g. clearTimeout)
        };
    }

    function handleSimTick() {
      if(!factoryContext) {
        console.error("Factory context not available in sim tick");
        return; // Should never happen due to useFactory check
      }
      const { state, updateMachineProgress, updateGlobalResources } = factoryContext;
      // Update machine progress and resources based on rules
      state.machines.forEach((machine) => {
        // update 10 progress per tick, scaled by processTime for that machine type
        const finished = updateMachineProgress(machine.id, machine.progress + 10);
        if (finished) {
          // If machine finished processing, update global resources if needed
          const rules = state.rules[machine.id as MachineTypes];
          if (rules.output) {
            // Increment global resource count for output
            updateGlobalResources(rules.output, 1);
          }
        }
      });
      // Trigger re-render to update UI
      setTick((prev) => prev + 1);
      return () => {
        // Cleanup if needed (e.g. clearTimeout)
      }
    }

    const tickInterval = 100; // 100ms per tick for smoother updates
    if (isLooping) {
      const intervalId = setInterval(simLoop, tickInterval);
      return () => clearInterval(intervalId); // Cleanup on unmount or when stopping loop
    }
  }, [isLooping]);

  return (
    <>
      <div>
          <h1>Mini Factory Queue Simulator</h1>
          <p>Very Factorio-lite.</p>
          <p>Ore -&gt; Furnace -&gt; Plate -&gt; Storage</p>
          <p>Every second:</p>
          <ul>
            <li>Ore node generates ore</li>
            <li>Furnace processes ore after delay</li>
            <li>Storage counts items</li>
          </ul>
          <p>Display nodes as cards connected by arrows.</p>
          <p>Goal: avoid prop drilling by introducing context.</p>
      </div>
      {/* Factory simulation components go here */}
      <button className="mt-5 px-4 py-2 bg-blue-500 text-white rounded" onClick={() => setIsLooping((prev) => !prev)}>
        {isLooping ? "Stop Simulation" : "Start Simulation"}
      </button>
      <div className="mt-5 flex gap-5">
        <GlobalResourcesDisplay />
        <GlobalTickDisplay tick={tick} />
      </div>
      <div className="mt-5">
        <MachineCardsDisplay />
      </div>
    </>
  )
}


function MachineCardsDisplay() {
    const factoryContext = useContext(FactoryContext);
    if(!factoryContext) {
      return null; // Should never happen due to useFactory check
    }
    const { state } = factoryContext;
    if (!state) {
      return null; // Should never happen due to useFactory check
    }
    return (
      <div>
        <h2>Machines</h2>
        {state.machines.map((machine) => (
          <div key={machine.id} className="border p-2 rounded mb-2">
            <p>ID: {machine.id}</p>
            <p>Input: {machine.input || "None"}</p>
            <p>Output: {machine.output}</p>
            <p>Progress: {machine.progress}%</p>
            <p>Input Resource Amount: {machine.inputResourceAmount || 0}</p>
            <p>Output Resource Amount: {machine.outputResourceAmount || 0}</p>
          </div>
        ))}
      </div>
    );
}

function GlobalResourcesDisplay() {
    const factoryContext = useContext(FactoryContext);
    if(!factoryContext) {
      return null; // Should never happen due to useFactory check
    }
    const { state } = factoryContext;
    if (!state) {
      return null; // Should never happen due to useFactory check
    }
    return (
      <div>
        <h2>Global Resources</h2>
        <p>Ore: {state.resources.ore}</p>
        <p>Plate: {state.resources.plate}</p>
      </div>
    );
  }

  function GlobalTickDisplay({ tick }: { tick: number }) {
    return (
      <div>
        <h2>Global Tick</h2>
        <p>{tick}</p>
      </div>
    );
  }
