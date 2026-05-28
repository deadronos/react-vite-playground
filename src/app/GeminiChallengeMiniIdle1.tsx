/*

🚀 The Challenge: "Alchemist's Forge" (Mini Idle Clicker)
You are an apprentice alchemist. Your goal is to automate the extraction of gold from raw iron ore using magical transmutation loops.

🎮 Game Mechanics to Implement:
1. The Core Currency & Clicker
Display the user's current Gold balance (starts at 0).

Add a large button: "Transmute Iron into Gold (+1 Gold)". Clicking this increments the Gold balance manually.

2. The Automation Loop (The Idle Engine)
Add two auto-transmutation upgrades that generate gold passively over time:

Alchemical Crucible: Costs 15 Gold. Generates 1 Gold every single second.

Magical Philosopher's Furnace: Costs 100 Gold. Generates 8 Gold every single second.

3. Game Logic Rules:
Dynamic Shop Prices: Every time the player buys an upgrade, its cost should increase slightly (e.g., New Cost = Old Cost * 1.15).

Smart Disabled Buttons: The shop purchase buttons must be disabled if the player doesn't have enough Gold.

💡 Architectural Hints (How to structure it in React):
To keep your code incredibly clean and production-ready, try setting up your game state like this:

TypeScript
interface GameState {
  gold: number;
  crucibles: number;
  furnaces: number;
}
The Idle Timer: You only need one single global setInterval running every 1,000ms (reusing your Day 6 skill). Every second, look at how many Crucibles and Furnaces the player owns, calculate the total income, and add it to the gold state.

Functional State Updates: Because the timer runs continuously, always use the functional update form of state to prevent stale closures:

TypeScript
setGold(prevGold => prevGold + passiveIncome);
Save & Load Progress: Use your updated Day 15 localStorage layout! Save the entire game state object whenever the gold or upgrades change, and load it when the component mounts so you never lose your hard-earned gold.

This is a fantastic capstone project for your playground. It combines click events, global intervals, dynamic math calculations, and local storage state sync.

How does this sound to you? Let me know if you want to tackle this, or if you'd like to adjust the theme before diving in!

*/

import React, { useCallback } from "react";
import { useState, useEffect } from "react";

export default function GeminiChallengeMiniIdle1(): React.JSX.Element {
  return (
    <>
    <div>
      <h2>Gemini Daily Challenge 15 - the localStorage state sync (persistent application memory)</h2>
      <p>This is a placeholder for the "Alchemist's Forge" mini idle clicker game. The actual implementation will be done in the next steps.</p>
    </div>
    <div className="AlchemyGame">
      <AlchemyGame />
    </div>
    </>
  );
}

interface GameState {
  gold: number;
  crucibles: number;
  furnaces: number;
}


function AlchemyGame(): React.JSX.Element {

  // load from customHook or create new game state if no saved state is found
  const { loadGameState,saveGameState } = useLocalStorage(); // get the save function from the custom hook to save the game state whenever it changes

  const [gameState, setGameState] = useState<GameState>(()=> {
    const savedState = loadGameState(); // attempt to load the saved game state from localStorage
    return savedState ?? { gold: 0, crucibles: 0, furnaces: 0 }; // if no saved state is found, initialize with default values
  });



  const [paused, setPaused] = useState(false); // we can add pause functionality later if needed
  const [tick, setTick] = useState(0); // keep track of the number of ticks that have passed, if needed for display or other logic

  const idleTimer = useIdleTimer({
    gameState,
    paused: paused, // we can add pause functionality later if needed
    setGameState,
    setPaused: setPaused, // we can implement pause functionality later if needed
    onTick: () => setTick(prevTick => prevTick + 1), // increment the tick count every second, if needed for display or other logic
  });

  const startTimer=idleTimer.startTimer; // we can use these functions to start and stop the timer if we implement pause functionality later
  const stopTimer=idleTimer.stopTimer;
  const getTick=idleTimer.getTick; // we can use this function to get the current tick count if needed for display or other logic

  const shop = useSmartShop({ gameState, setGameState });

  // save the game state to localStorage whenever it changes
  useEffect(()=>{
    saveGameState(gameState);
  },[gameState, saveGameState]); // re-run this effect whenever the game state changes to save the new state

  function resetGame() {
    setGameState({
      gold: 0,
      crucibles: 0,
      furnaces: 0,
    });
    setTick(0); // reset the tick count as well, if needed for display or other logic
  }

  function handleManualTransmute() {
    setGameState(prevState => ({
      ...prevState,
      gold: prevState.gold + 1, // add 1 gold for the manual transmute click
    }));
  }

  function handleReset() {
    if (window.confirm("Are you sure you want to reset your progress? This cannot be undone.")) {
      resetGame();
    }
  }

  function handlePauseToggle() {
    if (paused) {
      startTimer(); // unpause the game to start the timer
      setPaused(false);
    } else {
      stopTimer(); // pause the game to stop the timer
      setPaused(true);
    }
  }

  return (
    <div>
      <h2>Alchemist's Forge</h2>
      <p>Mutate (unlimited) iron ore into gold! Buy upgrades to automate your gold production and watch your fortune grow!</p>
      {/* Display the current gold balance */}
      <div className="gold-display">Gold: {gameState.gold}</div>
      <div className="upgrade-display">
        <div>Alchemical Crucibles: {gameState.crucibles} (each generates 1 Gold/sec)</div>
        <div>Magical Philosopher's Furnaces: {gameState.furnaces} (each generates 8 Gold/sec)</div>
      </div>
      {/* Pause and Reset buttons */}
      <button onClick={handlePauseToggle}>{paused ? "Resume" : "Pause"}</button>
      <button onClick={handleReset}>Reset Game</button>

      {/* Transmute button */}
      <button className="transmute-button" onClick={handleManualTransmute}>
        Transmute Iron into Gold (+1 Gold)
      </button>

      {/* Shop for upgrades */}
      <div className="shop">
        <h3>Shop</h3>
        <button
          onClick={shop.buyCrucible}
          disabled={gameState.gold < shop.currentCrucibleCost()}
        >
          Buy Alchemical Crucible (Cost: {shop.currentCrucibleCost()} Gold) - Generates {gameState.crucibles!==0 ? gameState.crucibles*1 : 1} Gold/sec, 1 per crucible
        </button>
        <button
          onClick={shop.buyFurnace}
          disabled={gameState.gold < shop.currentFurnaceCost()}
        >
          Buy Magical Philosopher's Furnace (Cost: {shop.currentFurnaceCost()} Gold) - Generates {gameState.furnaces!==0 ? gameState.furnaces*8 : 8} Gold/sec, 8 per furnace
        </button>
      </div>
    </div>
  )
}






function useLocalStorage() {
  // This is a custom hook that will handle saving and loading the game state to localStorage.
  const saveGameState = useCallback((state: GameState) => {
    localStorage.setItem("alchemyGameState", JSON.stringify(state));
  }, []);

  const loadGameState = useCallback((): GameState | null => {
    const savedState = localStorage.getItem("alchemyGameState");
    //verify that the saved state is valid JSON and has the correct structure
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState) as Partial<GameState>;
        if (
          typeof parsedState.gold === "number" &&
          typeof parsedState.crucibles === "number" &&
          typeof parsedState.furnaces === "number"
        ) {
          console.log("hydrating saved game state:", parsedState);
          return parsedState as GameState;
        }
      } catch (error) {
        console.error("Failed to parse saved game state:", error);
      }
    }
    console.log("No valid saved game state found. Starting a new game.");
    return null; // Return null if no valid saved state is found (first time playing or corrupted data)

  }, []);

  return { saveGameState, loadGameState };

}


interface IdleTimerProps {
  gameState: GameState;
  paused: boolean;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  setPaused: React.Dispatch<React.SetStateAction<boolean>>;
  onTick?: () => void; // Optional callback to run on each tick, if needed for additional side effects
}

function useIdleTimer({ gameState, paused, setGameState, setPaused, onTick }: IdleTimerProps) {
  // custom hook to handle the idle timer logic
  // gets gameState and paused state and function to update them
  const [tick, setTick] = useState(0); // keep track of the number of ticks that have passed
  const [isRunning, setIsRunning] = useState(false); // track whether the timer is currently running

  useEffect(() =>{
    if (paused) return; // if the game is paused, don't start the timer
    if (isRunning) return; // if the timer is already running, don't start another one

    const interval = setInterval(() => {
      // do something
      console.log("running idle timer tick:", tick);
      setGameState(prevState => {
        const { crucibles, furnaces } = prevState;
        const passiveIncome = crucibles * 1 + furnaces * 8; // calculate the total passive income from crucibles and furnaces
        if (passiveIncome > 0) {
          console.log(`Tick ${tick}: current gold = ${prevState.gold}, crucibles = ${crucibles}, furnaces = ${furnaces}, passive income this tick = ${passiveIncome}`);
          return {
            ...prevState,
            gold: prevState.gold + passiveIncome, // add the passive income to the current gold
          };
        }
        return prevState; // if no passive income, return the state unchanged
      });
      setTick(prevTick => prevTick + 1); // increment the tick count every second, if needed for display or other logic
      if (onTick) onTick(); // call the onTick callback if it exists, for any additional side effects needed on each tick
    }, 1000); // run the game loop every second

    return () => {
      // cleanup function to clear the interval when the component unmounts or when dependencies change
      clearInterval(interval);
      setIsRunning(false); // mark the timer as not running when cleaned up
    }
  },[ paused, setGameState, setPaused, tick, onTick, isRunning]); // re-run the effect whenever any of these dependencies change

  function startTimer() {
    setPaused(false); // unpause the game to start the timer
  }

  function stopTimer() {
    setPaused(true); // pause the game to stop the timer
  }

  function getTick() {
    return tick; // return the current tick count, if needed for display or other logic
  }

  return { startTimer, stopTimer, getTick }; // This hook doesn't render anything, it just manages the timer logic
}



interface GameLoopProps {
  gameState: GameState;
  tick: number;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

function gameLoop({ gameState, tick, setGameState }: GameLoopProps) {
  // This function will contain the main game loop logic that runs every second to update the gold based on the number of crucibles and furnaces owned.
    const { gold, crucibles, furnaces } = gameState;
    const passiveIncome = crucibles * 1 + furnaces * 8; // calculate the total passive income from crucibles and furnaces

    // manual clicks will be handled outside, we run passive income in the loop every second
    console.log(`Tick ${tick}: current gold = ${gold}, crucibles = ${crucibles}, furnaces = ${furnaces}, passive income this tick = ${passiveIncome}`);
    if (passiveIncome > 0) {
      setGameState(prevState => ({
        ...prevState,
        gold: prevState.gold + passiveIncome, // add the passive income to the current gold
      }));
    }

  return null; // This function doesn't render anything, it just contains the logic to update the game state.
}


interface ShopProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

function useSmartShop({ gameState, setGameState }: ShopProps) {

  function buyCrucible() {
    const crucibleCost = Math.floor(15 * Math.pow(1.15, gameState.crucibles)); // calculate the current cost of the next crucible based on how many have already been bought
    if (gameState.gold >= crucibleCost) {
      setGameState(prevState => ({
        ...prevState,
        gold: prevState.gold - crucibleCost, // subtract the cost from the current gold
        crucibles: prevState.crucibles + 1, // increment the number of crucibles owned
      }));
    }
  }

  function buyFurnace() {
    const furnaceCost = Math.floor(100 * Math.pow(1.15, gameState.furnaces)); // calculate the current cost of the next furnace based on how many have already been bought
    if (gameState.gold >= furnaceCost) {
      setGameState(prevState => ({
        ...prevState,
        gold: prevState.gold - furnaceCost, // subtract the cost from the current gold
        furnaces: prevState.furnaces + 1, // increment the number of furnaces owned
      }));
    }
  }

  function currentCrucibleCost() {
    return Math.floor(15 * Math.pow(1.15, gameState.crucibles)); // calculate the current cost of the next crucible based on how many have already been bought
  }

  function currentFurnaceCost() {
    return Math.floor(100 * Math.pow(1.15, gameState.furnaces)); // calculate the current cost of the next furnace based on how many have already been bought
  }

  return { buyCrucible, buyFurnace, currentCrucibleCost, currentFurnaceCost }; // return the functions to buy upgrades and get current costs, which can be used in the shop component
}
