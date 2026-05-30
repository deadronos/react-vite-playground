/*

🚀 Day 21: The Debounced Search Bar (Performance-Throttling Inputs)
Let's look at a critical optimization pattern required across every major application platform: Handling Input Debouncing to Protect Network Pipelines.

When a user types into a real search input, you don't want to fire a costly API database query or a heavy filter function on every single keypress. Instead, you wait for the user to pause typing for a short window before initiating the search.

The Goal:
Create a search text field that accepts real-time input but delays updating a separate "API Query Output" text value until the user completely stops typing for exactly 500ms.

Requirements:

Dual State Setup: Track two separate state variables:

searchQuery: The real-time string value synced directly to the input field text.

debouncedQuery: The delayed query target string that updates only after a delay window.

The Timing Loop: Use a useEffect hooked up to monitor modifications to searchQuery. Every time the user types a new character, your code must clear any pre-existing, active timeout and establish a fresh setTimeout delay window.

The Cleanup Execution (The Real Challenge): Ensure your effect block implements a proper lifecycle cleanup function to erase your active timer ID. If a user types 5 characters in rapid succession, 4 pending timer tasks should be aborted instantly, leaving only the final character update to execute.

💡 Hints to get you started:
The Return Cleanup Recipe: Inside a standard useEffect, returning a function block instructs React to run that block before applying the next effect pass, which is the perfect place to clean up lingering timers:

TypeScript
useEffect(() => {
  const handler = setTimeout(() => {
    setDebouncedQuery(searchQuery);
  }, 500);

  return () => {
    clearTimeout(handler); // Aborts the timer if searchQuery changes before 500ms!
  };
}, [searchQuery]);
Set up your text input fields, declare your rendering labels below it to display both live and debounced values side-by-side, and let's watch your event loop synchronize. Paste your solution whenever you're ready!

*/


import React from "react";
import { useState, useEffect } from "react";

export default function GeminiDailyChallenge21() {
  return (
    <div>
      <h1>Gemini Daily Challenge 21: The Debounced Search Bar</h1>
      <p>Type into the search box and watch the debounced query update after you stop typing for 500ms.</p>
      {/* Your implementation goes here */}
      <DebouncedSearchBar />
    </div>
  );
}

function DebouncedSearchBar() {

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [apiResults, setAPIResults] = useState<string[]>([]);

  useEffect(()=> {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => {
      clearTimeout(handler);
    }
  }, [searchQuery])

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchQuery(event.target.value);
  }

  useEffect(() => {
    if (!debouncedQuery) {
      setAPIResults([]);
      return;
    }

    let isCurrentRequest = true;

    MockAPISearch.search(debouncedQuery).then(results => {
      if (isCurrentRequest) {
        setAPIResults(results);
      }
    })
    .catch(error => {
      console.error("API Search Error:", error);
    });

    return () => {
      isCurrentRequest = false;
    };
  }, [debouncedQuery]);

  return (
    <div>
      <input type="text" placeholder="Search..." onChange={handleInputChange} />
      <p>Debounced Query: {debouncedQuery}</p>
      <ul>
        {apiResults.map((result, index) => (
          <li key={index}>{result}</li>
        ))}
      </ul>
    </div>
  )
}


class MockAPISearch {
  static MockResults = [
    "Result 1",
    "Result 2",
    "Result 3",
    "Result 4",
    "Result 5"
  ];

  static PickRandomResult(): string {
    const randomIndex = Math.floor(Math.random() * this.MockResults.length);
    return this.MockResults[randomIndex];
  }
  static search(query: string): Promise<string[]> {
    console.log(`API Search Triggered for query: "${query}"`);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([`Result for "${query}"`+ MockAPISearch.PickRandomResult()]);
      }, 1000); // Simulate network delay
    });
  }
}
