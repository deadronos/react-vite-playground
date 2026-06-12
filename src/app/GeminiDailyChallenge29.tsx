/*

🚀 Day 29: The Custom Event Emitter Engine (Pub/Sub Event Bus)
Let's step outside of visual layouts and build a critical backend architectural pattern used to pass data asynchronously across separated modules without creating coupling: The Publish-Subscribe (Pub/Sub) Event Bus.

In massive web apps, nested sub-components often need to notify distant sibling panels about data updates. Instead of passing deep prop callbacks up and down through dozens of layers, components can emit events to a central clearinghouse.

The Goal:
Create a pure JavaScript/TypeScript class or hook called EventEmitter that allows distinct parts of an application to register named event listeners and broadcast messages across those event channels.

📋 Requirements:
The Core Listener Registry Map: Implement a class structure or hook holding a private storage map tracking active string event channels to arrays of callback functions:

TypeScript
class MyEventEmitter {
  private events: Record<string, Function[]> = {};
}
The .on(eventName, callback) Subscription Method: Add a method that registers a listener function to a named event key string. If the event channel name doesn't exist yet, initialize it as an empty array, then push the callback into it.

The .emit(eventName, data) Broadcast Method: Add a method that targets a named event channel and executes every single registered callback function, passing the optional data payload argument straight into them.

The Unsubscribe Lifecycle Guard (The Real Challenge): Your subscription method must return an absolute teardown mechanism—a function that, when executed, cleanly slices only that specific callback out of the listener tracking array so it stops hearing future broadcasts!

TypeScript
// Usage Blueprint Example:
const unsubscribe = emitter.on("data-received", (payload) => console.log(payload));

// Sometime later when unmounting...
unsubscribe(); // Evicts the function reference safely out of the array queue!
💡 Hints to get you started:
Filtering Closures Immutably: To disconnect a specific listener inside your unsubscribe function return block, compare function references using standard reference inequality:

TypeScript
this.events[eventName] = this.events[eventName].filter(cb => cb !== callback);
To test your new event engine visually in your sandbox, you can wire a couple of separate <CounterButton /> rows inside a main layout component to call .emit(), and have a separate <LoggerPanel /> subscribe to those updates via a standard useEffect mount loop!

Drop your custom event bus logic whenever you're ready to look at the structural pipeline!

*/

import React, { useState, useEffect } from 'react';

{/* inline CSS classes for better visualization */}
/* CSS Styling Architecture */
const stylesEventEmitter = `
.event-emitter-container {
  width: 100%;
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  border-radius: 8px;
  background-color: #222; /* Darker background for better contrast */
  color: #eee; /* Lighter text color for readability */
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.event-emitter-header {
  font-size: 1.5rem;
  margin-bottom: 16px;
}

.event-emitter-button {
  padding: 10px 16px;
  margin-right: 10px;
  border: none;
  border-radius: 4px;
  background-color: #555; /* Darker button background */
  color: #eee; /* Lighter button text */
  cursor: pointer;
  font-size: 16px;
}

.event-emitter-button:hover {
  background-color: #777; /* Highlight on hover */
}

.event-emitter-log {
  margin-top: 20px;
  padding: 12px;
  background-color: #333; /* Darker log background */
  color: #eee; /* Lighter log text */
  border-radius: 4px;
  font-family: monospace;
}
`;

export default function GeminiDailyChallenge29() {
  return (
    <div>
      {/* 🌟 Injection of CSS rules directly into the DOM */}
      <style>{stylesEventEmitter}</style>
      {/* Your Event Emitter Component will go here */}
      <EventEmitterProvider>
        <EventEmitterComponent />
      </EventEmitterProvider>
    </div>
  );
}


type CallbackFunction = (data?: unknown) => void;

type eventMap = Record<string, CallbackFunction[]>;

class MyEventEmitter {
  private events: eventMap = {};

  unsubscribe(eventName: string, callback: CallbackFunction) {
    if (this.events[eventName]) {
      this.events[eventName] = this.events[eventName].filter(cb => cb !== callback);
    }
  }
  on(eventName: string, callback: CallbackFunction) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);

    // Return the unsubscribe function
    return () => this.unsubscribe(eventName, callback);
  }

  emit(eventName: string, data?: unknown) {
    if (this.events[eventName]) {
      this.events[eventName].forEach(callback => callback(data));
    }
  }
}




function LoggerPanel ({ emitter }: { emitter: MyEventEmitter }) {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(()=> {
    // subscribe and remember unsubscribe function
    const unsubscribeButton1 =emitter.on("button1-click", (data) => {
      setLogs(prev => [...prev, `Button 1 clicked with data: ${data}`]);
    });
    const unsubscribeButton2 = emitter.on("button2-click", (data) => {
      setLogs(prev => [...prev, `Button 2 clicked with data: ${data}`]);
    });

    // Cleanup on unmount
    return () => {
      unsubscribeButton1();
      unsubscribeButton2();
    }
  },[]);

  return (
    <div className="event-emitter-log">
      <h3>Event Logs:</h3>
      {logs.map((log, index) => <div key={index}>{log}</div>)}
    </div>
  );
}

function CounterButton1({ emitter }: { emitter: MyEventEmitter }) {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    const newCount = count + 1;
    setCount(newCount);
    emitter.emit("button1-click", newCount);
  };

  return (
    <button className="event-emitter-button" onClick={handleClick}>
      Button 1 Count: {count}
    </button>
  );
}

function CounterButton2({ emitter }: { emitter: MyEventEmitter }) {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    const newCount = count + 1;
    setCount(newCount);
    emitter.emit("button2-click", newCount);
  };

  return (
    <button className="event-emitter-button" onClick={handleClick}>
      Button 2 Count: {count}
    </button>
  );
}


const emitterContext = React.createContext<MyEventEmitter | null>(null);

function EventEmitterProvider({ children }: { children: React.ReactNode }) {
  const [emitter] = useState(new MyEventEmitter());

  return (
    <emitterContext.Provider value={emitter}>
      {children}
    </emitterContext.Provider>
  );
}


function EventEmitterComponent() {
  const emitter = React.useContext(emitterContext);

  if (!emitter) {
    throw new Error("EventEmitterComponent must be used within an EventEmitterProvider");
  }

  return (
    <div className="event-emitter-container">
      <h2 className="event-emitter-header">Custom Event Emitter Demo</h2>
      <CounterButton1 emitter={emitter} />
      <CounterButton2 emitter={emitter} />
      <LoggerPanel emitter={emitter} />
    </div>
  );
}
