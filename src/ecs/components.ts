export type ItemType ='iron_ore' |
                      'copper_ore' |
                      'coal' |
                      'iron_plate' |
                      'copper_plate' |
                      'iron_gear' |
                      'copper_wire' |
                      'circuit_board' |
                      'motor'

export interface Position {
  x: number
  y: number
}

export interface Velocity {
  vx: number
  vy: number
}

export interface ResourceNode {
  resourceType: ItemType; // eg 'iron_ore', 'copper_ore', etc.
  amountRemaining: number; // amount of resource left
  depletionRate: number; // rate at which resource depletes per extraction
  replenishRate?: number; // rate at which resource replenishes over time
}

export interface InventoryItem {
  itemType: ItemType; // type of item
  quantity: number; // quantity of the item
}

export interface Inventory {
  items: Map<ItemType, number>; // map of item types to their quantities
  capacity: number; // maximum capacity of the inventory
}

export interface Building {
  id: number; // unique identifier for the building
  name: string; // human-readable name of the building
  type: 'extractor'|
        'smelter'|
        'assembler'|
        'storage'|
        'dronedock'|
        'coal_generator'|
        'solar_panel'|
        'battery'|
        'converyor_belt'; // type of building
  range?: number; // operational range for buildings like extractor
  enabled?: boolean; // whether the building is active
  messageLog?: Message[]; // log of messages related to the building
  messagePending: Message |null;
  //Optional:
  targetResource?: ItemType; // for extractors: type of resource to extract
}

export interface Extractor {
  extractionRate: number; // amount of resource extracted per time unit
  outputRate?: number; // amount of processed resource output per time unit
  resourceType: ItemType; // type of resource being extracted
  outputInventory: Inventory; // inventory for output items
}

export interface Smelter {
  id: number; // unique identifier for the smelter
  name: string; // human-readable name of the smelter
  recipe: SmelterRecipe; // smelting recipe used by the smelter
  progress?: number; // current progress of the smelting process
  inputInventory: Inventory; // inventory for input items
  outputInventory: Inventory; // inventory for output items
}

export interface SmelterRecipe {
  id: number; // unique identifier for the recipe
  name: string; // human-readable name of the recipe
  input: ItemType; // type of input item
  inputQuantity: number; // quantity of input item required
  output: ItemType; // type of output item
  outputQuantity: number; // quantity of output item produced
  processingTime: number; // time required to process the recipe
}

export interface Assembler {
  id: number; // unique identifier for the assembler
  name: string; // human-readable name of the assembler
  recipe: AssemblerRecipe; // assembly recipe used by the assembler
  progress?: number; // current progress of the assembly process
  inputInventory: Inventory; // inventory for input items
  outputInventory: Inventory; // inventory for output items
}

export interface AssemblerRecipe {
  id: number; // unique identifier for the recipe
  name: string; // human-readable name of the recipe
  inputs: Map<ItemType,number>; // array of input items and their quantities
  output: ItemType; // type of output item
  outputQuantity: number; // quantity of output item produced
  processingTime: number; // time required to process the recipe
}

export interface Power {
  energyStored: number; // current stored energy
  capacity: number; // maximum energy capacity
  productionRate?: number; // energy production rate per time unit
  consumptionRate?: number; // energy consumption rate per time unit
  consumptionItem?: ItemType; // item type consumed for energy (if applicable)
}

export interface Drone {
  id: number; // unique identifier for the drone
  name: string; // human-readable name of the drone
  charge: number; // current charge level of the drone
  dischargeRate: number; // rate at which the drone discharges energy
  maxCharge: number; // maximum charge capacity of the drone
  speed: number; // movement speed of the drone
  targetEntityId?: string|null; // ID of the target entity for the drone
  targetPosition?: Position|null; // target position for the drone
  carrying?: DroneCargo|null;
  aiState?: string|null; // current AI state of the drone
}

export interface DroneCargo {
  items: InventoryItem[]; // items being carried by the drone
  message?: Message; // optional message associated with the cargo
  maxCapacity: number; // maximum capacity of the drone's cargo
}

export interface Storage {
  inventory: Inventory; // inventory of the storage building
}

export interface ConveyorBelt {
  speed: number; // speed of the conveyor belt
  direction: 'north' | 'south' | 'east' | 'west'; // direction of movement
  inventory: Inventory; // items currently on the conveyor belt
}

export interface CoalGenerator extends Power {
  consumptionItem: 'coal'; // item type consumed for energy
  productionRate: number; // energy production rate per time unit
  fuelInventory: Inventory; // inventory for coal fuel
}

export interface SolarPanel extends Power {
  productionRate: number; // energy production rate per time unit
  // Solar panels generate power based on time of day, no additional properties needed
}

export interface Battery extends Power {
  capacity: number; // maximum energy capacity
  // Batteries store and provide power, no additional properties needed
}

export interface DroneDock extends Battery {
  dockedDrones: number[]; // array of drone IDs currently docked
  maxdocked: number; // maximum capacity of drones that can be docked
  chargingRate: number; // rate at which drones are charged while docked
  capacity: number; // maximum energy capacity
}

export interface Message {
  text: string; // message text
  fromEntityId?: string; // ID of the entity sending the message
  toEntityId?: string; // ID of the entity receiving the message
  createdAt?: number; // timestamp of message creation
}

export interface EntityMeta {
  id?: number; // unique identifier for the entity
  name?: string; // human-readable name of the entity
  createdAt?: number; // timestamp of entity creation
  updatedAt?: number; // timestamp of last entity update
}

export type EntityPartial =Partial<Position>&
                     Partial<Velocity>&
                     Partial<ResourceNode>&
                     Partial<Building>&
                     Partial<Extractor>&
                     Partial<Smelter>&
                     Partial<Assembler>&
                     Partial<Power> &
                     Partial<Drone> &
                     Partial<Storage> &
                     Partial<ConveyorBelt> &
                     Partial<CoalGenerator> &
                     Partial<SolarPanel> &
                     Partial<Battery> &
                     Partial<DroneDock> &
                     Partial<EntityMeta>;

export type Entity= {
  id: number; // ensure every entity has an id
  components?: EntityPartial
}






