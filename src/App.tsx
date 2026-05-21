import React from "react";
import { ThemeProvider } from "./components/theme-provider";
import ChatGPTChallenge1 from "./app/ChatGPTChallenge1";
import GeminiDailyChallenge1 from "./app/GeminiDailyChallenge1";
import GeminiChallengeReactState from "./app/GeminiChallengeReactState";
import "./App.css";
import { ChatGPTChallenge2 } from "./app/ChatGPTChallenge2";




export default function App(): React.JSX.Element {
  const [activeTab, setActiveTab] = React.useState("");

  const challenge1="ChatGPT Challenge 1 - factory like using useContext in React";
  const challenge2="Gemini Daily Challenge 1 - simple component";
  const challenge3="Gemini Daily Challenge 2 - more complex component with state";
  const challenge4="ChatGPT Challenge 2 - ECS Playground (game architecture)";

  return (
    <main role="main" className="app">
      <ThemeProvider defaultTheme="dark" storageKey="react-vite-playground-ui-theme">
        <div className="tabs">
          <button
            className={activeTab === "challenge1" ? "button-active" : "button-inactive"}
            onClick={() => setActiveTab(activeTab === "challenge1" ? "" : "challenge1")}
          >
            {challenge1.split(" - ")[0]}<p>{challenge1.split(" - ")[1]}</p>
          </button>
          <span className="separator">|</span>
          <button
            className={activeTab === "challenge2" ? "button-active" : "button-inactive"}
            onClick={() => setActiveTab(activeTab === "challenge2" ? "" : "challenge2")}
          >
            {challenge2.split(" - ")[0]}<p>{challenge2.split(" - ")[1]}</p>
          </button>
          <span className="separator">|</span>
          <button
            className={activeTab === "challenge3" ? "button-active" : "button-inactive"}
            onClick={() => setActiveTab(activeTab === "challenge3" ? "" : "challenge3")}
          >
            {challenge3.split(" - ")[0]}<p>{challenge3.split(" - ")[1]}</p>
          </button>
          <span className="separator">|</span>
          <button
            className={activeTab === "challenge4" ? "button-active" : "button-inactive"}
            onClick={() => setActiveTab(activeTab === "challenge4" ? "" : "challenge4")}
          >
            {challenge4.split(" - ")[0]}<p>{challenge4.split(" - ")[1]}</p>
          </button>
        </div>
        <div style={{ padding: '16px' }}>
          <h1>Welcome to the React Vite Playground!</h1>
          <p>Select a challenge from the tabs above to get started.</p>
        </div>
        {activeTab === "challenge1" && <ChatGPTChallenge1 />}
        {activeTab === "challenge2" && <GeminiDailyChallenge1 />}
        {activeTab === "challenge3" && <GeminiChallengeReactState />}
        {activeTab === "challenge4" && <ChatGPTChallenge2 />}
      </ThemeProvider>
    </main>
  );
}

