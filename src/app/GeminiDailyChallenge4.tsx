/*

Day 4: The Array Filter & Accumulator
Let's move away from strings for a bit and focus on data arrays. Managing, filtering, and performing calculations on lists of records is bread-and-butter programming—crucial for managing app inventories, game data, or user profiles.

The Goal:
Imagine you have an array of simple transaction or item objects. Your task is to write a component that displays a list of items, but only if they match a specific condition, and then calculates a total summary value at the bottom.

Let's use this mock dataset of an inventory:

TypeScript
const inventory = [
  { id: 1, name: "Energy Potion", category: "usable", cost: 15 },
  { id: 2, name: "Iron Sword", category: "equipment", cost: 50 },
  { id: 3, name: "Antidote", category: "usable", cost: 10 },
  { id: 4, name: "Steel Shield", category: "equipment", cost: 80 },
  { id: 5, name: "Health Elixir", category: "usable", cost: 25 },
];
Your component needs to:

Filter: Only display items where the category is strictly "usable".

Accumulate: Calculate the total combined cost of only those filtered items and print that sum underneath the list.

The Interactive Twist:
Add a simple button or dropdown (select menu) that lets you toggle between viewing "usable" items or "equipment" items. When toggled, both the displayed list and the calculated total cost should update dynamically!

💡 Hints to get you started:
State: You'll need a state variable to keep track of the currently selected category filter (e.g., initialized to "usable").

Array Methods: Look into the native .filter() method to narrow down your inventory list based on the active state.

The Total: Once you have the filtered array, you can use a loop or the native .reduce() method to sum up the cost properties of the remaining items.

Populate the mock data, hook up your toggle switch, and let's see how you organize this one in your Vite playground!

*/

import React, { useState, useEffect } from "react";

// mock inventory
const inventory = [
  { id: 1, name: "Energy Potion", category: "usable", cost: 15 },
  { id: 2, name: "Iron Sword", category: "equipment", cost: 50 },
  { id: 3, name: "Antidote", category: "usable", cost: 10 },
  { id: 4, name: "Steel Shield", category: "equipment", cost: 80 },
  { id: 5, name: "Health Elixir", category: "usable", cost: 25 },
];

export default function GeminiDailyChallenge4(): React.JSX.Element {

  const [filterCategory, setFilterCategory] = useState<string>("usable");

  function handleCategoryChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const selectedCategory = event.target.value;
    setFilterCategory(selectedCategory);
  };



  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">Array Filter & Accumulator</h1>
      <p>Implement the inventory filter and cost accumulator here!</p>
      <div className="category-selector" style={{marginBottom:"16px"}}>
        <label htmlFor="category-select" style={{marginRight:"8px"}}>Select Category:</label>
        <select id="category-select" value={filterCategory} onChange={handleCategoryChange}>
          <option value="unfiltered">no filter</option>
          <option value="usable">Usable</option>
          <option value="equipment">Equipment</option>
        </select>
      </div>
      <div className="inventory-container">
      {filterCategory && filterCategory !== "unfiltered" ?
      <InventoryView inventoryToDisplay={inventory.filter(item => item.category === filterCategory)} />
       :
      <InventoryView inventoryToDisplay={inventory} />}
      </div>
    </div>
  )
}

interface InventoryViewProps {
  inventoryToDisplay: typeof inventory;
}

function InventoryView({inventoryToDisplay}:InventoryViewProps): React.JSX.Element{
    let totalCost = 0;


    let accumulatedCost = 0;
    for(const item of inventoryToDisplay){
      accumulatedCost += item.cost;
    }
    totalCost = accumulatedCost;


    return (
      <div className="inventory-view">
        <table>
          <thead>
            <tr>
              <th>id</th>
              <th>Name</th>
              <th>Category</th>
              <th>Cost</th>
            </tr>
          </thead>
          <tbody>
            {inventoryToDisplay.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>{item.cost}</td>
              </tr>
             )
            )}
            <tr>
              <td colSpan={3} style={{textAlign:"right", fontWeight:"bold"}}>Total Cost:</td>
              <td style={{fontWeight:"bold"}}>{totalCost}</td>
            </tr>
          </tbody>
        </table>
      </div>

    )
  }

