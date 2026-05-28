import React from "react";
import { ThemeProvider } from "./components/theme-provider";
import ChatGPTChallenge1 from "./app/ChatGPTChallenge1";
import GeminiDailyChallenge1 from "./app/GeminiDailyChallenge1";
import GeminiChallengeReactState from "./app/GeminiChallengeReactState";

import "./App.css";
import { ChatGPTChallenge2 } from "./app/ChatGPTChallenge2";
import GeminiDailyChallenge2 from "./app/GeminiDailyChallenge2";
import GeminiDailyChallenge3 from "./app/GeminiDailyChallenge3";
import GeminiDailyChallenge4 from "./app/GeminiDailyChallenge4";
import GeminiDailyChallenge5 from "./app/GeminiDailyChallenge5";
import GeminiDailyChallenge6 from "./app/GeminiDailyChallenge6";
import GeminiDailyChallenge7 from "./app/GeminiDailyChallenge7";
import GeminiDailyChallenge8 from "./app/GeminiDailyChallenge8";
import GeminiDailyChallenge9 from "./app/GeminiDailyChallenge9";
import GeminiDailyChallenge10 from "./app/GeminiDailyChallenge10";
import GeminiDailyChallenge11 from "./app/GeminiDailyChallenge11";
import GeminiDailyChallenge12 from "./app/GeminiDailyChallenge12";
import GeminiDailyChallenge13 from "./app/GeminiDailyChallenge13";
import GeminiDailyChallenge14 from "./app/GeminiDailyChallenge14";
import GeminiDailyChallenge15 from "./app/GeminiDailyChallenge15";
import GeminiDailyChallenge16 from "./app/GeminiChallengeMiniIdle1";

export default function App(): React.JSX.Element {
  const [activeTab, setActiveTab] = React.useState("");

  const challenge1="ChatGPT Challenge 1 - factory like using useContext in React";
  const challenge2="Gemini Daily Challenge 1 - simple component";
  const challenge3="Gemini Challenge React State - more complex component with state";
  const challenge4="ChatGPT Challenge 2 - ECS Playground (game architecture)";
  const challenge5="Gemini Daily Challenge 2 - string manipulation and algorithms";
  const challenge6="Gemini Daily Challenge 3 - title case capitalizer with live input";
  const challenge7="Gemini Daily Challenge 4 - array filter and accumulator";
  const challenge8="Gemini Daily Challenge 5 - object transformer and key mapper";
  const challenge9="Gemini Daily Challenge 6 - event timer and custom hook";
  const challenge10="Gemini Daily Challenge 7 - the debounced input (the API savior)";
  const challenge11="Gemini Daily Challenge 8 - the simple todo list (state arrays & mutability)";
  const challenge12="Gemini Daily Challenge 9 - the accordion component (managing derived & shared UI states)";
  const challenge13="Gemini Daily Challenge 10 - the pagination component (slicing big datasets)";
  const challenge14="Gemini Daily Challenge 11 - the star rating component (interactive grid states)";
  const challenge15="Gemini Daily Challenge 12 - the custom modal dialog (DOM portals & layout overlays)";
  const challenge16="Gemini Daily Challenge 13 - the fetch search & cache component (real API integration)";
  const challenge17="Gemini Daily Challenge 14 - the custom dropdown menu (accessible keyboard interactivity)";
  const challenge18="Gemini Daily Challenge 15 - the localStorage state sync (persistent application memory)";
  const challenge19="Gemini Daily Challenge 16 - the mini idle clicker game (combining all skills learned!)";

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
          <span className="separator">|</span>
          <button
            className={activeTab === "challenge5" ? "button-active" : "button-inactive"}
            onClick={() => setActiveTab(activeTab === "challenge5" ? "" : "challenge5")}
          >
            {challenge5.split(" - ")[0]}<p>{challenge5.split(" - ")[1]}</p>
          </button>
          <span className="separator">|</span>
          <button
            className={activeTab === "challenge6" ? "button-active" : "button-inactive"}
            onClick={() => setActiveTab(activeTab === "challenge6" ? "" : "challenge6")}
          >
            {challenge6.split(" - ")[0]}<p>{challenge6.split(" - ")[1]}</p>
          </button>
          <span className="separator">|</span>
          <button
            className={activeTab === "challenge7" ? "button-active" : "button-inactive"}
            onClick={() => setActiveTab(activeTab === "challenge7" ? "" : "challenge7")}
          >
            {challenge7.split(" - ")[0]}<p>{challenge7.split(" - ")[1]}</p>
          </button>
          <span className="separator">|</span>
          <button
            className={activeTab === "challenge8" ? "button-active" : "button-inactive"}
            onClick={() => setActiveTab(activeTab === "challenge8" ? "" : "challenge8")}
          >
            {challenge8.split(" - ")[0]}<p>{challenge8.split(" - ")[1]}</p>
          </button>
          <span className="separator">|</span>
          <button
            className={activeTab === "challenge9" ? "button-active" : "button-inactive"}
            onClick={() => setActiveTab(activeTab === "challenge9" ? "" : "challenge9")}
          >
            {challenge9.split(" - ")[0]}<p>{challenge9.split(" - ")[1]}</p>
          </button>
          <span className="separator">|</span>
          <button
            className={activeTab === "challenge10" ? "button-active" : "button-inactive"}
            onClick={() => setActiveTab(activeTab === "challenge10" ? "" : "challenge10")}
          >
            {challenge10.split(" - ")[0]}<p>{challenge10.split(" - ")[1]}</p>
          </button>
          <span className="separator">|</span>
          <button
            className={activeTab === "challenge11" ? "button-active" : "button-inactive"}
            onClick={() => setActiveTab(activeTab === "challenge11" ? "" : "challenge11")}
          >
            {challenge11.split(" - ")[0]}<p>{challenge11.split(" - ")[1]}</p>
          </button>
          <span className="separator">|</span>
          <button
            className={activeTab === "challenge12" ? "button-active" : "button-inactive"}
            onClick={() => setActiveTab(activeTab === "challenge12" ? "" : "challenge12")}
          >
            {challenge12.split(" - ")[0]}<p>{challenge12.split(" - ")[1]}</p>
          </button>
          <span className="separator">|</span>
          <button
            className={activeTab === "challenge13" ? "button-active" : "button-inactive"}
            onClick={() => setActiveTab(activeTab === "challenge13" ? "" : "challenge13")}
          >
            {challenge13.split(" - ")[0]}<p>{challenge13.split(" - ")[1]}</p>
          </button>
          <span className="separator">|</span>
          <button
            className={activeTab === "challenge14" ? "button-active" : "button-inactive"}
            onClick={() => setActiveTab(activeTab === "challenge14" ? "" : "challenge14")}
          >
            {challenge14.split(" - ")[0]}<p>{challenge14.split(" - ")[1]}</p>
          </button>
          <span className="separator">|</span>
          <button
            className={activeTab === "challenge15" ? "button-active" : "button-inactive"}
            onClick={() => setActiveTab(activeTab === "challenge15" ? "" : "challenge15")}
          >
            {challenge15.split(" - ")[0]}<p>{challenge15.split(" - ")[1]}</p>
          </button>
          <span className="separator">|</span>
          <button
            className={activeTab === "challenge16" ? "button-active" : "button-inactive"}
            onClick={() => setActiveTab(activeTab === "challenge16" ? "" : "challenge16")}
          >
            {challenge16.split(" - ")[0]}<p>{challenge16.split(" - ")[1]}</p>
          </button>
          <span className="separator">|</span>
          <button
            className={activeTab === "challenge17" ? "button-active" : "button-inactive"}
            onClick={() => setActiveTab(activeTab === "challenge17" ? "" : "challenge17")}
          >
            {challenge17.split(" - ")[0]}<p>{challenge17.split(" - ")[1]}</p>
          </button>
          <span className="separator">|</span>
          <button
            className={activeTab === "challenge18" ? "button-active" : "button-inactive"}
            onClick={() => setActiveTab(activeTab === "challenge18" ? "" : "challenge18")}
          >
            {challenge18.split(" - ")[0]}<p>{challenge18.split(" - ")[1]}</p>
          </button>
          <span className="separator">|</span>
          <button
            className={activeTab === "challenge19" ? "button-active" : "button-inactive"}
            onClick={() => setActiveTab(activeTab === "challenge19" ? "" : "challenge19")}
          >
            {challenge19.split(" - ")[0]}<p>{challenge19.split(" - ")[1]}</p>
          </button>
        </div>
        <div className="separator" />
        <div style={{ padding: '16px' }}>
          <h1>Welcome to the React Vite Playground!</h1>
          <p>Select a challenge from the tabs above to get started.</p>
        </div>
        <div className="separator" />
        <div className="tab-content" style={{ padding: '16px' }}>
        {activeTab === "challenge1" && <ChatGPTChallenge1 />}
        {activeTab === "challenge2" && <GeminiDailyChallenge1 />}
        {activeTab === "challenge3" && <GeminiChallengeReactState />}
        {activeTab === "challenge4" && <ChatGPTChallenge2 />}
        {activeTab === "challenge5" && <GeminiDailyChallenge2 />}
        {activeTab === "challenge6" && <GeminiDailyChallenge3 />}
        {activeTab === "challenge7" && <GeminiDailyChallenge4 />}
        {activeTab === "challenge8" && <GeminiDailyChallenge5 />}
        {activeTab === "challenge9" && <GeminiDailyChallenge6 />}
        {activeTab === "challenge10" && <GeminiDailyChallenge7 />}
        {activeTab === "challenge11" && <GeminiDailyChallenge8 />}
        {activeTab === "challenge12" && <GeminiDailyChallenge9 />}
        {activeTab === "challenge13" && <GeminiDailyChallenge10 />}
        {activeTab === "challenge14" && <GeminiDailyChallenge11 />}
        {activeTab === "challenge15" && <GeminiDailyChallenge12 />}
        {activeTab === "challenge16" && <GeminiDailyChallenge13 />}
        {activeTab === "challenge17" && <GeminiDailyChallenge14 />}
        {activeTab === "challenge18" && <GeminiDailyChallenge15 />}
        {activeTab === "challenge19" && <GeminiDailyChallenge16 />}
        </div>
      </ThemeProvider>
    </main>
  );
}

