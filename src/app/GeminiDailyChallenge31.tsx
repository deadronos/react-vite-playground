/*

🚀 Day 31: The Matrix Multiplier (Mathematical Memory Grid Mapping)
Let's venture into computational math and multi-dimensional tracking structures. This problem is a foundational step for graphics rendering pipelines, procedurally generated voxel coordinates, or gaming combat multiplier matrices!

The Goal
Write a calculation utility function that takes a complex 2D grid matrix of numbers (an array containing nested row arrays) and multiplies every index element inside it by a dynamic, variable scalar number—returning a completely new, immutable copy of the transformed grid structure.

📋 Requirements
The Base Grid Array: Initialize a static grid structure layout inside your component playground workspace representing rows and columns:

TypeScript
const initialMatrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];
The Multiplier State Input: Create an interactive state variable tracking the active scale factor, hooked up to an HTML number input field (default value = 2):

TypeScript
const [multiplier, setMultiplier] = useState(2);
The Immutable Matrix Mapper (The Real Challenge): Write a pure function called scaleMatrix(matrix: number[][], factor: number): number[][].

It must use a nested looping pattern (like .map() inside .map()) to target every inner number element.

Crucial Memory Safety: It must return a brand-new top-level array and brand-new row array instances. Simply mapping the top layer ([...matrix]) will pass references to the old rows, breaking immutable data design guidelines!

💡 Hints to Get You Started
The Nested Map Recipe: When processing multi-dimensional tracking setups, mapping a level downward clones your values cleanly if they are primitive integers:

TypeScript
const transformation = matrix.map(row =>
  row.map(value => value * factor)
);
Visual Layout Mapping: To render the numbers like a real grid block on your screen without resorting to messy tables, utilize CSS Flexbox rows or a neat CSS Grid matrix:

CSS
.matrix-grid {
  display: grid;
  grid-template-columns: repeat(3, 40px);
  gap: 8px;
  font-family: monospace;
}
Build out your scaling matrix math, wire your nested array maps safely to protect background references, and paste your sandbox file whenever you are ready!

*/


import React, { useState } from 'react';

export default function GeminiDailyChallenge31() {
  return (
    <div>
      <h1>Gemini Daily Challenge 31: The Matrix Multiplier</h1>
      <p>Write a calculation utility function that takes a complex 2D grid matrix of numbers and multiplies every index element inside it by a dynamic, variable scalar number—returning a completely new, immutable copy of the transformed grid structure.</p>

    </div>
  );
}
