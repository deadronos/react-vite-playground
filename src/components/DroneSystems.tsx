import { useFrame } from '@react-three/fiber';
import { useEffect } from 'react';
import { InitializeSystem, DeinitializeSystem } from '../ecs/systems/initialize';






export default function DroneSystems(){

  useEffect(()=>{
    // Initialize ECS systems here if needed
    InitializeSystem();

    return ()=>{
      // Cleanup ECS systems here if needed
      DeinitializeSystem();
    };
  },[]); // run only once on mount

  useFrame((_,dt)=>{
    // Drive ecs systems here per frame


  });

  return (
    <>
    </>
  );
}
