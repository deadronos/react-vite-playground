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
