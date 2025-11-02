import { create } from 'zustand';


const GRID_ROWS = 8;
const GRID_COLS = 8;

type GridStore = {
  rows: number;
  cols: number;
  grid: Cell[][];
  isInitialized: boolean;
  setGrid: (newGrid: Cell[][]) => void;
  getGrid: () => Cell[][];
  setCellValue: (x: number, y: number, value: string) => void;
  getCellValue: (x: number, y: number) => string;
  resetGrid: () => void;
  initializeGrid: (rows: number, cols: number,initialValue:string) => void;
}

type Cell ={
  x: number;
  y: number;
  value: string;
}

export const useGridStore = create<GridStore>((set, get) => ({
  rows: GRID_ROWS,
  cols: GRID_COLS,
  isInitialized: false,
  grid: Array.from({ length: GRID_ROWS }, (_, y) =>
    Array.from({ length: GRID_COLS }, (_, x) => ({ x, y, value: '' }))
  ),
  setGrid: (newGrid) => set({ grid: newGrid }),
  getGrid: () => get().grid,
  setCellValue: (x, y, value) => {
    const grid = get().grid.map(row =>
      row.map(cell =>
        cell.x === x && cell.y === y ? { ...cell, value } : cell
      )
    );
    set({ grid });
  },
  getCellValue: (x, y) => {
    const cell = get().grid[y]?.[x];
    return cell ? cell.value : '';
  },
  resetGrid: () => {
    const rows = get().rows;
    const cols = get().cols;
    const newGrid = Array.from({ length: rows }, (_, y) =>
      Array.from({ length: cols }, (_, x) => ({ x, y, value: '' }))
    );
    set({ grid: newGrid });
  },
  initializeGrid: (rows, cols,initialValue?:string) => {
    const newGrid = Array.from({ length: rows }, (_, y) =>
      Array.from({ length: cols }, (_, x) => ({ x, y, value: initialValue ?? '' }))
    );
    set({ rows, cols, grid: newGrid, isInitialized: true });
  }
}));
