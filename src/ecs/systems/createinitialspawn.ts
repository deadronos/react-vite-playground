import * as THREE from 'three';
import ECS, { createEntity, createPlatform, createTurret } from '../ecs';
import { queries } from '../ecs';


/* Initial Spawn System: Creates initial entities in the world
*  Spawns turrets and asteroids at predefined positions.
*/


export default function CreateInitialSpawnSystem() {
  const { platforms } = queries;



  // Check if there are already turrets and asteroids spawned
  const existingTurrets = ECS.world.with("turret").entities;
  const existingPlatforms = platforms.entities;

  // create first platform matching groundcircle in mainscene
  if(existingPlatforms.length === 0) {
    createEntity(createPlatform(new THREE.Vector3(0, -1, 0)));
  }
  // spawn 2 turrets if none exist on either side of the platform
  if (existingTurrets.length === 0) {
    createEntity(createTurret(new THREE.Vector3(-5, -0.5, 0)));
    createEntity(createTurret(new THREE.Vector3(5, -0.5, 0)));
  }

  console.log('Initial spawn system executed. Turrets and platform created.');


  return (
    null
  );
}

