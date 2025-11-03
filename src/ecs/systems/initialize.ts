import ECS,{ world,addBuildingEntity, addDroneEntity, type ECSWorldType, resetWorld } from "../world"
import {Vector3} from "three"



/**
 * Initialize the ECS world with default entities.
 * @returns DeinitializeSystem for cleanup
 */

export const InitializeSystem = () => {
  // Initialization logic can be added here if needed
    addDroneEntity(new Vector3().set(0,0,0));
    console.debug("Added initial drone entity at (0,0,0)");
    addBuildingEntity(new Vector3().set(-10,0,0))
    addBuildingEntity(new Vector3().set(10,0,0))
    console.debug("Added initial building entities at (-10,0,0) and (10,0,0)");

    console.debug("Initialization system executed.");

    // Return cleanup function
  return DeinitializeSystem;
};


export default InitializeSystem;

export const DeinitializeSystem = () => {
  // Replace with a fresh world instance for cleanup
  const prevCount = (world as any)?.entities?.length ?? 0;
  console.debug(`Deinitializing world. Previous world had ~${prevCount} entities (approx).`);
  resetWorld();
  console.debug("Deinitialization system executed and world reset.");
}
