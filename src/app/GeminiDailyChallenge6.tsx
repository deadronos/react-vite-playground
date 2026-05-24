/*

🚀 Day 6: The Event Timer & Custom Hook (or Side Effect)
Let's venture into a pattern you'll use constantly in frontend apps and dashboards: managing continuous real-time intervals and time calculations.

The Goal:
Create a simple "Live Uptime Counter" component that tracks and displays exactly how many seconds a user has spent looking at the page since it mounted, along with an interactive control layer.

Your component needs to:

Count: Start an internal counter at 0 when the component renders, increasing by 1 every single second.

Display: Format and show that number live on the screen.

Clean Up: Ensure that if the component unmounts or changes, the background interval timer is properly cleared so it doesn't cause a memory leak.

The Interactive Twist:
Add two buttons to the UI:

A Pause / Resume button that halts the live counting without wiping out the current time spent.

A Reset button that returns the counter back to 0.

💡 Hints to get you started:
The Side Effect: React's useEffect hook is the perfect place to instantiate native browser timers like setInterval.

The Cleanup Phase: Remember that useEffect can return a cleanup function (e.g., return () => clearInterval(timer)). This is critical for preventing phantom background intervals!

Tracking State: You'll need state to track both the current tick count (in seconds) and a boolean flag determining whether the clock is actively ticking or paused.

Fire up your Vite sandbox, establish your interval, and let's see how you handle state synchronization for Day 6!

*/

import React, { useState, useEffect } from "react";



export default function GeminiDailyChallenge6():React.JSX.Element {
  const [tickCount, setTickCount] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  function toggleRunning() {
    setIsRunning((prev) => !prev);
  }

  function resetCounter() {
    setTickCount(0);
  }

  useEffect(() => {
    const timer = setInterval(() => {
      if (isRunning) {
        setTickCount((prev) => prev + 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  },[isRunning]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Gemini Daily Challenge 6: The Event Timer & Custom Hook</h1>
      <p className="mb-4">
        This component implements a live uptime counter that tracks how many seconds a user has spent on the page. It includes a pause/resume button to control the counting and a reset button to set the counter back to zero. The useEffect hook is used to manage the interval timer, ensuring it is properly cleaned up when the component unmounts or when the counting is paused.
      </p>
      <div className="mb-4">
        <span className="text-xl font-mono">{tickCount} seconds</span>
      </div>
      <div className="space-x-2">
        <button type="button" onClick={toggleRunning} className="px-4 py-2 bg-blue-500 text-white rounded">
          {isRunning? "Pause" : "Resume"}
        </button>
        <button type="reset" onClick={resetCounter} className="px-4 py-2 bg-red-500 text-white rounded">
          Reset
        </button>
      </div>
    </div>
  );
}
