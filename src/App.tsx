import React from "react";
import { ThemeProvider } from "./components/theme-provider";
import ChatGPTChallenge1 from "./app/ChatGPTChallenge1";

export default function App(): React.JSX.Element {
  return (
    <main role="main" className="app">
      <ThemeProvider defaultTheme="dark" storageKey="react-vite-playground-ui-theme">
        <ChatGPTChallenge1 />
      </ThemeProvider>
    </main>
  );
}

