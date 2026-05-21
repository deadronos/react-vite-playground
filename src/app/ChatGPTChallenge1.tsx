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


/*
  napkin sketch:

  Factory overall lives in Provider,

  factory has nodes, a node contains a machine, has input and output buffer,
  a progress bar, and an onTick() method that can be called by the factory to ask the node to update itself.
  nodes can have an input and output port

  connections have an id, and a from and to port and an onTick() method that can be called by the factory to move items from one node to another.
  connection can display as arrows between nodes

  globalResources is a summation of all the resources in the system, and can be used to display total ore and plate counts.
  globalResources can be a special NodeLike in the factory which can watch all input/output buffers and update itself accordingly, and display the total resources in the system.

  simloop should live in the factory provider, and call onTick() on all nodes and connections every second.
  the individual onTick() methods decide logic for their object
*/



import React, { useMemo } from "react";
import { useState, useEffect, useContext } from "react";
import { useTheme } from "../components/theme-provider";


type Resource = "ore" | "plate";

type Machine = {
  id: string;
  input?: Resource;
  output: Resource;
  progress: number;
};

interface NodeLike {
  id: string;
  machine?: Machine;
  factoryRef?: FactoryLike;
  isActive?: boolean;
  inputBuffer: Resource[];
  outputBuffer: Resource[];

  behavior: NodeBehavior;  // defines how the node processes resources, and can be used to implement different types of nodes like ore nodes, furnaces, and storage.
  inputPort?: PortLike;
  outputPort?: PortLike;
  onTick: () => void;
  removeFromInputBuffer: (resource: Resource) => void;
  addToInputBuffer: (resource: Resource) => void;
  removeFromOutputBuffer: (resource: Resource) => void;
  addToOutputBuffer: (resource: Resource) => void;
  updateMachine: (machine: Machine) => void;
  getDisplayData: () => {
    title: string;
    content: string;
    progress: number;
  };
}

type NodeBehavior = {
  type: 'ore-node' | 'furnace' | 'storage';
  getBehavior: () => void; // this function will be called in the node's onTick method to execute the node's behavior based on its type
}

interface PortLike {
  nodeId: string;
  nodeRef: NodeLike;
  resource: Resource;
}

interface ConnectionLike {
  id: string;
  isActive?: boolean;
  fromPort: PortLike; // port id
  toPort: PortLike; // port id
  progress: number;
  onTick: () => void;

  display?: {
    fromNodeId: string;
    toNodeId: string;
  }
  updateFromPort: (port: PortLike) => void;
  updateToPort: (port: PortLike) => void;
  updateIsActive: (isActive: boolean) => void;
}

type NodesRecord=Record<string, NodeLike>;

type ConnectionRecord=Record<string, ConnectionLike>;

type GlobalResource={
  resource: Resource;
  quantity: number;
  factoryRef?: FactoryLike;
  onTick: () => void;
}
type GlobalResourcesRecord=Record<Resource, GlobalResource>;

interface FactoryLike {
  isActive: boolean;
  nodes: NodesRecord;
  connections: ConnectionRecord;
  globalResources: GlobalResourcesRecord;
  tick: number;
  onTick: () => void;
  getDisplayData: () => {
    nodes: {
      id: string;
      title: string;
      content: string;
    }[];
    connections: {
      id: string;
      fromNodeId: string;
      toNodeId: string;
      isActive?: boolean;
    }[];
    globalResources: {
      resource: Resource;
      quantity: number;
    }[];
  };
}

const createNode = (id: string, behavior: NodeBehavior, factoryRef: FactoryLike): NodeLike => {
  const getMachineFromBehavior = (): Machine => {
    switch (behavior.type) {
      case "ore-node":
        return {
          id: `${id}-machine`,
          output: "ore",
          progress: 0
        }
      case "furnace":
        return {
          id: `${id}-machine`,
          input: "ore",
          output: "plate",
          progress: 0
        }
      case "storage":
        return {
          id: `${id}-machine`,
          input: "plate",
          output: "plate",
          progress: 0
        }
      default:
        throw new Error("Unknown behavior type");
    }
  };

  return {
    id,
    behavior,
    isActive: false,
    machine: getMachineFromBehavior(),
    factoryRef,
    inputBuffer: [],
    inputPort: { nodeId: id, nodeRef: this, resource: behavior.type === "furnace" ? "ore" : "plate" },
    outputPort: { nodeId: id, nodeRef: this, resource: behavior.type === "ore-node" ? "ore" : "plate" },
    outputBuffer: [],
    onTick() {
      switch (this.behavior.type) {
        case "ore-node":
          // we are an orenode, so we add to our machineprogress, and when it hits 100 we add ore to our output buffer and reset progress
          if(this.machine) {
            this.machine.progress += 20;
            this.isActive = true;
          } else {
            console.error("Machine is undefined for node ", this.id);
          }
          if (this.machine && this.machine.progress >= 100) {
            this.addToOutputBuffer("ore");
            this.machine.progress = 0;
            this.isActive = false;
          }
          break;
        case "furnace":
          // we are a furnace, so if we have ore in our input buffer, we add to our machine progress, and when it hits 100 we remove ore from our input buffer, add plate to our output buffer, and reset progress
          if (this.inputBuffer.includes("ore") && this.machine) {
            this.machine.progress += 20;
            this.isActive = true;
            if (this.machine.progress >= 100) {
              this.removeFromInputBuffer("ore");
              this.addToOutputBuffer("plate");
              this.machine.progress = 0;
              this.isActive = false;
            }
          }
          break;
        case "storage":
          // we are storage, we use progress to move from input to output buffer, and count the number of plates in our output buffer for display purposes
          if (this.inputBuffer.includes("plate") && this.machine) {
            this.machine.progress += 20;
            this.isActive = true;
            if (this.machine.progress >= 100) {
              this.removeFromInputBuffer("plate");
              this.addToOutputBuffer("plate");
              this.machine.progress = 0;
              this.isActive = false;
            }
          }
          break;
      }
    },
    removeFromInputBuffer(resource: Resource) {
      this.inputBuffer = this.inputBuffer.filter(r => r !== resource);
    },
    addToInputBuffer(resource: Resource) {
      this.inputBuffer.push(resource);
    },
    removeFromOutputBuffer(resource: Resource) {
      this.outputBuffer = this.outputBuffer.filter(r => r !== resource);
    },
    addToOutputBuffer(resource: Resource) {
      this.outputBuffer.push(resource);
    },
    updateMachine(machine: Machine) {
      this.machine = machine;
    },
    getDisplayData() {
      return {
        title: `${this.behavior.type} (${this.id})`,
        content: `Input Buffer: ${this.inputBuffer.length > 0 ? this.inputBuffer.length : "empty"} | Output Buffer: ${this.outputBuffer.length > 0 ? this.outputBuffer.length : "empty"}`,
        progress: this.machine ? this.machine.progress : 0
      }
    }
  }
}

const createConnection = (id: string, fromPort: PortLike, toPort: PortLike): ConnectionLike => {
  return {
    id,
    fromPort,
    toPort,
    progress: 0,
    onTick() {
      // if the fromPort's node has the resource in its output buffer, we remove it from the output buffer and add it to the toPort's input buffer
      const fromNode = this.fromPort.nodeRef;
      const toNode = this.toPort.nodeRef;
      const resource = this.fromPort.resource;

      // start progress if resource is available and connection is not already active
      if (!this.isActive && fromNode.outputBuffer.includes(resource)) {
        this.isActive = true;
        this.progress += 20; // arbitrary progress increment
        if (this.progress >= 100) {
          fromNode.removeFromOutputBuffer(resource);
          toNode.addToInputBuffer(resource);
          this.progress = 0;
          this.isActive = false;
        }
      } else if (this.isActive) {
        this.progress += 20; // continue progress if already active
        if (this.progress >= 100) {
          fromNode.removeFromOutputBuffer(resource);
          toNode.addToInputBuffer(resource);
          this.progress = 0;
          this.isActive = false;
        }
      }
    },
    updateFromPort(port: PortLike) {
      this.fromPort = port;
    },
    updateToPort(port: PortLike) {
      this.toPort = port;
    },
    updateIsActive(isActive: boolean) {
      this.isActive = isActive;
    }
  }
}

const createGlobalResource = (resource: Resource, onTick: () => void): GlobalResource => {
  return {
    resource,
    quantity: 0,
    onTick
  }
}

const createFactory = (): FactoryLike => {
  return {
    isActive: false,
    nodes: {},
    connections: {},
    globalResources: {
      ore: createGlobalResource("ore", () => {
        // will be defined later
      }),
      plate: createGlobalResource("plate", () => {
        // will be defined later
      }),
    },
    tick: 0,
    onTick() {
      this.tick++;
      // call onTick on all nodes and connections
      Object.values(this.nodes).forEach(node => node.onTick());
      Object.values(this.connections).forEach(connection => connection.onTick());
      Object.values(this.globalResources).forEach(resource => resource.onTick());
    },
    getDisplayData() {
      return {
        nodes: Object.values(this.nodes).map(node => ({
          id: node.id,
          title: node.getDisplayData().title,
          content: node.getDisplayData().content
        })),
        connections: Object.values(this.connections).map(connection => ({
          id: connection.id,
          fromNodeId: connection.fromPort.nodeId,
          toNodeId: connection.toPort.nodeId,
          isActive: connection.isActive
        })),
        globalResources: Object.values(this.globalResources).map(resource => ({
          resource: resource.resource,
          quantity: resource.quantity
        }))
      }
    }
  }
}

const FactoryContext = React.createContext<FactoryLike | null>(null);

export const FactoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const factory = useMemo(() => createFactory(), []);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Factory tick");
      factory.onTick();
    }, 1000);

    return () => clearInterval(interval);
  }, [factory]);

  useEffect(() => {
    // initialize factory with nodes and connections

    console.log("Initializing factory...", factory);
    const oreNode = createNode("ore-node-1", {
      type: "ore-node",
      getBehavior() {
        // logic to generate ore every second

      }},
      factory
    );

    const furnaceNode = createNode("furnace-node-1", {
      type: "furnace",
      getBehavior() {
        // logic to process ore into plates after a delay
      }},
      factory
    );

    const storageNode = createNode("storage-node-1", {
      type: "storage",
      getBehavior() {
        // logic to count items in output buffer
      }},
      factory
    );

    factory.nodes[oreNode.id] = oreNode;
    factory.nodes[furnaceNode.id] = furnaceNode;
    factory.nodes[storageNode.id] = storageNode;

    const connection1 = createConnection("connection-1", { nodeId: oreNode.id, resource: "ore", nodeRef: oreNode }, { nodeId: furnaceNode.id, resource: "ore", nodeRef: furnaceNode });
    const connection2 = createConnection("connection-2", { nodeId: furnaceNode.id, resource: "plate", nodeRef: furnaceNode }, { nodeId: storageNode.id, resource: "plate", nodeRef: storageNode });

    factory.connections[connection1.id] = connection1;
    factory.connections[connection2.id] = connection2;

    factory.globalResources.ore.factoryRef = factory;
    factory.globalResources.ore.onTick = function() {
      // sum all ore in the system by looking at all node buffers and connections
      const totalOre = Object.values(this.factoryRef?.nodes || {}).reduce((sum, node) => {
        return sum + node.inputBuffer.filter(r => r === "ore").length + node.outputBuffer.filter(r => r === "ore").length;
      }, 0);
      this.quantity = totalOre;
    };
    factory.globalResources.plate.factoryRef = factory;
    factory.globalResources.plate.onTick = function() {
      // sum all plates in the system by looking at all node buffers and connections
      const totalPlate = Object.values(this.factoryRef?.nodes || {}).reduce((sum, node) => {
        return sum + node.inputBuffer.filter(r => r === "plate").length + node.outputBuffer.filter(r => r === "plate").length;
      }, 0);
      this.quantity = totalPlate;
    };
    factory.isActive = true;
  }, [factory]);


  return (
    <FactoryContext.Provider value={factory}>
      {children}
    </FactoryContext.Provider>
  );
}

export const useFactory = (): FactoryLike => {
  const context = useContext(FactoryContext);
  if (!context) {
    throw new Error("useFactory must be used within a FactoryProvider");
  }
  return context;
}


function FactoryCard() {
  const factory = useFactory();
  const [displayData, setDisplayData] = useState(factory.getDisplayData());

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayData(factory.getDisplayData());
    }, 1000);

    return () => clearInterval(interval);
  }, [factory]);

  return (
    <div className="factory-card">
      <h2>Factory</h2>
      <div className="nodes">
        <h3>Nodes</h3>
        {displayData.nodes.map(node => (
          <div key={node.id} className="node-card">
            <table>
              <thead>
                <tr>
                  <td>
                  {node.title}
                  </td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    {node.content}
                  </td>
                </tr>
                <tr>
                  <td>
                    <progress value={factory.nodes[node.id].machine?.progress || 0} max={100} />
                  </td>
                  <td>
                    {factory.nodes[node.id].isActive ? "Active" : "Inactive"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
      </div>
      <div className="connections">
        <h3>Connections</h3>
        {displayData.connections.map(connection => (
          <div key={connection.id} className={`connection ${connection.isActive ? "active" : ""}`}>
            {connection.fromNodeId} -> {connection.toNodeId}
          </div>
        ))}
      </div>
      <div className="global-resources">
        <h3>Global Resources</h3>
        {displayData.globalResources.map(resource => (
          <div key={resource.resource} className="global-resource">
            {resource.resource}: {resource.quantity}
          </div>
        ))}
      </div>
      <div className="tick-count">
        <h3>Tick: {factory.tick}</h3>
      </div>
    </div>
  );
}



const ChatGPTChallenge1Content: React.FC<{ className?: string }> = ({ className }) => {
  const theme = useTheme();


  return (
      <div className={`chat-gpt-challenge-1-content ${theme}`}>
      <div className={className}>

          <h1>Mini Factory Queue Simulator</h1>
          <p>Ore - Furnace - Plate - Storage</p>
          <p>___</p>
          <p>Overall Factory State:</p>
          <table>
            <tbody>
              <tr>
                <td>
                  <FactoryCard />
                </td>
              </tr>
            </tbody>
          </table>
      </div>
      </div>
  );
}

export default function ChatGPTChallenge1():React.ReactElement {


  return(
    <FactoryProvider>
      <ChatGPTChallenge1Content className="chat-gpt-challenge-1-content" />
    </FactoryProvider>
  );
}
