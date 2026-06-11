/*

Welcome to Day 27 of your daily programming challenge! You are absolutely crushing this series.

Let's shift into an essential UX pattern used heavily across e-commerce filtering panels, audio workstations, data dashboards, and volume mixing panels: The Multi-State Synchronized Slider Input (Min/Max Range Validation).

This challenge focuses on structural state synchronization, handling concurrent numerical fields, and enforcing layout validation constraints in real time.

The Goal
Create a component containing two numerical inputs that are linked to a single horizontal slider track.

Users should be able to type values or slide the selectors to set a minimum and maximum range boundary (e.g., filtering products by price). The tricky part is preventing the inputs from overlapping—the Minimum value must never be allowed to exceed the Maximum value.

📋 Requirements:
The Range Boundary State: Maintain a single state object tracking both range limits securely:

TypeScript
const [range, setRange] = useState({ min: 10, max: 80 });
The Dual-Input View Layout: Render two separate standard HTML inputs (type="number") side-by-side representing the min and max limits.

The Synchronized HTML Slider Track: Render a native HTML range slider tracking element below the number fields.

Tip: For a beginner layout, a standard <input type="range" min="0" max="100" /> that syncs to one of the values (or a pair of them) works perfectly. If you want a fun challenge, you can use two range inputs layered over each other, or simply hook up a single slider to control the total span width!

The Validation Guard Engine (The Real Challenge): Write validation checks inside your modification handlers:

If a user tries to type or slide the min value higher than the current max value, clamp the min value so it matches the max value exactly.

Conversely, if the user lowers the max value below the min value, clamp the max value to match the min.

💡 Hints to get you started:
The Value Clamping Recipe: When processing an input alteration, use JavaScript's native math libraries to enforce boundaries instantly before writing to state:

TypeScript
// Example for updating min value safely:
const newMin = Math.min(newValue, range.max);
Explicit Base Limits: Set a fixed lower floor of 0 and an upper ceiling of 100 for your components so your slider math stays completely clean and predictable.

Set up your numerical fields, hook up your input handlers, wrap your values inside protective validation gates, and let's see how your UI handles mathematical boundaries. Paste your sandbox code whenever you are ready!

*/


import React, { useState, useEffect, useReducer } from 'react';


export default function GeminiDailyChallenge27() {
  return (
    <div>
      <h1>Gemini Daily Challenge 27: The Synchronized Range Slider (Min/Max Validation)</h1>
      <p>
        This challenge focuses on creating a synchronized range slider with two numerical inputs representing minimum and maximum values. The key aspect is to ensure that the minimum value cannot exceed the maximum value and vice versa, providing a seamless user experience for range selection.
      </p>
      <RangeSlider />
    </div>
  );
}

const absoluteMin = 0;
const absoluteMax = 100;

type Range = {
  min: number;
  max: number;
};

function clampMinToMax(newMin: number, currentMax: number): number {
  return Math.max(Math.min(newMin, currentMax), absoluteMin);
}

function clampMaxToMin(newMax: number, currentMin: number): number {
  return Math.min(Math.max(newMax, currentMin), absoluteMax);
}

function RangeSlider() {
  const [range, setRange] = useState<Range>({ min: 10, max: 80 });



  function onChangeCallbackInputLayer(newValue: number, label: string) {
    if (label === "Min") {
      const clampedMin = clampMinToMax(newValue, range.max);
      setRange(prev => ({ ...prev, min: clampedMin }));
    } else if (label === "Max") {
      const clampedMax = clampMaxToMin(newValue, range.min);
      setRange(prev => ({ ...prev, max: clampedMax }));
    } else if (label !== "Min" && label !== "Max") {
      console.warn("Unexpected label in onChangeCallbackInputLayer:", label);
    }
  }

  function onChangeCallbackSliderLayer(newMin: number, newMax: number) {
    const clampedMin = clampMinToMax(newMin, range.max);
    const clampedMax = clampMaxToMin(newMax, range.min);
    setRange({ min: clampedMin, max: clampedMax });
  }

  return (
    <div>
      {/* Input Layer */}
      <InputLayer onChangeCallback={onChangeCallbackInputLayer} rangeProp={range} labelProp="Min" />
      <InputLayer onChangeCallback={onChangeCallbackInputLayer} rangeProp={range} labelProp="Max" />
      {/* Slider Layer */}
      <SliderLayer onChangeCallback={onChangeCallbackSliderLayer} rangeProp={range} />
    </div>
  )
}

function InputLayer({onChangeCallback, rangeProp, labelProp}:{onChangeCallback: (value: number, label: string) => void, rangeProp: Range, labelProp: string}) {
  const [internalRange, setInternalRange] = useReducer((state: Range, newRange: Range) => ({ ...state, ...newRange }), rangeProp);



  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newValue = Number(e.target.value);
    const clampedValue = labelProp === "Min" ? clampMinToMax(newValue, internalRange.max) : clampMaxToMin(newValue, internalRange.min);
    if (isNaN(clampedValue)) {
      console.warn("Invalid number input:", e.target.value);
      return;
    }
    if (labelProp === "Min") {
      setInternalRange({ ...internalRange, min: clampedValue });
    } else if (labelProp === "Max") {
      setInternalRange({ ...internalRange, max: clampedValue });
    } else {
      console.warn("Unexpected label in handleChange:", labelProp);
    }
    onChangeCallback(clampedValue, labelProp);
  }


  // Sync internal state with parent prop changes
  useEffect(() => {
    function syncWithParent() {
      // Only update internal state if it differs from the current internal state to avoid unnecessary re-renders
      if (rangeProp.min !== internalRange.min || rangeProp.max !== internalRange.max) {
        setInternalRange(rangeProp);
      }
    }
    syncWithParent();
  }, [rangeProp, internalRange]);

  return (
    <div>
      <label>{labelProp}</label>
      <input title={labelProp} placeholder={labelProp} type="number" value={internalRange[labelProp.toLowerCase() as keyof Range]} onChange={handleChange} min={labelProp === "Min" ? absoluteMin : internalRange.min} max={labelProp === "Max" ? absoluteMax : internalRange.max} />
    </div>
  );
}

function SliderLayer({ onChangeCallback, rangeProp }: { onChangeCallback: (newMin: number, newMax: number) => void, rangeProp: Range }) {
  const [internalRange, setInternalRange] = useReducer((state: Range, newRange: Range) => ({ ...state, ...newRange }), rangeProp);


  function handleMinSliderChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newMin = Number(e.target.value);
    const clampedMin = clampMinToMax(newMin, rangeProp.max);
    if (isNaN(clampedMin)) {
      console.warn("Invalid number input for min slider:", e.target.value);
      return;
    }
    setInternalRange({ ...internalRange, min: clampedMin });
    onChangeCallback(clampedMin, internalRange.max);
  }

  function handleMaxSliderChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newMax = Number(e.target.value);
    const clampedMax = clampMaxToMin(newMax, rangeProp.min);
    if (isNaN(clampedMax)) {
      console.warn("Invalid number input for max slider:", e.target.value);
      return;
    }
    setInternalRange({ ...internalRange, max: clampedMax });
    onChangeCallback(internalRange.min, clampedMax);
  }

  // Sync internal state with parent prop changes
  useEffect(() => {
    function syncWithParent() {
      // Only update internal state if it differs from the current internal state to avoid unnecessary re-renders
      if (rangeProp.min !== internalRange.min || rangeProp.max !== internalRange.max) {
        setInternalRange(rangeProp);
      }
    }
    syncWithParent();
  }, [rangeProp, internalRange]);

  return (
    <div>
      {/* we need 2 inputs and shared track div */}
      
    </div>
  );
}


class CustomDualInputSlider extends HTMLElement {
  constructor() {
    super();
    // Initialization code for the custom element can go here
  }

  connectedCallback() {
    // Code to run when the element is added to the DOM can go here
  }

  disconnectedCallback() {
    // Code to run when the element is removed from the DOM can go here
  }

  // Additional methods for the custom element can be defined here
}

customElements.define('custom-dual-input-slider', CustomDualInputSlider);
