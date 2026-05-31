/*

🚀 Day 22: The Infinite Scroll Simulator (Window Intersection Observer)
Let's look at an architectural data pattern required across modern social media timelines, infinite product inventory feeds, and asset logging dashboards: The Dynamic Intersection Scroll Sentinel.

Instead of downloading thousands of data records up front, apps track layout element visibility to load additional records dynamically on demand as the user scrolls down the page context bounds.

The Goal:
Create a scrollable layout container tracking elements that automatically appends more mock elements whenever the user scrolls to the absolute bottom boundary track.

Requirements:

The Mock Feed State: Initialize an array state containing 10 boilerplate item strings (e.g., ["Item 1", "Item 2", ..., "Item 10"]).

The Layout Boundary: Wrap your feed layout elements inside a fixed container box set to limit height and enable overflow scroll tracking via inline styling variables:

TypeScript
style={{ maxHeight: '300px', overflowY: 'scroll', border: '1px solid #444' }}
The Sensor Node (The Sentinel): Place an empty, designated anchor container immediately below your mapped list output lines inside the scroll tracker container wrapper:

JavaScript
<div ref={sentinelRef} style={{ height: "10px", backgroundColor: "transparent" }} />
The Native Intersection Hook (The Real Challenge): Inside a useEffect, initialize a native browser IntersectionObserver instance that tracks that sentinelRef pointer. When the node crosses the visibility threshhold into view, mock a 300ms data loading delay, and append 5 more list rows onto your tracking state collection array!

💡 Hints to get you started:
The Intersection Engine Structure: Your window hook should construct an observer instance that fires its logic callback function based on intersecting element target boolean triggers:

TypeScript
const observer = new IntersectionObserver((entries) => {
  const [entry] = entries;
  if (entry.isIntersecting) {
    // Execute item pagination logic here!
  }
}, { threshold: 0.1 });
Binding Life Cycle Cleanup: Don't let your sensors leave dead event observers listening behind the scenes. Attach the sensor ref targets on creation, and disconnect your entire active observer matrix when the viewport unmounts:

TypeScript
if (sentinelRef.current) observer.observe(sentinelRef.current);
return () => observer.disconnect();
Set up your text list arrays, anchor your bottom target node pointer using a standard React useRef, and let's watch your scroll engine paginate smoothly. Paste your solution code whenever you are ready!

*/


import React, { useEffect, useRef, useState } from "react";

export default function GeminiDailyChallenge22() {
  return (
    <div>
      <h2>Gemini Daily Challenge 22 - the infinite scroll simulator (window intersection observer)</h2>
      <p>Implement the infinite scroll simulator challenge here!</p>
      <InfiniteScrollSimulator />
    </div>
  );
}


const MockFeedInitial = Array.from({ length: 10 }, (_, i) => `Item ${i + 1}`);

function InfiniteScrollSimulator() {

  const [feedItems, setFeedItems] = useState(MockFeedInitial);
  const [isLoading, setIsLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // create observer
  useEffect(()=> {
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        // simulate loading delay
        setIsLoading(true);
        setTimeout(() => {
          setFeedItems((prev) => {
            const nextItems = Array.from({ length: 5 }, (_, i) => `Item ${prev.length + i + 1}`);
            return [...prev, ...nextItems];
          });
          setIsLoading(false);
        }, 300);
      }
    }, { threshold: 0.1 });

    if (sentinelRef.current) observer.observe(sentinelRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="infinite-scroll-simulator">
      <div className="scroll-container"style={{ maxHeight: '300px', overflowY: 'scroll', border: '1px solid #444' }}>
        {feedItems.map((item, index) => (
          <div key={index} className="feed-item" style={{ padding: "8px", borderBottom: "1px solid #ccc" }}>
            {item}
          </div>
        ))}
        {isLoading && <div className="loading" style={{ padding: "8px", textAlign: "center" }}>Loading...</div>}
        <div className="sentinel" ref={sentinelRef} style={{ height: "10px", backgroundColor: "transparent" }} />
      </div>
    </div>
  )

}
