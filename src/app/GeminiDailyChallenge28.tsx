/*

🚀 Day 28: The Accordion Matrix (Dynamic Multi-Panel Layouts)
Let's apply your structural state control patterns to a layout paradigm found across FAQ blocks, setting directories, and complex sidebar navigation trees: The Mutually Exclusive Multi-Panel Accordion Layout.

This challenge focuses on managing visibility toggles, using conditional UI compilation arrays, and enforcing interface exclusivity rules.

The Goal:
Create a vertical stack of 3 distinct informational cards. When a user clicks a panel card header title, it slides or flips open to expose its descriptive body details. Crucially, only one single panel element may remain expanded at any given moment. Expanding panel #2 must instantly trigger the absolute closure collapse of panel #1 or #3.

📋 Requirements:
The Target Dataset: Initialize an array structure containing the static text blocks inside your component sandbox:

TypeScript
const accordionData = [
  { id: "p1", title: "🔒 Security Configuration", body: "Manage TLS encryption targets and network cluster credentials." },
  { id: "p2", title: "📡 Telemetry Streams", body: "Monitor real-time event loops and microtask queue latency metrics." },
  { id: "p3", title: "💾 Storage Snapshots", body: "Configure automatic database volume allocation thresholds." }
];
The Exclusive State Anchor: Maintain a single state tracking pointer storing the unique string id of the panel that is currently open—or null if all items are completely collapsed:

TypeScript
const [activePanelId, setActivePanelId] = useState<string | null>(null);
The Toggle Logic Trigger (The Core Challenge): Clicking a panel header block must check conditions:

If the clicked item is already open, clicking it again must close it (reset state back to null).

If the clicked item is closed, it must become the newly designated target activePanelId, instantly snapping all other layouts shut.

💡 Hints to get you started:
Conditional Visibility Rendering: Use standard short-circuit evaluation operators to conditionally mount or expose your inner descriptive blocks:

TypeScript
{isOpen && <div style={{ padding: '12px' }}>{item.body}</div>}
Styling Feedback: Add contrasting borders or dynamic background highlight colors (e.g., matching your gray or dark themes) onto the active header so the user can easily distinguish the open panel at a glance.

Build out your panel layout maps, ensure your list loops maintain correct identity keys (key={item.id}), and let's watch your exclusivity engine perform. Paste your sandbox code whenever you are ready!

*/

import React, { useState } from 'react';

{/* inline CSS classes for better visualization */}
/* CSS Styling Architecture */
const stylesAccordion = `
.accordion-container {
  width: 100%;
  max-width: 600px;
  margin: 20px auto;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.accordion-item {
  border-bottom: 1px solid #333; /* Darker border for better visibility */
}

.accordion-header {
  background-color: #555; /* Darker header background */
  color: #fff; /* White text for contrast */
  padding: 15px;
  cursor: pointer;
  font-size: 18px;
}

.accordion-header.active {
  background-color: #777; /* Highlight active header */
}

.accordion-body {
  background-color: #666; /* Slightly lighter body background */
  color: #eee; /* Light text for readability */
  padding: 12px;
  font-size: 16px;
}
`;

export default function GeminiDailyChallenge28() {
  return (
    <div>
      {/* 🌟 Injection of CSS rules directly into the DOM */}
      <style>{stylesAccordion}</style>
      {/* Your Accordion Component will go here */}
      <AccordionComponent />
    </div>
  );
}



function AccordionComponent() {
  const accordionData = [
    { id: "p1", title: "🔒 Security Configuration", body: "Manage TLS encryption targets and network cluster credentials." },
    { id: "p2", title: "📡 Telemetry Streams", body: "Monitor real-time event loops and microtask queue latency metrics." },
    { id: "p3", title: "💾 Storage Snapshots", body: "Configure automatic database volume allocation thresholds." }
  ];

  const [activePanelId, setActivePanelId] = useState<string | null>(null);

  function handleClick(panelId: string) {
    setActivePanelId(prevId => (prevId === panelId ? null : panelId));
  }

  return (
    <div className="accordion-container">
      {accordionData.map(item => {
        const isOpen = activePanelId === item.id;
        return (
          <div key={item.id} className="accordion-item">
            <div
              className={`accordion-header ${isOpen ? 'active' : ''}`}
              onClick={() => handleClick(item.id)}
            >
              {item.title}
            </div>
            {isOpen && <div className="accordion-body">{item.body}</div>}
          </div>
        );
      })}
    </div>
  )
}
