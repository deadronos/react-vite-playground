/*

🚀 Day 25: The Shared Render Pipeline (Batching Multiple Canvas Views)
Now that you have mastered the client-side event debouncer and explored layout architectures, let’s combine those worlds. Let's tackle a performance optimization pattern critical for canvas dashboards, data visualizations, and game views: The Centralized Frame Ticker.

When building custom UI components (like the "Tiles" we discussed earlier) that require high-frequency updates—such as animations, particle systems, or real-time charting—giving every component its own independent requestAnimationFrame loop or setInterval will rapidly degrade performance. The browser has to manage dozens of separate scheduling cycles, resulting in micro-stutters.

Instead, production canvas engines use a Single-Ticker Multi-Receiver pattern. A centralized clock fires once per frame, and all active tiles hook into that single heartbeat.

The Goal:
Create a parent control pane that runs a single, continuous requestAnimationFrame loop. Multiple independent dashboard tiles must register themselves to this master ticker when they mount and seamlessly unregister when they unmount, allowing them to animate entirely in sync without running their own loops.

📋 Requirements:

The Registry Type Definition: Create a centralized array or map of listener callbacks that need to be executed on every frame tick:

TypeScript
type FrameListener = (timestamp: number) => void;
The Central Heartbeat: Implement a master loop inside the parent component (or via a custom hook) that drives a single requestAnimationFrame. This loop must iterate through the active registry and execute every registered tile's callback, passing the current animation timestamp.

Dynamic Subscriptions: Provide a mechanism (such as a shared React Context, a custom event bridge, or an engineered ref array) that allows child tiles to safely register their drawing logic on mount.

Absolute Lifecycle Isolation: Just like Day 24, when a tile unmounts, it must cleanly scrub itself from the master registry to prevent memory leaks or attempts to draw to absent canvas elements.

💡 Hints to get you started:
The Master Set: A mutable Set stored inside a useRef (e.g., const listenersRef = useRef<Set<FrameListener>>(new Set())) is an excellent way to store active callbacks. Adding and deleting from a Set avoids array re-allocation issues during rapid lifecycle shifts.

The Component Blueprint: Your dashboard should render at least two independent canvas tiles (e.g., Tile A: Oscillating Wave and Tile B: Rotating Indicator). Neither tile should contain a requestAnimationFrame statement inside its own component block; they should merely supply their canvas drawing logic to the master loop.

Wire up your shared heartbeat pipeline, map out your rendering tiles, and drop your code whenever you are ready to conquer Day 25!

*/


import React, { useEffect, useRef } from 'react';

export default function GeminiDailyChallenge25() {
  return (
    <div>
      <h1>Gemini Daily Challenge 25: The Shared Render Pipeline</h1>
      <p>
        This challenge focuses on creating a centralized frame ticker for multiple canvas views. The goal is to optimize performance by using a single requestAnimationFrame loop that all canvas tiles can subscribe to.
      </p>
      <p>
        Below is an implementation of the shared render pipeline using React. We will create a master ticker and two independent canvas tiles that register their drawing logic to this ticker.
      </p>

    </div>
  );
}



