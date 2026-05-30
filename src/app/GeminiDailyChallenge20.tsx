/*

🚀 Day 20: The Drag-and-Drop List Order (Reordering Array Indexes)
Let's tackle a landmark frontend interaction pattern found in Kanban task boards, media playlist managers, and custom dashboard layouts: The Linear Array Drag and Reorder Matrix.

This challenge focuses on managing complex mouse pointer state updates, capturing native browser drag hooks, and modifying state collection arrays immutably.

The Goal:
Create a compact vertical layout containing 3 static tasks. Users can click and pull an item up or down to dynamically swap its sequential placement index in the list.

Let's use this dataset of priority objectives:

TypeScript
const initialTasks = [
  "🚀 1. Complete Sandbox Dashboard",
  "🛡️ 2. Audit Security Tokens",
  "🛰️ 3. Deploy Production Clusters"
];
Requirements:

The Native Drag Setup: Map your array strings into rows. Add the HTML attribute draggable={true} and cursor styles (cursor: move) onto each row container wrapper.

The Source Index Tracker: Maintain a state variable to catch the index placement of the item the user actively picks up: const [draggedIndex, setDraggedIndex] = useState<number | null>(null);. Bind this data capture directly to the item's onDragStart={() => setDraggedIndex(index)} event hook.

The Hover Reorder Engine: When a user hovers a lifted item over another active element row in the list stack, capture that destination target's index using onDragEnter={() => handleDragEnter(index)}.

Immutable Index Swapping: Inside your drag entry handler, copy your task state array, splice out the item from draggedIndex, insert it cleanly into the new destination index, and update both the task state array and your active tracking pointer to mirror the new index layout!

💡 Hints to get you started:
The HTML Drop Blocker: Standard web elements block dropping by default. To make sure your custom onDragEnter and swap logic execute reliably, you must call e.preventDefault() inside each row container's onDragOver property.

The Splicing Blueprint:

TypeScript
const updatedList = [...tasks];
// 1. Extract the lifted item from its old position
const [removedItem] = updatedList.splice(sourceIndex, 1);
// 2. Inject it cleanly into its new target position
updatedList.splice(destinationIndex, 0, removedItem);
Attach your event attributes, structure your list item wrappers using clean borders so you can visually track your moves, and let's see how your drag-and-drop state updates. Paste your code solution whenever you are ready!

*/

import React, { useState } from 'react';

export default function GeminiDailyChallenge20() {
  return (
    <div>
      <h1>Gemini Daily Challenge 20: The Drag-and-Drop List Order</h1>
      <p>Click and drag the tasks to reorder them as you see fit!</p>
      {/* Your implementation goes here */}
      <DragAndDropList />
    </div>
  );
}


function DragAndDropList() {
  const initialTasks = [
    "🚀 1. Complete Sandbox Dashboard",
    "🛡️ 2. Audit Security Tokens",
    "🛰️ 3. Deploy Production Clusters"
  ];

  const [tasks, setTasks] = useState(initialTasks);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  function handleDragStart(index: number) {
    setDraggedIndex(index);
  }

  function preventDefault(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }

  function handleDragEnter(index: number) {
    if (draggedIndex === null || draggedIndex === index) return;

    const updatedList = [...tasks];
    const [removedItem] = updatedList.splice(draggedIndex, 1);
    updatedList.splice(index, 0, removedItem);

    setTasks(updatedList);
    setDraggedIndex(index);
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    preventDefault(e);
  }

  function handleDragEnd() {
    setDraggedIndex(null);
  }

  return (
    <div>
      {tasks.map((task, index) => (
        <div
          key={index}
          draggable={true}
          onDragStart={() => handleDragStart(index)}
          onDragEnter={() => handleDragEnter(index)}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          style={{
            border: '1px solid black',
            padding: '8px',
            marginBottom: '4px',
            cursor: 'move',
            backgroundColor: draggedIndex === index ? 'cyan' : 'white',
            color: draggedIndex === index ? '#888' : 'black'
          }}
        >
          {task}
        </div>
      ))}
    </div>
  );
}

