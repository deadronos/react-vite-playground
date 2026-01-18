import React from "react";
import Page from "./app/dashboard/page";
import { ThemeProvider } from "./components/theme-provider";

export default function App(): React.JSX.Element {
  return (
    <main role="main" className="app">
      <ThemeProvider defaultTheme="dark" storageKey="react-vite-playground-ui-theme">
        <Page />
      </ThemeProvider>
    </main>
  );
}

