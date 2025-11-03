import ECS,{ world,addBuildingEntity, addDroneEntity, type ECSWorldType } from "../world"
import {Vector3} from "three"





export const InitializeSystem = () => {
  // Initialization logic can be added here if needed
    addDroneEntity(new Vector3().set(0,0,0));
    console.debug("Added initial drone entity at (0,0,0)");
    addBuildingEntity(new Vector3().set(-10,0,0))
    addBuildingEntity(new Vector3().set(10,0,0))
    console.debug("Added initial building entities at (-10,0,0) and (10,0,0)");

    console.debug("Initialization system executed.");
  return () => {
    DeinitializeSystem();

  };
};


export default InitializeSystem;

export const DeinitializeSystem = () => {
  return () => {
    // Cleanup logic can be added here if needed
    world.clear();

    console.debug("Deinitialization system executed.");
  };
}
