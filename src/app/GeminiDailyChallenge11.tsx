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

      <ItemsDisplayComponent items={itemsToReview} />
    </div>
  );
}


const itemsToReview = [
  { id: 1, name: "Iron Ore" },
  { id: 2, name: "Copper Bar" },
  { id: 3, name: "Coal Chunk" },
  { id: 4, name: "Gold Nugget" }];

type Rating = 0 | 1 | 2 | 3 | 4 | 5;

type RatingPerItem = Record<number, Rating>;

function ItemsDisplayComponent({ items }: { items: typeof itemsToReview }): React.JSX.Element {
        // empty initially
  const [ratingPerItem, setRatingPerItem] = React.useState<RatingPerItem>({});

        // track hover before click, also empty initially
  const [hoverRatingPerItem, setHoverRatingPerItem] = React.useState<RatingPerItem>({});

 function handleHover({ e, rating, itemId }: HoverEvent) {
    let didWeEnterOrLeave = e.type === "mouseenter" ? "enter" : "leave";

    console.log(`Hover ${didWeEnterOrLeave} on item ${itemId} with rating ${rating}`);
    setHoverRatingPerItem(prev => ({ ...prev, [itemId]: rating }));
  }

  function handleClick({ itemId, rating }: ClickEvent) {
    console.log(`Clicked on item ${itemId} with rating ${rating}`);
    setRatingPerItem(prev => {
      const currentRating = prev[itemId] || 0;
      const newRating = currentRating === rating ? 0 : rating; // toggle if same rating is clicked
      return { ...prev, [itemId]: newRating };
    });
  }


  return (
    <div>
      {items.map(item => (
        <div  key={item.id}>{item.name}
          <StarRating
            itemId={item.id}
            rating={ratingPerItem[item.id] || 0}
            hoverRating={hoverRatingPerItem[item.id] || 0}
            onHover={handleHover}
            onClick={handleClick}
          />
        </div>
      ))}
    </div>
  );
}


interface StarProps {
  active: boolean;
}

function Star({ active }: StarProps): React.JSX.Element {
  return (
    <span style={{ color: active ? 'gold' : 'gray', fontSize: '24px' }}>
      {active ? '★' : '☆'}
    </span>
  );
}

interface StarRatingProps {
  rating: Rating;
  hoverRating: Rating;
  onHover: (hov:HoverEvent) => void; // for both enter and leave, we can use the same handler with different values
  onClick: (cli:ClickEvent) => void; // for locking in the rating
  itemId: number; // to identify which item is being rated, would come from parent context}
}

interface HoverEvent {
  e: React.MouseEvent<HTMLSpanElement>;
  rating: Rating;
  itemId: number; // parent should provide prop
}

interface ClickEvent {
  itemId: number; // parent should provide prop
  rating: Rating;
}

function StarRating({ rating, hoverRating, onHover, onClick, itemId }: StarRatingProps): React.JSX.Element {
  return (
    <div style={{ display: 'flex', gap: '4px' }}>
      {[1, 2, 3, 4, 5].map(index => {
        const active = index <= (hoverRating || rating);
        return (
          <span
            key={index}
            onMouseEnter={(e) => onHover({ e, rating: index as Rating, itemId: itemId })} // set hover to current index on enter
            onMouseLeave={(e) => onHover({ e, rating: 0, itemId:itemId })} // reset hover to 0 on leave
            onClick={(e) => onClick({ itemId: itemId, rating: index as Rating })} // itemId would come from context in a real implementation
          >
            <Star active={active} />
          </span>
        );
      })}
    </div>
  );
}
