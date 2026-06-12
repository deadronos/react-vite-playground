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

{/* inline CSS classes for better visualization */}
/* CSS Styling Architecture */
const stylesDoubleThumbInput = `
.slider-container {
  position: relative;
  width: 100%;
  height: 6px;
  background: #444; /* The shared background track */
}

.double-range-thumb {
  position: absolute;
  width: 100%;
  pointer-events: none; /* 🌟 Crucial: Allows clicks to pass through transparent track areas */
  background: none;
  appearance: none;
  -webkit-appearance: none;
}

/* Re-enable pointer events ONLY for the physical moving thumb handles */
.double-range-thumb::-webkit-slider-thumb {
  pointer-events: auto;
  cursor: pointer;
}`;



export default function GeminiDailyChallenge27() {
  return (
    <div>
      {/* 🌟 Injection of CSS rules directly into the DOM */}
      <style>{`
        .slider-container {
          position: relative;
          width: 100%;
          height: 6px;
          background: #444;
          margin-top: 20px;
        }
        .double-range-thumb {
          position: absolute;
          width: 100%;
          pointer-events: none;
          background: none;
          appearance: none;
          -webkit-appearance: none;
        }
        .double-range-thumb::-webkit-slider-thumb {
          pointer-events: auto;
          cursor: pointer;
          appearance: none;
          -webkit-appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: cyan;
        }
      `}</style>
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

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newValue = Number(e.target.value);
    if (isNaN(newValue)) {
      console.warn("Invalid number input for", labelProp, ":", e.target.value);
      return;
    }
    onChangeCallback(newValue, labelProp);
  }

  return (
    <div>
      <label>{labelProp}</label>
      <input title={labelProp} placeholder={labelProp} type="number"
        value={labelProp === "Min" ? rangeProp.min : rangeProp.max}
        onChange={handleChange}
        min={labelProp === "Min" ? absoluteMin : rangeProp.min}
        max={labelProp === "Max" ? absoluteMax : rangeProp.max} />
    </div>
  );
}

function SliderLayer({ onChangeCallback, rangeProp }: { onChangeCallback: (newMin: number, newMax: number) => void, rangeProp: Range }) {

  function handleMinChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newMin = Number(e.target.value);
    if (isNaN(newMin)) {
      console.warn("Invalid number input for slider min:", e.target.value);
      return;
    }
    onChangeCallback(newMin, rangeProp.max);
  }

  function handleMaxChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newMax = Number(e.target.value);
    if (isNaN(newMax)) {
      console.warn("Invalid number input for slider max:", e.target.value);
      return;
    }
    onChangeCallback(rangeProp.min, newMax);
  }

  return (
    <div className="slider-container" style={{ position: 'relative', width: '100%', height: '10px', background: '#444', marginTop: '20px' }}>
      {/* Min Slider Thumb Layer */}
      <input
        type="range"
        min={absoluteMin}
        max={absoluteMax}
        value={rangeProp.min}
        onChange={handleMinChange}
        className="double-range-thumb"
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', pointerEvents: 'none', background: 'none', appearance: 'none', WebkitAppearance: 'none' }}
      />
      {/* Max Slider Thumb Layer */}
      <input
        type="range"
        min={absoluteMin}
        max={absoluteMax}
        value={rangeProp.max}
        onChange={handleMaxChange}
        className="double-range-thumb"
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', pointerEvents: 'none', background: 'none', appearance: 'none', WebkitAppearance: 'none' }}
      />
    </div>
  );
}



