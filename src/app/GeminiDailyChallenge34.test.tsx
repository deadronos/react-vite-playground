/**
 * Granular failing tests for Gemini Daily Challenge 34 — The Game Loop Matrix Tick.
 *
 * To make these tests go red → green, your implementation in
 * `src/app/GeminiDailyChallenge34.tsx` needs to export and define:
 *
 *   1. `findShortestPath(grid, start, end): Coordinate[] | null`
 *      A BFS that returns the FULL ORDERED path (not just the step count).
 *      Return `null` when the target is unreachable.
 *
 *   2. `NavigationGridComponent({ grid, startPoint, endPoint })`
 *      - `useMemo` to compute `plannedPath` once from the pathfinder.
 *      - `useState` for `currentStepIndex`, initialised to `0`.
 *      - `useEffect` on the tick that increments `currentStepIndex`,
 *        clamped to `plannedPath.length - 1` (no out-of-bounds lookup).
 *      - Render a button labelled "🔄 Reboot Drone Run" that resets
 *        `currentStepIndex` back to `0`.
 *
 *   3. `RenderGrid({ grid, startPoint, endPoint, activeCell })`
 *      - Render a div per cell with `data-testid="cell-{row}-{col}"`.
 *      - The cell matching `activeCell` gets `data-active="true"` and a
 *        vibrant blue background colour.
 *
 *   4. `TickProvider` (a context that exposes an incrementing tick value).
 *      The classic implementation increments every 1 second.
 *
 * Run with: `npx vitest run src/app/GeminiDailyChallenge34.test.tsx`
 */

import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, fireEvent, cleanup } from '@testing-library/react';
import GeminiDailyChallenge34, { findShortestPath } from './GeminiDailyChallenge34';

type Coordinate = { row: number; col: number };
type Grid = number[][];

const navigationGrid: Grid = [
  [0, 0, 1, 0],
  [0, 1, 0, 0],
  [0, 0, 0, 1],
  [1, 0, 0, 0],
];
const startPoint: Coordinate = { row: 0, col: 0 };
const endPoint: Coordinate = { row: 2, col: 2 };

// Shortest path for the default grid:
// (0,0) -> (1,0) -> (2,0) -> (2,1) -> (2,2)  = 5 cells / 4 moves
const expectedPath: Coordinate[] = [
  { row: 0, col: 0 },
  { row: 1, col: 0 },
  { row: 2, col: 0 },
  { row: 2, col: 1 },
  { row: 2, col: 2 },
];

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

// ============================================================================
// 1. BFS PATHFINDER — full ordered path of {row, col} objects
// ============================================================================
describe('findShortestPath — BFS path tracker', () => {
  test('returns null when the target is unreachable', () => {
    const blocked: Grid = [
      [0, 1, 0],
      [1, 1, 0],
      [0, 0, 0],
    ];
    const result = findShortestPath(blocked, { row: 0, col: 0 }, { row: 0, col: 2 });
    expect(result).toBeNull();
  });

  test('returns a single-coordinate path when start equals end', () => {
    const result = findShortestPath(navigationGrid, { row: 1, col: 0 }, { row: 1, col: 0 });
    expect(result).toEqual([{ row: 1, col: 0 }]);
  });

  test('returns a non-empty array of {row, col} objects for a valid grid', () => {
    const result = findShortestPath(navigationGrid, startPoint, endPoint);
    expect(result).not.toBeNull();
    expect(Array.isArray(result)).toBe(true);
    expect(result!.length).toBeGreaterThan(0);
    for (const cell of result!) {
      expect(cell).toHaveProperty('row');
      expect(cell).toHaveProperty('col');
      expect(typeof cell.row).toBe('number');
      expect(typeof cell.col).toBe('number');
    }
  });

  test('path starts at the start coordinate', () => {
    const result = findShortestPath(navigationGrid, startPoint, endPoint)!;
    expect(result[0]).toEqual(startPoint);
  });

  test('path ends at the end coordinate', () => {
    const result = findShortestPath(navigationGrid, startPoint, endPoint)!;
    expect(result[result.length - 1]).toEqual(endPoint);
  });

  test('path length matches the BFS shortest distance (5 cells / 4 moves)', () => {
    const result = findShortestPath(navigationGrid, startPoint, endPoint)!;
    expect(result.length).toBe(5);
  });

  test('path only visits walkable cells (grid value 0)', () => {
    const result = findShortestPath(navigationGrid, startPoint, endPoint)!;
    for (const cell of result) {
      expect(navigationGrid[cell.row][cell.col]).toBe(0);
    }
  });

  test('consecutive cells in the path are 4-direction adjacent (cardinal only)', () => {
    const result = findShortestPath(navigationGrid, startPoint, endPoint)!;
    for (let i = 1; i < result.length; i++) {
      const prev = result[i - 1];
      const curr = result[i];
      const rowDiff = Math.abs(curr.row - prev.row);
      const colDiff = Math.abs(curr.col - prev.col);
      expect(rowDiff + colDiff).toBe(1);
    }
  });

  test('does not revisit cells in the path', () => {
    const result = findShortestPath(navigationGrid, startPoint, endPoint)!;
    const seen = new Set<string>();
    for (const cell of result) {
      const key = `${cell.row},${cell.col}`;
      expect(seen.has(key)).toBe(false);
      seen.add(key);
    }
  });

  test('produces a shortest path (alt grid, alternative shortest path)', () => {
    // Open 3x3 grid — there are many 4-step paths; any shortest one is valid.
    const open: Grid = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
    const result = findShortestPath(open, { row: 0, col: 0 }, { row: 2, col: 2 })!;
    expect(result.length - 1).toBe(4); // 4 moves for a 2,2 delta in 4-direction BFS
    expect(result[0]).toEqual({ row: 0, col: 0 });
    expect(result[result.length - 1]).toEqual({ row: 2, col: 2 });
  });
});

// ============================================================================
// 2. NAVIGATION GRID COMPONENT — real-time drone animation
// ============================================================================
describe('GeminiDailyChallenge34 — real-time drone animation', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  test('renders the challenge heading', () => {
    render(<GeminiDailyChallenge34 />);
    expect(
      screen.getByRole('heading', { level: 2 }),
    ).toHaveTextContent(/Gemini Daily Challenge 34/i);
  });

  test('renders all 16 grid cells (4x4)', () => {
    const { container } = render(<GeminiDailyChallenge34 />);
    const cells = container.querySelectorAll('[data-testid^="cell-"]');
    expect(cells.length).toBe(16);
  });

  test('renders the current tick display starting at 0', () => {
    render(<GeminiDailyChallenge34 />);
    expect(screen.getByText(/Current Tick:\s*0/)).toBeInTheDocument();
  });

  test('renders the Reboot Drone Run button', () => {
    render(<GeminiDailyChallenge34 />);
    expect(
      screen.getByRole('button', { name: /Reboot Drone Run/i }),
    ).toBeInTheDocument();
  });

  test('initially marks the start cell (0,0) as the active drone', () => {
    const { container } = render(<GeminiDailyChallenge34 />);
    const startCell = container.querySelector('[data-testid="cell-0-0"]');
    expect(startCell).toHaveAttribute('data-active', 'true');
  });

  test('only one cell is active at any time', () => {
    const { container } = render(<GeminiDailyChallenge34 />);
    const activeCells = container.querySelectorAll('[data-active="true"]');
    expect(activeCells.length).toBe(1);
  });

  test('initial active cell is rendered in vibrant blue', () => {
    const { container } = render(<GeminiDailyChallenge34 />);
    const startCell = container.querySelector('[data-testid="cell-0-0"]') as HTMLElement;
    expect(isBlueish(startCell.style.backgroundColor)).toBe(true);
  });

  test('tick increment moves the active cell off the start position', () => {
    const { container } = render(<GeminiDailyChallenge34 />);
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    const startCell = container.querySelector('[data-testid="cell-0-0"]');
    expect(startCell).not.toHaveAttribute('data-active', 'true');
  });

  test('after one tick, the active cell is the next path coordinate (1,0)', () => {
    const { container } = render(<GeminiDailyChallenge34 />);
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    const nextCell = container.querySelector('[data-testid="cell-1-0"]');
    expect(nextCell).toHaveAttribute('data-active', 'true');
  });

  test('keeps exactly one active cell at all times during animation', () => {
    const { container } = render(<GeminiDailyChallenge34 />);
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    const activeCells = container.querySelectorAll('[data-active="true"]');
    expect(activeCells.length).toBe(1);
  });

  test('currentStepIndex is clamped at the end of the path (2,2)', () => {
    const { container } = render(<GeminiDailyChallenge34 />);
    act(() => {
      vi.advanceTimersByTime(30000); // Way past the path
    });
    const activeCells = container.querySelectorAll('[data-active="true"]');
    expect(activeCells.length).toBe(1);
    const endCell = container.querySelector('[data-testid="cell-2-2"]');
    expect(endCell).toHaveAttribute('data-active', 'true');
  });

  test('no out-of-bounds lookup — exactly one cell stays active at the clamp', () => {
    const { container } = render(<GeminiDailyChallenge34 />);
    act(() => {
      vi.advanceTimersByTime(100000);
    });
    // No "undefined" or "null" cell should be marked active.
    const activeCells = container.querySelectorAll('[data-active="true"]');
    expect(activeCells.length).toBe(1);
  });

  test('Reboot Drone Run button resets the active cell back to the start', () => {
    const { container } = render(<GeminiDailyChallenge34 />);
    act(() => {
      vi.advanceTimersByTime(2000); // Move to step 2 (2,0)
    });
    const button = screen.getByRole('button', { name: /Reboot Drone Run/i });
    fireEvent.click(button);
    const startCell = container.querySelector('[data-testid="cell-0-0"]');
    expect(startCell).toHaveAttribute('data-active', 'true');
  });

  test('Reboot Drone Run can be used to re-watch the agent run again', () => {
    const { container } = render(<GeminiDailyChallenge34 />);
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    fireEvent.click(screen.getByRole('button', { name: /Reboot Drone Run/i }));
    act(() => {
      vi.advanceTimersByTime(1000); // Step 1 again
    });
    const nextCell = container.querySelector('[data-testid="cell-1-0"]');
    expect(nextCell).toHaveAttribute('data-active', 'true');
  });
});

// ============================================================================
// HELPERS
// ============================================================================
function isBlueish(color: string): boolean {
  if (!color) return false;
  const c = color.toLowerCase().trim();
  if (c.includes('blue')) return true;
  if (c === '#00f' || c === '#0000ff' || c === '#007bff') return true;
  if (c.startsWith('rgb(0, 0, 255)')) return true;
  if (c.startsWith('rgb(30, 144, 255)')) return true; // dodgerblue
  if (c.startsWith('rgb(0, 191, 255)')) return true; // deepskyblue
  if (c.startsWith('rgb(65, 105, 225)')) return true; // royalblue
  return false;
}
