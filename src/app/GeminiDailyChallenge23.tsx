/*

Welcome to Day 23 of your daily programming challenge!

Let's dive into a classic problem that will help you practice data structures, loops, and condition handling. Since we are keeping things beginner-oriented but structured, this one is all about organizing information efficiently.

The Challenge: The Inventory Merge
Imagine you are building a text-based adventure game or an idle RPG. The player has a current inventory of items, and they just defeated a boss and picked up a loot pile.

Your task is to write a function that merges the new loot into the player's existing inventory. If the player already has the item, you need to increase the quantity. If it's a new item, you need to add it to the inventory.

The Input Data
Here is how your data is structured. Each inventory is represented as an array of objects:

JavaScript
const currentInventory = [
  { name: "Iron Ore", quantity: 5 },
  { name: "Health Potion", quantity: 3 },
  { name: "Wooden Shield", quantity: 1 }
];

const lootPile = [
  { name: "Health Potion", quantity: 2 },
  { name: "Gold Coin", quantity: 100 },
  { name: "Iron Ore", quantity: 2 }
];
Your Goal
Write a function called mergeInventory(current, loot) that returns a single combined array.

For example, using the data above, your function should return:

JavaScript
[
  { name: "Iron Ore", quantity: 7 },       // 5 + 2
  { name: "Health Potion", quantity: 5 },   // 3 + 2
  { name: "Wooden Shield", quantity: 1 },   // Left as is
  { name: "Gold Coin", quantity: 100 }      // Added as new
]
Hints to Help You Out
The Naive Way: You could use nested loops (a loop inside a loop) to check every loot item against every inventory item. While fine for a beginner challenge, it can get messy.

The Smart Way (Lookup): You can use a temporary object or a Map where the key is the item's name to easily check if you've seen the item before.

Array Methods: If you are using JavaScript/TypeScript, methods like .find() or .findIndex() can help you check if an item already exists in an array.

Take your time, write out the logic, and let me know when you've got a solution or if you want to walk through the logic together!

*/

import React, { type JSX } from 'react';

export default function GeminiDailyChallenge23() {
  return (
    <div>
      <div>
        <h1>Gemini Daily Challenge 23: Inventory Merge</h1>
        <p>Check the console for the merged inventory result!</p>
      </div>
      <div>
        <InventoryMergeComponent />
      </div>
    </div>
  );
}


type Items = string;

interface InventoryItem {
  name: Items;
  quantity: number;
}

type Inventory = InventoryItem[];

function InventoryMergeComponent(): JSX.Element {
  const currentInventory: Inventory = [
    { name: "Iron Ore", quantity: 5 },
    { name: "Health Potion", quantity: 3 },
    { name: "Wooden Shield", quantity: 1 }
  ];

  const lootPile: Inventory = [
    { name: "Health Potion", quantity: 2 },
    { name: "Gold Coin", quantity: 100 },
    { name: "Iron Ore", quantity: 2 }
  ];

  function InventoryTile(item: InventoryItem) {
    return (
      <div>
        <p>{item.name}: {item.quantity}</p>
      </div>
    );
  }

  function mergeInventory(current: Inventory, loot: Inventory): Inventory {
    const inventoryMap: Record<string, number> = {};

    // Add current inventory items to the map
    current.forEach(item => {
      inventoryMap[item.name] = item.quantity;
    });

    // Merge loot items into the map
    loot.forEach(item => {
      if (inventoryMap[item.name]) {
        inventoryMap[item.name] += item.quantity; // Increase quantity if item exists
      } else {
        inventoryMap[item.name] = item.quantity; // Add new item to the map
      }
    });

    // Convert the map back to an array of InventoryItem
    const mergedInventory: Inventory = Object.keys(inventoryMap).map(name => ({
      name,
      quantity: inventoryMap[name]
    }));

    return mergedInventory;
  }

  return (
    <div>
      {/* Tiles of current inventory */}
      <h2>Current Inventory:</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
        <div style={{ backgroundColor: 'gray', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <table>
            <tbody>
            <tr>
          {currentInventory.map(item => (
            <td key={item.name} style={{ border: '3px solid black', padding: '8px' }}>
            <InventoryTile {...item} />
            </td>
            ))
          }</tr>
          </tbody>
          </table>
        </div>
      </div>
      {/* Tiles of loot pile */}
      <h2>Loot Pile:</h2>
      <div style={{  display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
        <div style={{ backgroundColor: 'gray', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <table>
            <tbody>
            <tr>
          {lootPile.map(item => (
            <td key={item.name} style={{ border: '3px solid black', padding: '8px' }}>
            <InventoryTile {...item} />
            </td>
            ))
          }</tr>
          </tbody>
          </table>
          </div>
      </div>
      {/* Merged inventory result */}
      <h2>Merged Inventory:</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ backgroundColor: 'gray', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <table>
            <tbody>
            <tr>
          {mergeInventory(currentInventory, lootPile).map(item => (
            <td key={item.name} style={{ border: '3px solid black', padding: '8px' }}>
            <InventoryTile {...item} />
            </td>
            ))
          }</tr>
          </tbody>
          </table>
          </div>
      </div>
    </div>
  )
}

