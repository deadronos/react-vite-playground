/**
 * 🧪 Alchemist's Apprentice — Idle Game Challenge
 * --------------------------------------------------
 * A beginner-friendly idle game built with React and TypeScript.
 * Core mechanics: manual clicking, passive income, and scaling upgrade costs.
 *
 * Core Requirements
 * ----------------
 * 1. The Core Resource
 *    - State for potions, starting at 0.
 *
 * 2. The Active Action
 *    - "Brew Potion" button that increments potions by 1 per click.
 *
 * 3. The Passive Income
 *    - "Hire Assistant" upgrade button.
 *    - Hiring costs potions; each assistant generates 1 potion / second.
 *
 * 4. The Idle Loop
 *    - Use `useEffect` with `setInterval` (1000 ms) for passive generation.
 *
 * 5. Scaling Costs
 *    - Assistant cost grows with ownership: Cost = BaseCost × 1.15 ^ AmountOwned.
 *
 * 🧱 Recommended TypeScript Interface
 * -----------------------------------
 * ```ts
 * interface Upgrade {
 *   id: string;
 *   name: string;
 *   baseCost: number;
 *   costMultiplier: number;
 *   count: number;
 *   potionsPerSecond: number;
 * }
 * ```
 *
 * 🚀 Step-by-Step Implementation Guide
 * ------------------------------------
 * Step 1 — The Clicker
 *   - Lay out a button that increments the potions state.
 *   - Display the total potion count prominently at the top.
 *
 * Step 2 — The Game Loop ("Idle" Part)
 *   - Mount a `useEffect` that sets up a 1000 ms `setInterval`.
 *
 *   💡 Beginner Tip — Watch out for stale closures!
 *      Always use the functional update form when updating state
 *      from inside `setInterval`:
 *      `setPotions(prev => prev + income)`
 *
 * Step 3 — The Upgrade Shop
 *   - Create the assistant upgrade.
 *   - Derive its current cost from the owned count.
 *   - Disable the "Hire Assistant" button when funds are insufficient.
 *   - On click: deduct the cost and increment the assistant count.
 *
 * 🏆 Bonus Challenges (Extra Credit)
 * ----------------------------------
 * - Save State
 *     Persist progress in `localStorage` so it survives a page refresh.
 * - Floating Numbers
 *     Animate a "+1" pop-up near the mouse or button on each click.
 * - More Upgrades
 *     Add a "Cauldron Upgrade" tier that boosts potions per manual click.
 *
 * ❓ Reflection Prompt
 * --------------------
 * How do you plan to structure the game loop's `useEffect` to avoid
 * the stale state problem?
 */



import React, { useState, useEffect, useCallback } from "react";


const styles = {
  container: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    fontFamily: "Arial, sans-serif",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    margin: "10px",
    cursor: "pointer",
  },
  brewButton: {
    padding: "10px 20px",
    fontSize: "16px",
    margin: "10px",
    cursor: "pointer",
  },
  animateBrewClick: {
    animation: "clickAnimation 0.3s ease-in-out",
    position: "absolute" as const,
    top: "55%",
    color: "white",
    fontWeight: "bold" as const,
    fontSize: "20px",
  },
  "@keyframes clickAnimation": {
    "0%": { transform: "scale(1)" },
    "50%": { transform: "scale(1.2)" },
    "100%": { transform: "scale(1)" },
  },
  upgradeButton: {
    padding: "8px 16px",
    fontSize: "14px",
    margin: "5px",
    cursor: "pointer",
  },
  upgradeButtonDisabled: {
    padding: "8px 16px",
    fontSize: "14px",
    margin: "5px",
    cursor: "not-allowed",
    opacity: 0.5,
  },
  potionCount: {
    fontSize: "24px",
    marginBottom: "20px",
  },
};



export default function GeminiIdleGameChallenge1() {

  return (
    <div className="challenge-container" style={styles.container}>
      <h1>Alchemist's Apprentice — Idle Game Challenge</h1>
      <p>
        This challenge is a beginner-friendly idle game built with React and TypeScript.
        The core mechanics include manual clicking, passive income, and scaling upgrade costs.
      </p>
      <p>
        Your task is to implement the game loop, manage state for potions and upgrades,
        and ensure that the game runs smoothly with proper React patterns.
      </p>
      <AlChemistIdleGame />
    </div>
  )
}


interface Upgrade {
  id: string;
  name: string;
  baseCost: number;
  costMultiplier: number;
  count: number;
  potionsPerSecond?: number;
  potionsPerClick?: number;
}

interface GameState {
  potions: number;
  assistants: Upgrade;
  cauldrons: Upgrade;
}


function AlChemistIdleGame() {

  const initialState: GameState = {
    potions: 0,
    assistants: {
      id: "assistant",
      name: "Assistant",
      baseCost: 10,
      costMultiplier: 1.15,
      count: 0,
      potionsPerSecond: 1,
    },
    cauldrons: {
      id: "cauldron",
      name: "Cauldron Upgrade",
      baseCost: 20,
      costMultiplier: 1.2,
      count: 0,
      potionsPerClick: 1,
    },
  };



  const [loopState, setLoopState] = useState<GameState>(() => {
    const savedState = localStorage.getItem("geminiIdleGameState1");
    if (savedState) {
      try {
        return JSON.parse(savedState) as GameState;
      } catch (error) {
        console.error("Failed to parse saved game state:", error);
      }
    }
    return initialState;
  });

  const [isBrewAnimating, setIsBrewAnimating] = useState(false);

  const saveGameState = useCallback(() => {
    localStorage.setItem("geminiIdleGameState1", JSON.stringify(loopState));
  }, [loopState]);

  // Save game state to localStorage whenever loopState changes
  useEffect(() => {
    saveGameState();
  }, [loopState, saveGameState]);

  // Game loop for passive income
  useEffect(() => {
    const interval = setInterval(() => {
      setLoopState(prevState => ({
        ...prevState,
        potions: prevState.potions + (prevState.assistants.count * (prevState.assistants.potionsPerSecond ?? 0)),
      }));

    }, 1000);

    return () => clearInterval(interval);
  }, []);

  function handleBrewPotionClick() {
    setLoopState(prevState => ({
      ...prevState,
      potions: prevState.potions + (prevState.cauldrons.count * (prevState.cauldrons.potionsPerClick ?? 0)) + 1,
    }));

    setIsBrewAnimating(true);
  }

  // Reset the animation state after the animation duration
  useEffect(() => {
    if (isBrewAnimating) {
      const timer = setTimeout(() => setIsBrewAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isBrewAnimating]);

  function handleHireAssistantClick() {
    const assistant = loopState.assistants;
    const cost = (assistant.count === 0)
      ? assistant.baseCost
      : Math.floor(assistant.baseCost * Math.pow(assistant.costMultiplier, assistant.count));

    if (loopState.potions >= cost) {
      setLoopState(prevState => ({
        ...prevState,
        potions: prevState.potions - cost,
        assistants: {
          ...prevState.assistants,
          count: prevState.assistants.count + 1,
        },
      }));
    }
  }

  function handleBuyCauldronClick() {
    const cauldron = loopState.cauldrons;
    const cost = (cauldron.count === 0)
      ? cauldron.baseCost
      : Math.floor(cauldron.baseCost * Math.pow(cauldron.costMultiplier, cauldron.count));

    if (loopState.potions >= cost) {
      setLoopState(prevState => ({
        ...prevState,
        potions: prevState.potions - cost,
        cauldrons: {
          ...prevState.cauldrons,
          count: prevState.cauldrons.count + 1,
        },
      }));
    }
  }

  return (
    <div style={styles.container}>
      <h1>Alchemist's Apprentice</h1>
      <p style={styles.potionCount}>Potions: {loopState.potions}</p>
      <button type="button" style={styles.brewButton} onClick={handleBrewPotionClick}>Brew Potion</button>
      {isBrewAnimating && <div style={styles.animateBrewClick}>+1</div>}
      <div>
        <button type="button"
        disabled={loopState.potions < (loopState.assistants.count===0
        ? loopState.assistants.baseCost
        : Math.floor(loopState.assistants.baseCost * Math.pow(loopState.assistants.costMultiplier, loopState.assistants.count)))}
        style={loopState.potions < (loopState.assistants.count===0
        ? loopState.assistants.baseCost
        : Math.floor(loopState.assistants.baseCost * Math.pow(loopState.assistants.costMultiplier, loopState.assistants.count)))
        ? styles.upgradeButtonDisabled
        : styles.upgradeButton}
        onClick={handleHireAssistantClick}>Hire Assistant (Cost: {(loopState.assistants.count===0)
        ? loopState.assistants.baseCost
        : Math.floor(loopState.assistants.baseCost * Math.pow(loopState.assistants.costMultiplier, loopState.assistants.count))} Potions)</button>
        <button type="button"
        disabled={loopState.potions < (loopState.cauldrons.count===0
        ? loopState.cauldrons.baseCost
        : Math.floor(loopState.cauldrons.baseCost * Math.pow(loopState.cauldrons.costMultiplier, loopState.cauldrons.count)))}
        style={loopState.potions < (loopState.cauldrons.count===0
        ? loopState.cauldrons.baseCost
        : Math.floor(loopState.cauldrons.baseCost * Math.pow(loopState.cauldrons.costMultiplier, loopState.cauldrons.count)))
        ? styles.upgradeButtonDisabled
        : styles.upgradeButton}
        onClick={handleBuyCauldronClick}>Buy Cauldron (Cost: {(loopState.cauldrons.count===0)
        ? loopState.cauldrons.baseCost
        : Math.floor(loopState.cauldrons.baseCost * Math.pow(loopState.cauldrons.costMultiplier, loopState.cauldrons.count))} Potions)</button>
        <p>Assistants Owned: {loopState.assistants.count}</p>
        <p>Cauldrons Owned: {loopState.cauldrons.count}</p>
      </div>
    </div>
  )
}
