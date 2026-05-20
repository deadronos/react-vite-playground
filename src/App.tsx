import React from "react";
import { ThemeProvider } from "./components/theme-provider";
import GeminiPlaygroundChallenge1 from "./app/GeminiPlaygroundChallenge1";

export default function App(): React.JSX.Element {
  return (
    <main role="main" className="app">
      <ThemeProvider defaultTheme="dark" storageKey="react-vite-playground-ui-theme">
        <GeminiPlaygroundChallenge1 />
      </ThemeProvider>
    </main>
  );
}

