/*

Day 1: The FizzBuzz Classic
This is a legendary rite of passage for every programmer. It tests your understanding of loops, basic math operations, and conditional logic.

The Goal:
Write a program that prints the numbers from 1 to 20. But there are three special rules:

For multiples of 3, instead of the number, print "Fizz".

For multiples of 5, instead of the number, print "Buzz".

For numbers which are multiples of both 3 and 5, print "FizzBuzz".

Expected Output:

Plaintext
1
2
Fizz
4
Buzz
Fizz
7
8
Fizz
Buzz
11
Fizz
13
14
FizzBuzz
... and so on up to 20
💡 Hints to get you started:
The Loop: You'll need a loop (like a for or while loop) that counts sequentially from 1 to 20.

The Modulo Operator (%): This is your best friend for this challenge. The modulo operator gives you the remainder of a division. For example, number % 3 == 0 checks if a number is perfectly divisible by 3 (meaning there is a remainder of 0).

Order Matters: Think carefully about which condition you need to check first inside your loop. If a number is divisible by both 3 and 5, what happens if your code checks if it's just divisible by 3 first?

Write your solution in whatever language you want to practice, paste it here when you're ready, and we'll see how it looks!

*/




import React from "react";

const divisibleBy3 = (num: number) => num % 3 === 0;
const divisibleBy5 = (num: number) => num % 5 === 0;

function fizzBuzz(num: number): string {
  if (divisibleBy3(num) && divisibleBy5(num)) {
    return "FizzBuzz";
  } else if (divisibleBy3(num)) {
    return "Fizz";
  } else if (divisibleBy5(num)) {
    return "Buzz";
  } else {
    return num.toString();
  }
}

export default function GeminiDailyChallenge1(): React.JSX.Element {
  return (
    <div>
      <h1>Gemini Daily Challenge 1</h1>
      <p>This is the first daily challenge for Gemini. Stay tuned for more!</p>
      <ul>
        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
          <li key={num}>{fizzBuzz(num)}</li>
        ))}
      </ul>
    </div>
  );
}
