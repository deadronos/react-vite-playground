/*

🚀 Day 34: The Game Loop Matrix Tick (Real-Time Grid Agent Animation)
Let's use that global TickProvider mechanism you constructed to turn this calculation loop into a fully functional visual animation.

Instead of treating pathfinding as a single instantaneous while block running on mount, you are going to calculate the discrete coordinates path array once, and then use your clock ticks to march an active drone agent across the screen cell by cell!

📋 Requirements
The Comprehensive Coordinate Tracker: Update your pathfinding function to return the full ordered array of step coordinates from start to finish, rather than just the final number.

TypeScript
// Expected output format from your updated pathfinder:
const plannedPath = [{row: 0, col: 0}, {row: 0, col: 1}, {row: 1, col: 1}, {row: 2, col: 1}, {row: 2, col: 2}];
Tip: To get the full path in a standard BFS, your queue needs to store the history of nodes visited to get to that point, for example: queue.push({ row: newRow, col: newCol, path: [...current.path, {row: newRow, col: newCol}] }).

The Animation Loop Sync Engine: Inside NavigationGridComponent, run your pathfinder once inside a useMemo to extract your plannedPath array.

The Step Pointer State: Create a state variable tracking which step index the drone is currently occupying:

TypeScript
const [currentStepIndex, setCurrentStepIndex] = useState(0);
The Chrono-March Effect: Use a useEffect hooked up to your global tick value. Every time the tick increments, increase currentStepIndex by 1—clamping it cleanly if it hits the end of the plannedPath array so it doesn't try to look up non-existent coordinates.

The Drone Render Layer: Update your RenderGrid component. If a cell matches the coordinates of plannedPath[currentStepIndex], color it a vibrant blue to indicate the active drone is processing that position!

💡 Hints to Get You Started
Reconstructing the Full Path: Modify the object shape inside your BFS queue to maintain the full historical tracking breadcrumbs:

TypeScript
// Initial Queue state:
const queue: { row: number; col: number; path: Coordinate[] }[] = [
  { row: start.row, col: start.col, path: [start] }
];
When you hit your target destination check condition, simply return current.path instead of current.steps!

Simulation Control: Add a small HTML action button right underneath your tick display labeled "🔄 Reboot Drone Run". Clicking it should immediately reset currentStepIndex back to 0 so you can watch the agent run the matrix again.

Set up your path tracker history arrays, bind your rendering tile parameters to your active step index pointer, and let's watch the drone navigate your room matrix in real time. Paste your updated component code whenever you are ready!

*/


import React, {useState, useEffect, useContext, useMemo} from "react";

export default function GeminiDailyChallenge34(): React.JSX.Element {

  return (
    <div>
      <h2>Gemini Daily Challenge 34 - the game loop matrix tick (real-time grid agent animation)</h2>
      {/* Your implementation of the BFS pathfinding algorithm with animation goes here */}
      <TickProvider> {/* This provider will manage the tick state for your BFS visualization */ }
        <NavigationGridComponent grid={navigationGrid} startPoint={startPoint} endPoint={endPoint} />
      </TickProvider>
    </div>
  );
}

type Coordinate = {
  row: number;
  col: number;
};

type Grid = number[][];

type MapGrid = {
  grid: Grid;
};

const navigationGrid: Grid = [
  [0, 0, 1, 0],
  [0, 1, 0, 0],
  [0, 0, 0, 1],
  [1, 0, 0, 0]
];

const startPoint: Coordinate = { row: 0, col: 0 };
const endPoint: Coordinate = { row: 2, col: 2 };

