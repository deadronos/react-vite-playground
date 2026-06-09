/*

🚀 Day 24: The Event Debouncer (Window Resize Monitor)
Let's jump into a foundational client-side optimization pattern critical for responsive design maps, canvas engines, and game viewports: The Window Resize Event Throttler.

When a user drags the corner of a browser window, the native resize window listener fires intensely—sometimes hundreds of times a second. If your application triggers expensive coordinate calculation logic directly on that event stream, the frame rate will crater.

The Goal:
Create a dashboard panel that tracks and displays the browser's current inner width and height, but intentionally delays modifying your structural layout state until the user stops resizing the window frame for exactly 150ms.

📋 Requirements:
The Dimension Boundary State: Track the active inner dimension values inside a single unified coordinate object state:

TypeScript
const [dimensions, setDimensions] = useState({
  width: window.innerWidth,
  height: window.innerHeight
});
The Global Effect Mount: Set up a useEffect on component mount to hook a custom listener method directly onto the browser's execution thread loop:

TypeScript
window.addEventListener("resize", handleResize);
The Event Debounce Engine (The Real Challenge): Inside your listener function, do not write straight to state. Instead, utilize an internal timeout instance. Every single incoming resize pulse must immediately destroy any previously scheduled tracking timeout before spinning up a fresh 150ms wait window.

Absolute Event Isolation: Your effect block must return a meticulous cleanup routine. When the component unmounts from view, your code must completely detach the global listener (window.removeEventListener) and cleanly evict any pending background timers out of memory.

💡 Hints to get you started:
Persisting Timer Ref: To track and target the same floating timer identifier handle safely across rapid, sequential resize updates without accidentally re-triggering component re-renders, look into using a standard component ref container:

TypeScript
const timeoutRef = useRef<NodeJS.Timeout | null>(null);
Clearing the Queue: Whenever handleResize executes, clear the previous handle using if (timeoutRef.current) clearTimeout(timeoutRef.current) right before rewriting it with a fresh setTimeout tracking frame assignment.

Wire up your window event bridges, map out your metric layouts to screen labels so you can easily observe the delay loop in action, and drop your code whenever you are ready!

*/

import React, { useState, useEffect, useRef } from "react";


export default function GeminiDailyChallenge24(): React.JSX.Element {

  return (
    <div>
      <h1>Gemini Daily Challenge 24: The Event Debouncer (Window Resize Monitor)</h1>
      <p>Do an implementation of the window resize event debouncer here!</p>
      <WindowResizeMonitor />
    </div>
  );
}



function WindowResizeMonitor(): React.JSX.Element {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  function handleResize() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }, 150);
  }

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div>
      <h2>Window Resize Monitor</h2>
      <p>Current dimensions: {dimensions.width} x {dimensions.height}</p>
    </div>
  )
}
