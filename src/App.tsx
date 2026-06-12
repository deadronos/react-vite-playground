import React from "react";
import {
  Boxes,
  ChevronLeft,
  ChevronRight,
  Code2,
  Component,
  FlaskConical,
  Home,
  Layers3,
  Sparkles,
} from "lucide-react";
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
import GeminiDailyChallenge21 from "./app/GeminiDailyChallenge21";
import GeminiDailyChallenge22 from "./app/GeminiDailyChallenge22";
import GeminiDailyChallenge23 from "./app/GeminiDailyChallenge23";
import GeminiDailyChallenge24 from "./app/GeminiDailyChallenge24";
import GeminiDailyChallenge25 from "./app/GeminiDailyChallenge25";
import GeminiDailyChallenge26 from "./app/GeminiDailyChallenge26";
import GeminiDailyChallenge27 from "./app/GeminiDailyChallenge27";
import GeminiDailyChallenge28 from "./app/GeminiDailyChallenge28";
import GeminiDailyChallenge29 from "./app/GeminiDailyChallenge29";
import GeminiDailyChallenge30 from "./app/GeminiDailyChallenge30";

type Challenge = {
  id: string;
  title: string;
  source: "ChatGPT" | "Gemini";
  topic: string;
  accent: "amber" | "cyan" | "green" | "rose";
  component: React.ComponentType;
};

const challenges: Challenge[] = [
  {
    id: "challenge1",
    title: "Factory pattern with React context",
    source: "ChatGPT",
    topic: "Context",
    accent: "amber",
    component: ChatGPTChallenge1,
  },
  {
    id: "challenge2",
    title: "Simple component fundamentals",
    source: "Gemini",
    topic: "Components",
    accent: "cyan",
    component: GeminiDailyChallenge1,
  },
  {
    id: "challenge3",
    title: "React state playground",
    source: "Gemini",
    topic: "State",
    accent: "green",
    component: GeminiChallengeReactState,
  },
  {
    id: "challenge4",
    title: "ECS playground",
    source: "ChatGPT",
    topic: "Architecture",
    accent: "rose",
    component: ChatGPTChallenge2,
  },
  {
    id: "challenge5",
    title: "String manipulation and algorithms",
    source: "Gemini",
    topic: "Algorithms",
    accent: "amber",
    component: GeminiDailyChallenge2,
  },
  {
    id: "challenge6",
    title: "Title case capitalizer with live input",
    source: "Gemini",
    topic: "Forms",
    accent: "cyan",
    component: GeminiDailyChallenge3,
  },
  {
    id: "challenge7",
    title: "Array filter and accumulator",
    source: "Gemini",
    topic: "Arrays",
    accent: "green",
    component: GeminiDailyChallenge4,
  },
  {
    id: "challenge8",
    title: "Object transformer and key mapper",
    source: "Gemini",
    topic: "Objects",
    accent: "rose",
    component: GeminiDailyChallenge5,
  },
  {
    id: "challenge9",
    title: "Event timer and custom hook",
    source: "Gemini",
    topic: "Hooks",
    accent: "amber",
    component: GeminiDailyChallenge6,
  },
  {
    id: "challenge10",
    title: "Debounced input",
    source: "Gemini",
    topic: "Performance",
    accent: "cyan",
    component: GeminiDailyChallenge7,
  },
  {
    id: "challenge11",
    title: "Simple todo list",
    source: "Gemini",
    topic: "State arrays",
    accent: "green",
    component: GeminiDailyChallenge8,
  },
  {
    id: "challenge12",
    title: "Accordion component",
    source: "Gemini",
    topic: "UI state",
    accent: "rose",
    component: GeminiDailyChallenge9,
  },
  {
    id: "challenge13",
    title: "Pagination component",
    source: "Gemini",
    topic: "Data slicing",
    accent: "amber",
    component: GeminiDailyChallenge10,
  },
  {
    id: "challenge14",
    title: "Star rating component",
    source: "Gemini",
    topic: "Interaction",
    accent: "cyan",
    component: GeminiDailyChallenge11,
  },
  {
    id: "challenge15",
    title: "Custom modal dialog",
    source: "Gemini",
    topic: "Overlays",
    accent: "green",
    component: GeminiDailyChallenge12,
  },
  {
    id: "challenge16",
    title: "Fetch search and cache",
    source: "Gemini",
    topic: "API",
    accent: "rose",
    component: GeminiDailyChallenge13,
  },
  {
    id: "challenge17",
    title: "Custom dropdown menu",
    source: "Gemini",
    topic: "Accessibility",
    accent: "amber",
    component: GeminiDailyChallenge14,
  },
  {
    id: "challenge18",
    title: "localStorage state sync",
    source: "Gemini",
    topic: "Persistence",
    accent: "cyan",
    component: GeminiDailyChallenge15,
  },
  {
    id: "challenge19",
    title: "Mini idle clicker game",
    source: "Gemini",
    topic: "Game loop",
    accent: "green",
    component: GeminiDailyChallenge16,
  },
  {
    id: "challenge20",
    title: "Vocabulary flashcard app",
    source: "Gemini",
    topic: "Cards",
    accent: "rose",
    component: GeminiDailyChallenge17,
  },
  {
    id: "challenge21",
    title: "Temperature unit converter",
    source: "Gemini",
    topic: "Inputs",
    accent: "amber",
    component: GeminiDailyChallenge18,
  },
  {
    id: "challenge22",
    title: "Dynamic progress bar",
    source: "Gemini",
    topic: "Intervals",
    accent: "cyan",
    component: GeminiDailyChallenge19,
  },
  {
    id: "challenge23",
    title: "Drag-and-drop list order",
    source: "Gemini",
    topic: "DnD",
    accent: "green",
    component: GeminiDailyChallenge20,
  },
  {
    id: "challenge24",
    title: "Debounced search bar",
    source: "Gemini",
    topic: "Search",
    accent: "rose",
    component: GeminiDailyChallenge21,
  },
  {
    id: "challenge25",
    title: "Infinite scroll simulator",
    source: "Gemini",
    topic: "Observer",
    accent: "amber",
    component: GeminiDailyChallenge22,
  },
  {
    id: "challenge26",
    title: "Inventory Merge",
    source: "Gemini",
    topic: "Data structures",
    accent: "green",
    component: GeminiDailyChallenge23,
  },
  {
    id: "challenge27",
    title: "Window Resize Monitor",
    source: "Gemini",
    topic: "Performance",
    accent: "cyan",
    component: GeminiDailyChallenge24,
  },
  {
    id: "challenge28",
    title: "The Shared Render Pipeline",
    source: "Gemini",
    topic: "Canvas",
    accent: "rose",
    component: GeminiDailyChallenge25,
  },
  {
    id: "challenge29",
    title: "The Resource Pooling Engine (Flyweight Pattern)",
    source: "Gemini",
    topic: "Canvas",
    accent: "amber",
    component: GeminiDailyChallenge26,
  },
  {
    id: "challenge30",
    title: "The Synchronized Range Slider (Min/Max Validation)",
    source: "Gemini",
    topic: "Inputs",
    accent: "cyan",
    component: GeminiDailyChallenge27,
  },
  {
    id: "challenge31",
    title: "The Exclusive Accordion (Single Open Panel)",
    source: "Gemini",
    topic: "UI State",
    accent: "green",
    component: GeminiDailyChallenge28,
  },
  {
    id: "challenge32",
    title: "The Custom Event Emitter Engine (Pub/Sub Event Bus)",
    source: "Gemini",
    topic: "Canvas",
    accent: "amber",
    component: GeminiDailyChallenge29,
  },
  {
    id: "challenge33",
    title: "The Task Worker Pool (Concurrency Throttling)",
    source: "Gemini",
    topic: "Concurrency",
    accent: "cyan",
    component: GeminiDailyChallenge30,
  },
];

const featureCards = [
  { icon: Component, label: challenges.length+" exercises", value: "Component patterns" },
  { icon: Layers3, label: "State and hooks", value: "Daily React reps" },
  { icon: Boxes, label: "Playground", value: "Small focused labs" },
];

export default function App(): React.JSX.Element {
  const [activeTab, setActiveTab] = React.useState("");
  const [collapsed, setCollapsed] = React.useState(false);

  const activeChallenge = challenges.find((challenge) => challenge.id === activeTab);
  const ActiveChallengeComponent = activeChallenge?.component;

  return (
    <ThemeProvider defaultTheme="dark" storageKey="react-vite-playground-ui-theme">
      <main role="main" className="app-shell">
        <aside className={`challenge-sidebar ${collapsed ? "is-collapsed" : ""}`} aria-label="Challenge navigation">
          <div className="sidebar-brand">
            <div className="brand-mark" aria-hidden="true">
              <FlaskConical size={22} />
            </div>
            {!collapsed && (
              <div>
                <p>React Vite</p>
                <strong>Playground</strong>
              </div>
            )}
          </div>

          <button className="sidebar-toggle" type="button" onClick={() => setCollapsed((value) => !value)}>
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            <span>{collapsed ? "Expand" : "Collapse"}</span>
          </button>

          <nav className="challenge-nav">
            <button className={`nav-item home-item ${activeTab === "" ? "is-active" : ""}`} type="button" onClick={() => setActiveTab("")}>
              <Home size={18} />
              <span>Home</span>
            </button>

            {challenges.map((challenge, index) => (
              <button
                className={`nav-item accent-${challenge.accent} ${activeTab === challenge.id ? "is-active" : ""}`}
                key={challenge.id}
                type="button"
                onClick={() => setActiveTab(challenge.id)}
                title={collapsed ? challenge.title : undefined}
              >
                <span className="challenge-number">{String(index + 1).padStart(2, "0")}</span>
                <span className="nav-copy">
                  <strong>{challenge.title}</strong>
                  <small>
                    {challenge.source} / {challenge.topic}
                  </small>
                </span>
              </button>
            ))}
          </nav>
        </aside>

        <section className="workspace-panel">
          <header className="workspace-header">
            <div>
              <p className="eyebrow">Interactive challenge collection</p>
              <h1>{activeChallenge ? activeChallenge.title : "React Vite Playground"}</h1>
            </div>
            <div className="header-badge">
              <Sparkles size={16} />
              <span>{activeChallenge ? activeChallenge.topic : "Ready to explore"}</span>
            </div>
          </header>

          {ActiveChallengeComponent ? (
            <article className={`challenge-stage accent-${activeChallenge.accent}`}>
              <div className="stage-heading">
                <div>
                  <p>{activeChallenge.source}</p>
                  <h2>{activeChallenge.title}</h2>
                </div>
                <span>{activeChallenge.topic}</span>
              </div>
              <div className="stage-content">
                <ActiveChallengeComponent />
              </div>
            </article>
          ) : (
            <article className="home-stage">
              <div className="home-hero">
                <div className="hero-copy">
                  <p className="eyebrow">Daily React practice</p>
                  <h2>Pick a lab and keep your component muscles warm.</h2>
                  <p>
                    A cleaner home for small React exercises, state experiments, component patterns,
                    and browser interaction drills.
                  </p>
                  <button className="primary-action" type="button" onClick={() => setActiveTab(challenges[0].id)}>
                    <Code2 size={18} />
                    Start first challenge
                  </button>
                </div>
                <div className="hero-meter" aria-label={`${challenges.length} available challenges`}>
                  <span>{challenges.length}</span>
                  <small>labs</small>
                </div>
              </div>

              <div className="feature-grid">
                {featureCards.map((card) => {
                  const Icon = card.icon;

                  return (
                    <div className="feature-card" key={card.label}>
                      <Icon size={20} />
                      <span>{card.label}</span>
                      <strong>{card.value}</strong>
                    </div>
                  );
                })}
              </div>
            </article>
          )}
        </section>
      </main>
    </ThemeProvider>
  );
}

