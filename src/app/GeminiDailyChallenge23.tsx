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

import React from 'react';

export default function GeminiDailyChallenge23() {
  return (
    <div>
      <h1>Gemini Daily Challenge 23: Inventory Merge</h1>
      <p>Check the console for the merged inventory result!</p>
    </div>
  );
}


