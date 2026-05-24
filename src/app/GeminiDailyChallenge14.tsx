/**

🚀 Day 14: The Custom Dropdown Menu (Accessible Keyboard Interactivity)
Let's step up to a foundational component used for navigation bars, item selectors, and context action panels globally: The Accessible Custom Dropdown.

This challenge moves beyond basic mouse clicks and layout coordinates to focus on handling custom keyboard navigation event listeners—a major milestone for mastering web accessibility (a11y) and advanced focus states.

The Goal:
Create a styled select menu overlay dropdown button. Clicking it or focusing on it toggles open an option card list.

Requirements:

The Data Core: Map over a small array of string options (e.g., ["JavaScript", "TypeScript", "Python", "Rust"]). Display a top button showing the currently active selection choice. Clicking it toggles the visibility panel.

Outside Pointer Dismissal: Clicking anywhere on the screen outside of the active dropdown component container wrapper must instantly collapse the dropdown card panel.

The Accessibility Twist (The Real Challenge): When the options list is open, the user must be able to navigate options without touching their mouse:

Pressing the ArrowDown key moves an active highlight class down to the next list option.

Pressing the ArrowUp key moves the active highlight class back up the list option.

Pressing Enter locks in the currently highlighted list selection item and closes the panel.

Pressing Escape cancels out and closes the panel immediately.

💡 Hints to get you started:
Tracking Focus Indices: Use a state integer to track the index number matching the current keyboard hover location: const [focusedIndex, setFocusedIndex] = useState<number>(-1).

The Global Click Listener: To catch external layout window clicks, hook a listener function to the root DOM layer inside an active side-effect block:

TypeScript
useEffect(() => {
  const handleOutsideClick = (event: MouseEvent) => { /* Check if click is inside a React useRef container bounds }
  document.addEventListener("mousedown", handleOutsideClick);
  return () => document.removeEventListener("mousedown", handleOutsideClick);
}, []);
Keyboard Listener Target: Use an onKeyDown={handleKeyDown} listener. Make sure you use event.preventDefault() inside arrow key matches to prevent the browser window from scrolling the page viewport up and down while moving through items!

Populate your options array, hook up a container useRef boundary pointer, and let's see how your focus matrix holds together in your Vite playground!

*/


import React, { useState, useEffect, useRef } from "react";

export default function GeminiDailyChallenge14() {
  const exampleOptions: Option[] = [
    { id: 1, label: "JavaScript" },
    { id: 2, label: "TypeScript" },
    { id: 3, label: "Python" },
    { id: 4, label: "Rust" },
  ];

  const [selectedOption, setSelectedOption] = useState<Option>(exampleOptions[0]);

  function handleSelect(option: Option) {
    setSelectedOption(option);
  }

  return (
    <div className="challenge-container">
      <h2>Gemini Daily Challenge 14 - the custom dropdown menu (accessible keyboard interactivity)</h2>
      <p>Challenge description in comments</p>
      <div className="challenge-content">
        <div className="content-selected-option">
          <span>You have selected: </span>{selectedOption.label}
        </div>
        <div className="challenge-custom-dropdown">
          <CustomDropdown options={exampleOptions} onSelect={handleSelect} />
        </div>
      </div>
    </div>
  )
}

type Option = {
  id: number;
  label: string;
};


interface DropdownProps {
  options: Option[];
  preselectedOptionId?: number;
  onSelect: (option: Option) => void;
}


function CustomDropdown({options, preselectedOptionId, onSelect}: DropdownProps):React.JSX.Element {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // Initialize selectedOption state with the preselected option or default to the first option
  const [selectedOption, setSelectedOption] = useState<Option>(
    options.find(option => option.id === preselectedOptionId) ?? options[0]
  );

  const dropdownRef = useRef<HTMLDivElement>(null);

  // populate Ref
  useEffect(()=>{
    // we assume we are the only dropdown on the page for this example, so we can directly query the DOM for our container element and assign it to the ref
    dropdownRef.current = document.getElementsByClassName("custom-dropdown-container")[0] as HTMLDivElement;
  }, [])

  // install document click listener on change to isOpen
  useEffect(()=>{
    if(!isOpen) return; // nothing to do

    // we are open > install
    const handleOutsideClick = (event: MouseEvent) => {
      if(dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      // cleanup listener on close
      document.removeEventListener("mousedown", handleOutsideClick);
    }
  }, [isOpen])





  return (
    <div className="custom-dropdown-container">
      <div className="custom-dropdown-compoment">
        <div className="custom-select-button" onClick={() => setIsOpen(!isOpen)}>
          <span>{selectedOption.label}</span>
        </div>
        <div className={`custom-dropdown-menu ${isOpen ? "open" : ""}`}>
          <CustomSelectMenu options={options} onSelect={onSelect} />
        </div>
      </div>
    </div>
  )
}


interface CustomSelectMenuProps {
    options: Option[];
    onSelect: (option: Option) => void;
    dropdownRef: React.RefObject<HTMLDivElement>;
}

function CustomSelectMenu({options, onSelect}: CustomSelectMenuProps): React.JSX.Element {

  return (
    <div className="custom-select-menu">
    </div>
  );
}
