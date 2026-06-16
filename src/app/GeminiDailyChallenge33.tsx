/*

🚀 Day 33: The Discrete Grid Pathfinding Step (Breadth-First Search)
Let's combine your coordinate tracking and spatial checking skills to tackle one of the most famous and fundamental algorithms in game design, automation logistics, and network routing: A Discrete 2D Grid Pathfinding Search (BFS).

Imagine your voxel ship needs to deploy an auto-mining drone across a flat, checkered coordinate room grid map. Some squares are open pathways, while others contain solid rocky debris barriers. Your goal is to find the absolute shortest sequence of coordinate movements from a Start square to a Target square.

📋 Requirements
The Grid Map Matrix: Initialize a 2D matrix representing a 4x4 room layout map grid. Use 0 for an open space and 1 for an impassable solid obstacle:

TypeScript
// 0 = Walkable path, 1 = Solid debris block
const navigationGrid = [
  [0, 0, 1, 0],
  [0, 1, 0, 0],
  [0, 0, 0, 1],
  [1, 0, 0, 0]
];
The Coordinates Struct: Define the start and target points using index row/column coordinates:

TypeScript
const startPoint = { row: 0, col: 0 };
const endPoint = { row: 2, col: 2 };
The BFS Path-Finder Engine (The True Milestone Challenge): Write a function called findShortestPathDistance(grid, start, end): number | null.

It should evaluate neighbor cells in the 4 cardinal directions (Up, Down, Left, Right).

It should return the minimum number of step movements required to reach the target cleanly, or null if the path is entirely blocked off by solid 1 squares.

💡 Hints to Get You Started
The Queue Frontier Pattern: Breadth-First Search uses a basic array acting as a FIFO (First-In, First-Out) queue to expand outward evenly like a ripple in water. Store the coordinate along with its current step count:

TypeScript
const queue: [{ row: number, col: number, steps: number }] = [
  { row: start.row, col: start.col, steps: 0 }
];
The Visited Guard Ledger: To prevent your loop from getting trapped running around in circles forever, create a tracking mechanism (like a Set of stringified values like "0,0") to remember cells you have already explored.

The Processing Loop: While the queue has items, pull the front one out (.shift()). If its coordinates match the target, return its steps count immediately! Otherwise, look at its neighbors, check if they are within grid bounds and equal to 0, and push them into the queue with a step count of steps + 1.

Render the grid on your display using separate block squares (e.g., green for start, red for target, dark gray for obstacles), print the final steps metric clearly onto your dashboard, and drop your solution file whenever you're ready to calculate the path!

*/

import React, {useState, useEffect, useContext, useMemo} from "react";

export default function GeminiDailyChallenge33(): React.JSX.Element {

  return (
    <div>
      <h2>Gemini Daily Challenge 33 - the discrete grid pathfinding step (breadth-first search)</h2>
      {/* Your implementation of the BFS pathfinding algorithm goes here */}
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

// 0 represents a walkable path, 1 represents a solid debris block
type MapGrid = {
  grid: Grid
}

const navigationGrid: Grid = [
  [0, 0, 1, 0],
  [0, 1, 0, 0],
  [0, 0, 0, 1],
  [1, 0, 0, 0]
];

const startPoint: Coordinate = { row: 0, col: 0 };
const endPoint: Coordinate = { row: 2, col: 2 };


function NavigationGridComponent({grid, startPoint, endPoint}: {grid: Grid, startPoint: Coordinate, endPoint: Coordinate}): React.JSX.Element {
  const [initialMap, setInitialMap] = useState<MapGrid>({ grid });
  const [currentPosition, setCurrentPosition] = useState<Coordinate>(startPoint);
  const [currentEndPoint, setCurrentEndPoint] = useState<Coordinate>(endPoint);
  const tick = useTick();
  const pathFinder = useMemo(() => new BFSPathFinder(initialMap.grid, currentPosition, currentEndPoint), [initialMap, currentPosition, currentEndPoint]);



  useEffect(() => {
    // This effect could be used to trigger the BFS algorithm and update the grid visualization based on the current tick
    // For example, you could run the BFS step by step and update the grid state to show the pathfinding process
      const distance = pathFinder.findShortestPathDistance();
      console.log(`Current Tick: ${tick}, Distance from Start to End: ${distance}`);


  }, [tick, pathFinder]);

  return (
    <div>
      {/* Render the grid here, using different colors or symbols for walkable paths, obstacles, start, and end points */}
      <RenderGrid grid={initialMap.grid} startPoint={startPoint} endPoint={currentEndPoint} />
      <p>Current Tick: {tick}</p>
    </div>
  )
}


function RenderGrid({grid, startPoint, endPoint}: {grid: Grid, startPoint: Coordinate, endPoint: Coordinate}): React.JSX.Element {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${grid[0].length}, 40px)`, gap: '2px' }}>
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          let backgroundColor = cell === 1 ? 'darkgray' : 'lightgray'; // Obstacle vs walkable
          if (rowIndex === startPoint.row && colIndex === startPoint.col) {
            backgroundColor = 'green'; // Start point
          } else if (rowIndex === endPoint.row && colIndex === endPoint.col) {
            backgroundColor = 'red'; // End point
          }
          return <div key={`${rowIndex}-${colIndex}`} style={{ width: '40px', height: '40px', backgroundColor }} />;
        })
      )}
    </div>
  );
}

const TickContext = React.createContext<number>(0);



function useTick(): number {
  return useContext(TickContext);
}

function TickProvider( {children}: {children: React.ReactNode}): React.JSX.Element {

  const [tick, setTick] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick(prev => prev + 1);
    }, 1000); // Increment tick every second

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <TickContext.Provider value={tick}>
      {children}
    </TickContext.Provider>
  );
}



class BFSPathFinder {
  grid: Grid;
  start: Coordinate;
  end: Coordinate;

  constructor(grid: Grid, start: Coordinate, end: Coordinate) {
    this.grid = grid;
    this.start = start;
    this.end = end;
  }

  findShortestPathDistance(): number | null {
    const queue: { row: number; col: number; steps: number }[] = [
      { row: this.start.row, col: this.start.col, steps: 0 }
    ];
    const visited = new Set<string>();
    visited.add(`${this.start.row},${this.start.col}`);

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (current.row === this.end.row && current.col === this.end.col) {
        return current.steps; // Found the target
      }

      // Explore neighbors (Up, Down, Left, Right)
      const directions = [
        { rowOffset: -1, colOffset: 0 }, // Up
        { rowOffset: 1, colOffset: 0 },  // Down
        { rowOffset: 0, colOffset: -1 }, // Left
        { rowOffset: 0, colOffset: 1 }   // Right
      ];

      for (const { rowOffset, colOffset } of directions) {
        const newRow = current.row + rowOffset;
        const newCol = current.col + colOffset;

        // Check bounds and if the cell is walkable
        if (
          newRow >= 0 && newRow < this.grid.length &&
          newCol >= 0 && newCol < this.grid[0].length &&
          this.grid[newRow][newCol] === 0 &&
          !visited.has(`${newRow},${newCol}`)
        ) {
          visited.add(`${newRow},${newCol}`);
          queue.push({ row: newRow, col: newCol, steps: current.steps + 1 });
        }
      }
    }

    return null; // No path found
  }
}
