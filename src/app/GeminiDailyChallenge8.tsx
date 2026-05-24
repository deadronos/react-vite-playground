/*

🚀 Day 8: The Simple Todo List (State Arrays & Mutability)
Now that you've mastered handling individual primitives, state effects, timers, and external objects, let's look at one of the absolute core milestones of frontend engineering: managing collections of item states without direct mutations.

A very common beginner trap is accidentally altering an array directly (e.g., array.push()) instead of treating React state as immutable. Today, we'll design a mini Todo tracker to cement correct array handling.

The Goal:
Create a compact layout that allows you to add items to a checklist, mark them as complete, and delete them entirely.

Requirements:

Data Model: Your state should track an array of tasks. Each task object should look something like:
{ id: number, text: string, isCompleted: boolean }

Add Task: Provide a small text input and an "Add" button. Clicking the button should append a new item to your task array.

Toggle Completion: Clicking a checkbox or a task's name should toggle its isCompleted flag, which visually crosses out the text (using CSS classes like line-through).

Delete Task: Provide a "❌" or "Delete" button next to each task that removes it from the list entirely.

💡 Hints to get you started:
Immutability is King: Never use methods like .push() or .splice() on your state arrays because they mutate the original variable directly, which can break React's rendering updates.

Adding safely: Use the array spread operator to copy the existing state: setTodos([...todos, newTodo]).

Toggling safely: Use .map() to iterate through the array, modifying only the item that matches the target id while returning all other items exactly as they were.

Deleting safely: Use .filter() to create a clean, new array containing every single item except the one matching the target id.

Let's see how you structure the array operations in your sandbox component!

*/

import React, { useState, useEffect } from "react";

type Task = {
  id: number;
  text: string;
  isCompleted: boolean;
};

type Tasks = Task[];


export default function GeminiDailyChallenge8():React.JSX.Element {
  const [todos, setTodos] = useState<Tasks>([]);
  const [inputValue, setInputValue] = useState("");
  const [exampleTask, setExampleTask] = useState<Task>({id:0,text:"Example Task",isCompleted:false});


  function handleAddTask() {
      let text = inputValue.trim();
      if (text === "") return; // Prevent adding empty tasks
      let id = Date.now(); // Simple unique ID based on timestamp
      // validate id does not exist already in todos
      todos.forEach((todo)=>{
        if(todo.id===id){
          //found clashing id
          id=id+Math.random();
        }
        // no clashing id found, id can stay
      });
      let newTask:Task={
        id,
        text,
        isCompleted:false
      };
      setTodos([...todos, newTask]);
      setInputValue(""); // reset input field after adding
   }



  return (
    <div>
      <h1>Gemini Daily Challenge 8: The Simple Todo List</h1>
      <p>Implement the todo list functionality as described in the challenge prompt.</p>
      <p> this is an Example Task:</p>
      <TaskView task={exampleTask} />
     {/* Render your list of tasks here using the TaskView component */}
      <table>
        <tbody>
          <tr>
            <td>
              <button onClick={handleAddTask}>Add Task:</button>
            </td>
            <td>
              <input onChange={(e) => setInputValue(e.target.value)} value={inputValue} placeholder="Enter a task" />
            </td>
          </tr>
          <tr>
            <td>
              <p>Task List:</p>
            </td>
          </tr>
          <tr>
            <td>
              {todos.map((task) => (
                <TaskView key={task.id} task={task} onToggle={()=>{
                  setTodos(todos.map((t)=>{
                    if(t.id===task.id){
                      return {...t,isCompleted:!t.isCompleted};
                    }else{
                      return t;
                    }
                  }));
                }} onDelete={(id)=>{
                  setTodos(todos.filter((t)=>t.id!==id));
                }} />
              ))}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}


interface TaskViewProps {
  task: Task;
  onToggle?: () => void;
  onDelete?: (id:number) => void;
}


function TaskView({task,onToggle,onDelete}:TaskViewProps) {
  const taskRef = React.useRef(task);
  const [_, forceUpdate] = useState({}); // dummy state to force re-render

  const handleToggle=()=>{
    if(onToggle){
      onToggle();
    }else{
      console.debug( "No onToggle function provided for TaskView component, using default toggle behavior");
      // default toggle behavior: log the task id and new completion status
      taskRef.current.isCompleted = !taskRef.current.isCompleted;
      forceUpdate({}); // force re-render to reflect the change
      console.log(`Toggled task ${taskRef.current.id} to ${taskRef.current.isCompleted? "completed" : "incomplete"}`);
    }
  };

  const handleDelete=()=>{
    if(onDelete){
      onDelete(task.id);
    }else{
      console.debug( "No onDelete function provided, I cannot delete myself without an onDelete handler! Please provide one to enable deletion functionality.");
    }
  };

  useEffect(()=>{
    taskRef.current = task;
  },[task]);

  return (
    <div>
      <table>
        <tbody>
          <tr>
            <td>
              <input type="checkbox" checked={task.isCompleted} onClick={handleToggle} />
            </td>
            <td>
              <span onClick={handleToggle} style={{textDecoration: task.isCompleted? "line-through" : "none"}}>{task.text}</span>
            </td>
            <td>
              <button onClick={handleDelete}>❌</button>
            </td>
          </tr>
      </tbody>
      </table>
    </div>
  );
}




