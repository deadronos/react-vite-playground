/*

4. ECS Playground (very useful for game architecture)

Make:

Entity
Component
System

Components:

Position
Velocity
Health

System:

MovementSystem

Render moving squares.

React only displays state:

entities.map(...)

Simulation runs separately.

This teaches decoupling UI from game logic.


*/

import React from 'react';


export function ChatGPTChallenge2():React.ReactElement {
  return (
    <div>
      <h1>ECS Playground</h1>
      <p>moving squares...</p>
    </div>
  );
}
