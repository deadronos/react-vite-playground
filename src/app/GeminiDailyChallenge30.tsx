/*

🚀 Day 30: The Task Worker Pool (Asynchronous Concurrency Throttling)
Let's conclude this advanced optimization arc with a powerful infrastructure pattern found in asset pre-loaders, image batch upload managers, and web-scraping queue loops: The Concurrency-Limited Async Worker Pool.

When an app needs to fire off a massive block of asynchronous actions (like fetching 50 API files or computing complex simulation iterations), launching them all simultaneously can completely choke the client browser or trip rate-limiters on the backend server.

The Goal:
Create an asynchronous task queue runner that accepts a batch of heavy promises but enforces a strict bottleneck cap, allowing a maximum of 2 operations to execute concurrently at any single moment. The moment one task finishes, the engine must immediately pull the next item from the pending stack and spin it up until the queue is completely exhausted.

📋 Requirements:
The Core Task Batch Metadata: Use this array of 6 distinct asynchronous mock tasks. Each task contains an identifier string and a specific processing delay (duration):

TypeScript
const taskBatch = [
  { name: "⚙️ Task Alpha", duration: 1200 },
  { name: "⚡ Task Beta", duration: 600 },
  { name: "🌐 Task Gamma", duration: 2000 },
  { name: "📦 Task Delta", duration: 400 },
  { name: "🎨 Task Epsilon", duration: 1500 },
  { name: "🔍 Task Zeta", duration: 800 }
];
The View State Layer: Track two metrics in your component view state:

activeTasks: An array of strings representing names of tasks currently executing right now.

completedTasks: An array of strings representing names of tasks that have finished executing.

The Concurrency Engine (The Core Challenge): Write an orchestrator function called runTaskPool(tasks, limit = 2).

It must launch exactly 2 worker threads concurrently.

Each worker needs to use an incremental index pointer (let nextIndex = 0) to claim a task, push its name to activeTasks, and fire a setTimeout matching the task's duration.

When that task's timer fires, it must remove itself from activeTasks, push its name to completedTasks, and immediately look for the next index in line to restart the worker loop!

💡 Hints to get you started:
The Pointer Ref Pattern: Because multiple parallel workers need to query the same task queue index without collision, track your index pointer inside a standard React Ref so it persists across renders without resetting:

TypeScript
const nextTaskIndex = useRef(0);
The Worker Closure Loop: Create an internal helper function inside your click handler called runWorker(). Call it twice side-by-side to initiate your two concurrent pipelines, and have it recursively invoke itself inside its own .then() or setTimeout resolution loop until nextTaskIndex.current >= tasks.length.

Add an interactive button titled "Initiate Task Pool Processing", render two clear visual columns or grids to track the active processing items vs. completed ones, and let's watch your event loop balance the workload. Paste your component solution whenever you are ready!

*/


import React, { useState, useRef, useEffect, type JSX } from 'react';

{/* inline CSS classes for better visualization */}
/* CSS Styling Architecture */
const stylesTaskWorkerPool = `
.task-worker-pool-container {
  width: 100%;
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  border-radius: 8px;
  background-color: #222; /* Darker background for better contrast */
  color: #eee; /* Lighter text color for readability */
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.task-worker-pool-header {
  font-size: 1.5rem;
  margin-bottom: 16px;
}

.task-worker-pool-button {
  padding: 10px 16px;
  margin-bottom: 20px;
  border: none;
  border-radius: 4px;
  background-color: #555; /* Darker button background */
  color: #eee; /* Lighter button text */
  cursor: pointer;
  font-size: 16px;
}

.task-worker-pool-button:hover {
  background-color: #777; /* Highlight on hover */
}

.task-worker-pool-columns {
  display: flex;
  justify-content: space-between;
}

.task-worker-pool-column {
  width: 48%;
}

.task-worker-pool-column-header {
  font-size: 1.2rem;
  margin-bottom: 12px;
}

.task-worker-pool-item {
  padding: 8px;
  margin-bottom: 8px;
  background-color: #333; /* Darker item background */
  color: #eee; /* Lighter item text */
  border-radius: 4px;
  font-family: monospace;
}
`;

type Task = {
  name: string;
  duration: number;
};

const taskBatch: Task[] = [
  { name: "⚙️ Task Alpha", duration: 1200 },
  { name: "⚡ Task Beta", duration: 600 },
  { name: "🌐 Task Gamma", duration: 2000 },
  { name: "📦 Task Delta", duration: 400 },
  { name: "🎨 Task Epsilon", duration: 1500 },
  { name: "🔍 Task Zeta", duration: 800 }
];


export default function GeminiDailyChallenge30() {
  return (
    <div>
      {/* 🌟 Injection of CSS rules directly into the DOM */}
      <style>{stylesTaskWorkerPool}</style>
      {/* Your Task Worker Pool Component will go here */}
      <EventEmitterProvider>
        <TaskWorkerPoolComponent tasks={taskBatch} />
      </EventEmitterProvider>
    </div>
  );
}

type eventMap = Record<string, CallbackFunction[]>;

type CallbackFunction = (data?: unknown) => void;

const emitterContext = React.createContext<MyEventEmitter | null>(null);

function EventEmitterProvider({ children }: { children: React.ReactNode }) {
  const emitter=useState(() => new MyEventEmitter())[0];

  return (
    <emitterContext.Provider value={emitter}>
      {children}
    </emitterContext.Provider>
  );
}

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
  }

  emit(eventName: string, data?: unknown) {
    if (this.events[eventName]) {
      this.events[eventName].forEach(callback => callback(data));
    }
  }
}


interface TaskWorkerPoolProps {
  tasks: Task[];
}

class AsyncTaskOrchestrator {
  private tasks: Task[];
  private concurrencyLimit: number;
  private activeCount = 0;
  private nextTaskIndex = 0;
  private emitter: MyEventEmitter;

  constructor(tasks: Task[], emitter: MyEventEmitter, concurrencyLimit = 2) {
    this.tasks = tasks;
    this.emitter = emitter;
    this.concurrencyLimit = concurrencyLimit;
  }

  run() {
    for (let i = 0; i < this.concurrencyLimit; i++) {
      this.runWorker();
    }
  }

  private runWorker() {
    if (this.nextTaskIndex >= this.tasks.length) return;

    const task = this.tasks[this.nextTaskIndex];
    this.nextTaskIndex++;
    this.activeCount++;
    this.emitter.emit("taskStarted", task.name);

    setTimeout(() => {
      this.activeCount--;
      this.emitter.emit("taskCompleted", task.name);
      this.runWorker();
    }, task.duration);
  }
}

function TaskWorkerPoolComponent({ tasks }: TaskWorkerPoolProps) {
  const emitter = React.useContext(emitterContext);

  const [activeTasks, setActiveTasks] = useState <string[]>([]);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [initiated, setInitiated] = useState(false);

  const orchestratorRef = useRef<AsyncTaskOrchestrator | null>(null);

  function handleInitiatedButtonClick() {
    if (!initiated) {
      setInitiated(true);
      if (!emitter) {
        throw new Error("TaskWorkerPoolComponent must be used within an EventEmitterProvider");
      }
      emitter.emit("taskDispatched", "All tasks dispatched");
      setActiveTasks(tasks.map(task => task.name));
      orchestratorRef.current = new AsyncTaskOrchestrator(tasks, emitter);
      orchestratorRef.current.run();
    }
  }

  useEffect(() => {
    if (!emitter) return;

    const handleTaskCompleted = (taskName: string) => {
      setActiveTasks(prev => prev.filter(name => name !== taskName));
      setCompletedTasks(prev => [...prev, taskName]);
    };

    emitter.on("taskCompleted", handleTaskCompleted as CallbackFunction);

    return () => {
      emitter.unsubscribe("taskCompleted", handleTaskCompleted as CallbackFunction);
    };
  }, [emitter]);

  if (!emitter) {
    throw new Error("TaskWorkerPoolComponent must be used within an EventEmitterProvider");
  }

  return (
    <div className="task-worker-pool-container">
      <h2 className="task-worker-pool-header">The Task Worker Pool (Concurrency Throttling)</h2>
      <button className="task-worker-pool-button" onClick={handleInitiatedButtonClick}>
        {initiated ? "Processing..." : "Initiate Task Pool Processing"}
      </button>
      <div className="task-worker-pool-columns">
        <div className="task-worker-pool-column">
          <h3 className="task-worker-pool-column-header">Active Tasks</h3>
          {activeTasks.map(task => (
            <div key={task} className="task-worker-pool-item">
              {task}
            </div>
          ))}
        </div>
        <div className="task-worker-pool-column">
          <h3 className="task-worker-pool-column-header">Completed Tasks</h3>
          {completedTasks.map(taskName => (
            <div key={taskName} className="task-worker-pool-item">
              {taskName}
            </div>
          ))}
        </div>
        <LoggerPanel />
      </div>
    </div>
  );
}

function LoggerPanel () {
  const emitter = React.useContext(emitterContext);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    if (!emitter) return;

    const handleTaskDispatched = (taskName: string) => {
      setLogs(prev => [...prev, `Dispatched: ${taskName}`]);
    };

    const handleTaskStarted = (taskName: string) => {
      setLogs(prev => [...prev, `Started: ${taskName}`]);
    };

    const handleTaskCompleted = (taskName: string) => {
      setLogs(prev => [...prev, `Completed: ${taskName}`]);
    };

    emitter.on("taskDispatched", handleTaskStarted as CallbackFunction);
    emitter.on("taskStarted", handleTaskStarted as CallbackFunction);
    emitter.on("taskCompleted", handleTaskCompleted as CallbackFunction);

    return () => {
      emitter.unsubscribe("taskDispatched", handleTaskDispatched as CallbackFunction);
      emitter.unsubscribe("taskStarted", handleTaskStarted as CallbackFunction);
      emitter.unsubscribe("taskCompleted", handleTaskCompleted as CallbackFunction);
    };
  }, [emitter]);

  if (!emitter) {
    throw new Error("LoggerPanel must be used within an EventEmitterProvider");
  }

  return (
    <div className="logger-panel">
      <h3>Event Logs</h3>
      {logs.map((log, index) => (
        <div key={index} className="log-entry">
          {log}
        </div>
      ))}
    </div>
  );
}
