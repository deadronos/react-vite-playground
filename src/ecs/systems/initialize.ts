import { addBuildingEntity, addDroneEntity, ECS,Entity } from "../world"
import {Vector3} from "three"



export const InitializeSystem = () => {
  return () => {
    // Initialization logic can be added here if needed
    addDroneEntity(new Vector3().set(0,0,0));
    console.debug("Added initial drone entity at (0,0,0)");
    addBuildingEntity(new Vector3().set(-10,0,0))
    addBuildingEntity(new Vector3().set(10,0,0))
    console.debug("Added initial building entities at (-10,0,0) and (10,0,0)");

    console.debug("Initialization system executed.");

  };
};
