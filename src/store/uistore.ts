import { create } from "zustand";


type UIStore = {
  darkMode: boolean;
  sidebarOpen: boolean;
  activeView: "home" | "settings" | "profile" | null;
  toggleDarkMode: () => void;
  toggleSidebar: () => void;
  setActiveView: (view: "home" | "settings" | "profile" | null) => void;
  home:{
    paused: boolean;
    setPaused: (paused: boolean) => void;
    togglePaused: () => void;
  }
};

export const useUIStore = create<UIStore>((set) => ({
  darkMode: true,
  sidebarOpen: false,
  activeView: "home",

  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setActiveView: (view) => set({ activeView: view }),
  home: {
    paused: false,
    setPaused: (paused) => set((state) => ({ home: { ...state.home, paused } })),
    togglePaused: () => set((state) => ({ home: { ...state.home, paused: !state.home.paused } })),
  },
}));
