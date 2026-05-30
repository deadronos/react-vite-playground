/*

🚀 Day 19: The Dynamic Progress Bar (Controlled Interval Stepping)
Let's look at a foundational dashboard state pattern used for media playback players, downloading managers, and multi-step forms: The Controlled State Step Interval.

This challenge focuses on controlling intervals dynamically, bounding boundary numbers, and styling visual inline element percentages.

The Goal:
Create an animated Progress Bar component that climbs from 0% to 100% when you hit a button, complete with active control mechanisms.

Requirements:

The Graphical Bar: Create a baseline status bar layout container. Inside it, render a highlighted inner bar whose width dynamically matches an active percentage state variable (e.g., style={{ width: ${progress}% }}).

The Control Trackers: Provide three interactive buttons:

Start: Initiates an interval that increases progress by 1 every 50ms.

Pause: Halts the interval ticking immediately, preserving the current state position.

Reset: Halts the interval and returns the value counter clean back to 0%.

Smart Cap Boundaries: When the bar hits exactly 100%, your code must automatically clear the background interval timer completely to prevent phantom memory background leaking.

💡 Hints to get you started:
Timer Persistence: Because your start and pause actions need to refer to the exact same running timer ID across separate button click triggers, use a useRef to store your timer instance instead of regular local function variables:

const timerRef = useRef<NodeJS.Timeout | null>(null);

Functional Boundary Safe Checks: When incrementing inside your interval loop, ensure you check your boundaries using Math.min() to keep the value from running past 100:

TypeScript
setProgress(prev => {
  if (prev >= 100) {
    clearInterval(timerRef.current!);
    return 100;
  }
  return prev + 1;
});
Set up your frame intervals, lay out your layout container tracking layers, and let's see how your state machine moves. Paste your solution whenever you're ready!

*/

import React, { useState, useRef } from 'react';
import type NodeJS from 'node:timers';

function GeminiDailyChallenge19() {
  return (
    <div>
      <h1>Gemini Daily Challenge 19: The Dynamic Progress Bar</h1>
      <p>Click "Start" to see the progress bar fill up. Use "Pause" to stop it and "Reset" to start over.</p>
      {/* Your implementation goes here */}
      <ProgressBar />
    </div>
  );
}

export default GeminiDailyChallenge19;

function ProgressBar() {
  const [progress, setProgress] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout| null>(null);

 function handleStartClick() {
  if (timerRef.current) {
    return; // Timer is already running, do nothing
  }

  timerRef.current = setInterval(() => {
    setProgress((prev) => {
      // 1. Check the absolute, freshest live state value from React
      if (prev >= 100) {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        return 100;
      }
      // 2. Otherwise, step forward safely
      return prev + 1;
    });
  }, 50);
}

  function handlePauseClick() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  function handleResetClick() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setProgress(0);
  }



  return (
    <>
      <div className="progress-bar-container" style={{ width: '100%', height: '30px', backgroundColor: '#eee', borderRadius: '5px', overflow: 'hidden' }}>
        <div className="progress-bar-fill" style={{ width: `${progress}%`, height: '100%', backgroundColor: '#76c7c0', transition: 'width 0.05s' }} />

    </div>
    <div style={{ marginTop: '10px' }}>
        <button onClick={handleStartClick}>Start</button>
        <button onClick={handlePauseClick}>Pause</button>
        <button onClick={handleResetClick}>Reset</button>
    </div>
    </>
  )
}
