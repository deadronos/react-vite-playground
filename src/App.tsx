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
import GeminiDailyChallenge17 from "./app/GeminiDailyChallenge17";
import GeminiDailyChallenge18 from "./app/GeminiDailyChallenge18";
import GeminiDailyChallenge19 from "./app/GeminiDailyChallenge19";
import GeminiDailyChallenge20 from "./app/GeminiDailyChallenge20";



export default function App(): React.JSX.Element {
  const [activeTab, setActiveTab] = React.useState("");
  const [collapsed, setCollapsed] = React.useState(false);

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
  const challenge20="Gemini Daily Challenge 17 - the key-value vocabulary flashcard app (two-sided UI flipping)";
  const challenge21="Gemini Daily Challenge 18 - the temperature unit converter (dual-way dependent inputs)";
  const challenge22="Gemini Daily Challenge 19 - the dynamic progress bar (controlled interval stepping)";
  const challenge23="Gemini Daily Challenge 20 - the drag-and-drop list order (reordering array indexes)";


  function renderActiveTab() {
    switch (activeTab) {
      case "challenge1":
        return <ChatGPTChallenge1 />;
      case "challenge2":
        return <GeminiDailyChallenge1 />;
      case "challenge3":
        return <GeminiChallengeReactState />;
      case "challenge4":
        return <ChatGPTChallenge2 />;
      case "challenge5":
        return <GeminiDailyChallenge2 />;
      case "challenge6":
        return <GeminiDailyChallenge3 />;
      case "challenge7":
        return <GeminiDailyChallenge4 />;
      case "challenge8":
        return <GeminiDailyChallenge5 />;
      case "challenge9":
        return <GeminiDailyChallenge6 />;
      case "challenge10":
        return <GeminiDailyChallenge7 />;
      case "challenge11":
        return <GeminiDailyChallenge8 />;
      case "challenge12":
        return <GeminiDailyChallenge9 />;
      case "challenge13":
        return <GeminiDailyChallenge10 />;
      case "challenge14":
        return <GeminiDailyChallenge11 />;
      case "challenge15":
        return <GeminiDailyChallenge12 />;
      case "challenge16":
        return <GeminiDailyChallenge13 />;
      case "challenge17":
        return <GeminiDailyChallenge14 />;
      case "challenge18":
        return <GeminiDailyChallenge15 />;
      case "challenge19":
        return <GeminiDailyChallenge16 />;
      case "challenge20":
        return <GeminiDailyChallenge17 />;
      case "challenge21":
        return <GeminiDailyChallenge18 />;
      case "challenge22":
        return <GeminiDailyChallenge19 />;
      case "challenge23":
        return <GeminiDailyChallenge20 />;
      default:
        return null;
    }
  }

  function toggleCollapse() {
    setCollapsed(prev => !prev);
  }

  function renderNavMenu() {
    if (collapsed) {
      return null;
    }
    return (
      <div className="nav-menu" style={{ display: 'flex', flexDirection: 'column', padding: '8px' }}>
        <button onClick={() => setActiveTab("")}>Home</button>
        <button onClick={() => setActiveTab("challenge1")}>{challenge1}</button>
        <button onClick={() => setActiveTab("challenge2")}>{challenge2}</button>
        <button onClick={() => setActiveTab("challenge3")}>{challenge3}</button>
        <button onClick={() => setActiveTab("challenge4")}>{challenge4}</button>
        <button onClick={() => setActiveTab("challenge5")}>{challenge5}</button>
        <button onClick={() => setActiveTab("challenge6")}>{challenge6}</button>
        <button onClick={() => setActiveTab("challenge7")}>{challenge7}</button>
        <button onClick={() => setActiveTab("challenge8")}>{challenge8}</button>
        <button onClick={() => setActiveTab("challenge9")}>{challenge9}</button>
        <button onClick={() => setActiveTab("challenge10")}>{challenge10}</button>
        <button onClick={() => setActiveTab("challenge11")}>{challenge11}</button>
        <button onClick={() => setActiveTab("challenge12")}>{challenge12}</button>
        <button onClick={() => setActiveTab("challenge13")}>{challenge13}</button>
        <button onClick={() => setActiveTab("challenge14")}>{challenge14}</button>
        <button onClick={() => setActiveTab("challenge15")}>{challenge15}</button>
        <button onClick={() => setActiveTab("challenge16")}>{challenge16}</button>
        <button onClick={() => setActiveTab("challenge17")}>{challenge17}</button>
        <button onClick={() => setActiveTab("challenge18")}>{challenge18}</button>
        <button onClick={() => setActiveTab("challenge19")}>{challenge19}</button>
        <button onClick={() => setActiveTab("challenge20")}>{challenge20}</button>
        <button onClick={() => setActiveTab("challenge21")}>{challenge21}</button>
        <button onClick={() => setActiveTab("challenge22")}>{challenge22}</button>
        <button onClick={() => setActiveTab("challenge23")}>{challenge23}</button>
      </div>
    )
  }

  return (
    <main role="main" className="app">
      <ThemeProvider defaultTheme="dark" storageKey="react-vite-playground-ui-theme">
        <div className="app-background" />
        <div className="app-header" style={{ padding: '16px', borderBottom: '1px solid #ccc' }}>
          <h1 style={{ margin: 0 }}>React Vite Playground</h1>
        </div>
        <div className="nav-menu-container" style={{ position: 'relative', top: 0, left: 0, zIndex: 1000, padding: '8px', borderBottom: '1px solid #ccc' }}>
          <button onClick={toggleCollapse} style={{ position: 'relative', top: '8px', left: '8px' }}>Expand Tabs</button>
          {!collapsed && renderNavMenu()}
        </div>

        <div className="tab-content" style={{ position: 'relative', top: '44px', padding: '16px' }}>
          {renderActiveTab()}
        </div>
      </ThemeProvider>
    </main>
  );
}

