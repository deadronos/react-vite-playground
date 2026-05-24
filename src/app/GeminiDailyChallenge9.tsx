/**
 🚀 Day 9: The Accordion Component (Managing Derived & Shared UI States)
Let's look at a foundational UI pattern used across every landing page, FAQ section, and complex settings board on the web: The Accordion List.

This challenge focuses on structural UI layout, conditional rendering, and deciding whether state should be scoped inside a child component or lifted to control a group.

The Goal:
Create a menu composed of multiple section elements. Clicking a section's title header expands its block to reveal hidden descriptive body text beneath it.

Let's use this mock dataset of FAQ items:

TypeScript
const faqData = [
  { id: 1, title: "What is an Incremental Game?", content: "A game focused on numbers growing larger via automated resource accumulation loops." },
  { id: 2, title: "What is React's Virtual DOM?", content: "A lightweight programmatic copy of the real DOM used to batch and optimize UI paint updates." },
  { id: 3, title: "Why is State Immutability important?", content: "It guarantees predictable render lifecycles and clear dependency matching for side effects." },
];
The Twist — Choose Your Mode:
You can build this accordion in one of two configurations. Pick the one you want to practice:

Independent Mode (Simpler): Multiple sections can be open at the exact same time. Clicking a header simply toggles its own local open/close visibility state.

Exclusive Single Mode (Advanced): Only one section can be open at a single time. Opening section #2 automatically collapses section #1. (Hint: This requires "lifting" the active item's ID state up to the parent container component).

💡 Hints to get you started:
For Independent Mode: Each accordion row item component can just maintain a standalone boolean isOpen state flag.

For Exclusive Mode: The parent component should track const [openId, setOpenId] = useState<number | null>(null). Pass down whether a row is open (task.id === openId) as a boolean prop alongside a trigger callback!

Map out the layout, apply your display styles, and let's see which architectural mode you choose to implement in your Vite sandbox!

 */


import React, {useEffect, useState} from "react";
type AccordionMode = "independent" | "exclusive";

const faqData = [
    { id: 1, title: "What is an Incremental Game?", content: "A game focused on numbers growing larger via automated resource accumulation loops." },
    { id: 2, title: "What is React's Virtual DOM?", content: "A lightweight programmatic copy of the real DOM used to batch and optimize UI paint updates." },
    { id: 3, title: "Why is State Immutability important?", content: "It guarantees predictable render lifecycles and clear dependency matching for side effects." },
  ];


export default function GeminiDailyChallenge9() {
  const [mode, setMode] = useState<AccordionMode>("independent");
  const [forceRender, setForceRender] = React.useState(0); // State to trigger re-render
  const [openId, setOpenId] = useState<number | null>(null); // State to track the currently open section in exclusive mode

  function handleCallBack(id: number) {
    console.log(`Toggled section with ID: ${id}`);
  }

  useEffect(()=>{
    // This effect runs whenever the mode changes
    console.log(`Mode changed to: ${mode}`);
  },[mode])

  return (
    <div>
      <h1>Gemini Daily Challenge 9: The Accordion Component</h1>
      <p>Choose your mode: Independent or Exclusive Single. Implement the accordion component using the provided FAQ data.</p>
      {/* Your implementation goes here */}
      <ModePicker mode={mode} setMode={setMode} />
      {/* Render the accordion based on the selected mode */}
      {mode === "independent" && faqData.map(item => (
        <AccordionItem
          key={item.id

          }
          id={item.id}
          title={item.title}
          content={item.content}
          isOpen={false} // Each item manages its own open state in independent mode
          onToggle={() => setForceRender(prev => prev + 1)} // Trigger a re-render to update the UI
        />
      ))}
      {mode === "exclusive" && faqData.map(item => (
        <AccordionItem
          key={item.id}
          id={item.id}
          title={item.title}
          content={item.content}
          isOpen={openId === item.id} // Only the item with matching ID is open in exclusive mode
          onToggle={() => setOpenId(openId === item.id ? null : item.id)} // Toggle open state based on current openId
          callBack={() => handleCallBack(item.id)} // Optional callback to log toggled section ID
        />
      ))}
    </div>
  );
}


interface ModePickerProps {
  mode: AccordionMode;
  setMode: React.Dispatch<React.SetStateAction<AccordionMode>>;
}

function ModePicker({mode, setMode}: ModePickerProps) {
  return (
    <div>
      <input type="radio" id="independent" name="mode" value="independent" checked={mode === "independent"} onChange={() => setMode("independent")} />
      <label htmlFor="independent">Independent Mode</label>
      <input type="radio" id="exclusive" name="mode" value="exclusive" checked={mode === "exclusive"} onChange={() => setMode("exclusive")} />
      <label htmlFor="exclusive">Exclusive Single Mode</label>
    </div>
  );
}

interface AccordionItemProps {
  id: number;
  title: string;
  content: string;
  isOpen: boolean;
  onToggle: () => void;
  callBack?: () => void;
}

function AccordionItem({id, title, content, isOpen, onToggle, callBack}: AccordionItemProps): React.JSX.Element {
  const doWeHaveACallBack = (callBack)? true : false;
  const [localIsOpen, setLocalIsOpen] = useState(false); // Local state for independent mode

  function handleToggle() {
    onToggle();
    if (doWeHaveACallBack) {
      if (callBack) {
        callBack();
      }
      // In exclusive mode, the parent component manages the open state, so we don't toggle local state here
    } else {
      // we don't have a callback, assume we should handle local state toggle for independent mode
      setLocalIsOpen(prev => !prev); // Toggle local state in independent mode
    }
  }

  return (
    <div>
      <h2 onClick={handleToggle}>{title}</h2>
      {isOpen && <p>--{content}</p>}
      {!doWeHaveACallBack && localIsOpen && <p>--{content}</p>}
    </div>
  )
}

