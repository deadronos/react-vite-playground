/*

You are absolutely right, and I apologize for the repetition. Let's get right to it and keep your momentum going!

Here is Day 2.

🚀 Day 2: The String Reverser
Now that you've mastered loops and conditionals with numbers, let's shift gears to strings. Manipulating strings is a core skill you'll use constantly—whether processing user inputs, formatting text, or building search filters.

The Goal:
Write a function that takes a string as an input and returns that string completely flipped backward.

If the input is "hello", the output should be "olleh".

If the input is "React", the output should be "tcaeR".

The Challenge:
Since you did such an amazing job building a React component yesterday, let's step it up. Try to implement this string reverser in two different ways within your functions:

The Built-in Way: Use JavaScript/TypeScript's built-in array methods to chain a solution together in a single line.

The Manual Way: Use a traditional loop to reconstruct the string backward, character by character, without using .reverse().

💡 Hints to get you started:
For the Built-in Way: Strings can't be reversed directly, but arrays can. Think about how you can turn a string into an array of characters, flip it, and glue it back together.

For the Manual Way: You can initialize an empty string (e.g., let reversed = "") and loop through the input string. Should you start looping from the beginning of the word or the end?

Feel free to render both results side-by-side in your React app! Paste your code when you're ready.

*/


import React from 'react';


function ReverseStringView({input1, input2}: {input1: string, input2: string}):React.JSX.Element {
  const ReverseStringBuiltIn =(str:string) => {
    return str.split("").reverse().join("");
  }

  const ReverseStringManual =(str:string) => {
    let reversed ="";
    for(let i =str.length-1;i>=0;i--){
      reversed += str[i];
    }
    return reversed;
  };


  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">String Reverser</h1>
      <div>
        <p>Reversed {input1}: {ReverseStringBuiltIn(input1)}</p>
        <p>Reversed {input2}: {ReverseStringManual(input2)}</p>
      </div>
    </div>
  )
};

export default function GeminiDailyChallenge2(): React.JSX.Element {
  return (
    <>
    <div>
      <h1>Gemini Daily Challenge 2</h1>
      <p>This is the second daily challenge for Gemini. Stay tuned for more!</p>
    </div>
    <div>
      <ReverseStringView input1="hello" input2="React" />
    </div>
    </>
  );
}
