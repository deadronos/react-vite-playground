/*

🚀 Day 5: The Object Transformer & Key Mapper
Since you are comfortably handling arrays of objects and working with state, let's look at an essential skill for front-end engineers: data normalization and formatting.

Often, APIs return keys or formats that are raw, hard to read, or mismatched with what your UI actually needs. Your task today is to take a raw dataset and transform its structure before displaying it.

The Goal:
Imagine an API hands you an array of user data profiles. The keys are poorly formatted, timestamps are raw numbers, and names are separated into first and last strings.

Write a component that maps over this raw array and transforms each record into a clean UI-ready format:

TypeScript
// The raw data from the server
const rawUsers = [
  { user_id: 101, first_name: "alex", last_name: "mercer", registered_epoch: 1716501600000, is_active: true },
  { user_id: 102, first_name: "sarah", last_name: "connor", registered_epoch: 1716588000000, is_active: false },
  { user_id: 103, first_name: "bruce", last_name: "wayne", registered_epoch: 1716674400000, is_active: true },
];
Your component needs to process this list so that the rendered table displays:

Full Name: Combines first_name and last_name into a single, clean title-cased string (e.g., "Alex Mercer"). Feel free to reuse your Day 3 capitalization logic here!

Readable Date: Converts the registered_epoch timestamp into a readable date string (like MM/DD/YYYY or using JavaScript's .toLocaleDateString()).

Status Badge: Displays a clean string or badge for is_active (e.g., "Active" or "Inactive") instead of a raw boolean.

The Advanced Edge (Optional):
Try to separate the data transformation logic into its own pure function transformUserData(data) outside of the React component, so the component only has to handle rendering the clean data.

💡 Hints to get you started:
The Array Method: The native .map() method is perfect for transforming one array of objects into a brand new array of objects with a different shape.

Dates: You can feed a Unix epoch timestamp in milliseconds directly into the JavaScript Date constructor: new Date(timestamp).

Populate the raw data, run it through your transformer function, and let's see how your clean table turns out!

*/


import React from "react";

export default function GeminiDailyChallenge5(): React.JSX.Element {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">Object Transformer & Key Mapper</h1>
      <p>Implement the object transformer and key mapper here!</p>
    </div>
  );
}
