/*

🚀 Day 11: The Star Rating Component (Interactive Grid States)
Let's look at a popular interactive component seen across every e-commerce engine, movie log, and service review dashboard: The Star Rating Widget.

This challenge focuses on managing interactive mouse event listeners, tracking temporary UI overrides, and using conditional execution to render active icon grids.

The Goal:
Create a compact review tracker that renders a horizontal row of 5 stars. Users can click a star to set a persistent score, or hover their mouse over the grid to preview a score before locking it in.

Requirements:

Interactive Hover Matrix: As the mouse hovers over the 3rd star, stars 1, 2, and 3 should all visually light up or fill. When the mouse leaves the widget entirely, the stars should fall back to reflecting whatever persistent rating was clicked last.

Persistent Lock Selection: Clicking on the 4th star locks that rating into place.

Reset Ability (Optional/Advanced): If a user clicks the currently selected star rating a second time, clear the score back down to 0.

💡 Hints to get you started:
Two Tracks of State: You will need two state hooks to make this work smoothly: rating (the permanently clicked score) and hoverRating (the temporary position of the cursor, initialized to null or 0).

Mouse Event Triggers: Leverage standard elements matching built-in pointer events like onMouseEnter={() => setHoverRating(index)} and onMouseLeave={() => setHoverRating(null)}.

Determining Active Highlights: When mapping through your 5 array placeholders, an individual icon should look filled/active if:
index <= (hoverRating ?? rating)

Set up your hover triggers, style the active/inactive characters (like ★ and ☆ or custom layout blocks), and let's see how you map your mouse movements in your Vite playground!

*/

import React from "react";

export default function GeminiDailyChallenge11(): React.JSX.Element {

  return (
    <div>
      <h2>Gemini Daily Challenge 11 - the star rating component (interactive grid states)</h2>
      <p>Hover over the stars to preview your rating, and click to lock it in!</p>
    </div>
  );
}
