import { useFrame } from '@react-three/fiber';
import { useEffect } from 'react';
import { InitializeSystem, DeinitializeSystem } from '../ecs/systems/initialize';
import { CheckMessagePendingSystem } from '@/ecs/systems/checkMessagePending';
import { MovementSystem } from '@/ecs/systems/movementDrones';
import { CheckLoadRadiusSystem } from '@/ecs/systems/checkLoadRadius';
import { ActionTimerSystem } from '@/ecs/systems/actionTimer';
import { ReturnCompletionSystem } from '@/ecs/systems/returnCompletion';






export default function DroneSystems(){

  useEffect(()=>{
    // Initialize and store cleanup function
    const cleanup = InitializeSystem();

    // return stored cleanup function
    return cleanup;
  },[]);

  useFrame((_,dt)=>{
    // Drive ecs systems here per frame
    CheckMessagePendingSystem();
    MovementSystem(dt);
    CheckLoadRadiusSystem(dt);
    ActionTimerSystem(dt);
    ReturnCompletionSystem(dt);

  });

  return (
    <>
    </>
  );
}
