import React from "react";
import { ThemeProvider } from "./components/theme-provider";
import ChatGPTChallenge1 from "./app/ChatGPTChallenge1";
import GeminiDailyChallenge1 from "./app/GeminiDailyChallenge1";
import GeminiChallengeReactState from "./app/GeminiChallengeReactState";
import "./App.css";




export default function App(): React.JSX.Element {
  const [activeTab, setActiveTab] = React.useState("");

  const challenge1="ChatGPT Challenge 1 - factory like using useContext in React";
  const challenge2="Gemini Daily Challenge 1 - simple component";
  const challenge3="Gemini Daily Challenge 2 - more complex component with state";

  return (
    <main role="main" className="app">
      <ThemeProvider defaultTheme="dark" storageKey="react-vite-playground-ui-theme">
        <div className="tabs">
          <button
            className={activeTab === "challenge1" ? "button-active" : "button-inactive"}
            onClick={() => setActiveTab(activeTab === "challenge1" ? "" : "challenge1")}
          >
            {challenge1}
          </button>
          <span className="separator">|</span>
          <button
            className={activeTab === "challenge2" ? "button-active" : "button-inactive"}
            onClick={() => setActiveTab(activeTab === "challenge2" ? "" : "challenge2")}
          >
            {challenge2}
          </button>
          <span className="separator">|</span>
          <button
            className={activeTab === "challenge3" ? "button-active" : "button-inactive"}
            onClick={() => setActiveTab(activeTab === "challenge3" ? "" : "challenge3")}
          >
            {challenge3}
          </button>
        </div>
        <div style={{ padding: '16px' }}>
          <h1>Welcome to the React Vite Playground!</h1>
          <p>Select a challenge from the tabs above to get started.</p>
        </div>
        {activeTab === "challenge1" && <ChatGPTChallenge1 />}
        {activeTab === "challenge2" && <GeminiDailyChallenge1 />}
        {activeTab === "challenge3" && <GeminiChallengeReactState />}
      </ThemeProvider>
    </main>
  );
}

