/*

🚀 Day 7: The Debounced Input (The API Savior)
Let's combine your async data skills from Day 5 and your side effect/timer skills from Day 6 to conquer an incredibly common production challenge: Debouncing.

When a user types into a live search input field, hitting a heavy API or running a complex filter on every single keystroke can ruin application performance. Instead, we want to wait until the user pauses typing for a split second before firing off our action.

The Goal:
Create a search component that takes a user's input but waits exactly 500 milliseconds after they stop typing before updating a finalized "Debounced Value" on the screen.

Requirements:

Immediate State: Maintain a state variable that updates instantly with the <input> field's value (so the input text feels fast and responsive as you type).

Debounced State: Maintain a separate state variable debouncedValue. This should only catch up to the input value if 500ms have passed without another keystroke.

UI Feedback: Display both values on the page so you can physically see the delay in action!

💡 Hints to get you started:
The Side Effect: Use a useEffect that listens specifically to changes in your immediate input text state.

The Timer: Inside that effect, set up a native setTimeout that runs after 500ms and updates your debouncedValue.

The Magical Cleanup: This is where Day 6 pays off. If the user types a new character before the 500ms are up, the component will re-render, triggering the effect again. If you return a cleanup function that calls clearTimeout(timer), you'll instantly kill the pending update and start a fresh 500ms window!

Hook up your input, type a long word rapidly, and watch the debounced value wait patiently for you to finish. Paste your component when you're ready!

*/

import React, { useState, useEffect } from "react";

async function MockAPICall(query:string):Promise<APIResponse> {
  console.log("Mock API Call initiated with query:", query);
  const mockData=[
    "Apple",
    "Banana",
    "Grape",
    "Orange",
    "Strawberry",
    "Blueberry",]

  // query should be case-insensitive and match any part of the string
  function filterData(query:string):string[] {
    const lowerQuery = query.toLowerCase();
    return mockData.filter(item => item.toLowerCase().includes(lowerQuery));
  }

  let APIResponse:APIResponse = {
    results: [],
    isError: false,
  };

  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Mock API Call processing query:", query);
      if(query.toLowerCase().includes("error")) {
        const err = {message: "Simulated API error triggered by query containing 'error'"};
        APIResponse = {
          results: [],
          isError: true,
          errorMessage: err.message,
        }
      }
      else {
        APIResponse = {
          results: filterData(query),
          isError: false,
        }
        console.log("Mock API Call successful, results:", APIResponse.results);
      }
      resolve(APIResponse);
    }, 1000); // simulate 1 second network delay
  });



}

type APIResponse = {
  results: string[];
  isError: boolean;
  errorMessage?: string;
}

type Error = {
  message: string;
}

export default function GeminiDailyChallenge7():React.JSX.Element {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [inputReset, setInputReset] = useState(true);

  function handleInputChange(e:React.ChangeEvent<HTMLInputElement>) {
    if(e.target.value.trim()==="") {
      // input empty
      if(debouncedValue!=="") setDebouncedValue("");
      if(results.length>0) setResults([]);
      if(error) setError(null);
      setInputValue("");
      setInputReset(true);
      // this returns to state onMount approximately
    } else {
      setInputValue(e.target.value);
      setInputReset(false); // input was changed to not empty
    }
  }

  async function getAPIResults(query:string):Promise<APIResponse> {
    let response:APIResponse={results: [], isError: false};
    let err:Error | null=null;
    // do API Call
    await MockAPICall(query).then((res)=>{
      response=res;
    }).catch((e:Error)=>{
      err={message: e.message ?? "Unknown error during API call"};
      response={results: [], isError: true, errorMessage: err.message};
    });
    return response;
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      // 500ms have passed since the last keystroke, update the debounced value
      console.log("500ms passed since last input change, updating debounced value to:", inputValue);
      setDebouncedValue(inputValue);
    }, 500);

    return () => clearTimeout(timer);
  }, [inputValue]);

  useEffect(() => {
    // debouncedValue has updated, now we can call the API
    console.log("Debounced value updated:", debouncedValue);
    if(debouncedValue.trim()==="") {
      console.log("Debounced value is empty, skipping API call.");
      return;
    };
    const timer = setTimeout(() => {
      // initiating loading
      setIsLoading(true);
    }, 10); // slight delay to ensure state updates before API call
    return () => clearTimeout(timer);
  }, [debouncedValue]);  // this updates only once the debounced value changes, not on every keystroke

  useEffect(()=>{
    //isLoading changed
    if(!isLoading) {
      // we never started or got interrupted, do nothing
      console.log("Not loading, skipping API call.");
      return;
    }
    console.log("Loading state initiated, starting API call with debounced value:", debouncedValue);
    // should initiate API Call with short delay
    const timer = setTimeout(() => {
      // we have isLoading true
      let loaded = false;
      let APIResponse:APIResponse={results: [], isError: false};
      getAPIResults(debouncedValue).then((res)=>{
        APIResponse=res;
        console.log("API call completed with response:", APIResponse);
        loaded=true;
        setIsLoading(false);
        setIsLoaded(true);
        setResults(APIResponse.results);
      }).catch((e:Error)=>{
        console.error("API call failed with error:", e);
        loaded=true;
        setIsLoading(false);
        setIsLoaded(true);
        setError({message: e.message ?? "Unknown error during API call"});
        setResults([]);
        APIResponse={results: [], isError: true, errorMessage: e.message ?? "Unknown error during API call"};
      });
      return;
    }, 10);
    return () => clearTimeout(timer);
  },[isLoading, debouncedValue]); // this effect runs when isLoading changes, which only happens after the debouncedValue has been set and the loading state has been initiated

  useEffect(()=>{
    if(!isLoaded) {
      // we should not have been called yet, or got interrupted, do nothing
      return;
    }
    if(!error) {
      console.log("API call successful. Results:", results);
    }
    else {
      console.error("API call failed with error:", error.message);
    }
  }, [isLoaded,results, error]) // this effect runs when we have new results, a new error, or a change in the loaded state, allowing us to react to the outcome of the API call (e.g., display results or show an error message)


  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Gemini Daily Challenge 7: The Debounced Input (The API Savior)</h1>
      <p className="mb-4">
        Create a search component that takes a user's input but waits exactly 500 milliseconds after they stop typing before updating a finalized "Debounced Value" on the screen.
      </p>
      <table>
        <tbody>
        <tr>
          <td>
            Current Input value:
          </td>
          <td>
            {inputValue}
          </td>
        </tr>
        <tr>
          <td>
            Debounced Value (updates after 500ms of inactivity):
          </td>
          <td>
            {debouncedValue}
          </td>
        </tr>
        <tr>
          <td>
            API Results (simulated with a 1-second delay):
          </td>
          <td>
            {inputReset ? "type something to search" :
              isLoading ? "Loading..." :
                isLoaded ? error ? "Loaded, but error: "+error.message :
                results.length > 0 ? results.join(", ") : "Loaded, but empty results" :
                "Loading finished, but no loaded state yet"}
          </td>
        </tr>
        <tr>
          <td>
            <input type="text" title="inputquery" onChange={handleInputChange} />
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  )
}
