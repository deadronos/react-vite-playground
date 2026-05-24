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

  // our CustomMenu will listen for outside click



  function handleCloseWithoutSelection() {
    setIsOpen(false);
  }

  // we set our own state and pass the selection up to the parent, we also close the menu if still open
  function handleLocalSelect(option: Option) {
    setSelectedOption(option);
    onSelect(option);
    setIsOpen(false);
  }

  return (
    <div className="custom-dropdown-container">
      <div className="custom-dropdown-compoment">
        <div className="custom-select-button" onClick={() => setIsOpen(!isOpen)} onFocus={() => setIsOpen(true)}>
          <button style={{
            padding: "8px 12px",
            cursor: "pointer",
            backgroundColor: isOpen ? "#eee" : "#fff",
            color: isOpen ? "#333" : "#000",
            border: "1px solid #ccc",
          }}>{selectedOption.label}</button>
        </div>
        {isOpen && <div className={`custom-dropdown-menu ${isOpen ? "open" : ""}`}>
          <CustomSelectMenu options={options} preselectedOptionId={preselectedOptionId} onSelect={handleLocalSelect} onClose={handleCloseWithoutSelection} />
        </div>}
      </div>
    </div>
  )
}


interface CustomSelectMenuProps {
    options: Option[];
    preselectedOptionId?: number;
    onSelect: (option: Option) => void;
    onClose: () => void;
}

function CustomSelectMenu({options, preselectedOptionId, onSelect, onClose}: CustomSelectMenuProps): React.JSX.Element {

  // prefocused index is the index of the option that matches the preselectedOptionId, or 0 if not found
  const [focusedIndex, setFocusedIndex] = useState<number>(
    options.findIndex(option => option.id === preselectedOptionId) ?? 0
  );

  const selectMenuRef = useRef<HTMLDivElement>(null);



  // installing document click listener for outside click detection
  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      // preventDefault behavior for clicks to prevent any unwanted side effects
      event.preventDefault();
      if(selectMenuRef.current && !selectMenuRef.current.contains(event.target as Node)) {
        // close the menu, we can do this by simulating a click outside or by calling a prop function to close the menu
        console.log("Clicked outside of menu, closing menu");
        onClose();
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [onClose]);

  const [selectedOption, setSelectedOption] = useState<Option>(
    options.find(option => option.id === preselectedOptionId) ?? options[0]
  );

  // watch selected option and log
  useEffect(()=>{
    console.log("Selected option changed:", selectedOption);
  },[selectedOption])

  function handleSelectOptionClick(option: Option) {
    setSelectedOption(option);
    onSelect(option);
    // we have selected something
    onClose();
  }

  /*  since we dont use a native select
    we dont have on change and option elements,
    so we need to handle the keyboard navigation and selection logic ourselves,
    we will do this in the handleKeyDown function, we will check the focusedIndex and update it accordingly,
    and when the user presses enter, we will call handleSelectOptionClick with the currently focused option

    this will rebuild the onchange logic roughly
  function handleOnChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const selectedId = parseInt(event.target.value);
    const selectedOption = options.find(option => option.id === selectedId);
    if (selectedOption) {
      handleSelectOptionClick(selectedOption);
    }
  }
  */

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
      // prevent default behavior for arrow keys to prevent scrolling
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        console.log("Preventing default for arrow key:", event.key);
        event.preventDefault();
      }

      // if we are called and no option focused, we should focus the first option
      if (focusedIndex === -1) {
        console.log("No option focused, setting focus to first option");
        setFocusedIndex(0);
      }
  };

  // we should also have an outside click listener
  function handleOutsideClick(event: MouseEvent) {
    if(selectMenuRef.current && !selectMenuRef.current.contains(event.target as Node)) {
      // close the menu, we can do this by simulating a click outside or by calling a prop function to close the menu
      console.log("Clicked outside of menu, closing menu");
      onClose();
    }
  }

  function handleClickAndDecideInsideOrOutside(event: React.MouseEvent<HTMLDivElement>) {
    if(selectMenuRef.current && !selectMenuRef.current.contains(event.target as Node)) {
      // we have clicked outside, it will handle onClose
      console.log("Clicked outside, passing event to outside click handler");
      handleOutsideClick(event.nativeEvent);
    } else {
      // we have clicked inside
      // check if we hit any option
      console.log("Clicked inside, checking if we hit an option");
      let selectedOption: Option | undefined;
      for (let i = 0; i < options.length; i++) {
        const optionElement = document.getElementsByClassName("custom-select-menu-option")[i] as HTMLDivElement;
        if (optionElement.contains(event.target as Node)) {
          selectedOption = options[i];
          break;
        }
      }
      // if we did, selected option will be set, if not, it will be undefined
      if (selectedOption) {
        console.log("Clicked on option:", selectedOption);
        // handles onClose because we have selected something, and also handles the selection logic
        handleSelectOptionClick(selectedOption);
      }
      console.log("Clicked inside but not on an option, ignoring click");
      // we have clicked and somehow didnt select an option, we should just ignore it and not do anything, the user might have clicked on the menu container or something else, we should not close the menu in this case
    }
  }

  function handleKeyDownWithinMenu(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowDown") {
      console.log("Arrow down pressed within menu, moving focus down");
      setFocusedIndex((prevIndex) => (prevIndex + 1) % options.length);
    } else if (event.key === "ArrowUp") {
      console.log("Arrow up pressed within menu, moving focus up");
      setFocusedIndex((prevIndex) => (prevIndex - 1 + options.length) % options.length);
    } else if (event.key === "Enter") {
      console.log("Enter pressed within menu, selecting focused option");
      handleSelectOptionClick(options[focusedIndex]);
    } else if (event.key === "Escape") {
      // close the menu, we can do this by simulating a click outside or by calling a prop function to close the menu
      console.log("Escape pressed within menu, closing menu");
      onClose();
    }
  }




  return (
    <div ref={selectMenuRef} className="custom-select-menu" onKeyDown={handleKeyDown} onClick={handleClickAndDecideInsideOrOutside}>
      {/* something could have clicked the container, it should also listen - that should not close */}
      {options.map((option, index) => (
        <input
          key={option.id}
          value={option.label}
          readOnly
          className={`custom-select-menu-option ${index === focusedIndex ? "focused" : ""}`}
          onClick={handleClickAndDecideInsideOrOutside}
          onMouseEnter={() => setFocusedIndex(index)} // update focused index on mouse hover
          onMouseLeave={() => setFocusedIndex(-1)} // reset focused index on mouse leave
          onKeyDown={handleKeyDownWithinMenu}
          style={{
            padding: "8px 12px",
            cursor: "pointer",
            backgroundColor: index === focusedIndex ? "#eee" : "#fff",
            color: index === focusedIndex ? "#333" : "#000",
            display: "block",
          }}
        />
      ))}
    </div>
  );
}



