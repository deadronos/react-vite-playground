/*

🚀 Day 18: The Temperature Unit Converter (Dual-Way Dependent Inputs)
Let's dive into an algorithm pattern used everywhere from ecommerce currency exchanges to technical coordinate converters:
Bi-directional State Synchronization.Your goal today is to tackle managing text inputs that dynamically influence each other
without falling into infinite state re-rendering loops.

The Goal:Create a dashboard component with two numeric text inputs side-by-side:

one for Celsius ($^\circ$C) and one for Fahrenheit ($^\circ$F).
Typing numbers into one box must instantly convert and populate the other box in real time.

🎛️ Dynamic FormulasTo keep your calculations precise, implement standard decimal float conversion logic using these equations:

$$C = (F - 32) \times \frac{5}{9}$$$$F = C \times \frac{9}{5} + 32$$📋

Requirements:Dependent Real-Time Calculation:

Typing 0 into the Celsius input should immediately force the Fahrenheit input to change its text value to 32.
Graceful Error Catching: Clearing out an input box entirely or accidentally typing non-numeric strings (like letters)
shouldn't throw NaN crashes or break your layout.
Single Source of Truth (The Architectural Challenge): Do not create separate independent state variables for both values
(like const [celsius, setCelsius] = useState() and const [fahrenheit, setFahrenheit] = useState()).
This creates messy state synchronization collisions.
Instead, track only the active temperature value and the last edited unit type, or derive one completely from the other!💡 Hints to get you started:The State Profile: Try structuring your internal state map with two variables tracking raw data entries:TypeScriptconst [temperature, setTemperature] = useState<string>("");
const [activeUnit, setActiveUnit] = useState<"C" | "F">("C");

Derived Computations: Inside your component body function (before the final return layout block), run your math checks.

If activeUnit === "C", use your stored temperature value directly for the Celsius field, and pass it through the formula to get your Fahrenheit string placeholder value!Set up your numeric event targets, isolate your inputs, and let's see how your state values align. Paste your solution whenever you're ready!

*/

import React, { useState } from 'react';

function GeminiDailyChallenge18() {
  return (
    <div>
      <h1>Gemini Daily Challenge 18: The Temperature Unit Converter</h1>
      <p>Type a temperature in either box to see the conversion in real time. Try entering non-numeric values or clearing the input to test error handling!</p>
      {/* Your implementation goes here */}
      <TemperatureConverter />
    </div>
  );
}

export default GeminiDailyChallenge18;

function TemperatureConverter() {

  const [temperature, setTemperature] = useState<string>("");
  const [activeUnit, setActiveUnit] = useState<"C" | "F">("C");

  function CelsiusToFahrenheit(celsius: number): number {
    return (celsius * 9/5) + 32;
  }

  function FahrenheitToCelsius(fahrenheit: number): number {
    return (fahrenheit - 32) * 5/9;
  }

  function handleCelsiusChange(e: React.ChangeEvent<HTMLInputElement>) {
    setActiveUnit("C");
    setTemperature(e.target.value);
  }

  function handleFahrenheitChange(e: React.ChangeEvent<HTMLInputElement>) {
    setActiveUnit("F");
    setTemperature(e.target.value);
  }


  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      {/* Celsius Input */}
      <input type="text" onChange={handleCelsiusChange} value={activeUnit === "C" ? temperature : (temperature !== "" ? FahrenheitToCelsius(parseFloat(temperature)).toFixed(2) : "")} placeholder="°C" />
      {/* Fahrenheit Input */}
      <input type="text" onChange={handleFahrenheitChange} value={activeUnit === "F" ? temperature : (temperature !== "" ? CelsiusToFahrenheit(parseFloat(temperature)).toFixed(2) : "")} placeholder="°F" />
    </div>
  )
}
