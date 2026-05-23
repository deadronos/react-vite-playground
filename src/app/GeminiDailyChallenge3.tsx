/*

🚀 Day 3: The Title-Case Capitalizer
Let's stick with string manipulation but make it dynamic. A common real-world task is cleaning up messy user inputs—like converting a name or a title into proper casing.

The Goal:
Write a function that takes a sentence or a full name and capitalizes the first letter of every single word, while ensuring the rest of the letters in that word are strictly lowercase.

If the input is "hello WORLD", the output should be "Hello World".

If the input is "jAnE dOe", the output should be "Jane Doe".

The Interactive Twist:
Instead of hardcoding the inputs via props this time, add a text <input> element to your component. As you type into the input box, the converted, title-cased text should display live on the page beneath it!

💡 Hints to get you started:
State: You'll want to use React's useState hook to capture the text from your input field's onChange event.

Chunking the String: Think about how you can split a full sentence into an array of individual words (hint: spaces make great delimiters).

Targeting Characters: For each individual word, grab the first character (word[0]) and uppercase it, then combine it with the rest of the word sliced from index 1 onward (word.slice(1)), making sure the rest is forced to lowercase.

Set up the input field in your Vite playground, let the state flow, and paste your code whenever you're ready to review!

*/

import React, { useState } from 'react';


export default function GeminiDailyChallenge3(): React.JSX.Element {
  const [input, setInput] = useState("");
  const [titleCased, setTitleCased] = useState("");

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setInput(value);
    const titleCasedValue = value.split(" ").map(word => {
      if(word.length === 0) return ""; // Handle multiple spaces
      return word[0].toUpperCase() + word.slice(1).toLowerCase();
    }).join(" ");
    setTitleCased(titleCasedValue);
  }


return (
  <div>
    <h1 className="text-4xl font-bold mb-4">Title Case Capitalizer</h1>
    <input
      type="text"
      placeholder="Type a sentence here..."
      className="border p-2 w-full mb-4"
      onChange={handleInputChange}
    />
    <p>Title Cased Output: </p>
    {titleCased}
    <p>Original Input: </p>
    {input}
  </div>
)

};
